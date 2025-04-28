document.addEventListener("DOMContentLoaded", () => {
  const homeSlides = document.querySelectorAll('.home-slide');
  const homeDots = document.querySelectorAll('.home-dot');
  const homeLeftArrow = document.querySelector('.home-left-arrow');
  const homeRightArrow = document.querySelector('.home-right-arrow');

  const aboutSlides = document.querySelectorAll('.about-slide');
  const aboutDots = document.querySelectorAll('.about-dot');
  const aboutLeftArrow = document.querySelector('.about-left-arrow');
  const aboutRightArrow = document.querySelector('.about-right-arrow');

  let currentHome = 0;
  let currentAbout = 0;
  let homeUserInteracted = false;
  let aboutUserInteracted = false;

  // Initialize home slider if elements exist
  if (homeSlides.length > 0 && homeDots.length > 0) {
    function showHomeSlide(index) {
      homeSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        if (homeDots[i]) {
          homeDots[i].classList.toggle('active', i === index);
        }
      });
      currentHome = index;
    }

    // Home dots
    homeDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        homeUserInteracted = true;
        showHomeSlide(index);
      });
    });

    // Home arrows
    if (homeLeftArrow) {
      homeLeftArrow.addEventListener('click', () => {
        homeUserInteracted = true;
        const prev = (currentHome - 1 + homeSlides.length) % homeSlides.length;
        showHomeSlide(prev);
      });
    }

    if (homeRightArrow) {
      homeRightArrow.addEventListener('click', () => {
        homeUserInteracted = true;
        const next = (currentHome + 1) % homeSlides.length;
        showHomeSlide(next);
      });
    }

    // Home auto-slide
    if (homeSlides.length > 1) {
      setInterval(() => {
        if (homeUserInteracted) return;
        const next = (currentHome + 1) % homeSlides.length;
        showHomeSlide(next);
      }, 20000);
    }
  }

  // Initialize about slider if elements exist
  if (aboutSlides.length > 0 && aboutDots.length > 0) {
    function showAboutSlide(index) {
      aboutSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        if (aboutDots[i]) {
          aboutDots[i].classList.toggle('active', i === index);
        }
      });
      currentAbout = index;
    }

    // About dots
    aboutDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        aboutUserInteracted = true;
        showAboutSlide(index);
      });
    });

    // About arrows
    if (aboutLeftArrow) {
      aboutLeftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        aboutUserInteracted = true;
        const prev = (currentAbout - 1 + aboutSlides.length) % aboutSlides.length;
        showAboutSlide(prev);
        console.log('About left arrow clicked, showing slide', prev);
      });
    }

    if (aboutRightArrow) {
      aboutRightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        aboutUserInteracted = true;
        const next = (currentAbout + 1) % aboutSlides.length;
        showAboutSlide(next);
        console.log('About right arrow clicked, showing slide', next);
      });
    }

    // About auto-slide
    if (aboutSlides.length > 1) {
      setInterval(() => {
        if (aboutUserInteracted) return;
        const next = (currentAbout + 1) % aboutSlides.length;
        showAboutSlide(next);
      }, 20000);
    }
  }

  // Background image appearance logic (uncommented)
  const targetSection = document.querySelector('[data-section="about"]');
  const image = document.getElementById("about-image");

  if (targetSection && image) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            image.classList.add("visible");
          } else {
            image.classList.remove("visible");
          }
        });
      },
      {
        root: null,
        threshold: 0.9 // Trigger when ~90% of section is visible
      }
    );

    observer.observe(targetSection);
  }
});
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
