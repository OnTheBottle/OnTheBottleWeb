(function () {
    'use strict';
    angular.module('interlocutorChatApp')
        .component('interlocutorChatComp', {
            templateUrl: 'components/chat/meetings/interlocutor/interlocutor.component.html',
            controller: ['$http', '$localStorage', interlocutorController],
            controllerAs: 'model',
            bindings: {
                authId: '=',
                interlocutor: '=',
                selectRoom: '<'
            }
        });

    function interlocutorController($http, $localStorage) {

        var model = this;
        var cache = $localStorage;

        model.$onInit = function () {
            if (cache.interlocutorId) {
                if (cache.interlocutorId === model.interlocutor.id) {
                    model.selected = true;
                } else model.selected = false;
            }
        };

        model.$onChanges = function () {
            model.$onInit();
        }

    }
})();
