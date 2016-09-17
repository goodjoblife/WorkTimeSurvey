const accordion = {
  item: '.accordion__item',
  content: '.accordion__content',
  icon: '.accordion__icon',
	toggle: function($btn) {
		$btn.parents(this.item).toggleClass('is-active');
		$btn.parents(this.item).find(this.content).slideToggle(400);
		$btn.find(this.icon).toggleClass('icon-plus icon-minus');
	},
	open: function($btn) {
		$btn.parents(this.item).addClass('is-active');
		$btn.parents(this.item).find(this.content).slideDown(400);
		$btn.find(this.icon).removeClass('icon-plus').addClass('icon-minus');
	},
	closeAll: function($btn) {
		const this_accordion = $btn.parents('.accordion');
		this_accordion.find(this.item).removeClass('is-active');
		this_accordion.find(this.content).slideUp(400);
		this_accordion.find(this.icon).removeClass('icon-minus').addClass('icon-plus');
	}
}

$('body').on('click', '.accordion__trigger', function() {
	accordion.toggle($(this));
});
