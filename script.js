/* ══════════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   Features:
     • Sticky nav with scroll-style transition
     • Active nav link tracking (IntersectionObserver)
     • Hamburger mobile menu toggle
     • Smooth scroll for all anchor links
     • Scroll-triggered fade-in animations
     • Skill bar fill animation on scroll into view
     • Contact form validation & submission feedback
══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM references ──────────────────────────────────────────── */
const navHeader  = document.getElementById('nav-header');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const allLinks   = document.querySelectorAll('.nav-link');
const form       = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

/* ════════════════════════════════════════════════════════════════
   1. NAV — scrolled style
════════════════════════════════════════════════════════════════ */
const onScroll = () => {
  if (window.scrollY > 20) {
    navHeader.classList.add('scrolled');
  } else {
    navHeader.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run immediately

/* ════════════════════════════════════════════════════════════════
   2. HAMBURGER MENU
════════════════════════════════════════════════════════════════ */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Lock body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.matches('.nav-link')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ════════════════════════════════════════════════════════════════
   3. SMOOTH SCROLL for anchor links
════════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = navHeader.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════════════════════
   4. ACTIVE NAV LINK — IntersectionObserver per section
════════════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      allLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  rootMargin: `-${navHeader.offsetHeight + 20}px 0px -50% 0px`,
  threshold: 0,
});

sections.forEach(section => sectionObserver.observe(section));

/* ════════════════════════════════════════════════════════════════
   5. SCROLL ANIMATIONS — fade-in on appear
════════════════════════════════════════════════════════════════ */
// Add fade-in class to target elements (sections, cards, items)
const animTargets = [
  '.about-grid',
  '.skill-category',
  '.project-card',
  '.contact-grid',
  '.section-heading',
];

animTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-in');
    // Stagger children in grids
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: '-60px 0px',
  threshold: 0.1,
});

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ════════════════════════════════════════════════════════════════
   6. SKILL BARS — animate width when in view
════════════════════════════════════════════════════════════════ */
const fills = document.querySelectorAll('.skill-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.getAttribute('data-width');
      fill.style.width = `${width}%`;
      barObserver.unobserve(fill);
    }
  });
}, {
  threshold: 0.3,
});

fills.forEach(fill => barObserver.observe(fill));

/* ════════════════════════════════════════════════════════════════
   7. CONTACT FORM VALIDATION
════════════════════════════════════════════════════════════════ */
const validators = {
  name: {
    field:   document.getElementById('name'),
    error:   document.getElementById('name-error'),
    validate(val) {
      if (!val.trim())              return 'Name is required.';
      if (val.trim().length < 2)    return 'Name must be at least 2 characters.';
      return '';
    }
  },
  email: {
    field:   document.getElementById('email'),
    error:   document.getElementById('email-error'),
    validate(val) {
      if (!val.trim())                          return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
      return '';
    }
  },
  message: {
    field:   document.getElementById('message'),
    error:   document.getElementById('message-error'),
    validate(val) {
      if (!val.trim())              return 'Message is required.';
      if (val.trim().length < 20)   return 'Message must be at least 20 characters.';
      return '';
    }
  }
};

// Live validation on blur
Object.values(validators).forEach(({ field, error, validate }) => {
  field.addEventListener('blur', () => {
    const msg = validate(field.value);
    error.textContent = msg;
    field.classList.toggle('error', !!msg);
  });
  // Clear error on focus
  field.addEventListener('focus', () => {
    error.textContent = '';
    field.classList.remove('error');
  });
});

// Submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  formSuccess.classList.remove('visible');

  Object.values(validators).forEach(({ field, error, validate }) => {
    const msg = validate(field.value);
    error.textContent = msg;
    field.classList.toggle('error', !!msg);
    if (msg) isValid = false;
  });

  if (!isValid) return;

  // Simulate async send
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    formSuccess.classList.add('visible');

    // Hide success message after 5 seconds
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});

/* ════════════════════════════════════════════════════════════════
   8. OPTIONAL: Typing cursor blink is CSS-only (no JS needed)
      Terminal code block is static markup — cursor via CSS @keyframes
════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════
   9. Click-outside to close mobile menu overlay
════════════════════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  const isMenuOpen = navLinks.classList.contains('open');
  if (!isMenuOpen) return;

  const clickedInsideMenu = navLinks.contains(e.target);
  const clickedHamburger  = hamburger.contains(e.target);

  if (!clickedInsideMenu && !clickedHamburger) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});
