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

/* smooth scroll; для #contact — устойчивый якорь: сетка галереи растёт при подгрузке фото */
function scrollPaddingTop(){
  const n=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(n)?n:88;
}
function scrollContactBlock(behavior){
  const el=document.querySelector('#contact .contact-sec');
  if(!el)return;
  const y=el.getBoundingClientRect().top+window.pageYOffset-scrollPaddingTop();
  window.scrollTo({top:Math.max(0,y),behavior:behavior==='smooth'?'smooth':'auto'});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(!id||id==='#')return;
    if(id==='#contact'){
      e.preventDefault();
      scrollContactBlock('smooth');
      const watched=[document.getElementById('ggrid'),document.getElementById('instagram')].filter(Boolean);
      let raf=0;
      const bump=()=>{
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>scrollContactBlock('auto'));
      };
      const ro=new ResizeObserver(bump);
      watched.forEach(n=>ro.observe(n));
      document.querySelectorAll('#ggrid img').forEach(img=>{
        if(img.complete)return;
        img.addEventListener('load',bump,{once:true});
        img.addEventListener('error',bump,{once:true});
      });
      [50,200,600,1600].forEach(ms=>setTimeout(bump,ms));
      setTimeout(()=>ro.disconnect(),12000);
      return;
    }
    const target=document.querySelector(id);
    if(!target)return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
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
