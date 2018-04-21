'use strict';

angular.module('myApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/home', {
                templateUrl: 'components/home/home.html',
                controller: 'mainCtrl'
            }).when('/users', {
                template: '<users></users>'
            }).when('/users/:userId', {
                template: '<posts></posts>'
            }).when('/posts', {
                template: '<posts></posts>'
            }).otherwise({
                redirectTo: '/home'
            })
        }
    ]);