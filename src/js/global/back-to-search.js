const section_search = document.getElementById('section-search');

if (section_search) {
  let search_position = section_search.offsetTop - 20;
  document.querySelector('.back-to-search').addEventListener('click', (e)=> {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: search_position
    }, 600);
  });
}
