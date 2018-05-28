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
            self.sortType = 'startTime';
            self.isMoreEvents = false;

            var eventsCount = 3;
            var eventsPage = 0;
            var isSearch = false;

            self.$onInit = function () {
                self.util.getEvents(self.sortType);
            };

            self.util = {
                getEvents: function (sortType) {
                    self.search = '';
                    self.sortType = sortType || self.sortType;
                    isSearch = false;
                    eventsPage = 0;
                    EventFactory.getEvents(
                        {options: self.options, eventsPage: eventsPage, sortType: self.sortType},
                        function (data) {
                            if (data[0] !== undefined) {
                                formatDate(data);
                                self.events = data;
                                self.isMoreEvents = self.events.length % eventsCount === 0;
                            } else {
                                self.isMoreEvents = false;
                            }
                        }, function (errResponse) {
                            errResponseFunction(errResponse, 'Error while read events');
                        });
                },
                getMoreEvents: function () {
                    eventsPage += 1;
                    if (isSearch) {
                        EventFactory.searchEvents(
                            {searchQuery: self.search, eventsPage: eventsPage},
                            function (data) {
                                if (data[0] !== undefined) {
                                    formatDate(data);
                                    data.forEach(function (item) {
                                        self.events.push(item);
                                    });
                                    self.isMoreEvents = self.events.length % eventsCount === 0;
                                } else {
                                    self.isMoreEvents = false;
                                }
                            }, function (errResponse) {
                                errResponseFunction(errResponse, 'Error while search events');
                            });
                    } else {
                        EventFactory.getEvents(
                            {options: self.options, eventsPage: eventsPage, sortType: self.sortType},
                            function (data) {
                                if (data[0] !== undefined) {
                                    formatDate(data);
                                    data.forEach(function (item) {
                                        self.events.push(item);
                                    });
                                    self.isMoreEvents = self.events.length % eventsCount === 0;
                                } else {
                                    self.isMoreEvents = false;
                                }
                            }, function (errResponse) {
                                errResponseFunction(errResponse, 'Error while read events');
                            });
                    }
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
                    }, function () {
                        self.util.resetEvent();
                        self.util.getEvents();
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while creating Event');
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
                search: function () {
                    if (self.search !== undefined) {
                        eventsPage = 0;
                        isSearch = true;
                        EventFactory.searchEvents(
                            {searchQuery: self.search, eventsPage: eventsPage},
                            function (data) {
                                if (data[0] !== undefined) {
                                    formatDate(data);
                                    self.events = data;
                                    self.isMoreEvents = self.events.length % eventsCount === 0;
                                } else {
                                    self.events = [];
                                    self.isMoreEvents = false;
                                }
                            }, function (errResponse) {
                                errResponseFunction(errResponse, 'Error while search events');
                            });
                    }
                }
            };

            self.keyPressed = function (keyEvent) {
                if (keyEvent.keyCode === 13) {
                    console.log('keyEvent', keyEvent);
                }
            };

            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                errResponseFunction(errResponse, 'Error while read places');
            });

            var formatDate = function (events) {
                events.forEach(function (item) {
                    item.startTime = new Date(item.startTime.replace(' ', 'T') + "Z");
                    item.startTimeTemp = new Date(item.startTime).setHours(0, 0, 0, 0);
                });
            };

            function errResponseFunction (errResponse, messageError) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = AUTH_HTML;
                } else {
                    console.error(messageError);
                }
            }
        }]
});