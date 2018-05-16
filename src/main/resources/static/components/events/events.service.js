'use strict';

angular.module('eventsService', ['ngResource', 'ngCookies']);

angular.module('eventsService').factory('EventFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource('http://localhost:8083/:path', {}, {
            getPlaces: {
                params: {path: 'getPlaces', access_token: $cookies.get('access_token')},
                method: "GET",
                isArray: true
            },
            getEvents: {
                params: {path: 'getEvents', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            },
            createEvent: {
                params: {path: 'createEvent', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            joinEvent: {
                params: {path: 'joinEvent', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            leaveEvent: {
                params: {path: 'leaveEvent', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            updateEvent: {
                params: {path: 'updateEvent', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            closeEvent: {
                params: {path: 'closeEvent', access_token: $cookies.get('access_token')},
                method: "POST"
            }
            ,
            getUsersInfo: {
                url: "http://localhost:8081/user/getUsersInfo",
                params: {access_token: $cookies.get('access_token')},
                method: "POST"
            }
        });
    }
]);