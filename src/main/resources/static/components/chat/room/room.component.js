(function () {
    'use strict';
    angular.module('roomChatApp')
        .component('roomChatComp', {
            templateUrl: 'components/chat/room/room.component.html',
            controller: ['$scope', '$http', '$cookies', '$route', '$localStorage', '$compile', roomChatController],
            controllerAs: 'model',
            bindings: {
                authId: '=',
                interlocutorId: '<'
            }
        });

    function roomChatController($scope, $http, $cookies, $route, $localStorage, $compile) {
        var cache = $localStorage;

        var socket = new SockJS(MESSAGE_PATH + '/ws');

        var stompClient = null;
        var chatChannel = null;
        var channelId = null;
        var senderId = null;
        var recipientId = null;
        var countNewMessage = 0;

        var model = this;
        model.messages = [];
        model.newMessages = [];
        model.content = '';
        model.isConnection = false;

        model.$onInit = function () {
            // console.log("roomChatController $onInit: Work");

            countNewMessage = 0;
            if (model.interlocutorId) {
                model.connect(model.authId, model.interlocutorId);
            } else if (cache.interlocutorId) {
                model.connect(model.authId, cache.interlocutorId);
            }
        };

        model.$onDestroy = function () {
            disconnect();
        };

        model.connect = function (firstId, secondId) {
            senderId = firstId;
            recipientId = secondId;

            stompClient = Stomp.over(socket);
            stompClient.reconnect_delay = 5000;
            stompClient.debug = null;
            stompClient.connect({}, onOpen, onClose);

        };

        function disconnect() {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            socket.close();
            // console.log("Disconnected");
        }

        function onOpen(frame) {
            //console.log('Connect is Ok! Frame is ', frame);
            var chatSession = getChatChannel(senderId, recipientId);
        }

        function onClose(error) {
            console.log('You have disconnected, hit "OK" to reload.');
            //window.location.reload();
        }

        function getChatChannel(senderId, recipientId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/chat/channel/init",
                params: {
                    token: cache.tokenJwt,
                    senderId: senderId,
                    recipientId: recipientId
                }
            }).then(onConnected, onError);
        }

        function onConnected(response) {
            model.isConnection = true;
            chatChannel = response.data;
            channelId = chatChannel.channelId;
            cache.channelId = channelId;
            stompClient.subscribe('/topic/private.chat.' + channelId, onMessageReceived);
            getMessages(channelId);
        }

        function clearRoom() {
            var messageArea = document.getElementById("messageArea");
            messageArea.innerHTML = '';
        }

        function getMessages(channelId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/chat/channel/getmessages",
                params: {
                    token: cache.tokenJwt,
                    channelId: channelId
                }
            }).then(function (response) {
                model.messages = response.data;

                if (model.messages.length !== 0) {
                    //console.log('model.messages: ', model.messages);
                    var lastMessageTime = model.messages[0].time;
                    setReadingTime(channelId, lastMessageTime);
                }
                //console.log('model.messages: ', model.messages);
            }, onError);
        }

        function setReadingTime(channelId, time) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/chat/channel/setTime",
                params: {
                    token: cache.tokenJwt,
                    channelId: channelId,
                    time: time
                }
            });
        }

        function onMessageReceived(payload) {
            //console.log('onMessageReceived payload.body: ', payload.body);
            var timeMessage = JSON.parse(payload.body).time;
            setReadingTime(cache.channelId, timeMessage);

            model.authId = cache.authUser.id;
            model.newMessages[countNewMessage] = JSON.parse(payload.body);

            angular.element(document.getElementById('space-for-message'))
                .prepend($compile(
                    '<message-chat-comp message="model.newMessages[' + countNewMessage + ']"></message-chat-comp>'
                )($scope));
            countNewMessage++;
        }

        model.sendMessage = function (content) {
            stompClient.send(
                '/app/private.chat.' + channelId,
                {},
                JSON.stringify({
                    senderId: senderId,
                    recipientId: recipientId,
                    content: content
                })
            );
        };

        function onError(response) {
            console.log('getChatChannel Error:', response.statusText);
        }

    }
})();
