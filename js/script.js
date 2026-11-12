(function(){
  var track=document.getElementById('track'),slides=[].slice.call(track.children),N=slides.length,
      dotsBox=document.getElementById('dots'),playBtn=document.getElementById('play'),car=track.closest('.car'),
      i=0,t,hover=false,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,x0=null;
  var dots=slides.map(function(_,n){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ir al proyecto '+(n+1));b.onclick=function(){go(n)};dotsBox.appendChild(b);return b});
  function schedule(){clearTimeout(t);if(playing&&!hover)t=setTimeout(function(){go(i+1)},i===0?9000:6500)}
  function go(n){i=(n+N)%N;track.style.transform='translateX(-'+i*100+'%)';
    slides.forEach(function(s,k){s.inert=k!==i;s.setAttribute('aria-hidden',k!==i)});
    dots.forEach(function(d,k){d.setAttribute('aria-current',k===i)});schedule()}
  function label(){playBtn.textContent=playing?'Pausar':'Reproducir';track.setAttribute('aria-live',playing?'off':'polite');playBtn.setAttribute('aria-label',playing?'Pausar rotación automática':'Reanudar rotación automática')}
  document.getElementById('prev').onclick=function(){go(i-1)};
  document.getElementById('next').onclick=function(){go(i+1)};
  playBtn.onclick=function(){playing=!playing;label();schedule()};
  car.addEventListener('mouseenter',function(){hover=true;clearTimeout(t)});
  car.addEventListener('mouseleave',function(){hover=false;schedule()});
  car.addEventListener('focusin',function(){hover=true;clearTimeout(t)});

  car.addEventListener('focusout', function(event) {
  const nextElement = event.relatedTarget;

  if (!nextElement || !car.contains(nextElement)) {
    hover = false;
    schedule();
  }
});
  car.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
  car.addEventListener('pointerdown',function(e){x0=e.clientX});
  car.addEventListener('pointerup',function(e){if(x0===null)return;var d=e.clientX-x0;x0=null;if(Math.abs(d)>50)go(d<0?i+1:i-1)});
  [].forEach.call(document.querySelectorAll('[data-slide]'),function(a){a.addEventListener('click',function(){go(+a.getAttribute('data-slide'))})});
  var rail=[].slice.call(document.querySelectorAll('.rail i')),secs=['.hero','#proyectos','#sobre','#stack','#trayectoria','#contacto'].map(function(q){return document.querySelector(q)});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var k=secs.indexOf(e.target);rail.forEach(function(d,m){d.classList.toggle('on',m===k)})}})},{rootMargin:'-45% 0px -50% 0px'});secs.forEach(function(el){el&&io.observe(el)})}
  label();go(0);


  // Animaciones de entrada: se activan cuando cada elemento entra en pantalla.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.hero .wrap > div, section .wrap > h2, section .wrap > .lead, ' +
    '.about > *, .grid2 > div, .cols > div, .tl li, .contact .wrap > *'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(function(el, index) {
      el.classList.add('reveal');
      el.style.transitionDelay = (index % 4) * 70 + 'ms';
    });

    var revealObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealTargets.forEach(function(el) { revealObserver.observe(el); });
  }

  // Barra superior que indica cuánto ha avanzado el usuario en la página.
  var progress = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progress) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, percent)) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Marca el enlace de navegación correspondiente a la sección visible.
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav nav a[href^="#"]')
  );
  var navSections = navLinks.map(function(link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    var navObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function(link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    navSections.forEach(function(section) { navObserver.observe(section); });
  }

})();