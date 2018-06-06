'use strict';

angular.module('eventsService', ['ngResource', 'ngCookies']);

angular.module('eventsService').factory('EventFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(MESSAGE_PATH + '/:path', {}, {
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
            getEvent: {
                params: {path: 'getEvent', access_token: $cookies.get('access_token')},
                method: "POST"
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
            },
            searchEvents: {
                params: {path: 'searchEvents', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            },
            getAllUsers: {
                params: {path: 'getAllUsers', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            getEventsFromUser: {
                params: {path: 'getEventsFromUser', access_token: $cookies.get('access_token')},
                method: "POST",
                isArray: true
            }
        });
    }
]);