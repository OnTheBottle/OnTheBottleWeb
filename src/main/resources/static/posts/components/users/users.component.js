'use strict';

angular.module('users').
    component('users', {
    templateUrl: 'components/users/users.template.html',
    controller: ['$routeParams', 'UserFactory',
        function UserController($routeParams, UserFactory ) {
            this.users = UserFactory.getUsers();
            this.orderProp = 'name';
        }]
});