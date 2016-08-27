const scroll_to_form = document.getElementById('scroll-to-form');
const form_position = document.getElementById('section-form').offsetTop - 58;

const scrollTo = (element, to, duration) => {
  if (duration <= 0) return;
  let difference = to - element.scrollTop;
  let perTick = difference / duration * 10;

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

scroll_to_form.addEventListener('click', () => {
  scrollTo(document.body, form_position, 400);
  scrollTo(document.documentElement, form_position, 400);
});
