'use strict';

angular.module('userOk').factory('UserFactory', ['$resource','$cookies',
    function ($resource,$cookies) {
        return $resource('http://localhost:8081/getUser', {}, {
            getUsr: {
                method: "GET"
            },
            getUsers: {
                url: 'http://localhost:8081/:path',
                params:{path:'getUsers'},
                method: "POST",
                isArray: true
            },
            addUser: {
                url: 'http://localhost:8083/:path',
                params: {path: 'addUser'},
                method: "POST"
            },
            getSmallInfoAboutUsers: {
                url: USER_PATH + '/user/getSmallInfoAboutUsers',
                params: {access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            }
        });
    }
]);
