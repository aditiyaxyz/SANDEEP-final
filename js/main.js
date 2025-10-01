document.addEventListener('DOMContentLoaded',()=>{
  gsap.from('.stagger-text',{duration:1,y:50,opacity:0,ease:'power3.out',stagger:0.1});
  gsap.from('.subheading',{duration:1,delay:0.5,y:20,opacity:0,ease:'power3.out'});
  gsap.from('.btn-glow',{duration:1,delay:1,scale:0.8,opacity:0,ease:'back.out(1.7)'});
});
const sections=document.querySelectorAll('section');
sections.forEach(section=>{
  gsap.from(section,{
    scrollTrigger:{trigger:section,start:'top 80%',toggleActions:'play none none none'},
    y:50,opacity:0,duration:1,ease:'power3.out'
  });
});
const canvas=document.getElementById('particle-canvas');
const ctx=canvas.getContext('2d');
let particlesArray;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  initParticles();
});
class Particle{constructor(x,y,size,speedX,speedY){this.x=x;this.y=y;this.size=size;this.speedX=speedX;this.speedY=speedY;}update(){this.x+=this.speedX;this.y+=this.speedY;if(this.x>canvas.width)this.x=0;if(this.x<0)this.x=canvas.width;if(this.y>canvas.height)this.y=0;if(this.y<0)this.y=canvas.height;}draw(){ctx.fillStyle="rgba(212,175,55,0.6)";ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill();}}
function initParticles(){particlesArray=[];const numberOfParticles=Math.floor((canvas.width*canvas.height)/15000);for(let i=0;i<numberOfParticles;i++){const size=Math.random()*3+1;const x=Math.random()*canvas.width;const y=Math.random()*canvas.height;const speedX=(Math.random()-0.5)*0.5;const speedY=(Math.random()-0.5)*0.5;particlesArray.push(new Particle(x,y,size,speedX,speedY));}}
initParticles();
function animateParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);particlesArray.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animateParticles);}
animateParticles();
