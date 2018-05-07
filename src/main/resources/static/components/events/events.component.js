'use strict';

angular.module('eventsApp').component('eventsComp', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['EventFactory', '$scope',
        function UserController(EventFactory, $scope) {
            var self = this;
            self.options = {allEvents: 'true', activeEvents: true, passedEvents: false};
            self.today = new Date();

            self.util = {
                getEvents: function () {
                    EventFactory.getEvents(
                        {userId: self.userId, options: self.options},
                        function (data) {
                            self.formatDate(data);
                            self.setUserId(data);
                            self.events = data;
                        }, function (errResponse) {
                            console.error('Error while read events');
                        });
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
                    $scope.createEventForm.$setUntouched();
                    $scope.createEventForm.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                },
                resetEventUpdate: function () {
                    self.isUpdate = false;
                    $scope.eventInfoForm.$setUntouched();
                    $scope.eventInfoForm.$setPristine();
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
                },
                updateEvent: function () {
                    self.isUpdate = false;
                    EventFactory.updateEvent({
                        id: self.eventInfo.id,
                        title: self.eventInfo.title,
                        text: self.eventInfo.text,
                        startTime: self.eventInfo.startTime,
                        endTime: self.eventInfo.endTime,
                        place: self.eventInfo.place.id
                    }, function (data) {
                        self.util.getEvents();
                    }, function (errResponse) {
                        console.error('Error while update Event');
                    });
                }
            };

            self.setEventInfo = function (event) {
                self.isUpdate = false;
                self.eventInfo = event;
                self.isOwner = self.userId === self.eventInfo.owner.id;
            };

            self.util.getEvents();
            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                console.error('Error while read places');
            });

            self.formatDate = function (events) {
                events.forEach(function (item) {
                    item.startTime = new Date(item.startTime.replace(' ', 'T') + "Z");
                    item.endTime = new Date(item.endTime.replace(' ', 'T') + "Z");
                });
            };

            self.setUserId = function (events) {
                events.forEach(function (event) {
                    event.users.forEach(function (item) {
                        event.usersId += item.id;
                    });
                });
            };
        }]
});
