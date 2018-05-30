(function () {
    'use strict';
    angular.module('messageChatApp')
        .component('messageChatComp', {
            templateUrl: 'components/chat/room/message/message-room.component.html',
            controller: ['$http', '$localStorage', messageController],
            controllerAs: 'model',
            bindings: {
                message: '='
            }
        });

    function messageController($http, $localStorage) {

        var model = this;
        var cache = $localStorage;
        model.sender = {};

        model.$onInit = function () {
            //console.log('model.message',model.message);
            var isFind = false;
            model.authId = cache.authUser.id;

            if (model.message.senderId === cache.authUser.id) {
                model.sender.avatarUrl = cache.authUser.avatarUrl;
                model.sender.name = cache.authUser.name + ' ' + cache.authUser.surname;
                isFind =true;
            } else {
                for (var i = 0, len = cache.friends.length; i < len; i++) {
                    if (model.message.senderId === cache.friends[i].id) {
                        model.sender.avatarUrl = cache.friends[i].avatarUrl;
                        model.sender.name = cache.friends[i].name + ' ' + cache.friends[i].surname;
                        isFind = true;
                        break;
                    }
                }
            }
            if (!isFind){
                model.getUser(model.message.senderId);
            }
            if (!model.sender.avatarUrl){
                model.sender.avatarUrl = DEFAULT_AVATAR_PATH;
            }
            //console.log('avatar path:', model.sender.avatarUrl);

        };

        model.getUser = function (id) {
            $http({
                method: "POST",
                url: USER_PATH + "/user/get_by_id",
                params: {'userId': id}
            }).then(function mySuccess(response) {
                model.sender.name = response.data.name + ' ' + response.data.surname;
                model.sender.avatarUrl = response.data.avatarUrl;
                // if (!model.sender.avatarUrl){
                //     model.sender.avatarUrl = DEFAULT_AVATAR_PATH;
                // }
            }, function myError(response) {
                console.log('error get_by_id: ', response.statusText);
            });
        };

    }
})();
