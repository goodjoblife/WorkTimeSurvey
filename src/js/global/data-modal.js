$(function() {
  $('body').on('click', '[data-modal-id]', function() {
    $('body, html').addClass('is-fixed');
    const modal_id = this.dataset.modalId;
    const $modal = $(`[data-modal="${modal_id}"]`);
    $modal.addClass('is-open');
  });

  $('[data-modal-mobile-id]').on('click', function() {
    const modal_id = this.dataset.modalMobileId;
    const $modal = $(`[data-modal="${modal_id}"]`);
    $modal.addClass('is-open');
  });

  const closeModal = () => {
    $('.modal').removeClass('is-open');
    $('body, html').removeClass('is-fixed');
  };

  $('body').on('click', '.js-close-data-modal', () => {
    closeModal();
  });
  $('body').on('click', '.data-modal', (event) => {
    if (!$(event.target).closest('.js-data-modal-container').length) {
      closeModal();
    }
  });
});
