'use strict';

angular.module('userOk').factory('UserFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(USER_PATH + '/user/:path', {}, {
            getSmallInfo: {
                params: {path: 'getSmallInfo', access_token: $cookies.get('access_token'), userId: '@userId'},
                method: "GET"
            },
            getUsersInfo: {
                params: {path: 'getUsersInfo', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            },
            getUser: {
                params: {path: 'getUser', access_token: $cookies.get('access_token')},
                method: "GET"
            }
        });
    }
]);
