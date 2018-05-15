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
            self.eventId = $routeParams.id;
        }]
});

