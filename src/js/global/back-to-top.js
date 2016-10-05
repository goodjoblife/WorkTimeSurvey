const btn_back_to_top  = document.getElementById('btn-back-to-top');
if (btn_back_to_top) {
  window.addEventListener('scroll', function() {
    if ((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop > 50) {
      btn_back_to_top.classList.add('is-active');
    } else {
      btn_back_to_top.classList.remove('is-active');
    }
  });

  btn_back_to_top.addEventListener('click', () => {
    $('html, body').animate({
      scrollTop: 0
    }, 600);
  });
}
