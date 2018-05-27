'use strict';



const USER_PATH = location.protocol + '//' + location.hostname + ':8081';
const PLACE_PATH = location.protocol + '//' + location.hostname + ':8082';
const MESSAGE_PATH = location.protocol + '//' + location.hostname + ':8083';
//const USER_PATH = 'http://127.0.0.1:8081';
// const PLACE_PATH = 'http://127.0.0.1:8082';
// const MESSAGE_PATH = 'http://127.0.0.1:8083';
const AUTH_HTML = 'auth.html';
const DEFAULT_AVATAR_PATH = 'images/userspictures/default-avatar.jpeg';

(function () {
    'use strict';

    angular.module(
        'mainApp', [
            'ngRoute',
            'ngResource',
            'ngCookies',
            'ngAnimate',
            'ngStorage',
            'findApp',
            'addFriendsApp',
            'linkFriendsApp',
            'friendApp',
            'viewFriendsApp',
            'notifyFriendRequestApp',
            'profileInfoApp',
            'userInfoApp',
            'newsApp',
            'chatApp',
            'quitApp',
            'footerApp',
            'eventsApp',
            'postsApp',
            'viewPlaceApp'
        ])
        .service('idStorage', function () {
            var _id = null;
            return {
                setId: function (id) {
                    _id = id;
                },
                getId: function () {
                    return _id;
                }
            }
        })
        .controller('MainController', mainController);

    function mainController($cookies, $window, $http, $localStorage, idStorage, $rootScope) {

        var cache = $localStorage;

        var tokenJwt = $cookies.get('access_token');
        if (!tokenJwt) {
            $window.location.href = AUTH_HTML;
        }

        this.authId = null;
        cache.tokenJwt = tokenJwt;
        cache.users = [];
        cache.places = [];

        $http({
            method: "POST",
            url: USER_PATH + "/auth/verify",
            params: {'access_token': tokenJwt}
        }).then(function mySuccess(response) {
            if (response.data !== true) {
                $cookies.remove('access_token');
                $window.location.href = AUTH_HTML;
            }
            getFriends();
        }, function myError(response) {
            console.log('error Auth: ', response.statusText);
        });

        var token = parseJwt(tokenJwt);
        cache.authId = token.userId;
        this.authId = cache.authId;
        idStorage.setId(cache.authId);

        // var socket = new SockJS(MESSAGE_PATH + '/ws');
        // var stompClient = Stomp.over(socket);
        // stompClient.reconnect_delay = 5000;
        // stompClient.debug = null;
        //$rootScope.webSocket = new SockJS(MESSAGE_PATH + '/ws');



        function parseJwt(tokenJwt) {
            var base64Url = tokenJwt.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        }

        function getFriends() {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_confirmed_friends",
                params: {
                    'access_token': cache.tokenJwt,
                    'userId': cache.authId
                }
            }).then(function mySuccess(response) {
                if (response.data !== null) {
                    cache.friends = response.data;
                }
                //console.log('getFriends cache.friends: ', cache.friends);
            }, function myError(response) {
                console.log('error getFriends: ', response.statusText);
            });
        }
    }
})();
