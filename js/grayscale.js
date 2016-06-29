/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);


var isFacebookSignedIn = false;

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
  if ($(this).attr('class') != 'dropdown-toggle active' && $(this).attr('class') != 'dropdown-toggle') {
    $('.navbar-toggle:visible').click();
  }
});

$("#knowMore").modal({
    show: false 
});

$("#knowMoreBtn").click(function(e){
    e.preventDefault();
    $("#knowMore").modal("show");
});

function statusChangeCallback(response) {
    if (response.status == 'connected') {
        isFacebookSignedIn = true;
        $("#fb-login-word").addClass("hidden");
        $("#form").removeClass("hidden");

        getUserInfo();
    } else {
        isFacebookSignedIn = false;
        $("#fb-login-word").removeClass("hidden");
        $("#form").addClass("hidden");
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

    $("#fb-login").click(function(e){
        e.preventDefault();
        if (!isFacebookSignedIn) {
            FB.login(function(response){
                statusChangeCallback(response);
            },{
                scope: 'public_profile,email'
            });
        } else {
            $('html, body').stop().animate({
                scrollTop: $("#form").offset().top
            }, 1500, 'easeInOutExpo');
        }
    });

    $("#fb-share").click(function(e){
        e.preventDefault();
        FB.ui({
            method: 'share',
            href: 'https://goodjoblife.github.io/WorkTimeSurvey/'
        }, function(response){
            
        });
    });

    $("#submit").click(function(e) {
        e.preventDefault();
        var msg = checkForm();
        if(msg == 'success'){
            submitForm();
        }
        else{
            alert(msg);
        }
    });
    $("#submit-more").click(function(e) {
        e.preventDefault();

        $("#form-more").removeClass("hidden");
        $("#submit-more").addClass("hidden");
        $("#submit-reject").addClass("hidden");
    });
    $("#submit-reject").click(function(e) {
        e.preventDefault();

        checkForm();
    });
};

$(function() {
    var container = $("#workings-table tbody");

    // A view convert working to view
    function view(w) {
        return "<tr><td>" + w.company_name + "</td><td>" + w.week_work_time + "</td></tr>";
    }

    /*
     * query a specific page workings
     */
    function queryWorkings(page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/',
            data: {
                page: page,
            },
            method: 'GET',
            dataType: 'json',
        });
    }

    /*
     * query workings starting from a specific page
     */
    function queryAllWorkings(page) {
        page = page || 0;

        return queryWorkings(page).then(function(workings) {
            $.map(workings, view).forEach(function(html) {
                $(html).appendTo(container);
            });

            return workings;
        }).then(function(workings) {
            if (workings.length != 0) {
                return queryAllWorkings(page + 1);
            } else {
                return true;
            }
        });
    }

    queryAllWorkings().then(function(res) {
        if (res) {
            console.log("finish all page query");
        }
    });
});

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
};

function checkForm () {
    console.log("check!");
    var company_id = $("#company_id").val();
    var company_name = $("#company_name").val();
    var job_title = $("#job_title").val();
    var week_work_time = $("#week_work_time").val();
    var email = $("#email").val();
    var salary_type = $("#salary_type").val();
    var salary_min = $("#salary_min").val();
    var salary_max = $("#salary_max").val();
    var work_year = $("#work_year").val();
    var review = $("#review").val();

    if(company_name == ''){
        if(company_id == ''){
            return "公司名稱或公司統一編號其中一個必填"
        }
        else{
            company_id = parseInt(company_id);
            if(isNaN(company_id)){
                return "統編要是一個數字";
            }
            else if(company_id < 0){
                return "統編要大於0";
            }
        }
    }

    if(job_title == ''){  //allow other type of job title
        return "需填職稱";
    }
    if(week_work_time == ''){  
        return "需填平均每週工時";
    }
    if(salary_min != '' || salary_max != ''){
        salary_min = parseInt(salary_min);
        salary_max = parseInt(salary_max);
        if(salary_min < 0 || salary_max < 0 || salary_min > salary_max){
            return "薪資需大於0 且範圍由小至大";
        }
    }
    if(work_year != ''){
        work_year = parseInt(work_year);
        if(work_year < 0){
            return "年資須大於0";
        }
    }
    return "success";

};

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
        url: 'https://tranquil-fortress-92731.herokuapp.com/',
        method: 'POST', 
        data: {
            access_token: FB.getAccessToken(),
            company_id: $("#company_id").val(),
            company_name: $("#company_name").val(),
            job_title: $("#job_title").val(),
            week_work_time: $("#week_work_time").val(),
            email: $("#email").val(),
            salary_type: $("#salary_type").val(),
            salary_min: $("#salary_min").val(),
            salary_max: $("#salary_max").val(),
            work_year: $("#work_year").val(),
            review: $("#review").val()

        },
        dataType: 'json',
    }).then(function(res) {
        console.log(res);

        // On success, recover the status (3 things)
        // On fail, ... it should, TODO
        spinner.fadeOut(2000, function() {
            spinner.remove();
        });
        $("#submit").attr("disabled", false);
        submitting = false;

        // TODO if success
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // TODO if fail

        console.log(jqXHR);
    });
};
