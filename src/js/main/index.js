/* check form before submit */
const checkForm = () => {
  const company_query = $("#company_query").val();
  if (company_query === '') {
    showTooltipAndScroll($("#company_query"), "需填寫公司/單位");
    throw new Error("需填寫公司/單位");
  }
}

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
  if( !$(this).val() ) {
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
                var nameList = $.map(res, function(item, i) {
                    return {
                        value: item.des,
                        id: item._id,
                    };
                });
                response(nameList);
            }).fail(function( jqXHR, textStatus ) {
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
                nameList = new Array();
                console.log(res);

                res.forEach(function(item, i) {
                    nameList.push({"value": item['name'], "company_id": item.id});
                });
                response(nameList);
            }).fail(function( jqXHR, textStatus ) {
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
