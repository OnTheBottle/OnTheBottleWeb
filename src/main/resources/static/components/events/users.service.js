'use strict';

angular.module('usersService', ['ngResource', 'ngCookies']);

angular.module('usersService').factory('UserEventFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(USER_PATH + '/user/:path', {}, {
            getUsersInfo: {
                params: {path: 'getUsersInfo', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            }
        });
    }
]);