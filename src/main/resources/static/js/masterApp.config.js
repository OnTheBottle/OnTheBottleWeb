'use strict';

angular.module('mainApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/news', {
                template: '<notify-friend-request-comp user-id="ctrl.userId"></notify-friend-request-comp>' +
                '<news-comp user-id="ctrl.userId"></news-comp>'
            }).when('/profile', {
                template: '<profile-info-comp user-id="ctrl.userId"></profile-info-comp>'
            }).when('/userInfo:id', {
                template: '<user-info-comp auth-id="ctrl.userId"></user-info-comp>'
            }).when('/friend', {
                template: '<view-friends-comp user-id="ctrl.userId"></view-friends-comp>'
            }).when('/event', {
                template: '<events-comp user-id="ctrl.userId"></events-comp>'
            }).when('/find', {
                template: '<find-comp user-id="ctrl.userId"></find-comp>'
            }).when('/find:whatToFind', {
                template: '<find-comp user-id="ctrl.userId"></find-comp>'
            }).when('/wall', {
                template: '<posts-comp></posts-comp>'
            }).when('/place', {
                template: '<view-place-comp>laceComp user-id="ctrl.userId></view-place-comp>'
            }).otherwise({
                redirectTo: '/news'
            })
        }
    ]);
