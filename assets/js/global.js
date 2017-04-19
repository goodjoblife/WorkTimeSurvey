"use strict";function copyToClipboard(o){var e=o.dataset.copytarget?o.dataset.copytarget:null,t=e?document.querySelector(e):null,n=document.querySelector(e+"-icon");if(t&&t.select){t.select();try{document.execCommand("copy"),t.blur(),n.classList.add("is-active"),setTimeout(function(){n.classList.remove("is-active")},2e3)}catch(o){console.log(o)}}}var breakpoint={above_desktop:window.matchMedia("(min-width: 1025px)"),below_desktop:window.matchMedia("(max-width: 1024px)"),above_small:window.matchMedia("(min-width: 851px)"),below_small:window.matchMedia("(max-width: 850px)"),above_tablet:window.matchMedia("(min-width: 768px)"),below_tablet:window.matchMedia("(max-width: 767px)"),below_mobile:window.matchMedia("(max-width: 550px)")},accordion={item:".accordion__item",content:".accordion__content",toggle:function(o){o.parents(this.item).toggleClass("is-active"),o.parents(this.item).find(this.content).slideToggle(400)},open:function(o){o.parents(this.item).addClass("is-active"),o.parents(this.item).find(this.content).slideDown(400)},closeAll:function(o){var e=o.parents(".accordion");e.find(this.item).removeClass("is-active"),e.find(this.content).slideUp(400)}};$("body").on("click",".accordion__trigger",function(){accordion.toggle($(this))});var btn_back_to_top=document.getElementById("btn-back-to-top");btn_back_to_top&&(window.addEventListener("scroll",function(){document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop>50?btn_back_to_top.classList.add("is-active"):btn_back_to_top.classList.remove("is-active")}),btn_back_to_top.addEventListener("click",function(){$("html, body").animate({scrollTop:0},600)})),window.WTS=window.WTS||{},WTS.constants={backendURL:"https://tranquil-fortress-92731.herokuapp.com/",siteURL:"https://www.goodjob.life/"},$("body").on("click","[data-copytarget]",function(){copyToClipboard(this)}),$(function(){$("body").on("click","[data-modal-id]",function(){$("body, html").addClass("is-fixed");var o=this.dataset.modalId;$('[data-modal="'+o+'"]').addClass("is-open")}),$("[data-modal-mobile-id]").on("click",function(){var o=this.dataset.modalMobileId;$('[data-modal="'+o+'"]').addClass("is-open")});var o=function(){$(".modal").removeClass("is-open"),$("body, html").removeClass("is-fixed")};$("body").on("click",".js-close-data-modal",function(){o()}),$("body").on("click",".data-modal",function(e){$(e.target).closest(".js-data-modal-container").length||o()})}),$("[data-show-trigger]").on("click",function(){var o=$(this).attr("data-show-trigger");$('[data-show="'+o+'"]').slideToggle()});var is_safari=-1!=navigator.userAgent.indexOf("Safari")&&-1==navigator.userAgent.indexOf("Chrome");is_safari&&document.documentElement.classList.add("is-safari");var is_mobile=function(){return!!(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i))}();is_mobile&&document.documentElement.classList.add("is-mobile");var form_modal=document.getElementById("modal-alert"),closeFormModal=function(){form_modal.classList.remove("is-open"),$("body, html").removeClass("is-fixed"),form_modal.innerHTML=""},showAlert=function(o,e,t,n){var a=void 0,i=void 0;"go-to-show"==n?a='<a href="/show.html" class="modal-content__btn btn-black btn-m">查看最新工時、薪資</a>':"go-to-form"==n?a='<button class="modal-content__btn btn-black btn-m" id="modal-scroll-to-form">重新填寫</button>':"go-fb-login"==n&&(a='<button id="fb-login-and-submit-in-modal" class="modal-content__btn btn-black btn-m">以<svg role="img" class="icon-facebook"><use xlink:href="#icon-facebook"></use></svg>驗證並送出資料</button>'),"success"==o?i="form-checked":"alert"==o&&(i="form-alert");var s='\n  <div class="modal__inner">\n    <div class="modal__close wrapper-s js-close-modal"><svg role="img"><use xlink:href="#x"></use></svg></div>\n    <div class="modal__container wrapper-s">\n      <div class="modal-content">\n        <div class="modal-content__icon"><svg role="img"><use xlink:href="#'+i+'"></use></svg></div>\n        <h5 class="modal-content__heading">'+e+'</h5>\n        <h6 class="modal-content__paragraph">'+t+"</h6>\n        "+a+"\n      </div>\n    </div>\n  </div>\n  ";form_modal.innerHTML=s,form_modal.classList.add("is-open"),document.querySelector("html").classList.add("is-fixed"),document.querySelector("body").classList.add("is-fixed")};$("body").on("click","#modal-scroll-to-form",function(o){var e=section_form.offsetTop-58;o.preventDefault(),closeFormModal(),$("html, body").animate({scrollTop:e},600)}),$("body").on("click","#fb-login-and-submit-in-modal",function(o){o.preventDefault(),closeFormModal(),$("#work-form").trigger("submit")}),$("body").on("click",".js-close-modal",function(){closeFormModal()}),$("body").on("click",".form-modal",function(o){$(o.target).closest(".modal__container").length||closeFormModal()});var header=document.getElementById("header");breakpoint.above_small.matches&&window.addEventListener("scroll",function(){document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop>100?header.classList.add("is-fixed"):(document.documentElement&&document.documentElement.scrollTop||0==document.body.scrollTop)&&header.classList.remove("is-fixed")});var header_button=document.getElementById("header-button"),header_nav=document.getElementById("header-nav");header_button.addEventListener("click",function(){this.classList.toggle("is-open"),header_nav.classList.toggle("is-open"),document.querySelector(".btn-scroll-down")&&document.querySelector(".btn-scroll-down").classList.toggle("hide")});for(var nav_scroll=document.querySelectorAll(".js-scrollpage"),i=0;i<nav_scroll.length;i++)nav_scroll[i].addEventListener("click",function(){header_button.classList.remove("is-open"),header_nav.classList.remove("is-open")});var scroll_to_form=document.querySelectorAll(".js-scrollToForm"),scroll_to_faq=document.querySelectorAll(".js-scrollToFaq"),section_form=document.getElementById("section-form"),section_faq=document.getElementById("section-faq");section_form&&function(){for(var o=section_form.offsetTop-58,e=0;e<scroll_to_form.length;e++)scroll_to_form[e].addEventListener("click",function(e){e.preventDefault(),$("html, body").animate({scrollTop:o},600)})}(),section_faq&&function(){for(var o=section_faq.offsetTop-58,e=0;e<scroll_to_faq.length;e++)scroll_to_faq[e].addEventListener("click",function(e){e.preventDefault(),$("html, body").animate({scrollTop:o},600)})}();var highlightCurrentPage=function(){for(var o=document.querySelectorAll(".site-menu__item"),e=window.location.pathname,t=0;t<o.length;t++){var n=o[t].childNodes[0];n.getAttribute("href")===e?n.classList.add("is-current"):n.classList.remove("is-current")}};highlightCurrentPage(),window.fbAsyncInit=function(){var o="localhost"===window.location.hostname?"1750608541889151":"1750216878594984";FB.init({appId:o,cookie:!0,xfbml:!0,version:"v2.6"}),FB.getLoginStatus(function(o){loginStatusChange("connected"===o.status?!0:!1)})},function(o,e,t){var n,a=o.getElementsByTagName(e)[0];o.getElementById(t)||(n=o.createElement(e),n.id=t,n.src="//connect.facebook.net/zh_TW/sdk.js",a.parentNode.insertBefore(n,a))}(document,"script","facebook-jssdk"),$("body").on("click",".btn-login",function(){FB.login(function(o){console.log("user login..."),o.authResponse?loginStatusChange(!0):(console.log("User cancelled login or did not fully authorize."),loginStatusChange(!1))})});var loginStatusChange=function(o){o?(FB.api("/me",function(o){changeLoginBlock(!0,o.name)}),"undefined"!=typeof showjs_store&&showjs_store.changeLoggedInState(!0),"undefined"!=typeof statusChangeCallback&&statusChangeCallback(!0)):("undefined"!=typeof showjs_store&&showjs_store.changeLoggedInState(!1),"undefined"!=typeof statusChangeCallback&&statusChangeCallback(!1),changeLoginBlock(!1))},changeLoginBlock=function(o,e){var t=$(".header__user .name"),n=$(".btn-login");!1===o?(n.removeClass("hide"),t.addClass("hide")):!0===o&&(n.addClass("hide"),t.removeClass("hide"),t.text(e))};