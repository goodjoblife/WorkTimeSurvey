const showTooltipAndScroll = ($selector, message) => {
  const $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
  $('html, body').animate({
    scrollTop: $selector.offset().top - 100
  }, 600);
}

const showTooltip = ($selector, message) => {
  let $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
}

const removeTooltip = ($selector) => {
  let $form_group = $selector.closest('.form-group');
  $form_group.removeClass('has-error');
  $form_group.find('.form-error-message').remove();
}

/* validate form on focus */
const $form_input = $('#work-form :input.is-required');
$form_input.on('blur', function() {
  if (!$(this).val()) {
    $(this).hasClass('ui-autocomplete-input') ? showTooltip($(this), '本欄必填 (可自動完成)') : showTooltip($(this), '本欄必填');
  } else {
    removeTooltip($(this));
  }
});


/* radio button */
const has_fee_option = document.getElementById('has-fee-option');
const clearHasFee = () => {
  has_fee_option.classList.remove('is-active');
  let item = has_fee_option.childNodes;
  for (let j = 0; j < item.length; j++) {
    for (let k = 0; k < item[j].childNodes.length; k++) {
      if (item[j].childNodes[k].nodeName === 'INPUT') {
        item[j].childNodes[k].checked = false;
      }
    }
  }
}
$('#select-fee :input[type="radio"]').on('change', function() {
  if (document.getElementById('fee_yes').checked) {
    has_fee_option.classList.add('is-active');
  } else {
    clearHasFee();
  }
});

const clear_radio_btn = document.querySelectorAll('.btn-radio-clear');
for (let i = 0; i < clear_radio_btn.length; i++) {
  clear_radio_btn[i].addEventListener('click', function() {
    let item = this.parentNode.parentNode.childNodes;
    for (let j = 0; j < item.length; j++) {
      for (let k = 0; k < item[j].childNodes.length; k++) {
        if (item[j].childNodes[k].nodeName === 'INPUT') {
          item[j].childNodes[k].checked = false;
        }
      }
    }
    if (this.parentNode.parentNode.id === 'select-fee') {
      clearHasFee();
    }
  })
}

/*
 * Form Submit Controller
 */
const $work_form = $("#work-form");

const domToData = () => {
  // TODO need to check the id in html
  return {
    company_id: $("#form-company-id").val(),
    company_query: $("#form-company-query").val(),
    job_title: $("#form-job-title").val(),
    sector: $("#form-sector").val(),
    day_promised_work_time: $("#form-day-promised-work-time").val(),
    day_real_work_time: $("#form-day-real-work-time").val(),
    week_work_time: $("#form-week-work-time").val(),
    overtime_frequency: $("#form-overtime-frequency input[name='frequency']:checked").val(),
    has_overtime_salary: $("#select-fee input[name='fee']:checked").val(),
    is_overtime_salary_legal: $("#has-fee-option input[name='has_pay']:checked").val(),
    has_compensatory_dayoff: $("#form-has-compensatory-dayoff input[name='time_off']:checked").val(),
    email: $("#form-email").val(),
  }
};

/* check form before submit */
const checkFormField = () => {
  const company_query = $("#company_query").val();
  const job_title = $("#job_title").val();

  if (company_query === '') {
    showTooltipAndScroll($("#company_query"), "需填寫公司/單位");
    throw new Error("需填寫公司/單位");
  }
};

const sendFormData = () => {
  const data = domToData();

  data.company = data.company_query;
  delete data.company_query;
  data.day_promised_work_time = parseFloat(data.day_promised_work_time);
  data.day_real_work_time = parseFloat(data.day_real_work_time);
  data.week_work_time = parseFloat(data.week_work_time);

  $.ajax({
    url: 'http://localhost:12000/workings', //'https://tranquil-fortress-92731.herokuapp.com/workings',
    method: 'POST',
    data: data,
    dataType: 'json',
  }).then(res => {
    $work_form.trigger('sended', {
      data: res
    })
    $work_form.trigger('submitted', {
      data: res
    })
  }).fail((jqXHR, textStatus, errorThrown) => {
    $work_form.trigger('sended', {
      error: new Error(),
      type: 'SendError',
      jqXHR: jqXHR,
      textStatus: textStatus,
      errorThrown: errorThrown,
    });
    $work_form.trigger('submitted', {
      error: new Error(),
      type: 'SendError',
      jqXHR: jqXHR,
      textStatus: textStatus,
      errorThrown: errorThrown,
    });
  });
};

$work_form.on('submit', function(e) {
  e.preventDefault();
  $work_form.trigger('submitting');

  // TODO disable the form

  // Check things
  try {
    checkFormField();
  } catch (error) {
    // TODO enable the form
    $work_form.trigger('submitted', {
      error: error,
      type: 'ValidationError',
    });
    return;
  }

  // TODO include FB script to check whether FB is signed in
  sendFormData();
});

$work_form.on('submitting', (e) => {});

$work_form.on('submitted', (e, result) => {
  if (result.error) {
    return;
  }
});

$work_form.on('submitted', (e, result) => {
  // ValidationError ???
  if (result.error) {
    console.log(result.error.target);
    showTooltipAndScroll(result.error.target, result.error.message);
  }
});

window.fbAsyncInit = () => {
  const appId = (window.location.hostname === "localhost") ? '1750608541889151' : '1750216878594984';
  FB.init({
    appId   : appId,
    cookie  : true,
    xfbml   : true,
    version : 'v2.6'
  });
};
