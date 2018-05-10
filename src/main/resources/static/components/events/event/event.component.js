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
                self.setEventInfo(self.event);
            };

            self.checkMember = function (users) {
                var isMember = false;
                users.forEach(function (item) {
                    if (item.id === self.userId) {
                        isMember = true;
                    }
                });
                return isMember;
            };

            self.control = function () {
                if (self.checkMember(self.event.users)) {
                    self.leaveEvent();
                } else {
                    EventFactory.joinEvent({
                        eventId: self.event.id,
                        userId: self.userId
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        angular.element('#myModalClosed').modal('show');
                    });
                }
            };

            self.leaveEvent = function () {
                if (self.event.users[0].id === self.event.owner.id) {
                    self.setEventInfo(self.event);
                    angular.element('#myModalClose').modal('show');
                } else {
                    EventFactory.leaveEvent({
                        eventId: self.event.id,
                        userId: self.userId
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        console.error('Error while leave Event');
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

