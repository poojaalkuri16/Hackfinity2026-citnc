// Canvas Background Animation
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let particlesArray;
let w, h;

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  w = canvas.width;
  h = canvas.height;
}

window.addEventListener('resize', initCanvas);

class Particle {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Add glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
  }

  update() {
    if (this.x > w || this.x < 0) this.dx = -this.dx;
    if (this.y > h || this.y < 0) this.dy = -this.dy;

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

function initParticles() {
  particlesArray = [];
  let numberOfParticles = (w * h) / 10000;

  const colors = ['rgba(157, 78, 221, 0.8)', 'rgba(72, 202, 228, 0.8)', 'rgba(255, 106, 0, 0.5)'];

  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let dx = (Math.random() * 2) - 1;
    let dy = (Math.random() * 2) - 1;
    let color = colors[Math.floor(Math.random() * colors.length)];

    particlesArray.push(new Particle(x, y, dx, dy, size, color));
  }
}

// Draw circuit-like connecting lines
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < 12000) {
        opacityValue = 1 - (distance / 12000);

        ctx.strokeStyle = 'rgba(157, 78, 221,' + opacityValue * 0.5 + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Drawing right angles for a circuit-like feel
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);

        // Find midpoint
        let midX = (particlesArray[a].x + particlesArray[b].x) / 2;

        ctx.lineTo(midX, particlesArray[a].y);
        ctx.lineTo(midX, particlesArray[b].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);

        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

// Navigation and Smooth scrolling logic
function showPage(pageId) {
  const mainContent = document.getElementById('main-content');
  const problemsPage = document.getElementById('problems-page');
  const faqsPage = document.getElementById('faqs-page');
  const contactPage = document.getElementById('contact-page');

  if (pageId === '#problems') {
    if(mainContent) mainContent.style.display = 'none';
    if(faqsPage) faqsPage.style.display = 'none';
    if(contactPage) contactPage.style.display = 'none';
    if(problemsPage) problemsPage.style.display = 'block';
    window.scrollTo(0, 0);
  } else if (pageId === '#faqs') {
    if(mainContent) mainContent.style.display = 'none';
    if(problemsPage) problemsPage.style.display = 'none';
    if(contactPage) contactPage.style.display = 'none';
    if(faqsPage) faqsPage.style.display = 'block';
    window.scrollTo(0, 0);
  } else if (pageId === '#contact') {
    if(mainContent) mainContent.style.display = 'none';
    if(problemsPage) problemsPage.style.display = 'none';
    if(faqsPage) faqsPage.style.display = 'none';
    if(contactPage) contactPage.style.display = 'block';
    window.scrollTo(0, 0);
  } else {
    if(mainContent) mainContent.style.display = 'block';
    if(problemsPage) problemsPage.style.display = 'none';
    if(faqsPage) faqsPage.style.display = 'none';
    if(contactPage) contactPage.style.display = 'none';

    // Scroll to the specific section if it's not #home, #problems, #faqs or #contact
    if (pageId !== '#' && pageId !== '#home') {
      const element = document.querySelector(pageId);
      if (element) {
        // slight delay to allow display:block to render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    } else if (pageId === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Reveal elements on the newly shown page after a short delay
  setTimeout(reveal, 100);
  setTimeout(reveal, 500);
}

// On Load check hash
window.addEventListener('load', () => {
  if (window.location.hash === '#problems') {
    showPage('#problems');
  } else if (window.location.hash === '#faqs') {
    showPage('#faqs');
  } else if (window.location.hash === '#contact') {
    showPage('#contact');
  }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const hash = window.location.hash || '#home';
  showPage(hash);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    if (targetId !== '#') {
      e.preventDefault();

      // Update the URL hash
      history.pushState(null, null, targetId);

      // Handle page switching
      if (targetId === '#problems' || targetId === '#faqs' || targetId === '#contact') {
        showPage(targetId);
      } else {
        // If we are currently on problems, faqs or contact page, switch back to main
        const problemsActive = document.getElementById('problems-page') && document.getElementById('problems-page').style.display === 'block';
        const faqsActive = document.getElementById('faqs-page') && document.getElementById('faqs-page').style.display === 'block';
        const contactActive = document.getElementById('contact-page') && document.getElementById('contact-page').style.display === 'block';
        
        if (problemsActive || faqsActive || contactActive) {
          showPage(targetId);
        } else {
          // We are on main page, just smooth scroll
          const element = document.querySelector(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    }
  });
});

// Accordion Logic
window.toggleAccordion = function (headerElement) {
  const item = headerElement.parentElement;

  // Close all other accordions
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(accItem => {
    if (accItem !== item) {
      accItem.classList.remove('active');
    }
  });

  // Toggle the clicked one
  item.classList.toggle('active');
};

// Reveal elements on scroll
function reveal() {
  var reveals = document.querySelectorAll('.glass-card, .section-title, .timeline-item');
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add('active');
    }
  }
}

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.querySelector('.nav-links');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a nav link (not the dropdown trigger)
  navLinks.querySelectorAll('a:not(.dropbtn)').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
      // Also close any open dropdown
      const openDropdown = navLinks.querySelector('.dropdown.mobile-open');
      if (openDropdown) openDropdown.classList.remove('mobile-open');
    });
  });

  // Mobile dropdown toggle (click instead of hover)
  const dropdownBtn = navLinks.querySelector('.dropbtn');
  if (dropdownBtn) {
    dropdownBtn.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropdownBtn.closest('.dropdown').classList.toggle('mobile-open');
      }
    });
  }
}

// Initial setup
initCanvas();
initParticles();
animate();

// Reveal: fire on load, scroll, and resize
reveal();
window.addEventListener('scroll', reveal);
window.addEventListener('resize', reveal);

// Fallback: reveal again after short delays to catch any edge cases
setTimeout(reveal, 300);
setTimeout(reveal, 1000);
