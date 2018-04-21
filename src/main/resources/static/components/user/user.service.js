'use strict';

angular.module('userOk').factory('UserFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/getUser', {}, {
            getUser: {method: "GET"},
            getUsers: {
                url: 'http://localhost:8083/getUsers',
                method: "GET",
                isArray: true
            }
        });
    }
]);
