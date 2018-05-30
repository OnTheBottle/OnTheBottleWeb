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
        model.isUnreadMessage = false;
        var cache = $localStorage;

        model.$onInit = function () {
            if (cache.interlocutorId) {
                if (cache.interlocutorId === model.interlocutor.id) {
                    model.selected = true;
                    model.isUnreadMessage = false;
                } else {
                    model.selected = false;
                    //console.log('interlocutorController $onInit OK');
                    getUnreadCount(model.interlocutor.id);
                }
            }
        };

/*
        model.$onChanges = function () {
            console.log('interlocutorController $onChanges OK');
            model.$onInit();
        };
*/

        function getUnreadCount(interlocutorId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/chat/channel/getUnreadCount",
                params: {
                    'token': cache.tokenJwt,
                    'interlocutorId': interlocutorId
                }
            }).then(function mySuccess(response) {
                if (response.data > 0) {
                    model.isUnreadMessage = true;
                    model.unreadCount = response.data;
                }else {
                    model.isUnreadMessage = false;
                    model.unreadCount = 0;
                }
                //console.log('getUnreadCount model.unreadCount: ', model.unreadCount);
            }, function myError(response) {
                console.log('error getUnreadCount: ', response.statusText);
            });
        };

    }
})();
