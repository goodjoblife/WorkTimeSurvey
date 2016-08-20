var breakpoint = {
	above_desktop: window.matchMedia("(min-width: 1025px)"),
	below_desktop: window.matchMedia("(max-width: 1024px)"),
	above_small: window.matchMedia("(min-width: 851px)"),
	below_small: window.matchMedia("(max-width: 850px)"),
	above_tablet: window.matchMedia("(min-width: 768px)"),
	below_tablet: window.matchMedia("(max-width: 767px)"),
	below_mobile: window.matchMedia("(max-width: 550px)")
}
