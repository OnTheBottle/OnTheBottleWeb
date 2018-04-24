'use strict';

angular.module('event').factory('EventFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/:path', {}, {
            getPlaces: {
                params: {path: 'getPlaces'},
                method: "GET",
                isArray: true
            },
            getEvents: {
                params: {path: 'getEvents'},
                method: "POST",
                isArray: true
            },
            createEvent: {
                params: {path: 'createEvent'},
                method: "POST"
            }
        });
    }
]);
