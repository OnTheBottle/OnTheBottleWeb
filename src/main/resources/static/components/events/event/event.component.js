'use strict';

angular.module('event').component('eventComp', {
    templateUrl: 'components/events/event/event.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '=',
        event: '<',
        getEvents: '='
    },
    controller: ['EventFactory', '$window',
        function UserController(EventFactory, $window) {
            var self = this;
            self.today = new Date().setHours(0,0,0,0);

            self.control = function () {
                if (self.event.member) {
                    EventFactory.leaveEvent({
                        id: self.event.id
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while leave Event');
                        }
                    });
                } else {
                    EventFactory.joinEvent({
                        id: self.event.id
                    }, function (data) {
                        self.getEvents();
                    }, function (errResponse) {
                        angular.element('#myModalClosed').modal('show');
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while leave Event');
                        }
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


