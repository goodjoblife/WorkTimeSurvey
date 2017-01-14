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
    if (response.status === 'connected') {
      loginStatusChange(true);
    } else {
      loginStatusChange(false);
    }
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
      loginStatusChange(true);
    } else {
      console.log('User cancelled login or did not fully authorize.');
      loginStatusChange(false);
    }
  });
});

const loginStatusChange = (is_loggined) => {
  if (is_loggined) {
    FB.api('/me', (childResponse) => {
      changeLoginBlock(true, childResponse.name);
    });
    if (typeof show_store !== 'undefined') {
      show_store.changeLogginedState(true);
    }
  } else {
    if (typeof show_store !== 'undefined') {
      show_store.changeLogginedState(false);
    }
    changeLoginBlock(false;
  }
}

const changeLoginBlock = (status, name) => {
  const $user_name = $('.header__user .name');
  const $button = $('.btn-login');

  if (status === false) {
    $button.removeClass('hide');
    $user_name.addClass('hide');
  } else if (status === true) {
    $button.addClass('hide');
    $user_name.removeClass('hide');
    $user_name.text(name);
  }
}
