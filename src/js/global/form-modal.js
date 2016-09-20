const form_modal = document.getElementById('modal-alert');
const closeFormModal = () => {
  form_modal.classList.remove('is-open');
  $('body, html').removeClass('is-fixed');
  form_modal.innerHTML = '';
}
const showAlert = (type, message1, message2, button_type) => {
  let button;
  let icon;
  if (button_type == 'go-to-show') {
    button = '<a href="/show.html" class="modal-content__btn btn-black btn-m">查看最新工時</a>'
  } else if (button_type == 'go-to-form') {
    button = '<button class="modal-content__btn btn-black btn-m" id="modal-scroll-to-form">重新填寫</button>'
  } else if (button_type == 'go-fb-login') {
    button = '<button id="fb-login-modal" class="modal-content__btn btn-black btn-m">以 fb 驗證並送出資料</button>'
  }
  if (type == 'success') {
    icon = 'form-checked'
  } else if (type == 'alert') {
    icon = 'form-alert'
  }
  let to_be_append = `
  <div class="modal__inner">
    <div class="modal__close wrapper-s js-close-modal"><svg role="img"><use xlink:href="#x"></use></svg></div>
    <div class="modal__container wrapper-s">
      <div class="modal-content">
        <div class="modal-content__icon"><svg role="img"><use xlink:href="#${icon}"></use></svg></div>
        <h5 class="modal-content__heading">${message1}</h5>
        <h6 class="modal-content__paragraph">${message2}</h6>
        ${button}
      </div>
    </div>
  </div>
  `
  form_modal.innerHTML = to_be_append;
  form_modal.classList.add('is-open');
  document.querySelector('html').classList.add('is-fixed');
  document.querySelector('body').classList.add('is-fixed');
}
$('body').on('click', '#modal-scroll-to-form', (e) => {
  let form_position = section_form.offsetTop - 58;
  e.preventDefault();
  closeFormModal();
  $('html, body').animate({
    scrollTop: form_position
  }, 600);
});

$('body').on('click', '.modal__close', () => {
  closeFormModal();
});
$('body').on('click', '.modal', (event) => {
  if (!$(event.target).closest('.modal__container').length) {
    closeFormModal();
  }
});
