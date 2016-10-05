const accordion = {
  item: '.accordion__item',
  content: '.accordion__content',
	toggle: function($btn) {
		$btn.parents(this.item).toggleClass('is-active');
		$btn.parents(this.item).find(this.content).slideToggle(400);
	},
	open: function($btn) {
		$btn.parents(this.item).addClass('is-active');
		$btn.parents(this.item).find(this.content).slideDown(400);
	},
	closeAll: function($btn) {
		const this_accordion = $btn.parents('.accordion');
		this_accordion.find(this.item).removeClass('is-active');
		this_accordion.find(this.content).slideUp(400);
	}
}

$('body').on('click', '.accordion__trigger', function() {
	accordion.toggle($(this));
});
