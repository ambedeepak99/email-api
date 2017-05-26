/**
 * @namespace app
 * @description This file is used to redirect application state e.g. login, mailer etc.
 * @author Prathamesh Parab
 */
var app = angular.module("done", ["ngRoute"]);

app.config(["$httpProvider", "$routeProvider", function ($httpProvider, $routeProvider) {

    $routeProvider
        .when("/", {
            redirectTo: "/login"
        })
        .when("/login", {
            templateUrl: "templates/login/login.html",
            controller: "LoginCtrl",
            controllerAs: "log"
        })

        .when("/email", {
            templateUrl: "templates/email/email.html",
            controller: "EmailCtrl",
            controllerAs: "email"
        })
        .otherwise({
            redirectTo: "/login"
        });
}]);

function containerCtrl(Utils) {
    var vm = this;
};
app.controller('containerCtrl', ['Utils', containerCtrl]);

/**
 * This file is used to generate custom directive to perform some oprtaion with dom element with class ,attribute and element.
 * @author Prathamesh Parab
 */
app.directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}:{point.y} <b>({point.percentage:.1f}%)</b>'
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [
                    {
                        name: scope.title,
                        colorByPoint: true,
                        data: scope.data
                    }
                ]
            });
        }
    };
});

app.directive('clientAutoComplete', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            attrs.autocomplete({
                source: function (request, response) {

                    //term has the data typed by the user
                    var params = request.term;

                    //simulates api call with odata $filter
                    var data = scope.dataSource;
                    if (data) {
                        var result = $filter('filter')(data, {name: params});
                        angular.forEach(result, function (item) {
                            item['value'] = item['name'];
                        });
                    }
                    response(result);

                },
                minLength: 1,
                select: function (event, ui) {
                    //force a digest cycle to update the views
                    scope.$apply(function () {
                        scope.setClientData(ui.item);
                    });
                }

            });
        }

    };
});


app.directive('hcColumnChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            axistitle: '=',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'column'
                },

                title: {
                    text: scope.title
                },
                subtitle: {
                    text: ''
                },
                legend: {
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'vertical'
                },

                xAxis: {
                    categories: scope.axistitle.xTitle,
                    labels: {
                        x: -10
                    }
                },

                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: scope.axistitle.yTitle
                    }
                },

                series: scope.data,

                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                yAxis: {
                                    labels: {
                                        align: 'left',
                                        x: 0,
                                        y: -5
                                    },
                                    title: {
                                        text: null
                                    }
                                },
                                subtitle: {
                                    text: null
                                },
                                credits: {
                                    enabled: false
                                }
                            }
                        }
                    ]
                }
            });
        }
    };
});


/**
 * This file is used to define constants, services
 * @author Prathamesh Parab
 */
