document.body.addEventListener('click', copyToClipboard, true);
function copyToClipboard(e) {
  const t = e.target;
  const name = t.dataset.copytarget;
  const text = (name ? document.querySelector(name) : null);
  const icon = document.querySelector(`${name}-icon`);

  if (text && text.select) {
    text.select();

    try {
      document.execCommand('copy');
      text.blur();
      icon.classList.add('is-active');
      setTimeout(function() {
        icon.classList.remove('is-active');
      }, 2000);
    }

    catch(err) {
      console.log(err);
    }
  }
}
