const showTooltipAndScroll = ($selector, message) => {
  const $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
  $('html, body').animate({
    scrollTop: $selector.offset().top - 100
  }, 600);
};

const showTooltip = ($selector, message) => {
  let $form_group = $selector.closest('.form-group');
  if (!$form_group.hasClass('has-error')) {
    $form_group.addClass('has-error');
    $form_group.append(`<div class="form-error-message">${message}</div>`);
  }
};

const removeTooltip = ($selector) => {
  let $form_group = $selector.closest('.form-group');
  $form_group.removeClass('has-error');
  $form_group.find('.form-error-message').remove();
};

const checkAllBlank = ($selector) => {
  let result = true;
  $selector.each(function() {
    if ($.trim(this.value)) {
      if (this.checked && $(this).prop('type') === 'radio') {
        result = false;
      } else if (!this.checked && $(this).prop('type') !== 'radio') {
        result = false;
      }
    }
  });
  return result;
};

/* add is-required by which section input first*/
const $form_input_salary = $('#form-section-salary .maybe-is-required');
const $form_input_work_time = $('#form-section-work-time .maybe-is-required, .not-required');
$form_input_salary.on('input', function() {
  if ($.trim(this.value)) {
    $form_input_salary.addClass('is-required');
  } else if (checkAllBlank($form_input_salary)) {
    $form_input_salary.removeClass('is-required');
    removeTooltip($form_input_salary);
  }
});

$form_input_work_time.on('click input change', function() {
  if (($(this).prop('type') === 'text' && $.trim(this.value)) || ($(this).prop('type') === 'radio' && this.checked === true)) {
    $form_input_work_time.each(function (){
      if ($(this).hasClass('maybe-is-required')) {
        $(this).addClass('is-required');
      }
    });
  } else if (checkAllBlank($form_input_work_time)) {
    $form_input_work_time.removeClass('is-required');
    removeTooltip($form_input_work_time);
  }
});

/* validate form on focus */
const $form_input = $('#work-form :input.maybe-is-required');
$form_input.on('blur', function() {
  if (!$.trim(this.value) && $(this).hasClass('is-required')) {
    showTooltip($(this), '本欄必填');
  } else {
    removeTooltip($(this));
  }
});

/* show hide has fee options */
const $has_fee_options = $('#has-fee-options');
const $child_options = $has_fee_options.find('input[name="has_pay"]');
$('#select-fee input[name="fee"]').on('click', function() {
  if ($('#fee_yes').prop('checked') === true) {
    $has_fee_options.toggleClass('is-active');
  } else {
    $has_fee_options.removeClass('is-active');
  }
  //reset all child options
  $child_options.prop('checked', false);
  $child_options.data('waschecked', false);
});

/* toggle radio buttons */
$('.toggled-radio-button').click(function() {
  const $radio = $(this);
  if ($radio.data('waschecked') === true) {
    $radio.prop('checked', false);
    $radio.data('waschecked', false);
  } else {
    $radio.data('waschecked', true);
  }
  $radio.parent().siblings().find('input').data('waschecked', false);
});


/* is-currently-check */
const is_currently_btn = document.querySelectorAll('input[type="radio"][name="is_currently_employed"]');
const leave_job_form = document.getElementById('form-job-ending-time');
const currentlyChange = () => {
  resetJobEndingTime();
  if (document.getElementById('form-not-currently-employed').checked) {
    leave_job_form.classList.add('is-active');
  } else {
    leave_job_form.classList.remove('is-active');
  }
}
Array.prototype.forEach.call(is_currently_btn, function(radio) {
  radio.addEventListener('change', currentlyChange);
})

