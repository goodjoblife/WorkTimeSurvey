console.log("Yo");

function statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);

    if (response.status == 'connected') {
    
    } else if (response.status == 'not_authorized') {
    
    } else {
        
    }
}

window.fbAsyncInit = function() {
    FB.init({
        appId   : '1750216878594984',
        cookie  : true,
        xfbml   : true,
        version : 'v2.6'
    });

    //
    FB.getLoginStatus(function(response) {
    
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
