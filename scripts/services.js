const serviceItems = document.querySelectorAll('.service-item');
const serviceTabs = document.querySelectorAll('.service-tab');

serviceItems.forEach(item => {
  item.addEventListener('click', () => {
    // remove active from all
    serviceItems.forEach(i => i.classList.remove('active'));
    serviceTabs.forEach(tab => {
      tab.classList.remove('active');
      tab.style.display = 'none'; // ensure hidden
    });

    // add active to clicked item
    item.classList.add('active');
    const targetTab = document.getElementById(item.getAttribute('data-tab'));
    targetTab.style.display = 'block'; // show immediately
    setTimeout(() => {
      targetTab.classList.add('active'); // trigger animation
    }, 10); // short delay to trigger transition
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Get elements
  const toggleBtn = document.querySelector('.services-toggle');
  const sidebar = document.querySelector('.services-sidebar');
  const serviceItems = document.querySelectorAll('.service-item');

  // Set up toggle button
  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    this.classList.toggle('active');
  });

  // On mobile, collapse sidebar when a service is selected
  serviceItems.forEach(item => {
    item.addEventListener('click', function () {
      if (window.innerWidth <= 970) {
        sidebar.classList.add('collapsed');
        toggleBtn.classList.remove('active');

        // Scroll to content area
        // document.querySelector('.services-section').scrollIntoView({
        //   behavior: 'smooth'
        // });
      }
    });
  });

  // Handle resize events
  window.addEventListener('resize', function () {
    if (window.innerWidth > 970) {
      // Remove mobile-specific classes on desktop
      sidebar.classList.remove('collapsed');
      toggleBtn.classList.remove('active');
    }
  });
});
