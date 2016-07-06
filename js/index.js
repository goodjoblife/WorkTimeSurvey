var isFacebookSignedIn = false;

$(function() {
    $("#knowMore").modal({
        show: false
    });

    $(".knowMoreBtn").click(function(e){
        e.preventDefault();
        $("#knowMore").modal("show");
    });

    window.WorkingLoader.init(function() {
        window.WorkingLoader.View.limit = 10;
    });

    $("#fb-login-modal").modal({
        show: false
    });

    // Modal should login into FB or fail
    $("#fb-login-modal-login-button").click(function(e) {
        e.preventDefault();

        FB.login(function(response){
            statusChangeCallback(response);
            $("#fb-login-modal").modal("hide");
            if (response.status == 'connected') {
                submitForm();
            } else {
                showAlert("未登入FB，取消送出資料");
            }
        },{
            scope: 'public_profile,email'
        });
    });
});

$("#submit").click(function(e) {
    e.preventDefault();
    try {
        checkForm();
    } catch (err) {
        showAlert(err.message);
        return;
    } 

    if (isFacebookSignedIn) {
        submitForm();
    } else {
        $("#fb-login-modal").modal('show');
    }
});

$("#fb-login").click(function(e) {
    e.preventDefault();
    if (isFacebookSignedIn) {
        $('html, body').animate({
            scrollTop: $("#form").offset().top
        }, 2000);
    } else {
        FB.login(function(response){
            statusChangeCallback(response);
            if (response.status == 'connected') {
                $('html, body').animate({
                    scrollTop: $("#form").offset().top
                }, 2000);
            } else {
                //TODO: should prompt any error message?
            }
        },{
            scope: 'public_profile,email'
        });
    }
});

function statusChangeCallback(response) {
    if (response.status == 'connected') {
        isFacebookSignedIn = true;
        getUserInfo();
        $("#fb-login-word").addClass("hidden");
    } else {
        isFacebookSignedIn = false;
        $("#fb-login-word").removeClass("hidden");
    }
}

window.fbAsyncInit = function() {
    var appId = (window.location.hostname == "localhost") ? '1750608541889151' : '1750216878594984';
    FB.init({
        appId   : appId,
        cookie  : true,
        xfbml   : true,
        version : 'v2.6'
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

    $(".fb-share").click(function(e){
        e.preventDefault();
        FB.ui({
            method: 'share',
            href: 'https://goodjoblife.github.io/WorkTimeSurvey/'
        }, function(response){
        });
    });

    $("#see-data").click(function(){
        var q = $("#job_title").val();
        var url = 'show.html';
        if (q !== undefined && q !== '') {
            url += '?job_title=' + encodeURIComponent(q);   
        }
        window.location.href = url;
    });

};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function getUserInfo() {
    console.log("Welcome! Fetching your information");
    FB.api('/me', function(response){
        console.log('success login for: '+ response.name);
    });
}

function checkForm () {
    console.log("check!");
    var company_id = $("#company_id").val();
    var company_name = $("#company_name").val();
    var job_title = $("#job_title").val();
    var week_work_time = $("#week_work_time").val();
    var overtime_frequency = $("#overtime_frequency_input input[name='frequency']:checked").val();
    var email = $("#email").val();
    var day_promised_work_time = $("#day_promised_work_time").val();
    var day_real_work_time = $("#day_real_work_time").val();

    if (company_name === '') {
        if (company_id === '') {
            throw new Error("公司名稱或公司統一編號其中一個必填");
        } else {
            company_id = parseInt(company_id);
            if (isNaN(company_id)) {
                throw new Error("統編要是一個數字");
            } else if(company_id < 0) {
                throw new Error("統編要大於0");
            }
        }
    }

    //allow other type of job title
    if (job_title === '') {
        throw new Error("需填職稱");
    }

    if (week_work_time === undefined || week_work_time === '') {
        throw new Error("需填平均每週工時");
    }
    week_work_time = parseInt(week_work_time);
    if (week_work_time < 0 || week_work_time > 168) {
        throw new Error("最近一週工時範圍為0~168小時");
    }

    if (day_promised_work_time === undefined || day_promised_work_time === '') {
        throw new Error("需填寫工作日表定工作時間");
    }
    day_promised_work_time = parseInt(day_promised_work_time);
    if (day_promised_work_time < 0 || day_promised_work_time > 24) {
        throw new Error("工作日表定工作時間範圍為0~24小時");
    }

    if (day_real_work_time === undefined || day_real_work_time === '') {
        throw new Error("需填寫工作日實際工作時間");
    }
    day_real_work_time = parseInt(day_real_work_time);
    if (day_real_work_time < 0 || day_real_work_time > 24) {
        throw new Error("工作日實際工作時間範圍為0~24小時");
    }

    if (overtime_frequency === undefined || overtime_frequency === '') {
        throw new Error("需填寫加班頻率");
    }

    return {
        company_id            : company_id,
        company_name          : company_name,
        job_title             : job_title,
        week_work_time        : week_work_time,
        day_promised_work_time: day_promised_work_time,
        day_real_work_time    : day_real_work_time,
        overtime_frequency    : overtime_frequency,
        email                 : email,
    };
}

/* Indicating whether the form is submiting or not
 * If submitting, we should avoid send it twice, it should return
 */
var submitting = false;

function submitForm() {
    if (submitting) {
        return;
    }
    // a spinner append to button to indicate it is running (3 things)
    var spinner = $("<i class=\"fa fa-spinner fa-spin fa-fw\"></i>").prependTo($("#submit"));
    $("#submit").attr("disabled", true);
    submitting = true;

    $.ajax({
        url: 'https://tranquil-fortress-92731.herokuapp.com/workings',
        method: 'POST',
        data: {
            access_token: FB.getAccessToken(),
            company_id: $("#company_id").val(),
            company_name: $("#company_name").val(),
            job_title: $("#job_title").val(),
            week_work_time: $("#week_work_time").val(),
            day_promised_work_time: $("#day_promised_work_time").val(),
            day_real_work_time: $("#day_real_work_time").val(),
            overtime_frequency: $("#overtime_frequency_input input[name='frequency']:checked").val(),
            email: $("#email").val(),
        },
        dataType: 'json',
    }).then(function(res) {
        console.log(res);

        spinner.fadeOut(2000, function() {
            spinner.remove();
        });
        $("#submit").attr("disabled", false);
        submitting = false;

        //hide form 
        $("#form").addClass("hidden");

        //remove hidden class and scroll to that div
        $("#result").removeClass("hidden");
        $('html, body').animate({
            scrollTop: $("#result").offset().top
        }, 2000);

        window.WorkingLoader.loadPage(0);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        spinner.fadeOut(2000, function() {
            spinner.remove();
        });
        $("#submit").attr("disabled", false);
        submitting = false;

        showAlert(jqXHR.responseJSON.message);
    });
}

function showAlert(message) {
    var $alert = $("<div class=\"alert alert-danger\" role=\"alert\"></div>");
    $alert.text(message).appendTo($("#submit-alerts"));

    setTimeout(function() {
        $alert.fadeOut(2000, function() {
            $alert.remove();
        });
    }, 5000);
}

