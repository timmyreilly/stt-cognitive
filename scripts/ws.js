var websocket = null;
var textDisplay = "";

function startWebSocketWithFile(file) {
    startDemo();

    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    if (window.location.port != "80" && window.location.port != "")
    {
        hostString=hostString.concat(":").concat(window.location.port);
    }
 
    var uri = 'wss://' + hostString + window.applicationRoot + '/ws/speechtotextdemo?file=' + file + '&language=' + $('#languageoptions').val()
            + '&g_Recaptcha_Response=' + reCaptchaSdk.g_Recaptcha_Response + '&isNeedVerify=' + reCaptchaSdk.isNeedVerify;
    websocket = getWebSocket(uri);
}

function startWebSocketForMic() {
    startDemo();

    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    if (window.location.port != "80" && window.location.port != "") {
        hostString = hostString.concat(":").concat(window.location.port);
    }
    var uri = 'wss://' + hostString + window.applicationRoot + '/ws/speechtotextdemo?language=' + $('#languageoptions').val()
            + '&g_Recaptcha_Response=' + reCaptchaSdk.g_Recaptcha_Response + '&isNeedVerify=' + reCaptchaSdk.isNeedVerify;
    websocket = getWebSocket(uri);
    console.log(uri)
    websocket.onopen = function () {
        audioRecorder.sendHeader(websocket);
        audioRecorder.record(websocket);

        $('.mic').text('stop');
        $('#microphoneText').text("Please speak. Click on the microphone again to stop listening.");
    };
}

function getWebSocket(uri) {
    websocket = new WebSocket(uri);
    websocket.onerror = function (event) {    
        stopRecording();
        websocket.close();
    };

    websocket.onmessage = function (event) {
        var data = event.data.toString();
        if (data == null || data.length <= 0) {
            return;
        }
        else if (data == "Throttled" || data == "Captcha Fail") {
            $('#messages').text(data);
            reCaptchaSdk.ProcessReCaptchaStateCode(data);
            stopSounds();
            return;
        }
        else {
            reCaptchaSdk.RemoveReCaptcha();
        }
        if (data == null || data.length <= 0) {
            return;
        }

        var ch = data.charAt(0);
        var message = data.substring(1);
        if (ch == 'e') {
            stopRecording();
        }
        else {
            var text = textDisplay + message;
            if (ch == 'f') {
                textDisplay = text + " ";
            }

            $('#messages').text(text);
        }
    };

    websocket.onclose = function (event) {
        stopRecording();
    };

    return websocket;
}