const now_year = new Date().getFullYear();
const now_month = new Date().getMonth() + 1;
function appendJobEndingTime() {
  let years = [];
  for (let i = now_year; i > (now_year - 10); i--) { years.push(i) }
  years.reverse().map(item => {
    $('#form-job-ending-year').append(`<option value="${item}">${item}</option>`);
  });

  let month = [];
  for (let i = 1; i < 13; i++) { month.push(i); }
  month.map(item => {
    $('#form-job-ending-month').append(`<option value="${item}">${item}</option>`);
  });

  resetJobEndingTime();
}
appendJobEndingTime();

function resetJobEndingTime() {
  document.querySelector(`#form-job-ending-year option[value="${now_year}"]`).selected = true;
  document.querySelector(`#form-job-ending-month option[value="${now_month}"]`).selected = true;
}

/* form-experience-in-year select */
const appendJobExperienceTime = () => {
  $("#form-experience-in-year").append(`<option value="0">小於1年</option>`);
  for(let i = 1; i <= 50; i++) {
    $('#form-experience-in-year').append(`<option value="${i}">${i} 年</option>`);
  }
};
appendJobExperienceTime();

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
    is_overtime_salary_legal: $("#has-fee-options input[name='has_pay']:checked").val(),
    has_compensatory_dayoff: $("#form-has-compensatory-dayoff input[name='time_off']:checked").val(),
    email: $("#form-email").val(),
    is_currently_employed: $('input[type="radio"][name="is_currently_employed"]:checked').val(),
    job_ending_time_year: $('#form-job-ending-year').val(),
    job_ending_time_month: $('#form-job-ending-month').val(),
    employment_type: $('#form-employed-type').val(),
    gender: $('#form-gender').val(),
    salary_type: $('#salary-type').val(),
    salary_amount: $('#salary-amount').val(),
    experience_in_year: $('#form-experience-in-year').val(),
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

  if (!($('#salary-amount').hasClass('is-required')) && !($("#form-day-promised-work-time").hasClass('is-required'))) {
    throw new ValidationError("薪資 / 工時需擇一必填", $("#salary-amount"));
  } else {
    if ($('#salary-amount').hasClass('is-required')) {
      if (data.salary_type === "") {
        throw new ValidationError("需填寫薪資類型", $("#salary-type"));
      }

      if (data.salary_amount === "") {
        throw new ValidationError("需填寫薪資", $("#salary-amount"));
      }

      if (data.experience_in_year === "") {
        throw new ValidationError("需填寫相關職務工作經歷", $("#form-experience-in-year"));
      }
    }

    if ($("#form-day-promised-work-time").hasClass('is-required')) {
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

      if (data.has_overtime_salary === "yes" && (!data.is_overtime_salary_legal || data.is_overtime_salary_legal === "")) {
        throw new ValidationError("需填寫是否符合勞基法", $("#select-fee"));
      }
    }
  }
};

/*
 * Get the recommendation string from url
 *
 * Adapted from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */
