'use strict';

const USER_PATH = location.protocol + '//' + location.hostname + ':8081';
const INDEX_FILE = 'master.html';

var userId = '';
var token = '';

(function () {
    angular.module(
        'mainApp', [
            'authApp',
            'registrationApp',
            'ngCookies'
        ])
        .controller('MainController', MainController);

    angular.module('mainApp')
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        }]);

    function MainController($cookies, $http, $window) {
        var token = $cookies.get('access_token');

        if(!token){
            return;
        }

        $http({
            method: "POST",
            url: USER_PATH + "/auth/verify",
            params: {'access_token': token}
        }).then(function mySuccess(response) {
            if (response.data === true) {
                $window.location.href = INDEX_FILE;
            } else {
                $cookies.remove('access_token');
            }
        }, function myError(response) {
            console.log('error Auth: ');
        });
    }
})();
