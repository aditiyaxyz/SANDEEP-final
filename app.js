// assets/app.js - interactions: reveal, tilt, particles, GSAP hero timeline, underline draw
(function(){
  'use strict';

  // NAV toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if(navToggle && navList){
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navList.style.position = 'absolute';
        navList.style.right = '18px';
        navList.style.top = '64px';
        navList.style.background = 'linear-gradient(180deg, rgba(7,7,7,0.98), rgba(7,7,7,0.95))';
        navList.style.padding = '12px';
        navList.style.borderRadius = '10px';
        navList.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      } else {
        navList.style.display = '';
      }
    });
  }

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href === '#') return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if(revealEls.length){
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const el = entry.target;
          const idx = revealEls.indexOf(el);
          el.style.setProperty('--delay', `${(idx % 10) * 60}ms`);
          el.classList.add('show');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // GSAP hero timeline (if available)
  if(window.gsap){
    try {
      const tl = gsap.timeline();
      tl.from('.hero-title', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
      tl.from('.subtitle', { y: 24, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
      tl.from('.hero-desc', { y: 24, opacity: 0, duration: 0.7 }, '-=0.4');
      tl.from('.portrait-card', { scale: 0.95, opacity: 0, duration: 0.9, ease: 'elastic.out(1,0.6)' }, '-=0.6');
    } catch(e){/* ignore */ }
  }

  // Animated underline draw (nav)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const underline = link.querySelector('.nav-underline');
      if(!underline) return;
      underline.style.width = '0%';
      requestAnimationFrame(() => underline.style.width = '100%');
    });
    link.addEventListener('mouseleave', () => {
      const underline = link.querySelector('.nav-underline');
      if(underline) underline.style.width = '';
    });
  });

  // Particle field - lightweight: generate circles in svg
  (function buildParticles(){
    const svg = document.querySelector('.particles');
    if(!svg) return;
    const layer = svg.querySelector('#particlesLayer');
    const w = 80; // number of particles scaled down
    const rect = svg.viewBox.baseVal;
    const width = rect && rect.width ? rect.width : 800;
    const height = rect && rect.height ? rect.height : 600;
    // generate varied circles
    for(let i=0;i<60;i++){
      const cx = Math.random()*width;
      const cy = Math.random()*height;
      const r = 6 + Math.random()*20;
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill','url(#g1)');
      circle.style.opacity = (0.06 + Math.random()*0.5).toString();
      circle.style.transformOrigin = `${cx}px ${cy}px`;
      circle.style.transition = `transform ${4+Math.random()*8}s ease-in-out, opacity ${3+Math.random()*6}s ease-in-out`;
      layer.appendChild(circle);
      // animate slight float via setInterval
      (function(c){
        let dir = Math.random() > 0.5 ? 1 : -1;
        setInterval(()=> {
          const dx = (Math.random()*8 - 4) * dir;
          const dy = (Math.random()*6 - 3) * dir;
          c.setAttribute('cx', Math.max(0, Math.min(width, parseFloat(c.getAttribute('cx')) + dx)));
          c.setAttribute('cy', Math.max(0, Math.min(height, parseFloat(c.getAttribute('cy')) + dy)));
          c.style.opacity = 0.04 + Math.random()*0.6;
        }, 3000 + Math.random()*4000);
      })(circle);
    }
  })();

  // portrait tilt (pointer only)
  const tilt = document.querySelector('[data-tilt]');
  function prefersReduceMotion(){ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function isTouch(){ return ('ontouchstart' in window) || navigator.maxTouchPoints > 0; }
  if(tilt && !prefersReduceMotion() && !isTouch()){
    const limit = 10;
    document.addEventListener('pointermove', (e) => {
      const r = tilt.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / (r.width/2);
      const dy = (e.clientY - cy) / (r.height/2);
      const rx = Math.max(-limit, Math.min(limit, -dy*limit));
      const ry = Math.max(-limit, Math.min(limit, dx*limit));
      tilt.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    document.addEventListener('pointerleave', ()=> tilt.style.transform = '');
  }

  // small Safari alignment fixes
  document.querySelectorAll('.portrait-frame, .photo-block, .hero-bg, .particles').forEach(el => {
    if(el && el.style) {
      el.style.backfaceVisibility = 'hidden';
      el.style.transformStyle = 'preserve-3d';
      el.style.webkitTransform = el.style.transform || '';
    }
  });

  // focus outline for keyboard users
  document.addEventListener('keydown', (e) => { if(e.key === 'Tab') document.body.classList.add('show-focus'); });

})();
