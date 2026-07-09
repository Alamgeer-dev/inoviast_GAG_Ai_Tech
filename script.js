// -----------------------------------------------------------------
// Hero spotlight assets
// -----------------------------------------------------------------
const BG_IMAGE_1 = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80';
const BG_IMAGE_2 = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80';
const SPOTLIGHT_R = 260;

const heroBase = document.getElementById('heroBase');
const revealLayer = document.getElementById('revealLayer');
const canvas = document.getElementById('revealCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (heroBase && revealLayer && canvas && ctx) {
  heroBase.style.backgroundImage = `url(${BG_IMAGE_1})`;
  revealLayer.style.backgroundImage = `url(${BG_IMAGE_2})`;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const smooth = { x: mouse.x, y: mouse.y };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  function drawMask(x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const dataUrl = canvas.toDataURL();
    revealLayer.style.WebkitMaskImage = `url(${dataUrl})`;
    revealLayer.style.maskImage = `url(${dataUrl})`;
  }

  function tick() {
    smooth.x += (mouse.x - smooth.x) * 0.1;
    smooth.y += (mouse.y - smooth.y) * 0.1;
    drawMask(smooth.x, smooth.y);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// -----------------------------------------------------------------
// Mobile menu toggle
// -----------------------------------------------------------------
const burgerBtn = document.getElementById('burgerBtn');
const burgerIcon = document.getElementById('burgerIcon');
const closeIcon = document.getElementById('closeIcon');
const mobileMenu = document.getElementById('mobileMenu');

if (burgerBtn && burgerIcon && closeIcon && mobileMenu) {
  function setMenuOpen(open) {
    mobileMenu.classList.toggle('open', open);
    burgerIcon.style.display = open ? 'none' : 'block';
    closeIcon.style.display = open ? 'block' : 'none';
    burgerBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  burgerBtn.addEventListener('click', () => {
    setMenuOpen(!mobileMenu.classList.contains('open'));
  });

  mobileMenu.querySelectorAll('a, button').forEach((item) => {
    item.addEventListener('click', () => setMenuOpen(false));
  });
}

// -----------------------------------------------------------------
// Services carousel
// -----------------------------------------------------------------
const servicesTrack = document.getElementById('servicesTrack');
const servicesPrev = document.getElementById('servicesPrev');
const servicesNext = document.getElementById('servicesNext');
const carouselDots = document.querySelectorAll('.carousel-dot');

if (servicesTrack && servicesPrev && servicesNext) {
  const getStep = () => {
    const card = servicesTrack.querySelector('.service-card');
    return card ? card.getBoundingClientRect().width + 20 : 320;
  };

  const updateDots = () => {
    const index = Math.round(servicesTrack.scrollLeft / getStep());
    carouselDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  };

  servicesPrev.addEventListener('click', () => {
    servicesTrack.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  servicesNext.addEventListener('click', () => {
    servicesTrack.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  servicesTrack.addEventListener('scroll', updateDots, { passive: true });
  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.index);
      servicesTrack.scrollTo({ left: index * getStep(), behavior: 'smooth' });
    });
  });

  window.addEventListener('resize', updateDots);
  updateDots();
}

// -----------------------------------------------------------------
// Scroll reveal and active navigation
// -----------------------------------------------------------------
const revealItems = document.querySelectorAll('.about-animate, .section-reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const navLinks = document.querySelectorAll('.nav-link');
const linkedSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navLinks.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-42% 0px -50% 0px', threshold: 0.01 });

  linkedSections.forEach((section) => navObserver.observe(section));
}

// -----------------------------------------------------------------
// FAQ accordion
// -----------------------------------------------------------------
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('is-open');
  });
});

// -----------------------------------------------------------------
// CTA shortcuts
// -----------------------------------------------------------------
document.querySelectorAll('.nav-cta, .mobile-cta, .hero-cta').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
  });
});
