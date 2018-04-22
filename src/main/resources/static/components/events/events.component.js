'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controller: ['$routeParams', 'EventFactory', '$scope',
        function UserController($routeParams, $scope) {
            var self = this;
            self.userId = $routeParams.userId;
            this.orderProp = 'date';
            self.events = EventFactory.getEvents({user_Id: this.userId});

            console.log(self.events);
        }]
});

