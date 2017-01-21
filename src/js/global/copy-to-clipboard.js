const element = document.querySelector('[data-copytarget]');
if (element) {
  element.addEventListener('click', function() {
    copyToClipboard(this);
  });
}

function copyToClipboard(t) {
  const name = t.dataset.copytarget ? t.dataset.copytarget : null;
  const text = name ? document.querySelector(name) : null;
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
