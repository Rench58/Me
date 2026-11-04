(() => {
  document.documentElement.classList.add('motion');
  const motionOn=true;
  const observer = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  const logo=document.querySelector('.living-logo');
  const stage=document.querySelector('.logo-stage');
  let lastPointer=-5000;
  stage.addEventListener('pointerdown',()=>{stage.classList.remove('greeting');void stage.offsetWidth;stage.classList.add('greeting');setTimeout(()=>stage.classList.remove('greeting'),950);});
  window.addEventListener('pointermove',e=>{lastPointer=performance.now();if(!motionOn)return;const r=logo.getBoundingClientRect();logo.style.setProperty('--ex',Math.max(-17,Math.min(17,(e.clientX-r.left-r.width/2)/22))+'px');logo.style.setProperty('--ey',Math.max(-10,Math.min(10,(e.clientY-r.top-r.height/2)/35))+'px');document.querySelector('.logo-stage').style.setProperty('--turn',((e.clientX/innerWidth-.5)*18)+'deg');},{passive:true});
  let scheduled=false;const update=()=>{scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;};
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
  const viewer=document.querySelector('#viewer'), items=[...document.querySelectorAll('[data-image]')];let current=0;
  function show(i){current=(i+items.length)%items.length;const el=items[current];document.querySelector('#viewer-image').src=el.dataset.image;document.querySelector('#viewer-image').alt=el.dataset.title;document.querySelector('#viewer-title').textContent=el.dataset.title;document.querySelector('#original').href=el.dataset.image;}
  items.forEach((el,i)=>el.addEventListener('click',()=>{show(i);viewer.showModal();document.body.style.overflow='hidden';}));
  document.querySelector('.close').addEventListener('click',()=>viewer.close());viewer.addEventListener('close',()=>{document.body.style.overflow='';items[current]?.focus({preventScroll:true});});
  viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
  document.querySelector('#previous').onclick=()=>show(current-1);document.querySelector('#next').onclick=()=>show(current+1);
  viewer.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}});
  const canvas=document.querySelector('#field'),ctx=canvas.getContext('2d');
  let w=0,h=0;function size(){w=canvas.clientWidth;h=canvas.clientHeight;const d=Math.min(devicePixelRatio,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}size();addEventListener('resize',size);
  const stars=Array.from({length:65},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.5+.5,v:Math.random()*.00005+.00002}));
  let last=0;function frame(t){const dt=Math.min(t-last,50);last=t;const hero=document.querySelector('.hero').getBoundingClientRect();if(hero.bottom>0&&!document.hidden){if(t-lastPointer>1800){logo.style.setProperty('--ex',(Math.sin(t/1150)*11)+'px');logo.style.setProperty('--ey',(Math.sin(t/1700)*5)+'px');stage.style.setProperty('--turn',(Math.sin(t/2200)*9)+'deg');}ctx.clearRect(0,0,w,h);for(const s of stars){if(motionOn)s.y=(s.y-dt*s.v+1)%1;ctx.fillStyle='#dce5f0';ctx.globalAlpha=.2+s.r*.2;ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;const k=motionOn?Math.min(1,Math.max(0,-hero.top/hero.height)):0;document.querySelector('.hero-copy').style.transform=`translateY(${k*100}px)`;document.querySelector('.logo-stage').style.transform=`perspective(900px) translateY(${-k*110}px) rotateY(var(--turn,0deg)) scale(${1+k*.22})`;}
  document.querySelectorAll('.section').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){const k=motionOn?Math.max(0,Math.min(1,r.top/innerHeight)):0;el.style.setProperty('--enter',k);}});requestAnimationFrame(frame);}requestAnimationFrame(frame);
})();
