'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const INDEX_FILE = 'test_news_index.html';

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
