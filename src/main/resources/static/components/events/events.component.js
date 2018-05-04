'use strict';

angular.module('eventsApp').component('eventsComp', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', 'EventFactory', '$scope',
        function UserController($routeParams, EventFactory, $scope) {
            var self = this;
            self.options = {allEvents: 'true', activeEvents: true, passedEvents: false};
            self.today = new Date();

            self.util = {
                getEvents: function () {
                    self.events = EventFactory.getEvents({userId: self.userId, options: self.options});
                },
                createEvent: function () {
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
                        self.util.resetEvent();
                        self.util.getEvents();
                    }, function (errResponse) {
                        console.error('Error while creating Event');
                    });
                },
                resetEvent: function () {
                    angular.element('#myModal').modal('hide');
                    $scope.createEvent.$setUntouched();
                    $scope.createEvent.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                },
                joinEvent: function () {
                    EventFactory.joinEvent({
                        eventId: self.eventInfo.id,
                        userId: self.userId
                    }, function (data) {
                        self.util.getEvents();
                        self.eventInfo.isJoin = false;
                        self.eventInfo.isLeave = true;
                    }, function (errResponse) {
                        console.error('Error while join Event');
                    });
                },
                leaveEvent: function () {
                    EventFactory.leaveEvent({
                        eventId: self.eventInfo.id,
                        userId: self.userId
                    }, function (data) {
                        self.util.getEvents();
                        self.eventInfo.isLeave = false;
                        self.eventInfo.isJoin = true;
                    }, function (errResponse) {
                        console.error('Error while leave Event');
                    });
                }
            };

            self.setEventInfo = function (event) {
                self.eventInfo = event;
            };

            self.util.getEvents();
            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                console.error('Error while read places');
            });
        }]
});
