var reCaptchaSdk = {
    sitekey: '6LemihkTAAAAAKBFxFpiFlrhOTkB6HpaCJQDRc7b',
    theme: 'light', //dark,light
    size: 'normal', //compact, normal
    type: 'image',   //audio image

    reCaptchaHtml: '<div class="g-recaptcha" id="ReCaptcha"></div><script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>',
    isDisplayCaptcha: false,
    g_Recaptcha_Response: null,
    reCaptcha: null,
    isNeedVerify:false,

    PassReCaptchaCallback: function (response) {
        reCaptchaSdk.g_Recaptcha_Response = grecaptcha.getResponse(reCaptchaSdk.reCaptcha);
        $(".googleReCaptcha").empty();
        $('.maskLayer').hide();
    },

    ProcessReCaptchaStateCode: function (e,demoTypeClass) {
        if (e.responseText == "Throttled" || e == "Throttled") {
            if ($(".g-recaptcha").length <= 0) {
                $('.maskLayer').show();
                $('.'+demoTypeClass+' .googleReCaptcha').append(reCaptchaSdk.reCaptchaHtml);
            }
        }
        if (e.responseText == "Captcha Fail" || e == "Captcha Fail") {
            grecaptcha.reset(reCaptchaSdk.reCaptcha);
        }
        reCaptchaSdk.isDisplayCaptcha = true;
    },

    RemoveReCaptcha: function () {
        $(".googleReCaptcha").empty();
        reCaptchaSdk.isNeedVerify = false;
    }
}
var onloadCallback = function () {
    if (!reCaptchaSdk.isNeedVerify) {
        reCaptchaSdk.reCaptcha = grecaptcha.render('ReCaptcha', {
            'sitekey': reCaptchaSdk.sitekey,
            'theme': reCaptchaSdk.theme,
            'size': reCaptchaSdk.size,
            'type': reCaptchaSdk.type,
            'callback': reCaptchaSdk.PassReCaptchaCallback
        });
        reCaptchaSdk.isNeedVerify = true;
    }
};
$(function () {
    $('.reCaptcha-demo').reCaptcha();
})
;(function ($) {
    $.fn.extend({
        "reCaptcha": function () {
            if ($(this).length<=0) {
                return;
            }
            $(this).css('position', 'relative');
            $(this).append('<div class="maskLayer">  <div class="googleReCaptcha-normal googleReCaptcha"> </div></div><div style="clear:both"></div>');
        }
    });
})(jQuery);