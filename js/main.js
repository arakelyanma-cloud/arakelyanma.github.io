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

/* smooth scroll — для #contact повторно выравниваем якорь: при прокрутке грузятся фото галереи и колонки растут */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(!id||id==='#')return;
    const t=document.querySelector(id);
    if(!t)return;
    e.preventDefault();
    t.scrollIntoView({behavior:'smooth',block:'start'});
    if(id==='#contact'){
      const snap=()=>{t.scrollIntoView({behavior:'auto',block:'start'});};
      [380,900,2000,3500].forEach(ms=>setTimeout(snap,ms));
    }
  });
});

/* scroll reveal */
const ro=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');ro.unobserve(e.target);}});
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>ro.observe(el));

/* gallery tabs */
function gt(btn){
  const f=btn.getAttribute('data-filter')||'all';
  document.querySelectorAll('.gtab').forEach(t=>{
    t.classList.toggle('on',t===btn);
    t.setAttribute('aria-selected',t===btn?'true':'false');
  });
  document.querySelectorAll('#ggrid .gi').forEach(it=>{
    const c=it.getAttribute('data-cat')||'';
    it.hidden=(f!=='all'&&c!==f);
  });
}
