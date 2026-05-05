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
if(nb){
  let navScPending=false;
  window.addEventListener('scroll',()=>{
    if(navScPending)return;
    navScPending=true;
    requestAnimationFrame(()=>{
      nb.classList.toggle('sc',scrollY>60);
      navScPending=false;
    });
  },{passive:true});
}

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

/* gallery masonry: плотная укладка без «балансировочных» дыр multicol */
const ggrid=document.getElementById('ggrid');
let gallLayRaf=0;
function galleryColCount(){
  const w=window.innerWidth;
  if(w<=768)return 2;
  if(w<=1024)return 3;
  return 4;
}
function galleryHGap(){return 3;}
function layoutGalleryMasonry(){
  if(!ggrid)return;
  const items=[...ggrid.querySelectorAll('.gi')].filter(el=>!el.hidden);
  if(!items.length){
    ggrid.classList.remove('ggrid--masonry');
    ggrid.style.cssText='';
    return;
  }
  ggrid.classList.add('ggrid--masonry');
  const c=galleryColCount();
  const hg=galleryHGap();
  const W=ggrid.getBoundingClientRect().width;
  const colW=Math.max(0,(W-hg*(c-1))/c);
  const heights=new Array(c).fill(0);
  items.forEach(el=>{
    el.style.boxSizing='border-box';
    el.style.position='absolute';
    el.style.margin='0';
    el.style.padding='0';
    el.style.width=colW+'px';
    let col=0;
    let minH=heights[0];
    for(let i=1;i<c;i++){
      if(heights[i]<minH){
        minH=heights[i];
        col=i;
      }
    }
    el.style.left=col*(colW+hg)+'px';
    el.style.top=heights[col]+'px';
    heights[col]+=el.offsetHeight;
  });
  ggrid.style.position='relative';
  ggrid.style.width='100%';
  ggrid.style.height=Math.max(...heights)+'px';
}
function scheduleGalleryLayout(){
  cancelAnimationFrame(gallLayRaf);
  gallLayRaf=requestAnimationFrame(()=>{
    gallLayRaf=requestAnimationFrame(layoutGalleryMasonry);
  });
}
if(ggrid){
  scheduleGalleryLayout();
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(scheduleGalleryLayout).observe(ggrid);
  ggrid.querySelectorAll('img').forEach(img=>{
    img.addEventListener('load',scheduleGalleryLayout);
    img.addEventListener('error',scheduleGalleryLayout);
  });
  window.addEventListener('resize',scheduleGalleryLayout,{passive:true});
}

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
  scheduleGalleryLayout();
}
