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
            //self.userId = $routeParams.userId;
            self.options = {allEvents: 'true', activeEvents: false, passedEvents: false};
            self.today = new Date();

            self.event = {
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
                        self.event.resetEvent();
                        self.event.getEvents();
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
                showEventInfo: function (event) {
                    self.eventId = event.id;
                    self.eventTitle = event.title;
                    self.eventInfo = event.text;
                    self.eventStartTime = event.startTime;
                    self.eventEndTime = event.endTime;
                    self.eventPlaceTitle = event.place.title;
                    self.eventPlaceAvatar = event.place.avatar;
                    checkMember(event.users);
                    self.isJoin = !(self.isMember && event.isActive) && event.isActive;
                    self.isLeave = (self.isMember && event.isActive) && event.isActive;
                },
                joinEvent: function () {
                    EventFactory.joinEvent({
                        eventId: self.eventId,
                        userId: self.userId
                    }, function (data) {
                        self.event.getEvents();
                        self.isJoin = false;
                        self.isLeave = true;
                    }, function (errResponse) {
                        console.error('Error while join Event');
                    });
                },
                leaveEvent: function () {
                    EventFactory.leaveEvent({
                        eventId: self.eventId,
                        userId: self.userId
                    }, function (data) {
                        self.event.getEvents();
                        self.isLeave = false;
                        self.isJoin = true;
                    }, function (errResponse) {
                        console.error('Error while leave Event');
                    });
                }
            };

            self.event.getEvents();
            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                console.error('Error while read places');
            });

            function checkMember(users) {
                var BreakException = {};
                self.isMember = false;
                try {
                    users.forEach(function (item) {
                        if (item.id === self.userId) {
                            self.isMember = true;
                            throw BreakException;
                        }
                    });
                } catch (e) {
                    if (e !== BreakException) throw e;
                }
            }
        }]
});

angular.module('eventsApp').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
