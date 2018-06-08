'use strict';

angular.module('placesService', ['ngResource', 'ngCookies']);

angular.module('placesService').factory('PlaceFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(PLACE_PATH + '/:path', {}, {
            getTypesPlace: {
                params: {path: 'getTypesPlace', access_token: $cookies.get('access_token')},
                method: "GET",
                isArray: true
            },
            createPlace: {
                params: {path: 'createPlace', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            getPlaces: {
                params: {path: 'getPlaces', access_token: $cookies.get('access_token')},
                method: "GET",
                isArray: true
            }
        });
    }
]);