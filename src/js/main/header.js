const header = document.getElementById('header');

window.addEventListener('scroll', function() {
  if ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop > 100) {
    header.classList.add('is-fixed');
  } else if ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop == 0) {
    header.classList.remove('is-fixed');
  }
})
