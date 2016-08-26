const scroll_to_form = document.getElementById('scroll-to-form');
const form_position = document.getElementById('section-form').offsetTop - 60;
scroll_to_form.addEventListener('click', function() {
  scrollTo(document.body, form_position, 400);
  scrollTo(document.documentElement, form_position, 400);
});

function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function() {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}