app.factory('Utils', function () {

    var constants = {
        //BASE_URL: "https://data.sfgov.org/resource/6a9r-agq8.json",
        BASE_URL: "http://10.40.12.205:3000/",
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



/**
 * This file is used to generate custome filter
 * @author Prathamesh Parab
 */

app.filter('filterMultipleForOrder', ['$filter', function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data: items,
            filteredData: [],
            applyCustomFilter: applyCustomFilter
        };

        function applyCustomFilter(keyObj, data) {
            var myFilterData = [];
            var customCondition = {
                searchText: true,
                orderStatus: true,
                multipleOrderStatus: true,
                outlet: true,
                subarea: true,
                clientPlatform: true,
                deliveryProvider: true,
                dineinStatus: true
            };
            if (data && data.length) {
                angular.forEach(data, function (order, index) {
                    if (keyObj.orderStatus && order.order_status && order.order_status.status)
                        customCondition.orderStatus = (order.order_status.status.toLowerCase() === keyObj.orderStatus.toLowerCase());

                    if (keyObj.multipleOrderStatus && order.order_status && order.order_status.status)
                        customCondition.multipleOrderStatus = (keyObj.multipleOrderStatus.toLowerCase().indexOf(order.order_status.status.toLowerCase()) > -1);

                    if (keyObj.clientPlatform && order.client_platform)
                        customCondition.clientPlatform = (order.client_platform.toLowerCase().indexOf(keyObj.clientPlatform.old_name.toLowerCase()) > -1);

                    if (keyObj.outlet && order.outlet && order.outlet.name)
                        customCondition.outlet = (order.outlet.name.toLowerCase().indexOf(keyObj.outlet.name.toLowerCase()) > -1);

                    if (keyObj.subarea && order.user && order.user.address) {
                        if (order.user.address.subarea_name)
                            customCondition.subarea = (order.user.address.subarea_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                        else if (order.user.address.area_name)
                            customCondition.subarea = (order.user.address.area_name.toLowerCase().indexOf(keyObj.subarea.toLowerCase()) > -1);
                    }
                    if (keyObj.deliveryProvider && order.delivery_provider)
                        customCondition.deliveryProvider = (order.delivery_provider.toLowerCase().indexOf(keyObj.deliveryProvider.toLowerCase()) > -1);

                    if (keyObj.dineinStatus && order.reservation_status)
                        customCondition.dineinStatus = (order.reservation_status.toLowerCase() === keyObj.dineinStatus.toLowerCase());

                    if (keyObj.searchText)
                        customCondition.searchText = (JSON.stringify(order).toLowerCase().indexOf(keyObj.searchText.toLowerCase()) > -1);

                    if (customCondition.orderStatus &&
                        customCondition.outlet &&
                        customCondition.subarea &&
                        customCondition.clientPlatform &&
                        customCondition.searchText &&
                        customCondition.multipleOrderStatus &&
                        customCondition.deliveryProvider &&
                        customCondition.dineinStatus) {
                        myFilterData.push(order);
                    }
                });
            }
            return myFilterData;
        };

        if (keyObj)
            filterObj.filteredData = filterObj.applyCustomFilter(keyObj, filterObj.data);

        return filterObj.filteredData;
    }
}]);

app.filter('unique', function () {
    return function (items, filterOn) {
        if (filterOn === false) {
            return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

app.filter('zpad', function () {
    return function (input, n) {
        if (input === undefined)
            input = ""
        if (input.length >= n)
            return input
        var zeros = "0".repeat(n);
        return (zeros + input).slice(-1 * n)
    };
});

app.filter('getTotal', function () {
    return function (inputArray, additionValue, multiplyer) {
        var total = 0;
        if (inputArray !== undefined && inputArray.length >= 1)
            for (var i = 0; i < inputArray.length; i++)
                if (multiplyer !== undefined)
                    total = total + (inputArray[i][additionValue] * inputArray[i][multiplyer]);
                else
                    total = total + inputArray[i][additionValue];
        return total;
    };
});
app.filter('timeSpanStringToDate', function () {
    return function (timeSpan, customDateString) {
        if (timeSpan) {
            var current_time = new Date();
            if (customDateString) {
                current_time = Date.parse(customDateString);
            }
            var myDate = new Date(current_time.toLocaleDateString() + " " + timeSpan);
            return myDate;
        }
        else {
            return timeSpan;
        }
    };
});

/**
 * EmailCtrl - This controller is used to send validated emails to users
 * @param $scope {object} Scope object
 * @param $location {object} location object
 * @param Utils {object} Utils object
 * @param WebService {object} WebService object
 * @param $interval {object} interval object
 * @author Prathamesh Parab
 * @constructor
 */

function EmailCtrl($scope, $location, Utils, WebService, $interval) {

    var vm = this;
    var WEBSERVICE = WebService.WEBSERVICES;
    var SOUNDNOTIFY = Utils.SOUNDNOTIFY;
    var STORAGE = Utils.STORAGE;

    /**
     * to check token is expire or not and then only proceed
     */

    if (STORAGE.getStorage("access_token") && STORAGE.getStorage("access_token") != "") {
        vm.user = {
            emails: "",
            body: "",
            subject: ""
        };
        vm.sendmail = sendmail;
        vm.logout = logout;
        vm.sendMailAgn = sendMailAgn;

        /**
         * sendmail - this function is used to send mail to user
         * @author Prathamesh Parab
         */
        function sendmail() {
            $(".sendEmail").slideUp(500);
            $(".emailloading").delay(1000).slideDown(500);
            $(".logoutBtn").hide();
            if (vm.user.emails != undefined) {
                if (vm.user.emails && vm.user.subject && vm.user.body) {
                    WEBSERVICE.sendMails(vm.user, function (result) {
                        if (result && result.response.code === 2000) {
                            $(".sendEmail").slideUp(500);
                            $(".emailloading").delay(500).slideDown(500).slideUp(500).hide(0);
                            $(".emailSuccess").delay(2000).slideDown(500);
                            $(".logoutBtn").delay(2000).show();
                        }
                        else {
                            $(".emailloading").delay(1000).slideDown(500).slideUp(500).hide(0);
                            $(".emailfailure").delay(2000).slideDown(500);
                            $(".logoutBtn").delay(2000).show();
                        }
                    });
                } else {

                    WEBSERVICE.createAlert(1, "Please fill all mandatory details", 3);
                    $(".emailloading").slideUp(100);
                    $(".sendEmail").delay(1000).slideDown(500);
                }
            } else {
                WEBSERVICE.createAlert(1, "Please provider proper email address", 3);
                $(".emailloading").slideUp(100);
                $(".sendEmail").delay(1000).slideDown(500);
            }
        }

        /**
         * logout  - this function is used to sign off the user
         * @author Prathamesh Parab
         */
        function logout() {
            STORAGE.deleteStorage("access_token");
            $location.path('/login');
            location.reload();
        }

        /**
         * sendMailAgn - this function is used send back to send mail screen
         * @author Prathamesh Parab
         */

        function sendMailAgn() {
            vm.user = {
                emails: "",
                body: "",
                subject: ""
            };
            $(".sendEmail").delay(1000).slideDown(500);
            $(".emailSuccess").slideUp(500).hide(0);
            $(".emailfailure").slideUp(500).hide(0);
        }
    } else {
        STORAGE.deleteStorage("access_token");
        $location.path('/login');
        location.reload();
    }

};
app.controller('EmailCtrl', ['$scope', '$location', 'Utils', 'WebService', '$interval', EmailCtrl]);

/**
 * LoginCtrl - This controller is used to validate user creaditial
 *
 * @param $scope {object} Scope object
 * @param $location {object} location object
 * @param Utils {object} Utils object
 * @param WebService {object} WebService object
 * @param $interval {object} interval object
 * @author Prathamesh Parab
 * @constructor
 */
function LoginCtrl($scope,$location, Utils, WebService, $interval) {

    var vm = this;
    vm.issignup = false;
    vm.signupbtn = true;
    vm.loginbtn = false;
    var WEBSERVICE = WebService.WEBSERVICES;
    var SOUNDNOTIFY = Utils.SOUNDNOTIFY;
    var STORAGE = Utils.STORAGE;

    vm.user = {
        uName: "",
        pwd: "",
        email:""
    };

    vm.submit = submit;
    vm.signup = signup;
    vm.logAgn = logAgn;

    if(!STORAGE.getStorage("access_token"))
    {

        /**
         * submit - This function is used to validate the user credentials
         * @author Prathamesh parab
         */

        function submit() {
            if (vm.issignup == true) {
                vm.signupbtn = false;
                if (vm.user.uName && vm.user.pwd && vm.user.email) {
                    WEBSERVICE.signUp(vm.user, function (result) {
                        if (result && result.response.code === 2000) {
                            vm.issignup = false;
                            vm.signupbtn = true;
                            vm.loginbtn = false;
                            WEBSERVICE.createAlert(2, "User Register Successfully", 3);
                            clearAll();
                            $location.path('/login');
                        }
                        else {
                            WEBSERVICE.createAlert(1, "User Already Exits", 3);
                        }
                    });
                } else {
                    WEBSERVICE.createAlert(1, "Please fill all mandatory details", 3);
                }
            } else {
                if (vm.user.uName && vm.user.pwd) {
                    WEBSERVICE.validatelogin(vm.user, function (result) {
                        if (result && result.response.code === 2000) {
                            STORAGE.setStorage("access_token", result.response.data.token);
                            $location.path('/email');
                           // location.reload();
                        }
                        else {
                            WEBSERVICE.createAlert(1, "Invalid username and password", 3);
                            STORAGE.deleteStorage("access_token");
                        }
                    });
                } else {
                    WEBSERVICE.createAlert(1, "Please fill all mandatory details", 3);
                }
            }
        }

        function signup()
        {
            vm.issignup = true;
            vm.signupbtn = false;
            vm.loginbtn = true;
        }

        function logAgn()
        {
            vm.issignup = false;
            vm.signupbtn = true;
            vm.loginbtn = false;
        }

        function clearAll()
        {
            vm.user = {
                uName: "",
                pwd: "",
                email:""
            };
        }
    }
    else
    {
        $location.path('/email');
    }

};
app.controller('LoginCtrl', ['$scope','$location','Utils', 'WebService', '$interval', LoginCtrl]);
