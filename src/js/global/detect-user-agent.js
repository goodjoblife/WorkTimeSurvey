const is_safari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);

if (is_safari) {
  document.documentElement.classList.add('is-safari');
}

const is_mobile = function detectmob() {
  if ( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
  ) { return true; }
  else { return false; }
}();

if ( is_mobile) {
  document.documentElement.classList.add('is-mobile');
}
