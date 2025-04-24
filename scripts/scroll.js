const container = document.querySelector('.scroll-container');
const sections = document.querySelectorAll('section');
let currentIndex = 0;
let isAnimating = false;

function smoothScrollTo(targetY, duration = 800) {
  const startY = container.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOut(t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  }

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOut(progress);

    container.scrollTop = startY + distance * eased;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isAnimating = false;
    }
  }

  requestAnimationFrame(animate);
}

function scrollToSection(index) {
  const direction = index > currentIndex ? 1 : -1;
  index = Math.max(0, Math.min(index, sections.length - 1));

  // Skip hidden sections
  while (
    index >= 0 &&
    index < sections.length &&
    window.getComputedStyle(sections[index]).display === 'none'
  ) {
    index += direction;
  }

  if (index < 0 || index >= sections.length) return;

  isAnimating = true;
  currentIndex = index;

  const targetY = sections[index].offsetTop;
  smoothScrollTo(targetY);
}

// Wheel/trackpad scroll detection
let wheelDeltaBuffer = 0;
let wheelLocked = false;
const wheelSensitivity = 20;

window.addEventListener('wheel', (e) => {
  if (isAnimating || wheelLocked) return;

  // Normalize for deltaMode (pixels vs lines vs pages)
  const delta = e.deltaY;

  if (Math.abs(delta) < wheelSensitivity) return;

  wheelLocked = true;

  if (delta > 0) {
    scrollToSection(currentIndex + 1);
  } else {
    scrollToSection(currentIndex - 1);
  }

  // Unlock after a delay (inertia protection)
  setTimeout(() => {
    wheelLocked = false;
  }, 800);
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
document.querySelectorAll('.link').forEach(link => {
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
const sectionContents = document.querySelectorAll('section');

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
