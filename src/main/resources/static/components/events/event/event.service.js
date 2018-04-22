'use strict';

angular.
module('event').factory('EventFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/getEvent', {}, {
            getEvent: {method: "GET"},
            getEvents: {
                url: 'http://localhost:8083/getEvents',
                method: "GET",
                isArray: true
                },
            getPlaces: {
                url: 'http://localhost:8083/getPlaces',
                method: "GET",
                isArray: true
            }
        });
    }
]);
