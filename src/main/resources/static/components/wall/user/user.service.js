'use strict';

angular.module('userOk').factory('UserFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8081/getUser', {}, {
            getUsr: {method: "GET"

            },
            getUsers: {
                url: 'http://localhost:8083/getUsers',
                method: "GET",
                isArray: true
            },
            addUser:{
                url:'http://localhost:8083/:path',
                params:{path:'addUser'},
                method: "POST"
            }
        });
    }
]);
