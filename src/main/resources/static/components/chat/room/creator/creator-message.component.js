(function () {
    'use strict';
    angular.module('creatorChatApp')
        .component('creatorChatComp', {
            templateUrl: 'components/chat/room/creator/creator-message.component.html',
            controller: ['$http', creatorMessageController],
            controllerAs: 'model',
            bindings: {
                sendMessage: '<'
            }
        });

    function creatorMessageController($http) {

        var model = this;

        model.$onInit = function () {
        };

        model.onClick = function () {
            model.sendMessage(model.content);
            model.content = '';
        }
    }
})();
