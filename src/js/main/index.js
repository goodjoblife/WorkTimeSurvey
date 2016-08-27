const scroll_to_form = document.querySelectorAll('.js-scrollToForm');
const form_position = document.getElementById('section-form').offsetTop - 58;

for (let i = 0; i < scroll_to_form.length; i++) {
  scroll_to_form[i].addEventListener('click', (e) => {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: form_position
    }, 600);
  });
}
