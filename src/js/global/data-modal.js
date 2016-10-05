$('body').on('click', '[data-modal-id]', function() {
  $('body, html').addClass('is-fixed');
  const modal_id = $(this).attr('data-modal-id');
  const $modal = $(`[data-modal="${modal_id}"]`);
  $modal.addClass('is-open');
});
const closeModal = () => {
  $('.modal').removeClass('is-open');
  $('body, html').removeClass('is-fixed');
};

$('body').on('click', '.js-close-modal', () => {
  closeModal();
});
$('body').on('click', '.modal', (event) => {
  if (!$(event.target).closest('.modal__container').length) {
    closeModal();
  }
});
