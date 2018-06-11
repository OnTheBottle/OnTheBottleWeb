(function () {
    'use strict';
    angular.module('chatApp')
        .component('chatComp', {
            templateUrl: 'components/chat/chat.component.html',
            controller: ['$http', '$localStorage', '$route', '$cookies', '$scope', '$compile', chatController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function chatController($http, $localStorage, $route, $cookies, $scope, $compile) {
        var cache = $localStorage;
        var model = this;

        model.$onInit = function () {
            getFriendsByUserId(model.authId);
        };

        function init() {
            if (cache.interlocutorId) {
                angular.element(document.getElementById('space-for-room'))
                    .prepend($compile(
                        '<room-chat-comp interlocutor-id="model.interlocutorId" auth-id="model.authId"></room-chat-comp>'
                    )($scope));
            }
        }

        model.selectRoom = function (interlocutorId) {
            //console.log('chatController model.selectRoom:', interlocutorId);
            //if (interlocutorId === cache.interlocutorId) return;
            model.interlocutorId = interlocutorId;
            cache.interlocutorId = interlocutorId;
            model.selectedInterlocutor = interlocutorId;

            angular.element(document.getElementById('space-for-room')).empty();
            angular.element(document.getElementById('space-for-room'))
                .prepend($compile(
                    '<room-chat-comp interlocutor-id="model.interlocutorId" auth-id="model.authId"></room-chat-comp>'
                )($scope));

            //$route.reload();
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
                var friendIds = [];
                cache.friends.forEach(function (friend) {
                    friendIds.push(friend.id);
                });
                getInterlocutorChannels(friendIds);
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

        function getInterlocutorChannels(arrayId) {
            //console.log('getInterlocutorChannels arrayId:', arrayId);
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/chat/channel/getChannels",
                params: {
                    token: $cookies.get('access_token'),
                    interlocutorIds: arrayId
                }
            }).then(function mySuccess(response) {
                cache.notifiers.chat.channels = response.data;
                //console.log('getInterlocutorChannels cache.chat.channels:', cache.notifiers.chat.channels);
            }, function myError(response) {
                console.log('Error response getInterlocutorChannels: ', response.statusText);
            });
        }

    }
})();
