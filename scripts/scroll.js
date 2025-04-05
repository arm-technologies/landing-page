const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('section');
let currentIndex = 0;
let isAnimating = false;

function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return;

  isAnimating = true;
  currentIndex = index;
  sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    isAnimating = false;
  }, 800); // inertia-like scroll window
}

// Wheel/trackpad scroll detection
let wheelDeltaBuffer = 0;
const wheelSensitivity = 2;

window.addEventListener('wheel', (e) => {
  if (isAnimating) return;

  wheelDeltaBuffer += e.deltaY;

  if (wheelDeltaBuffer > wheelSensitivity) {
    scrollToSection(currentIndex + 1);
    wheelDeltaBuffer = 0;
  } else if (wheelDeltaBuffer < -wheelSensitivity) {
    scrollToSection(currentIndex - 1);
    wheelDeltaBuffer = 0;
  }
}, { passive: false });

// Touch/swipe
let touchStartY = null;
const touchThreshold = 20;

window.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].clientY;
});

window.addEventListener('touchend', (e) => {
  if (isAnimating || touchStartY === null) return;

  const deltaY = touchStartY - e.changedTouches[0].clientY;

  if (deltaY > touchThreshold) {
    scrollToSection(currentIndex + 1);
  } else if (deltaY < -touchThreshold) {
    scrollToSection(currentIndex - 1);
  }

  touchStartY = null;
});

// Keyboard scroll
window.addEventListener('keydown', (e) => {
  if (isAnimating) return;

  if (e.key === 'ArrowDown') {
    scrollToSection(currentIndex + 1);
  } else if (e.key === 'ArrowUp') {
    scrollToSection(currentIndex - 1);
  }
});

// Burger menu link scroll
document.querySelectorAll('.navbar-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const index = parseInt(link.getAttribute('data-index'));
    scrollToSection(index);

    // Close burger menu
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.navbar-menu');
    if (burger.classList.contains('open')) {
      burger.classList.remove('open');
      menu.classList.remove('active');
    }
  });
});

// Section content animation on entry (experimenting)
const sectionContents = document.querySelectorAll('.section-content');

const contentObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.4
});

sectionContents.forEach(content => contentObserver.observe(content));

// Track currentIndex
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(sections).indexOf(entry.target);
      currentIndex = index;
    }
  });
}, {
  threshold: 0.6
});

sections.forEach(section => sectionObserver.observe(section));
