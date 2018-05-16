'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', 'EventFactory',
        function UserController($routeParams, EventFactory) {
            var self = this;

            self.$onInit = function () {
                self.event = EventFactory.getEvent(
                    {eventId: $routeParams.id, userId: self.userId},
                    function (data) {
                        return data;
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while read event');
                        }
                    });
            };

        }]
});

