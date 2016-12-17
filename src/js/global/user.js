/*
 * Facebook related
 */

let isFbLogin = null;

//define async function first
window.fbAsyncInit = () => {
  const appId = (window.location.hostname === "localhost") ? "1750608541889151" : "1750216878594984";
  FB.init({
    appId: appId,
    cookie: true,
    xfbml: true,
    version: "v2.6",
  });

  FB.getLoginStatus((response) => {
    if (response.status === 'connected') {
      isFbLogin = true;
    } else {
      isFbLogin = false;
    }
    FB.api('/me', function(response) {
      console.log(response.name);
    });

    changeLoginBlock();
  });
};

//execute async function to load fb sdk
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');


$('.btn-login').on('click', function() {
  FB.login(function(response) {
    if (response.authResponse) {
      isFbLogin = true;
    } else {
      isFbLogin = false;
      console.log('User cancelled login or did not fully authorize.');
    }

    changeLoginBlock();
  });
});

const changeLoginBlock = () => {
  const $not_login = $('.dashed-line-box .not-login');
  const $logined = $('.dashed-line-box .logined');

  if (isFbLogin === false) {
    $not_login.removeClass('hide');
    $logined.addClass('hide');
  } else if (isFbLogin === true) {
    $logined.removeClass('hide');
    $not_login.addClass('hide');
  }
}

let user_enabled = true;

if (user_enabled) {
  $('#user-enabled').addClass('hide');
} else {
  $('#user-enabled').removeClass('hide');
}
