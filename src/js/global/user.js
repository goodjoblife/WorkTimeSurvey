/*
 * Facebook related
 */

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
    loginStatusChange(response);
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
  FB.login((response) => {
    console.log('user login...')
    if (response.authResponse) {
      FB.api('/me', (childResponse) => {
        changeLoginBlock(true, childResponse.name);
      });
    } else {
      changeLoginBlock(false, '');
      console.log('User cancelled login or did not fully authorize.');
    }
  });
});

const loginStatusChange = (response) => {
  if (response.status === 'connected') {
    FB.api('/me', (childResponse) => {
      changeLoginBlock(true, childResponse.name);
    });
    changeUserEnabled(true);
//    const acc_tok = FB.getAccessToken();
  } else {
    changeLoginBlock(false, '');
  }
}

const changeLoginBlock = (status, name) => {
  const $not_login = $('.dashed-line-box .not-login');
  const $logined = $('.dashed-line-box .logined');
  const $user_name = $('.header__user .name');
  const $button = $('.btn-login');

  if (status === false) {
    $not_login.removeClass('hide');
    $logined.addClass('hide');
    $button.removeClass('hide');
    $user_name.addClass('hide');
  } else if (status === true) {
    $logined.removeClass('hide');
    $not_login.addClass('hide');
    $button.addClass('hide');
    $user_name.removeClass('hide');
    $user_name.text(name);
  }
}

