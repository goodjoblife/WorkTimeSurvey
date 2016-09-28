$('[data-show-trigger]').on('click', function() {
  const value = $(this).attr('data-show-trigger');
  $(`[data-show="${value}"]`).slideToggle();
});
