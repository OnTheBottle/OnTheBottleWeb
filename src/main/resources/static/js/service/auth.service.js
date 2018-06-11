'use strict';

angular.module('authService', ['ngResource', 'ngCookies']);

angular.module('authService').factory('AuthService', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(USER_PATH + '/auth/verify', {}, {
            verify: {
                params: {
                    access_token: $cookies.get('access_token')
                },
                method: "POST",
                isArray: false
            }
        });
    }
]);