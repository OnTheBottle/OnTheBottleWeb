'use strict';

angular.module('usersService', ['ngResource', 'ngCookies']);

angular.module('usersService').factory('UserEventFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource('http://localhost:8081/user/:path', {}, {
            getUsersInfo: {
                params: {path: 'getUsersInfo', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            }
        });
    }
]);