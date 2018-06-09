'use strict';

angular.module('eventsApp').component('eventsComp', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['EventFactory', 'PlaceFactory', '$scope', '$window', '$q', '$localStorage',
        function UserController(EventFactory, PlaceFactory, $scope, $window, $q, $localStorage) {
            var self = this;
            self.options = {allEvents: 'true', activeEvents: 'true', ownerEvents: false};
            self.today = new Date();
            self.sortType = 'startTime';
            self.isMoreEvents = false;
            self.scroll = true;
            self.places = [];
            var process = $q.defer();

            var eventsCount = 7;
            var eventsPage = 0;
            var isSearch = false;

            self.$onInit = function () {
                self.wait = false;
                getPlaces();
                process.promise
                    .then(function () {
                        self.util.getEvents(self.sortType);
                    });
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
                                setPlaceInfo(data);
                                self.events = data;
                                self.scroll = self.events.length % eventsCount === 0;
                            } else {
                                self.scroll = false;
                            }
                        }, function (errResponse) {
                            errResponseFunction(errResponse, 'Error while read events');
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
                        owner: self.userId,
                        addPost: self.isAddPost
                    }, function () {
                        self.notification('Событие ' + self.title + ' созданно!');
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
                        if (self.search.replace(' ', '').length === 0) return;
                        eventsPage = 0;
                        isSearch = true;
                        EventFactory.searchEvents(
                            {searchQuery: self.search, eventsPage: eventsPage},
                            function (data) {
                                if (data[0] !== undefined) {
                                    formatDate(data);
                                    self.events = data;
                                    self.scroll = self.events.length % eventsCount === 0;
                                } else {
                                    self.events = [];
                                    self.scroll = false;
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


            self.notification = function (text) {
                self.notificationText = text;
                angular.element('#notification').modal('show');
                $window.setTimeout(function () {
                    angular.element('#notification').modal('hide');
                }, 2000);
            };

            function getPlaces() {
                self.places = PlaceFactory.getPlacesInfo([], function (data) {
                    self.place = data[0].id;
                    setPlacesToCache(data);
                }, function (errResponse) {
                    errResponseFunction(errResponse, 'Error while read places');
                });
            }

            function formatDate(events) {
                events.forEach(function (item) {
                    item.startTime = new Date(item.startTime.replace(' ', 'T') + "Z");
                    item.startTimeTemp = new Date(item.startTime).setHours(0, 0, 0, 0);
                });
            }

            function errResponseFunction(errResponse, messageError) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = AUTH_HTML;
                } else {
                    console.error(messageError);
                }
            }

            function setPlacesToCache(input) {
                input.forEach(function (item) {
                    $localStorage.places.addPlace(item);
                });
                process.resolve();
            }

            function setPlaceInfo(events) {
                events.forEach(function (event) {
                    event.place = $localStorage.places.getPlace(event.place.id);
                });
            }

            $(window).scroll(function () {
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    if (self.scroll === true) {
                        self.scroll = false;
                        self.wait = true;
                        eventsPage += 1;

                        if (isSearch) {
                            EventFactory.searchEvents(
                                {searchQuery: self.search, eventsPage: eventsPage},
                                function (data) {
                                    self.wait = false;
                                    if (data[0] !== undefined) {
                                        formatDate(data);
                                        data.forEach(function (item) {
                                            self.events.push(item);
                                        });
                                        self.scroll = self.events.length % eventsCount === 0;
                                    } else {
                                        self.scroll = false;
                                    }
                                }, function (errResponse) {
                                    errResponseFunction(errResponse, 'Error while search events');
                                });
                        } else {
                            EventFactory.getEvents(
                                {options: self.options, eventsPage: eventsPage, sortType: self.sortType},
                                function (data) {
                                    if (data[0] !== undefined) {
                                        self.wait = false;
                                        formatDate(data);
                                        data.forEach(function (item) {
                                            self.events.push(item);
                                        });
                                        self.scroll = self.events.length % eventsCount === 0;
                                    } else {
                                        self.scroll = false;
                                    }
                                }, function (errResponse) {
                                    errResponseFunction(errResponse, 'Error while read events');
                                });
                        }
                    }

                }
            });
        }

    ]
});