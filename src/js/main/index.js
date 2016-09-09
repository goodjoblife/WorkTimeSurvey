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
let isFacebookSignedIn = false;

const $work_form = $("#work-form");
const $work_form_submit_button = $("#submit");

class ValidationError extends Error {
  constructor(message, target) {
    super(message);
    this.target = target;
  }
}

const domToData = () => {
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
  };
};

/* check form before submit */
const checkFormField = () => {
  const data = domToData();

  // TODO {String}.trim() can be a better solution, but here use $.trim() for IE8.
  data.company_query = $.trim(data.company_query);
  if (data.company_query === "") {
    throw new ValidationError("需填寫公司/單位", $("#form-company-query"));
  }

  data.job_title = $.trim(data.job_title);
  if (data.job_title === "") {
    throw new ValidationError("需填寫職稱", $("#form-job-title"));
  }

  if (data.day_promised_work_time === "") {
    throw new ValidationError("需填寫工作日表定工作時間", $("#form-day-promised-work-time"));
  }
  data.day_promised_work_time = parseFloat(data.day_promised_work_time);
  if (isNaN(data.day_promised_work_time)) {
    throw new ValidationError("工作日表定工作時間並非數字", $("#form-day-promised-work-time"));
  }
  if (data.day_promised_work_time < 0 || data.day_promised_work_time > 24) {
    throw new ValidationError("工作日表定工作時間範圍為0~24小時", $("#form-day-promised-work-time"));
  }

  if (data.day_real_work_time === "") {
    throw new ValidationError("需填寫工作日實際工作時間", $("#form-day-real-work-time"));
  }
  data.day_real_work_time = parseFloat(data.day_real_work_time);
  if (isNaN(data.day_real_work_time)) {
    throw new ValidationError("工作日實際工作時間並非數字", $("#form-day-real-work-time"));
  }
  if (data.day_real_work_time < 0 || data.day_real_work_time > 24) {
    throw new ValidationError("工作日實際工作時間範圍為0~24小時", $("#form-day-real-work-time"));
  }

  if (data.week_work_time === "") {
    throw new ValidationError("需填寫一週總工時", $("#form-week-work-time"));
  }
  data.week_work_time = parseFloat(data.week_work_time);
  if (isNaN(data.week_work_time)) {
    throw new ValidationError("一週總工時並非數字", $("#form-week-work-time"));
  }
  if (data.week_work_time < 0 || data.week_work_time > 168) {
    throw new ValidationError("一週總工時範圍為0~168小時", $("#form-week-work-time"));
  }

  if (!data.overtime_frequency || data.overtime_frequency === "") {
    throw new ValidationError("需填寫加班頻率", $("#form-overtime-frequency"));
  }
};

const sendFormData = () => {
  const data = domToData();

  data.access_token = FB.getAccessToken();
  data.company = data.company_query;
  delete data.company_query;
  data.day_promised_work_time = parseFloat(data.day_promised_work_time);
  data.day_real_work_time = parseFloat(data.day_real_work_time);
  data.week_work_time = parseFloat(data.week_work_time);

  $.ajax({
    url: "https://tranquil-fortress-92731.herokuapp.com/workings",
    method: "POST",
    data: data,
    dataType: "json",
  }).then(res => {
    // disable the form still

    $work_form.trigger("sended", {
      data: res,
    });
    $work_form.trigger("submitted", {
      data: res,
    });
  }).fail((jqXHR, textStatus, errorThrown) => {
    // enable the form
    $work_form_submit_button.prop("disabled", false);

    $work_form.trigger("sended", {
      error: new Error(),
      type: "SendError",
      jqXHR: jqXHR,
      textStatus: textStatus,
      errorThrown: errorThrown,
    });
    $work_form.trigger("submitted", {
      error: new Error(),
      type: "SendError",
      jqXHR: jqXHR,
      textStatus: textStatus,
      errorThrown: errorThrown,
    });
  });
};

