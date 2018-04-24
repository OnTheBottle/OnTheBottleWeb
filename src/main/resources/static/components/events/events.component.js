'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controller: ['$routeParams', '$resource',
        function UserController($routeParams, EventFactory, $resource) {
            var self = this;
            self.userId = $routeParams.userId;
            this.orderProp = 'date'; //TODO понять принцип сортировки
            self.events = getAllEvents();
            self.places = getPlaces();

            self.submit = submit;

            function submit() {
                angular.element('#myModal').modal('hide');
                EventFactory.createEvent({
                    id: null,
                    title: self.title,
                    text: self.text,
                    startTime: self.startTime,
                    endTime: self.endTime,
                    place: self.place,
                    owner: self.userId
                }, function (data) {
                    //self.eventCreateForm.reset(); //TODO понять как очистить форму
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                    self.events = getEvents({user_Id: self.userId});
                }, function (errResponse) {
                    console.error('Error while creating Event');
                });
            }

            function getPlaces() {
                return $resource('http://localhost:8083/getPlaces',
                    {charge: {method: 'GET', isArray: true}}).query(function (data) {
                    self.place = data[0].id;
                    return data;
                });
            }

            function getEvents(user_Id) {
                return $resource('http://localhost:8083/getEvents', user_Id,
                    {charge: {method: 'GET', isArray: true}}).query(function (data) {
                    return data;
                });
            }
        }]
});

