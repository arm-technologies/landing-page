// Close burger menu on-click
document.querySelectorAll('.link').forEach(link => {
  link.addEventListener('click', (e) => {

    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.navbar-menu');
    if (burger.classList.contains('open')) {
      burger.classList.remove('open');
      menu.classList.remove('active');
    }
  });
});
