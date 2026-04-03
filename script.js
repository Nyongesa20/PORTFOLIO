/* ═══════════════════════════════════════════════
   PORTFOLIO JS — script.js
   Include at end of <body> as <script src="script.js">
═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. DOM REFERENCES
───────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const navToggle   = document.getElementById('navToggle');
const navLinks    = document.getElementById('navLinks');
const backToTop   = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('form-success');
const submitBtn   = document.getElementById('submitBtn');

/* ─────────────────────────────────────────────
   2. NAVBAR — shrink on scroll + mobile toggle
───────────────────────────────────────────── */
function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ─────────────────────────────────────────────
   3. ACTIVE NAV LINK — highlight current section
───────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function highlightNav() {
  const scrollPos = window.scrollY + 140;
  let currentId = '';

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop) {
      currentId = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
  });
}


/* ─────────────────────────────────────────────
   4. SCROLL REVEAL — animate elements into view
───────────────────────────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards in the same grid
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const index = [...siblings].indexOf(entry.target);
      const delay = Math.min(index * 80, 400); // max 400ms delay

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   5. BACK TO TOP BUTTON
───────────────────────────────────────────── */
function handleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────────
   6. SCROLL EVENT — grouped for performance
───────────────────────────────────────────── */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleNavScroll();
      highlightNav();
      handleBackToTop();
      ticking = false;
    });
    ticking = true;
  }
});

// Run once on load
handleNavScroll();
highlightNav();


/* ─────────────────────────────────────────────
   7. SMOOTH SCROLL for anchor links
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────
   8. CONTACT FORM — validation + submission
───────────────────────────────────────────── */
function showError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;

  input.classList.toggle('invalid', show);
  error.classList.toggle('visible', show);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmessage').value.trim();

    let valid = true;

    // Validate name
    if (!name) {
      showError('fname', 'err-name', true);
      valid = false;
    } else {
      showError('fname', 'err-name', false);
    }

    // Validate email
    if (!email || !validateEmail(email)) {
      showError('femail', 'err-email', true);
      valid = false;
    } else {
      showError('femail', 'err-email', false);
    }

    // Validate message
    if (!message) {
      showError('fmessage', 'err-message', true);
      valid = false;
    } else {
      showError('fmessage', 'err-message', false);
    }

    if (!valid) return;

    // ── Simulate send (replace this block with your real backend or Formspree) ──
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      // Show success message
      formSuccess.classList.remove('hidden');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message &rarr;';

      // Hide success after 6 seconds
      setTimeout(() => {
        formSuccess.classList.add('hidden');
      }, 6000);
    }, 1200); // Simulated 1.2s network delay

    /*
    ── TO CONNECT A REAL BACKEND, replace the block above with: ──

    const formData = new FormData(contactForm);

    fetch('https://formspree.io/f/YOUR_FORM_ID', {   // or your PHP endpoint
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        formSuccess.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.add('hidden'), 6000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    })
    .catch(() => alert('Network error. Please try again.'))
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send Message &rarr;';
    });
    */
  });

  // Clear errors on input
  ['fname','femail','fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const err = document.getElementById('err-' + id.replace('f',''));
        if (err) err.classList.remove('visible');
      });
    }
  });
}


/* ─────────────────────────────────────────────
   9. SKILL CARD — subtle tilt on mouse move
───────────────────────────────────────────── */
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width / 2;
    const cy     = rect.height / 2;
    const rotX   = ((y - cy) / cy) * -5;   // max ±5deg
    const rotY   = ((x - cx) / cx) *  5;

    card.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    card.style.transition = 'transform 0.05s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'all 0.35s ease';
  });
});


/* ─────────────────────────────────────────────
   10. TYPED EFFECT — hero tagline cycling
───────────────────────────────────────────── */
(function typedEffect() {
  const roles = [
    'Web Developer',
    'IT Graduate',
    'CyberOps Enthusiast',
    'PHP Developer',
    'Problem Solver'
  ];

  // Find the <em> tag inside .hero-sub
  const em = document.querySelector('.hero-sub em');
  if (!em) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  const typingSpeed   = 90;
  const deletingSpeed = 50;
  const pauseTime     = 2000;

  function type() {
    const current = roles[roleIndex];

    if (!deleting) {
      em.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      em.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
  }

  // Start after a short delay so hero animation settles first
  setTimeout(type, 1500);
})();


/* ─────────────────────────────────────────────
   11. YEAR — auto-update footer copyright year
───────────────────────────────────────────── */
(function updateYear() {
  const yearEls = document.querySelectorAll('.footer-year');
  const year = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = year);
})();