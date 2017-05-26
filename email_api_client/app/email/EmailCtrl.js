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

    if (STORAGE.getStorage("email_auth_token") && STORAGE.getStorage("email_auth_token") != "") {
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
            STORAGE.deleteStorage("email_auth_token");
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
        STORAGE.deleteStorage("email_auth_token");
        $location.path('/login');
        //location.reload();
    }

};
app.controller('EmailCtrl', ['$scope', '$location', 'Utils', 'WebService', '$interval', EmailCtrl]);
