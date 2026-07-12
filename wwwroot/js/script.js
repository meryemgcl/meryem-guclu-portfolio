/* =============================================
   MERYEM GÜÇLÜ — PORTFOLIO JAVASCRIPT
   Interactions, animations, filtering
   ============================================= */

// ---- Code Rain Canvas (Hero Section Background) ----
function initCodeCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</>{}()[];=+*#&!?'.split('');
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(5, 11, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#06B6D4';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  let animId = setInterval(draw, 50);

  // Pause when not visible to save resources
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animId) animId = setInterval(draw, 50);
      } else {
        clearInterval(animId);
        animId = null;
      }
    });
  });
  observer.observe(canvas);

  window.addEventListener('resize', () => {
    resizeCanvas();
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });
}

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
  document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
});

navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active navigation highlighting ----
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ---- Typed title effect ----
const titles = [
  'Software Developer',
  'Data Enthusiast',
  'Python Developer',
  'Problem Solver'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const titleEl = document.getElementById('hero-title-text');

function typeTitle() {
  const current = titles[titleIndex];

  if (!isDeleting) {
    titleEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeTitle, 2200);
      return;
    }
  } else {
    titleEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  setTimeout(typeTitle, isDeleting ? 60 : 90);
}

setTimeout(typeTitle, 1000);

// ---- Scroll reveal animations ----
const revealElements = () => {
  const elements = document.querySelectorAll(
    '.about-grid, .skill-category, .project-card, .timeline-item, .edu-card, .contact-grid, .section-header'
  );

  elements.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80 * (Array.from(entry.target.parentElement?.children || []).indexOf(entry.target)));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
};

// ---- Project filtering ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach((card, i) => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = `fadeInUp 0.5s ${i * 0.05}s ease forwards`;
        card.style.opacity = '0';
        setTimeout(() => { card.style.opacity = ''; }, 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

let formSubmitted = false;

// ---- Contact form handler ----
function handleFormSubmit() {
  formSubmitted = true;
  const btn = document.getElementById('btn-send');
  const btnText = document.getElementById('btn-send-text');
  
  if (btnText) btnText.textContent = 'Gönderiliyor...';
  else btn.textContent = 'Gönderiliyor...';
  
  btn.disabled = true;
  if (!form || !success || !btn) return;
  
  const originalText = btnText.innerText;
  btnText.innerText = "Gönderiliyor...";
  btn.style.opacity = "0.7";
  btn.style.pointerEvents = "none";
  success.style.display = "none";
  errorMsg.style.display = "none";
  
  const formData = new FormData(form);
  
  try {
    const response = await fetch('/Home/SendMessage', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      success.style.display = "block";
      form.reset();
    } else {
      errorMsg.style.display = "block";
    }
  } catch (error) {
    errorMsg.style.display = "block";
  } finally {
    btnText.innerText = originalText;
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  }
}

// ---- Stats counter animation ----
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const reposEl = document.getElementById('stat-repos');
      const followersEl = document.getElementById('stat-followers');
      const followingEl = document.getElementById('stat-following');

      if (reposEl) animateCounter(reposEl, 22);
      if (followersEl) animateCounter(followersEl, 67);
      if (followingEl) animateCounter(followingEl, 66);

      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.getElementById('about-stats');
if (statsEl) statsObserver.observe(statsEl);

// ---- Smooth scroll polyfill ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  revealElements();
  updateActiveNav();
  initCodeCanvas();

  // Add subtle parallax to hero shapes
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    shapes.forEach((shape, i) => {
      const factor = (i + 1) * 0.5;
      shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
});

// ---- Cursor glow effect (subtle) ----
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(205,181,142,0.05) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});
