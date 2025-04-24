
const homeSlides = document.querySelectorAll('.home-slide');
const homeDots = document.querySelectorAll('.home-dot');
const homeLeftArrow = document.querySelector('.home-left-arrow');
const homeRightArrow = document.querySelector('.home-right-arrow');

const aboutSlides = document.querySelectorAll('.about-slide');
const aboutDots = document.querySelectorAll('.about-dot');
const aboutLeftArrow = document.querySelector('.about-left-arrow');
const aboutRightArrow = document.querySelector('.about-right-arrow');

let current = 0;
let userInteracted = false;

function showSlide(index, slides, dots) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  current = index;
}

// Dot navigation
homeDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    userInteracted = true;
    showSlide(index, homeSlides, homeDots);
  });
});

aboutDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    userInteracted = true;
    showSlide(index, aboutSlides, aboutDots);
  });
});

// Arrow navigation
homeLeftArrow.addEventListener('click', () => {
  userInteracted = true;
  const prev = (current - 1 + homeSlides.length) % homeSlides.length;
  showSlide(prev, homeSlides, homeDots);
});

aboutLeftArrow.addEventListener('click', () => {
  userInteracted = true;
  const prev = (current - 1 + aboutSlides.length) % aboutSlides.length;
  showSlide(prev, aboutSlides, aboutDots);
});

homeRightArrow.addEventListener('click', () => {
  userInteracted = true;
  const next = (current + 1) % homeSlides.length;
  showSlide(next, homeSlides, homeDots);
});

aboutRightArrow.addEventListener('click', () => {
  userInteracted = true;
  const next = (current + 1) % aboutSlides.length;
  showSlide(next, aboutSlides, aboutDots);
});

// Auto-slide every 20 seconds unless user interacted
setInterval(() => {
  if (userInteracted) return;
  const next = (current + 1) % homeSlides.length;
  showSlide(next, homeSlides, homeDots);
}, 20000);

setInterval(() => {
  if (userInteracted) return;
  const next = (current + 1) % aboutSlides.length;
  showSlide(next, aboutSlides, aboutDots);
}, 20000);


// Background image appearance logic
// document.addEventListener("DOMContentLoaded", () => {
//   const targetSection = document.querySelector('[data-section="about"]');
//   const image = document.getElementById("about-image");

//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           image.classList.add("visible");
//         } else {
//           image.classList.remove("visible");
//         }
//       });
//     },
//     {
//       root: null,
//       threshold: 0.9 // Trigger when ~90% of section is visible
//     }
//   );

//   if (targetSection) {
//     observer.observe(targetSection);
//   }
// });
