'use strict';

angular.module('event').component('eventComp', {
    templateUrl: 'components/events/event/event.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '=',
        event: '<',
        setEventInfo: '=',
        getEvents: '='
    },
    controller: ['EventFactory',
        function UserController(EventFactory) {
            var self = this;
            self.today = new Date();

            self.showEventInfo = function () {
                checkMember(self.event.users);
                self.event.isJoin = !(self.isMember && self.event.isActive) && self.event.isActive;
                self.event.isLeave = (self.isMember && self.event.isActive) && self.event.isActive;
                self.setEventInfo(self.event);
            };

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

            self.control = function () {
                var isMember = self.event.usersId.indexOf(self.userId) !== -1;
                if (isMember) {
                    EventFactory.leaveEvent({
                        eventId: self.event.id,
                        userId: self.userId
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        console.error('Error while leave Event');
                    });
                } else {
                    EventFactory.joinEvent({
                        eventId: self.event.id,
                        userId: self.userId
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        console.error('Error while join Event');
                    });
                }
            };
        }]
});

angular.module('event').filter('cut', function () {
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

