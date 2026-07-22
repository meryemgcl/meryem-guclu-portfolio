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
let filterBtns = document.querySelectorAll('.filter-btn');
let projectCards = document.querySelectorAll('.project-card');

function initFilters() {
  filterBtns = document.querySelectorAll('.filter-btn');
  projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    // Remove old listeners to avoid duplicates if called multiple times
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  filterBtns = document.querySelectorAll('.filter-btn');
  
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
}
initFilters();
// ---- Contact form handler ----
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  const btn = document.getElementById('btn-send');
  const btnText = document.getElementById('btn-send-text');
  
  if (!form || !success || !btn) return;
  
  const originalText = btnText.innerText;
  btnText.innerText = "Gönderiliyor...";
  btn.style.opacity = "0.7";
  btn.style.pointerEvents = "none";
  success.style.display = "none";
  errorMsg.style.display = "none";
  
  const formData = new FormData(form);
  
  try {
    const response = await fetch('https://formsubmit.co/ajax/meriguclu123@gmail.com', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
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
  fetchGitHubProjects();

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

// ---- Fetch GitHub Projects ----
async function fetchGitHubProjects() {
  const username = 'meryemgcl';
  const repoGrid = document.getElementById('projects-grid');
  const filterContainer = document.getElementById('projects-filter');
  if (!repoGrid || !filterContainer) return;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100`);
    if (!response.ok) return;
    const repos = await response.json();

    const existingFilterKeys = Array.from(document.querySelectorAll('.filter-btn')).map(btn => btn.dataset.filter);
    
    // Ignore portfolio repo and already hardcoded repos based on some criteria, here just ignore the portfolio repo
    const ignoredRepos = ['meryem-guclu-portfolio', 'meryemgcl.github.io'];

    for (const repo of repos) {
      if (ignoredRepos.includes(repo.name) || repo.fork) continue;

      const lang = repo.language || 'Diğer';
      const catKey = lang.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Create filter button if it doesn't exist
      if (!existingFilterKeys.includes(catKey)) {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = catKey;
        btn.textContent = lang;
        filterContainer.appendChild(btn);
        existingFilterKeys.push(catKey);
      }

      // Create project card
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.dataset.category = catKey;
      card.innerHTML = `
        <div class="project-card-header">
          <div class="project-icon">⚡</div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" aria-label="GitHub" class="project-link-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
        <h3 class="project-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${repo.name}">${repo.name}</h3>
        <p class="project-desc">${repo.description || 'Bu proje için henüz bir açıklama bulunmuyor.'}</p>
        <div class="project-tags">
          <span class="ptag">${lang}</span>
          ${repo.topics ? repo.topics.map(t => `<span class="ptag">${t}</span>`).join('') : ''}
        </div>
      `;
      repoGrid.appendChild(card);
    }

    // Re-initialize filters and reveal animations
    initFilters();
    revealElements();
  } catch (error) {
    console.error('GitHub API error:', error);
  }
}
