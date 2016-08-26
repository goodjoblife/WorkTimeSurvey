const header = document.getElementById('header');

if (breakpoint.above_small.matches) {
  window.addEventListener('scroll', function() {
    if (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop > 100) {
      header.classList.add('is-fixed');
    } else if (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop == 0) {
      header.classList.remove('is-fixed');
    }
  });
}

const header_button = document.getElementById('header-button');
const header_nav = document.getElementById('header-nav');
header_button.addEventListener('click', function() {
  this.classList.toggle('is-open');
  header_nav.classList.toggle('is-open');
  document.querySelector('.btn-scroll-down').classList.toggle('hide');
})

const nav_scroll = document.querySelectorAll('.js-scrollpage');
for (let i = 0; i < nav_scroll.length; i++) {
  nav_scroll[i].addEventListener('click', function() {
    header_button.classList.remove('is-open');
    header_nav.classList.remove('is-open');
  });
}
