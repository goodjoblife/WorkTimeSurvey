let lateset_url = 'https://tranquil-fortress-92731.herokuapp.com/workings/latest?page=0&limit=20';
ajaxWrap(lateset_url)
  .then(data => data.workings)
  .then(workings => {
    let item = workings.map(obj => {
      appendLatest(obj.company.name, obj.job_title, obj.week_work_time, obj.overtime_frequency);
    });
    return workings;
  })
  .then(workings => {
    let table_time_bar = document.querySelectorAll('.table-time-bar');
    for (let i = 0; i < table_time_bar.length; i++) {
      table_time_bar[i].style.width = table_time_bar[i].dataset.time * 2 + 'px';
    }
  })
  .catch(err => {
    console.log(err);
  });

const appendLatest = (company, job_title, week_work_time, overtime_frequency) => {
  let to_be_append = `
    <tr>
      <td data-th="公司名稱">
        <span class="rwd-td"><a href="#">${company}</a></span>
      </td>
      <td data-th="職稱 (廠區/門市/分公司)">
        <span class="rwd-td"><span>${job_title}</span><span class="table-sector">ooxx</span></span>
      </td>
      <td data-th="一週總工時">
        <span class="rwd-td"><span class="table-time-bar" data-time="${week_work_time}">${week_work_time}</span></span>
      </td>
      <td data-th="加班頻率">
        <span class="rwd-td"><span class="table-frequency-circle" data-frequency="${overtime_frequency}"></span>${overtime_frequency}</span>
      </td>
    </tr>
  `;
  $('#tbody-latest-data').append(to_be_append);
}

function ajaxWrap(reqPath) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: reqPath,
      success(data) {
        resolve(data);
      },
      error(err) {
        reject(err);
      }
    });
  });
}
