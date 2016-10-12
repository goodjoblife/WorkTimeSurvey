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
  if (!$.trim(this.value)) {
    showTooltip($(this), '本欄必填');
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

/*
 * temp loading of Facebook authentication
 * will be removed after done with authentication check
 */
$("#submit").prop("disabled",true).before(
  $("<div>").attr("id","tmp_loading").append(
    $("<div>").css({
      width: "32px",
      height: "32px",
      margin: "40px auto",
      background: "url('data:image/gif;base64,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')",
    })
  ).append(
    $("<div>").css("text-align","center").text("正在驗證Facebook是否登入，如果一直沒有回應，請重新整理：（")
  ).css("padding-bottom","2em")
);

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
  $("#submit").prop("disabled",false);
  $("tmp_loading").remove();
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
        url: WTS.constants.backendURL + 'workings/latest',
        dataType:"json",
    }).done(function(res){
        default_job_titles =
            Array.from(new Set(
                $.map(res.workings, (item,i)=>({
                    "value": item.job_title,
                }))
            )).slice(0,4);
        default_company_names =
            Array.from(new Set(
                $.map(res.workings, (item,i)=>({
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
