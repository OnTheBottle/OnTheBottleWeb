'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controller: ['$routeParams', 'UserFactory', '$scope',
        function UserController($routeParams, $scope) { //TODO: Почему такое название
            var self = this;
            self.userId = $routeParams.userId;
            this.user = UserFactory.getUser({user_Id: this.userId}); //TODO нужен ли мне юзер?
            this.orderProp = 'date'; //TODO: ?
        }]
});

