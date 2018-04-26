'use strict';

angular.module('security').factory('SecurityFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/getSecurities', {}, {
            getSecurities: {

                method: "GET",
                isArray: true
            }
        });
    }
]);
