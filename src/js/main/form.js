/* check form before submit */
const checkForm = () => {
  const company_query = $("#company_query").val();
  if (company_query === '') {
    showTooltipAndScroll($("#company_query"), "需填寫公司/單位");
    throw new Error("需填寫公司/單位");
  }
}

const showTooltipAndScroll = ($selector, message) => {
  const $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
  $('html, body').animate({
    scrollTop: $selector.offset().top - 100
  }, 600);
}

const showTooltip = ($selector, message) => {
  let $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
}

const removeTooltip = ($selector) => {
  let $form_group = $selector.closest('.form-group');
  $form_group.removeClass('has-error');
  $form_group.find('.form-error-message').remove();
}

/* validate form on focus */
const $form_input = $('#work-form :input.is-required');
$form_input.on('blur', function() {
  if( !$(this).val() ) {
    $(this).hasClass('ui-autocomplete-input') ? showTooltip($(this), '本欄必填 (可自動完成)') : showTooltip($(this), '本欄必填');
  } else {
    removeTooltip($(this));
  }
});
