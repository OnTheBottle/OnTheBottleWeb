'use strict';

angular.module('eventsApp').component('eventsComp', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['EventFactory', '$scope', '$window',
        function UserController(EventFactory, $scope, $window) {
            var self = this;
            self.options = {allEvents: 'true', activeEvents: 'true', ownerEvents: false};
            self.today = new Date();
            self.orderProp = 'startTime';
            self.isEvents = false;

            var eventsCount = 3;
            var eventsPage = 0;

            self.$onInit = function () {
                self.util.getEvents();
            };

            self.util = {
                getEvents: function () {
                    eventsPage = 0;
                    EventFactory.getEvents(
                        {options: self.options, eventsPage: eventsPage},
                        function (data) {
                            if (data[0] !== undefined) {
                                self.formatDate(data);
                                self.events = data;
                                self.isEvents = self.events.length % eventsCount === 0;
                            } else {
                                self.isEvents = false;
                            }
                        }, function (errResponse) {
                            if (errResponse.data === 'Non-valid token') {
                                $window.location.href = '/auth.html';
                            } else {
                                console.error('Error while read events');
                            }
                        });
                },
                getMoreEvents: function () {
                    eventsPage += 1;
                    EventFactory.getEvents(
                        {options: self.options, eventsPage: eventsPage},
                        function (data) {
                            if (data[0] !== undefined) {
                                self.formatDate(data);
                                data.forEach(function (item) {
                                    self.events[self.events.length] = item;
                                });
                                self.isEvents = self.events.length % eventsCount === 0;
                            } else {
                                self.isEvents = false;
                            }
                        }, function (errResponse) {
                            if (errResponse.data === 'Non-valid token') {
                                $window.location.href = '/auth.html';
                            } else {
                                console.error('Error while read events');
                            }
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
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while creating Event');
                        }
                    });
                },
                resetEvent: function () {
                    $scope.createEventForm.$setUntouched();
                    $scope.createEventForm.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                }
            };

            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = '/auth.html';
                } else {
                    console.error('Error while read places');
                }
            });

            self.formatDate = function (events) {
                events.forEach(function (item) {
                    item.startTime = new Date(item.startTime.replace(' ', 'T') + "Z");
                    item.startTimeTemp = new Date(item.startTime).setHours(0, 0, 0, 0);
                });
            };
        }]
});