'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';
const AUTH_HTML = 'auth.html';

(function () {
    'use strict';

    angular.module(
        'mainApp', [
            'ngRoute',
            'ngResource',
            'ngCookies',
            'ngAnimate',
            'findApp',
            'addFriendsApp',
            'linkFriendsApp',
            'friendApp',
            'viewFriendsApp',
            'profileInfoApp',
            'userInfoApp',
            'newsApp',
            'quitApp',
            'footerApp',
            'eventsApp'
        ])
        .controller('MainController', mainController);

    function mainController($cookies, $window, $http) {

        this.userId = '';

        var tokenJwt = $cookies.get('access_token');

        if (!tokenJwt) {
            $window.location.href = AUTH_HTML;
        }

        $http({
            method: "POST",
            url: USER_PATH + "/auth/verify",
            params: {'access_token': tokenJwt}
        }).then(function mySuccess(response) {
            if (response.data !== true) {
                $cookies.remove('access_token');
                $window.location.href = AUTH_HTML;
            }
        }, function myError(response) {
            console.log('error Auth: ', response.statusText);
        });

        var token = parseJwt(tokenJwt);
        this.userId = token.userId;

        function parseJwt(tokenJwt) {
            var base64Url = tokenJwt.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }
    }


})();
