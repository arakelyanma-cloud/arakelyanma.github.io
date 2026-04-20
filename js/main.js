/* theme */
const THEME_KEY='zvartnots-theme';
function setThemeLabel(){
  const b=document.getElementById('themeBtn');
  if(!b)return;
  const d=document.documentElement.getAttribute('data-theme')||'light';
  b.setAttribute('aria-label',d==='dark'?'Включить светлую тему':'Включить тёмную тему');
}
function toggleTheme(){
  const next=(document.documentElement.getAttribute('data-theme')||'light')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  try{localStorage.setItem(THEME_KEY,next);}catch(e){}
  setThemeLabel();
}
var te=document.getElementById('themeBtn');if(te)te.addEventListener('click',toggleTheme);
setThemeLabel();

/* nav scroll */
const nb=document.getElementById('nb');
window.addEventListener('scroll',()=>nb.classList.toggle('sc',scrollY>60));

/* mobile menu */
const mm=document.getElementById('mm');
document.getElementById('bgr').onclick=()=>mm.classList.add('open');
document.getElementById('mc').onclick=()=>mm.classList.remove('open');
function cm(){mm.classList.remove('open');}

/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

/* scroll reveal */
const ro=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target);}});
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>ro.observe(el));

/* carousel */
const ct=document.getElementById('ct');
const cards=[...ct.querySelectorAll('.tc')];
const cd=document.getElementById('cd');
let ci=0;

function gv(){
  const w=window.innerWidth;
  return w<768?1:w<1024?2:3;
}
function mkdots(){
  cd.innerHTML='';
  const pg=Math.ceil(cards.length/gv());
  for(let i=0;i<pg;i++){
    const d=document.createElement('button');
    d.className='cdot'+(i===0?' on':'');
    d.onclick=()=>go(i);
    cd.appendChild(d);
  }
}
function go(idx){
  const v=gv();
  const mx=Math.max(0,Math.ceil(cards.length/v)-1);
  ci=Math.max(0,Math.min(idx,mx));
  const cw=cards[0].offsetWidth+26;
  ct.style.transform=`translateX(-${ci*v*cw}px)`;
  cd.querySelectorAll('.cdot').forEach((d,i)=>d.classList.toggle('on',i===ci));
}
document.getElementById('cp').onclick=()=>go(ci-1);
document.getElementById('cn').onclick=()=>go(ci+1);
mkdots();
window.addEventListener('resize',()=>{ci=0;mkdots();go(0);});

/* gallery tabs */
function gt(el){document.querySelectorAll('.gtab').forEach(t=>t.classList.remove('on'));el.classList.add('on');}
