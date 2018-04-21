'use strict';

angular.module('messagesystem')
    .component('messagesystem', {
        templateUrl: '../components/messagesystem/messagesystem.template.html',
        controller: ['$routeParams', 'UserFactory',
            function UserController($routeParams, UserFactory ) {
                this.users = UserFactory.getUsers();
                this.orderProp = 'name';
            }]
    });