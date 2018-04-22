'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controller: ['$routeParams', 'EventFactory',
        function UserController($routeParams, EventFactory) {
            var self = this;
            self.userId = $routeParams.userId;
            this.orderProp = 'date'; //TODO понять принцип сортировки
            self.events = EventFactory.getEvents({user_Id: this.userId});
            self.places = EventFactory.getPlaces();

            console.log(self.places);
        }]
});

