'use strict';

angular.module('security').factory('SecurityFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(MESSAGE_PATH + '/:path', {}, {
            getSecurities: {
                params: {path: 'getSecurities', access_token: $cookies.get('access_token')},
                method: "GET",
                isArray: true
            }
        });
    }
]);
