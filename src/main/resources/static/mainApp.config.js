'use strict';

angular.module('mainApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/start', {
                template: '<start></start>'
            }).when('/registration', {
                template: '<registration></registration>'
            }).when('/messagesystem', {
                template: '<messagesystem></messagesystem>'
            }).when('/messagesystem/:userId', {
                template: '<messagesystemuser></messagesystemuser>'
            }).otherwise({
                redirectTo: '/start'
            })
        }
    ]);