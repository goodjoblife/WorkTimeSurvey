const header_button = document.getElementById('header-button');
const header_nav = document.getElementById('header-nav');
header_button.addEventListener('click', function() {
  this.classList.toggle('is-open');
  header_nav.classList.toggle('is-open');
  if (document.querySelector('.btn-scroll-down')) {
    document.querySelector('.btn-scroll-down').classList.toggle('hide');
  }
});

const nav_scroll = document.querySelectorAll('.js-scrollpage');
for (let i = 0; i < nav_scroll.length; i++) {
  nav_scroll[i].addEventListener('click', () => {
    header_button.classList.remove('is-open');
    header_nav.classList.remove('is-open');
  });
}

const scroll_to_form = document.querySelectorAll('.js-scrollToForm');
const scroll_to_faq = document.querySelectorAll('.js-scrollToFaq');
const section_form = document.getElementById('section-form');
const section_faq = document.getElementById('section-faq');

if (section_form) {
  let form_position = section_form.offsetTop - 58;
  for (let i = 0; i < scroll_to_form.length; i++) {
    scroll_to_form[i].addEventListener('click', (e) => {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: form_position
      }, 600);
    });
  }
}

if (section_faq) {
  let faq_position = section_faq.offsetTop - 58;
  for (let i = 0; i < scroll_to_faq.length; i++) {
    scroll_to_faq[i].addEventListener('click', (e) => {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: faq_position
      }, 600);
    })
  }
}

const highlightCurrentPage = () => {
  const menu_item = document.querySelectorAll('.site-menu__item');
  const pathname = window.location.pathname;
  for (let i = 0; i < menu_item.length; i++) {
    const href_item = menu_item[i].childNodes[0];
    if ( href_item.getAttribute('href') === pathname) {
      href_item.classList.add('is-current');
    } else {
      href_item.classList.remove('is-current');
    }
  }
}
highlightCurrentPage();
