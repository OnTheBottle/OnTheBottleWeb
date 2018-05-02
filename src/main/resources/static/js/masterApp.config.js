'use strict';

angular.module('mainApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/news', {
                template: '<news-comp></news-comp>'
            }).when('/profile', {
                template: '<profile-info-comp></profile-info-comp>'
            }).when('/friend', {
                template: '<view-friends-comp></view-friends-comp>'
            }).when('/event', {
                template: '<events-comp></events-comp>'
            }).when('/find', {
                template: '<find-comp></find-comp>'
            }).when('/find', {
                template: '<find-comp></find-comp>'
            }).otherwise({
                redirectTo: '/news'
            })
        }
    ]);