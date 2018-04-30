'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';


(function () {

    var userId = '57c49497-918c-4ece-81d9-629d11c5ad6b';

    angular.module('mainApp', ['ngRoute', 'ngCookies'])
        .controller('MainController', MainController);

    function MainController($cookies) {
        this.userId = userId;

        var tokenJwt = $cookies.get('access_token');
        console.log('tokenJWT: ', tokenJwt);

        var token;

        if (!!tokenJwt) token = parseJwt(tokenJwt);
        console.log('token: ', token);


        function parseJwt(tokenJwt) {
            var base64Url = tokenJwt.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }


    }
})();
