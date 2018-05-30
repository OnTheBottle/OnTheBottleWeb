(function () {
    'use strict';
    angular.module('chatApp')
        .component('chatComp', {
            templateUrl: 'components/chat/chat.component.html',
            controller: ['$http', '$localStorage', '$route', '$cookies', chatController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function chatController($http, $localStorage, $route, $cookies) {
        var cache = $localStorage;
        var model = this;

        model.$onInit = function () {
            getFriendsByUserId(model.authId);
        };

        model.selectRoom = function (interlocutorId) {
            //console.log('chatController model.selectRoom:', interlocutorId);
            if (interlocutorId === cache.interlocutorId) return;
            model.interlocutorId = interlocutorId;
            cache.interlocutorId = interlocutorId;
            $route.reload();
        }

        function getFriendsByUserId(userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_confirmed_friends",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                cache.friends = response.data;
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