$work_form.on("submit", function(e) {
  e.preventDefault();

  // disable the form
  $work_form_submit_button.prop("disabled", true);

  $work_form.trigger("submitting");

  // Check things
  try {
    checkFormField();
  } catch (error) {
    // enable the form
    $work_form_submit_button.prop("disabled", false);

    $work_form.trigger("submitted", {
      error: error,
      type: "ValidationError",
    });
    return;
  }

  if (isFacebookSignedIn) {
    sendFormData();
  } else {
    FB.login((response) => {
      statusChangeCallback(response);
      if (response.status === "connected") {
        sendFormData();
      } else {
        // enable the form
        $work_form_submit_button.prop("disabled", false);

        $work_form.trigger("submitted", {
          error: new Error("未登入FB，取消送出資料"),
          type: "AuthError",
        });
      }
    }, {
      scope: "public_profile,email",
    });
  }
});

$work_form.on("submitting", (e) => {});

$work_form.on("submitted", (e, result) => {
  if (result.error) {
    if (result.type === "ValidationError") {
      showTooltipAndScroll(result.error.target, result.error.message);
    } else if (result.type === "AuthError") {
      showAlert('alert', 'Facebook 登入失敗', '為了避免使用者大量輸入假資訊，我們會以您的 Facebook 帳戶做驗證。但別擔心！您的帳戶資訊不會以任何形式被揭露、顯示。每一帳戶目前僅能上傳 5 次工時資訊。', 'go-fb-login');
    } else if (result.type === "SendError") {
      if (result.jqXHR.readyState === 0) {
        showAlert('alert', 'Oops 有些錯誤發生', '請查看你的網路連線再試一次！', 'go-to-form');
      } else if (result.jqXHR.readyState === 4) {
        showAlert('alert', 'Oops ', result.jqXHR.responseJSON.message, 'go-to-form');
      } else {
        showAlert('alert', 'Oops 有些錯誤發生', '請查看你的網路連線再試一次！', 'go-to-form');
      }
    }
    return;
  }

  // when submit success
  const quota = 5;

  const queries_count = result.data.queries_count;
  showAlert('success', '上傳成功', `您已經上傳 ${queries_count} 次，還有 ${quota - queries_count} 次可以上傳。`, 'go-to-show');
});

/*
 * Facebook related
 */
window.fbAsyncInit = () => {
  const appId = (window.location.hostname === "localhost") ? "1750608541889151" : "1750216878594984";
  FB.init({
    appId: appId,
    cookie: true,
    xfbml: true,
    version: "v2.6",
  });

  FB.getLoginStatus((response) => {
    statusChangeCallback(response);
  });
};

const statusChangeCallback = (response) => {
  if (response.status == "connected") {
    isFacebookSignedIn = true;
    document.querySelector(".fb-login-word").style.display = "none";
    document.querySelector(".btn-why-facebook-login").style.display = "none";
  } else {
    isFacebookSignedIn = false;
    document.querySelector(".fb-login-word").style.display = "";
    document.querySelector(".btn-why-facebook-login").style.display = "";
  }
};

$(document).ready(function(){
    $("#job_title").autocomplete({
        source: function (request, response) {
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-search', request.term);
            }
            $.ajax({
                url: WTS.constants.backendURL + 'jobs/search',
                data: {
                    key : request.term,
                },
                dataType: "json",
            }).done(function(res) {
                let nameList = $.map(res, (item, i) => {
                    return {
                        value: item.des,
                        id: item._id,
                    };
                });
                response(nameList);
            }).fail((jqXHR, textStatus) => {
                response([]);
            });
        },
        select: function(event, ui){
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-select', ui['item']['label']);
            }
        }
    });

    $("#company_query").autocomplete({
        source: function (request, response) {
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-search', request.term);
            }
            $.ajax({
                url: WTS.constants.backendURL + 'companies/search',
                data: { key : request['term'] },
                dataType: "json",
            }).done(function( res ) {
                let nameList = new Array();
                console.log(res);

                res.forEach((item, i) => {
                    nameList.push({"value": item['name'], "company_id": item.id});
                });
                response(nameList);
            }).fail((jqXHR, textStatus) => {
                response([]);
            });
        },
        minLength: 2,
        select: function(event, ui){
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-select', ui['item']['company_id']);
            }
            $("#company_id").val(ui['item']['company_id']);
        }
    });
});
