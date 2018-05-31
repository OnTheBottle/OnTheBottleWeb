'use strict';


const USER_PATH = location.protocol + '//' + location.hostname + ':8081';
const PLACE_PATH = location.protocol + '//' + location.hostname + ':8082';
const MESSAGE_PATH = location.protocol + '//' + location.hostname + ':8083';
const AUTH_HTML = 'auth.html';
const DEFAULT_AVATAR_PATH = 'images/userspictures/default-avatar.jpeg';
const TIME_TO_CLEAR_USER_INFO = 30;

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
            //'addFriendsApp',
            'linkFriendsApp',
            'friendApp',
            'viewFriendsApp',
            'buttonFriendsApp',
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

        cache.users = {
            users: cache.users === undefined ? [] : cache.users.users,
            count: cache.users === undefined ? 0 : cache.users.count,
            addUser: function (user) {
                user.avatarUrl = user.avatarUrl || DEFAULT_AVATAR_PATH;
                if (this.count < 100) {
                    this.users[this.count] = user;
                    this.count++;
                } else {
                    this.count = 0;
                    this.users[this.count] = user;
                }
            },
            getUser: function (id) {
                var user = false;
                this.users.forEach(function (item) {
                    if (item.id === id) {
                        user = item;
                        return true;
                    }
                });
                return user;
            },
            resetUsers: function () {
                this.count = 0;
                this.users = [];
            }
        };

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

        cache.timeAddUsers = cache.timeAddUsers || new Date().valueOf();
        var timeClearUsers = cache.timeAddUsers + TIME_TO_CLEAR_USER_INFO * 60000;
        if (timeClearUsers - new Date().valueOf() <= 0) {
            cache.users.resetUsers();
            cache.timeAddUsers = new Date().valueOf();
            cache.friends.forEach(function (user) {
                cache.users.addUser(user);
            });
        }

        cache.places = cache.places || [];

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
