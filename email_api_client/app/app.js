/**
 * @namespace app
 * @description This file is used to redirect application state e.g. login, mailer etc.
 * @author Prathamesh Parab
 */
var app = angular.module("emailAPI", ["ngRoute"]);

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
