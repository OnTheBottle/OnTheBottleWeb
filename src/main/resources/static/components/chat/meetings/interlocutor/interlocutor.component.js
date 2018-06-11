(function () {
    'use strict';
    angular.module('interlocutorChatApp')
        .component('interlocutorChatComp', {
            templateUrl: 'components/chat/meetings/interlocutor/interlocutor.component.html',
            controller: ['$http', '$localStorage', '$interval', interlocutorController],
            controllerAs: 'model',
            bindings: {
                authId: '=',
                interlocutor: '=',
                selectRoom: '<',
                selectedInterlocutor: '<'
            }
        });

    function interlocutorController($http, $localStorage, $interval) {

        var model = this;
        model.isUnreadMessage = false;
        var cache = $localStorage;


        // $interval(function () {
        //     model.chatNotifier = cache.notifiers.chat.newMessageCounter;
        // }, 2000);

        model.$onInit = function () {

            //console.log('interlocutor: ', model.interlocutor.id);
            // console.log('selectedInterlocutor: ', model.selectedInterlocutor);


                if (model.selectedInterlocutor === model.interlocutor.id) {
                    model.selected = true;
                    model.isUnreadMessage = false;
                } else {
                    model.selected = false;
                }

/*
            if (cache.interlocutorId) {
                if (cache.interlocutorId === model.interlocutor.id) {
                    model.selected = true;
                    model.isUnreadMessage = false;
                } else {
                    model.selected = false;
                }
            }

*/
            $interval(function () {
                var id = model.interlocutor.id;
                // console.log('interlocutorController $interval interlocutor.id: ', id);
                var channelId = cache.notifiers.chat.channels[id];
                // console.log('interlocutorController $interval channelId: ', channelId);
                var count = cache.notifiers.chat.newMessageCounterArray[channelId];
                // console.log('interlocutorController $interval count: ', count);
                model.chatNotifier = count;                //model.chatNotifier = cache.notifiers.chat.newMessageCounterArray[model.interlocutor.id];
                //console.log('interlocutorController $interval model.chatNotifier: ', model.chatNotifier);
            }, 2000);

        };


        model.$onChanges = function(){
            model.$onInit();
        }
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
                } else {
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
