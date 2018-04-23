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
            // self.selectedOption = self.places[0]; //TODO сделать выбором по умолчанию

            self.title = '';
            self.text = '';
            self.startTime = '';
            self.endTime = '';
            self.place = '';

            self.submit = submit;

            function submit() {
                console.log(self.title);
                console.log(self.text);
                console.log(self.startTime);
                console.log(self.endTime);
                console.log(self.place);


                /*EventFactory.createEvent({
                    id: null,
                    title: self.event.title,
                    text: self.event.text,
                    startTime: self.event.startTime,
                    endTime: self.event.endTime,
                    place: self.event.place,
                    owner: self.event.owner
                }, function (data) {
                    getEvents();
                }, function (errResponse) {
                    console.error('Error while creating Event');
                });*/
            }

            function getEvents() {
                self.events = EventFactory.getEvents({user_Id: self.userId});
            }
        }]
});

