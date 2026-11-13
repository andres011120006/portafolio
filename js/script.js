(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener: function () {} };

  var nav = document.getElementById('primaryNavigation');
  var navToggle = document.getElementById('navToggle');
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );

  function closeMobileNav(returnFocus) {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('.nav-toggle-label').textContent = 'Menú';
    if (returnFocus) navToggle.focus();
  }

  if (nav && navToggle) {
    navToggle.hidden = false;

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
      navToggle.querySelector('.nav-toggle-label').textContent = isOpen ? 'Menú' : 'Cerrar menú';
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileNav(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMobileNav(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeMobileNav(false);
      }
    });

    var desktopQuery = window.matchMedia('(min-width: 761px)');
    function syncNavForViewport() {
      if (desktopQuery.matches) closeMobileNav(false);
    }
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', syncNavForViewport);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(syncNavForViewport);
    }
  }

  // Año del pie de página: evita que el dato quede desactualizado.
  var year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  // Si falta la foto, conserva las iniciales como alternativa visual.
  var profileImage = document.querySelector('.profile-photo img');
  if (profileImage) {
    profileImage.addEventListener('error', function () {
      var picture = profileImage.closest('picture');
      if (picture) picture.remove();
    });
  }

  // Barra de progreso de lectura. El listener pasivo no bloquea el scroll.
  var progress = document.getElementById('scrollProgress');
  var progressPending = false;

  function updateProgress() {
    if (!progress) return;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, percentage)) + '%';
    progressPending = false;
  }

  function requestProgressUpdate() {
    if (progressPending) return;
    progressPending = true;
    window.requestAnimationFrame(updateProgress);
  }

  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate, { passive: true });
  updateProgress();

  // Resalta el enlace de navegación de la sección que está leyendo la persona.
  var navSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, {
      rootMargin: '-28% 0px -62% 0px',
      threshold: 0
    });

    navSections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // Las animaciones de entrada solo se aplican si el navegador no pide reducir movimiento.
  var revealSelector = [
    '.hero-copy',
    '.hero-visual',
    '.section-heading',
    '.project-card',
    '.lab-card',
    '.about-grid > *',
    '.technology-grid > div',
    '.journey-grid > div',
    '.contact-content > *'
  ].join(', ');
  var revealTargets = Array.prototype.slice.call(
    document.querySelectorAll(revealSelector)
  );
  var revealObserver = null;

  function revealEverything() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    revealTargets.forEach(function (element) {
      element.classList.remove('reveal');
      element.classList.remove('is-visible');
      element.style.removeProperty('transition-delay');
    });
  }

  function enableRevealAnimations() {
    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      revealEverything();
      return;
    }

    revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -32px 0px'
    });

    revealTargets.forEach(function (element, index) {
      element.classList.add('reveal');
      element.style.transitionDelay = (index % 3) * 65 + 'ms';
      revealObserver.observe(element);
    });
  }

  enableRevealAnimations();

  // Si la preferencia del sistema cambia mientras la página está abierta,
  // se muestran todos los elementos y se eliminan las animaciones pendientes.
  function handleMotionPreferenceChange(event) {
    if (event.matches) revealEverything();
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', handleMotionPreferenceChange);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(handleMotionPreferenceChange);
  }
})();
