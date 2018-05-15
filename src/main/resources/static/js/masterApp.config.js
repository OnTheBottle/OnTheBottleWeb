'use strict';

angular.module('mainApp')
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/news', {
                template: '<notify-friend-request-comp user-id="ctrl.authId"></notify-friend-request-comp>' +
                '<news-comp auth-id="ctrl.authId"></news-comp>'
            }).when('/profile', {
                template: '<profile-info-comp user-id="ctrl.authId"></profile-info-comp>'
            }).when('/userInfo:id', {
                template: '<user-info-comp auth-id="ctrl.authId"></user-info-comp>'
            }).when('/friend', {
                template: '<view-friends-comp user-id="ctrl.authId"></view-friends-comp>'
            }).when('/event', {
                template: '<events-comp user-id="ctrl.authId"></events-comp>'
            }).when('/eventInfo/:id', {
                template: '<event-info-comp user-id="ctrl.authId"></event-info-comp>'
            }).when('/find', {
                template: '<find-comp user-id="ctrl.authId"></find-comp>'
            }).when('/find:whatToFind', {
                template: '<find-comp user-id="ctrl.authId"></find-comp>'
            }).when('/wall', {
                template: '<posts-comp></posts-comp>'
            }).when('/place', {
                template: '<view-place-comp user-id="ctrl.authId"></view-place-comp>'
            }).otherwise({
                redirectTo: '/news'
            })
        }
    ]);
