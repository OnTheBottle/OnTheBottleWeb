(function () {
    'use strict';
    angular.module('interlocutorChatApp')
        .component('interlocutorChatComp', {
            templateUrl: 'components/chat/meetings/interlocutor/interlocutor.component.html',
            controller: ['$http', interlocutorController],
            controllerAs: 'model',
            bindings: {
                authId: '=',
                interlocutor: '=',
                selectRoom: '<'
            }
        });

    function interlocutorController($http) {

        var model = this;

        model.$onInit = function () {
            console.log('interlocutorController model.authId: ', model.authId);
            console.log('interlocutorController model.interlocutor: ', model.interlocutor);
        }

    }
})();
