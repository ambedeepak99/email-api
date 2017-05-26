/**
 * This file is used to define constants, services
 * @author Prathamesh Parab
 */
app.factory('Utils', function () {

    var constants = {
        //BASE_URL: "https://data.sfgov.org/resource/6a9r-agq8.json",
        BASE_URL: "http://localhost:3000/",
        SERVER_ERROR: "There is no internet connection or server unreachable.",
        SETTING: {
            SOUND_NOTIFY_SETTING_KEY: "SOUNDNOTIFY"
        }
    };

    var encodeDecodeFunctions = {
        encodeString: encodeString,
        decodeString: decodeString
    }

    function encodeString(originalString) {
        return Base64.encode(originalString);
    }

    function decodeString(encodedString) {
        return Base64.decode(encodedString);
    }

    /**
     * This section build for store values in store section
     * @type {{setStorage: setStorage, getStorage: getStorage, deleteStorage: deleteStorage}}
     */

    var soundNotifyFunctions = {
        playTruckTone: playTruckTone
    }

    function playTruckTone() {
        try {
            startTruckTone.pause();
            startTruckTone.currentTime = 0;
            startTruckTone.play();
        }
        catch (e) {
            throw error(e);
        }
    }

    var storageFunctions = {
        setStorage: setStorage,
        getStorage: getStorage,
        deleteStorage: deleteStorage
    };

    function setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    function getStorage(key) {
        var value = localStorage.getItem(key);
        if (value)
            return value;
        else
            return value;
    }

    function deleteStorage(key) {
        localStorage.removeItem(key);
    }

    return{
        CONSTANTS: constants,
        STORAGE: storageFunctions,
        SOUNDNOTIFY: soundNotifyFunctions,
        ENCODE_DECODE: encodeDecodeFunctions
    }
});

app.factory('WebService', ['$http', 'Utils', '$location', function ($http, Utils, $location) {

        var BASE_URL = Utils.CONSTANTS.BASE_URL;
        var animation_delay = 750;
        var WebServiceFunctions = {
            validatelogin: validatelogin,
            createAlert: createAlert,
            sendMails: sendMails,
            signUp : signUp
        }
        var finalResult = {
            "success": false,
            "response": null
        }

        /**
         * checkAuthorization  - This function is used to check authorization token expire or not
         * @param errCode
         * @param callback
         * @author Prathamesh Parab
         */
        function checkAuthorization(err, callback) {
            if (err.code == 401 || err.code == 402) {
                $location.path('/login');
                createAlert(1, "your session has been expire please try to login again", 3);
            } else {
                $location.path('/login');
                createAlert(1, Utils.CONSTANTS.SERVER_ERROR, 3);
                callback(finalResult);
            }
        }

        /**
         * This service used to verify user creaditial
         * @param loginInfo
         * @param callback
         * @author Prathamesh Parab
         */

        function validatelogin(loginInfo, callback) {
            var post_request = {
                'username': loginInfo.uName,
                'password': loginInfo.pwd
            };

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.post(BASE_URL + "user/signin", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };


        /**
         * signUp - This function is used to Rgister New user
         * @param loginInfo
         * @param callback
         * @author Prathamesh Parab
         */

        function signUp(loginInfo, callback) {
            var post_request = {
                'username': loginInfo.uName,
                'password': loginInfo.pwd,
                'email': loginInfo.email
            };

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.post(BASE_URL + "user/signup", post_request, request_config)
                .success(function (data) {
                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        /**
         * createAlert - This service create different alert based on severity
         * @param severity, message, timeout
         * @author Prathamesh Parab
         */

        function createAlert(severity, message, timeout) {
            $("div.alert-box.active").remove();
            timeout *= 1000;
            var alert_div;
            switch (severity) {
                case 1:
                    alert_div = $("div.alert-box.alert-msg").clone();
                    break;
                case 2:
                    alert_div = $("div.alert-box.success-msg").clone();
                    break;
                case 3:
                    alert_div = $("div.alert-box.warning-msg").clone();
                    break;
                default:
                    alert_div = $("div.alert-box.alert-msg").clone();
                    break;
            }
            $(alert_div).addClass("active");
            $(alert_div).find(".alert-message").text(message);
            $("#alert-container").append(alert_div);
            $(alert_div).slideDown(animation_delay);
            if (timeout) {
                setTimeout(function () {
                    $(alert_div).slideUp(animation_delay, function () {
                        $(alert_div).remove();
                    });
                }, timeout);
            }
        }

        /**
         * sendMails - This function is used to send send mail to users
         * @param loginInfo
         * @param callback
         * @author Prathamesh Parab
         */

        function sendMails(loginInfo, callback) {
            var post_request = {
                'to': loginInfo.emails.split(","),
                'subject': loginInfo.subject,
                'body': loginInfo.body
            };

            var request_config = { headers: {  "Content-Type": 'application/json',
                "authorization": Utils.STORAGE.getStorage("access_token")
            } };

            $http.post(BASE_URL + "v1/mailer/sendmail", post_request, request_config)
                .success(function (data) {

                    finalResult.success = true;
                    finalResult.response = data;
                    callback(finalResult);
                }).error(function (err) {
                    checkAuthorization(err);
                });
        };

        return{
            WEBSERVICES: WebServiceFunctions
        }
    }]
);