function getRecommendationString(url = window.location.href) {
  const regex = new RegExp("[?&]rec_by(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const sendFormData = () => {
  const data = domToData();

  // convert all Nan, undefined and "" to ""
  $.each(data, (index, value) => {
    if (!value) {
      data[index] = "";
    }
  });

  // default job_ending_time_year and job_ending_time_month is not null
  if (data.is_currently_employed === "yes") {
    data.job_ending_time_year = "";
    data.job_ending_time_month = "";
  }

  data.access_token = FB.getAccessToken();
  data.company = data.company_query;
  delete data.company_query;

  //get recommendation_string if it exists
  const rec_str = getRecommendationString();
  if(rec_str !== null){
    data.recommendation_string = rec_str;
  }

  $.ajax({
    url: WTS.constants.backendURL + "workings",
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

/*
 * authentication checking indicator
 */

$("#auth_check_text").hide()
$("#auth_check_reminder").hide()

/*
 * Listen to submit events
 */

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
      if (response.status === "connected") {
        statusChangeCallback(true);
        sendFormData();
      } else {
        statusChangeCallback(false);

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


// for auth_check_reminder (i.e. 如果一直沒有回應，請重新整理：（)
let auth_check_reminder_timer = null;
const auth_check_reminder_latency = 3000;

$work_form.on("submitting", (e) => {
  // show authenticating-message
  $("#submit_text").hide();
  $("#auth_check_text").show();
  auth_check_reminder_timer = setTimeout(function(){
    $("#auth_check_reminder").show("slow");
  }, auth_check_reminder_latency);
});

$work_form.on("submitted", (e, result) => {
  // remove authenticating-message and restore button text
  $("#submit_text").show();
  $("#auth_check_text").hide();
  clearTimeout(auth_check_reminder_timer);
  $("#auth_check_reminder").hide("slow");

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

const statusChangeCallback = (is_logged_in) => {
  if (is_logged_in) {
    isFacebookSignedIn = true;
    document.querySelector(".fb-login-word").style.display = "none";
    document.querySelector(".btn-why-facebook-login").style.display = "none";
  } else {
    isFacebookSignedIn = false;
    document.querySelector(".fb-login-word").style.display = "";
    document.querySelector(".btn-why-facebook-login").style.display = "";
  }
};

/*
 * Autocomplete Part
 */
$(function(){
    // default autocomplete:
    // fetch the newest job titles and company names
    let default_job_titles = [];
    let default_company_names = [];
    $.ajax({
        url: WTS.constants.backendURL + 'workings',
        dataType:"json",
    }).done(function(res){
        default_job_titles =
            Array.from(new Set(
                $.map(res.time_and_salary, (item,i)=>({
                    "value": item.job_title,
                }))
            )).slice(0,4);
        default_company_names =
            Array.from(new Set(
                $.map(res.time_and_salary, (item,i)=>({
                    "value": item.company.name,
                    "company_id": item.company.id,
                })).filter( item=>item.company_id!==undefined )
            )).slice(0,4);
    });
    const default_search = function() {
        $(this).autocomplete("search",$(this).val());
    };

    // prevent disabled options from keyboard choosing
    const focus_prevent_disabled_options = function(event, ui){
        let $active_item = $(event.currentTarget).find('.ui-state-active');
        if($active_item.parent().hasClass('ui-state-disabled')){
            event.preventDefault();
            $active_item.parent().siblings().first().children('div').mouseenter();
        }
    }
    // render each item in ui.content as a <li> element
    const renderDisabledItem = function(ul,item){
        let li = $("<li>").append($("<div>").text(item.label));
        // put .ui-state-disabled on disabled items (e.g. 最近被填寫的公司)
        if(item.disabled) li.addClass("ui-state-disabled");
        return li.appendTo(ul);
    };

    // autocomplete
    const $job_title = $("#form-job-title");
    const $company_query = $("#form-company-query");

    $job_title.autocomplete({
        source: function (request, response) {
            $job_title.trigger('autocomplete-search', request.term);

            // show some list when focusing on an empty input
            if(request.term.length==0){
                response([{
                    value:"最近被填寫的職位",
                    disabled:true,
                }].concat(
                    default_job_titles.map(v=>{ v.disabled=false; return v; })
                ));
                return;
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
        minLength:0, // required for empty input
        select: function(event, ui){
            $job_title.trigger('autocomplete-select', ui.item.label);
        },
        focus: focus_prevent_disabled_options,

    }).focus(default_search).data("ui-autocomplete")._renderItem = renderDisabledItem;

    $("#form-company-query").autocomplete({
        source: function (request, response) {
            $company_query.trigger('autocomplete-search', request.term);

            // show some list when focusing on an empty input
            if(request.term.length<2){
                response([{
                    value:"最近被填寫的公司",
                    disabled:true,
                }].concat(
                    default_company_names.map(v=>{ v.disabled = false; return v })
                ));
                return;
            }

            $.ajax({
                url: WTS.constants.backendURL + 'companies/search',
                data: { key : request.term },
                dataType: "json",
            }).done(function( res ) {
                let nameList = [];

                res.forEach((item, i) => {
                    nameList.push({value: item.name, company_id: item.id});
                });
                response(nameList);
            }).fail((jqXHR, textStatus) => {
                response([]);
            });
        },
        minLength:0, // required for empty input
        select: function(event, ui){
            $company_query.trigger('autocomplete-select', ui.item.company_id);
            $("#form-company-id").val(ui.item.company_id);
        },
        focus:focus_prevent_disabled_options,

    }).focus(default_search).data("ui-autocomplete")._renderItem = renderDisabledItem;
});

/*
 * GA part
 */
// Calculating form writing time
let formBeginTime = null;
let formSubmittedTime = null;
let hasSendedFormWritingTime = false;
$(function() {
  (function() {
    var isCalled = false;
    function callback(e) {
      if (isCalled) {
        return;
      }
      isCalled = true;
      $('#work-form').trigger('beginWriting');
    }

    $('#work-form input').on('focus', callback);
    $('#work-form input').on('click', callback);
    $('#work-form input[type=radio]').on('change', callback);
  })();
});

$work_form.one('beginWriting', (e) => {
  formBeginTime = performance.now();
  ga && ga('send', 'timing', 'LANDING_PAGE', 'form-begin-writing', formBeginTime);
});

$work_form.on('submitted', (e, result) => {
  if(!result.error){
    if(!hasSendedFormWritingTime){
      formSubmittedTime = performance.now();
      const elapsedTime = formSubmittedTime - formBeginTime;
      ga && ga('send', 'timing', 'LANDING_PAGE', 'form-submitted', formSubmittedTime);
      ga && ga('send', 'timing', 'LANDING_PAGE', 'form-writing', elapsedTime);
      hasSendedFormWritingTime = true;
    }
  }
});

// tracking submit button clicking
$work_form.on("submit", (e) => {
  ga && ga('send', 'event', 'LANDING_PAGE', 'click-submit');
});

// tracking sharing button clicking
const $fb_share_button = $("#fb-share-button");
const $twitter_share_button = $("#twitter-share-button");

$fb_share_button.on('click', (e) => {
  ga && ga('send', 'event', 'LANDING_PAGE', 'click-fb-share');
});
$twitter_share_button.on('click', (e) => {
  ga && ga('send', 'event', 'LANDING_PAGE', 'click-twitter-share');
});

// tracking form validation and upload status
$work_form.on("submitted", (e, result) => {
  if (result.error) {
    if (result.type === "ValidationError") {
      ga && ga('send', 'event', 'LANDING_PAGE', 'check-form-fail', result.error.message);
    } else if (result.type === "AuthError") {
      ga && ga('send', 'event', 'LANDING_PAGE', 'upload-fail', result.error.message);
    } else if (result.type === "SendError") {
      if (result.jqXHR.readyState === 0) {
        ga && ga('send', 'event', 'LANDING_PAGE', 'upload-fail', 'readyState:' + result.jqXHR.readyState);
      } else if (result.jqXHR.readyState === 4) {
        ga && ga('send', 'event', 'LANDING_PAGE', 'upload-fail', result.jqXHR.responseJSON.message);
      } else {
        ga && ga('send', 'event', 'LANDING_PAGE', 'upload-fail', result.error.message);
      }
    }
  } else {
    ga && ga('send', 'event', 'LANDING_PAGE', 'upload-success');
  }
});

const $job_title = $("#form-job-title");
const $company_query = $("#form-company-query");

$job_title.on('autocomplete-search', (query) => {
    ga && ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-search', query);
});

$job_title.on('autocomplete-select', (selected) => {
    ga && ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-select', selected);
});

$company_query.on('autocomplete-search', (query) => {
    ga && ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-search', query);
});

$company_query.on('autocomplete-search', (selected) => {
    ga && ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-select', selected);
});
