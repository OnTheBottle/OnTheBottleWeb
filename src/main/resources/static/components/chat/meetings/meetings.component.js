(function () {
    'use strict';
    angular.module('meetingsChatApp')
        .component('meetingsChatComp', {
            templateUrl: 'components/chat/meetings/meetings.component.html',
            controller: ['$http', '$localStorage', meetingsController],
            controllerAs: 'model',
            bindings: {
                authId: '=',
                selectRoom: '<'
            }
        });

    function meetingsController($http, $localStorage) {

        var model = this;

        model.$onInit = function () {
            model.interlocutors = $localStorage.friends;
        }

    }
})();
