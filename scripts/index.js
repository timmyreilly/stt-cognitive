var ua = navigator.userAgent.toLowerCase();
var check = function (r) {
    return r.test(ua);
};
var isOpera = check(/opera/);
var isChrome = check(/chrome/);
var isFF = check(/firefox/);
var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;
var isIE = !isOpera && (isIE11 || check(/msie/));
var canWork = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

$(document).ready(function () {
    if (!canWork || (!isChrome && !isFF && !isOpera)) {
        $('.mic').hide();
        $('#microphoneText').hide();
        $('.warnInfo').show();
    } 


    $('.sample').bind('play', function () {
        audioStatusChanged(this, true);
    }).bind('ended', function () {
        audioStatusChanged(this, false);
    }).bind('pause', function () {
        audioStatusChanged(this, false);
    });

    $('.mic.demo_btn').click(function () {
        console.log('clickedddd')
        micOnClick();
    });
        
    
});

function startDemo() {
    resetSound();
    stopRecording();
    $('#messages').empty();
    textDisplay = "";
}

function audioStatusChanged(audio, isPlay) {
    var index = parseInt($(audio).data("index"));
    var btn = $(".samplelink".concat(index));

    if (isPlay) {
        btn.addClass("playing");
    } else {
        btn.removeClass("playing");
    }
};

function resetSound() {
    stopWebSocket();
    stopSounds();
    $(".samplelink1").removeClass("playing");
    $(".samplelink2").removeClass("playing");
}
