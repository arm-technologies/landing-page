document.addEventListener("DOMContentLoaded", () => {
  const aboutSlides = document.querySelectorAll('.about-slide');
  const aboutDots = document.querySelectorAll('.about-dot');
  const aboutLeftArrow = document.querySelector('.about-left-arrow');
  const aboutRightArrow = document.querySelector('.about-right-arrow');

  let currentAbout = 0;
  let aboutUserInteracted = false;

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

  // Background image appearance logic
  // const targetSection = document.querySelector('[data-section="about"]');
  // const image = document.getElementById("about-image");

  // if (targetSection && image) {
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

  //   observer.observe(targetSection);
  // }
});
