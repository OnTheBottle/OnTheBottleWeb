'use strict';

angular.module('userService', ['ngResource', 'ngCookies']);

angular.module('userService').factory('UserService', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(USER_PATH + '/user/:path', {}, {
            getUser: {
                params: {
                    path: 'getUser',
                    userId: '@userId',
                    access_token: $cookies.get('access_token')
                },
                method: "POST",
                isArray: false
            },
            getUsers: {
                params: {
                    path: 'getUsers',
                    usersId: '@usersId',
                    access_token: $cookies.get('access_token')
                },
                method: "POST",
                isArray: true
            },
            getUsersInfo: {
                params: {
                    path: 'getUsersInfo',
                    access_token: $cookies.get('access_token')
                },
                method: "POST",
                isArray: true
            }
        });
    }
]);