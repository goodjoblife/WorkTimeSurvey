console.log("Yo");

function statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);

    var displayDOM = document.getElementById("status");
    if (response.status == 'connected') {
        testAPI();
    } else if (response.status == 'not_authorized') {
        console.log("not_authorized");
        console.log(displayDOM);
        displayDOM.innerHTML = "Please log into this App";
    } else {
        console.log("unknow");
        displayDOM.innerHTML = "Please log into Facebook";
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response){
        statusChangeCallback(response);
    });
};

window.fbAsyncInit = function() {
    FB.init({
        appId   : '1750216878594984',
        cookie  : true,
        xfbml   : true,
        version : 'v2.6'
    });

    //
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response); 
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

function testAPI() {
    console.log("Welcome! Fetching your information");
    FB.api('/me', function(response){
        console.log('success login for: '+ response.name);
        document.getElementById('status').innerHTML = response.name;
    });
};

function login () {
    FB.login(function(response){
        console.log("login");
        statusChangeCallback(response);
    }, {scope: 'public_profile,email'});
};
