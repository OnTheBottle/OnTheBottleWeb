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

        //var socket = new SockJS(MESSAGE_PATH + '/ws');
        //var socket = cache.websocket;
        //console.log("roomChatController cache.websocket:", cache.websocket);


        var stompClient = null;
        var chatChannel = null;
        var channelId = null;
        var senderId = null;
        var recipientId = null;
        var count = 0;

        var model = this;
        model.messages = [];
        model.newMessages = [];
        model.content = '';


        model.$onInit = function () {
            //console.log("roomChatController $onInit: Work");

        };

        model.$onChanges = function () {
            //console.log("roomChatController $onChanges: Work");

            disconnect();
            if (model.interlocutorId) {
                model.connect(model.authId, model.interlocutorId);
            } else if (cache.interlocutorId) {
                model.connect(model.authId, cache.interlocutorId);
            }
        }

        model.connect = function (firstId, secondId) {
            senderId = firstId;
            recipientId = secondId;

            var socket = new SockJS(MESSAGE_PATH + '/ws');
            stompClient = Stomp.over(socket);
            stompClient.reconnect_delay = 5000;
            stompClient.debug = null;
            stompClient.connect({}, onOpen, onClose);

        };

        function disconnect() {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            //console.log("Disconnected");
        }

        function onOpen(frame) {
            //console.log('Connect is Ok! Frame is ', frame);
            var chatSession = getChatChannel(senderId, recipientId);
        }

        function onClose(error) {
            alert('You have disconnected, hit "OK" to reload.');
            window.location.reload();
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
            chatChannel = response.data;
            channelId = chatChannel.channelId;
            //console.log('onConnected chatSession:', chatChannel);
            stompClient.subscribe('/topic/private.chat.' + channelId, onMessageReceived);
            //clearRoom();
            getMessages(channelId);
        }

        /*
                    stompClient.send(
                        '/app/private.chat.' + chatChannel.channelId,
                        {},
                        JSON.stringify({
                            senderId: senderId,
                            recipientId: recipientId,
                            content: 'I am here!!!'
                        })
                    )
        */

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
                //console.log('roomChatController getMessages:', model.messages);
            }, onError);
        }

        function onMessageReceived(payload) {
            //model.messages.unshift(JSON.parse(payload.body));
            //console.log('roomChatController onMessageReceived:', model.messages[0]);
            model.authId = cache.authUser.id;
            model.newMessages[count] = JSON.parse(payload.body);
            //var arr = JSON.parse(payload.body);
            //console.log('roomChatController onMessageReceived:', model.message);

            angular.element(document.getElementById('space-for-message'))
                .prepend($compile(
                    '<message-chat-comp message="model.newMessages[' + count + ']"></message-chat-comp>'
                )($scope));
            //console.log('angular.element model.newMessages[', count, ']', model.newMessages[count]);
            count++;



/*
            angular.element(document.getElementById('space-for-message'))
                .prepend($compile(
                    '<message-chat-comp ' +
                    'message-id="' + arr.id + ' ' +
                    'message-content="' + arr.content + ' ' +
                    'message-time="' + arr.time + ' ' +
                    '"></message-chat-comp>'
                )($scope));
*/




            //$route.reload();
            /*
                        var messageArea = document.getElementById("messageArea");
                        var messageElement = document.createElement('li');
                        messageElement.innerHTML = '111<message-chat-comp></message-chat-comp>2222';
                        messageArea.prepend(messageElement);
            */
            //     //messageArea.appendChild(messageElement);

            //console.log('roomChatController onMessageReceived:', model.message);
            //console.log('roomChatController onMessageReceived:', model.messages);
        }

        // function onMessageReceived(payload) {
        //     var messageDTO = JSON.parse(payload.body);
        //     console.log('onMessageReceived message:', messageDTO);
        //     console.log('onMessageReceived chatChannel:', chatChannel);
        //
        //     var sender = {};
        //     sender.id = messageDTO.senderId;
        //     sender.content = messageDTO.content;
        //     if (sender.id === chatChannel.firstUser.id) {
        //         sender.avatar = chatChannel.firstUser.avatarUrl;
        //         sender.name = chatChannel.firstUser.name;
        //         sender.surname = chatChannel.firstUser.surname;
        //         sender.backgroundColor = 'red';
        //     }
        //     else {
        //         sender.avatar = chatChannel.secondUser.avatarUrl;
        //         sender.name = chatChannel.secondUser.name;
        //         sender.backgroundColor = 'blue';
        //     }
        //
        //     var messageElement = document.createElement('li');
        //     messageElement.classList.add('chat-message');
        //
        //     //var x = document.createElement("IMG");
        //     //document.getElementById("myImg").src = "hackanm.gif";
        //
        //     var avatarElement = document.createElement("IMG");
        //     avatarElement.src = sender.avatar;
        //     avatarElement.classList.add('chat-avatar');
        //     var avatarText = document.createTextNode(sender.name);
        //     avatarElement.appendChild(avatarText);
        //     avatarElement.style['background-color'] = sender.backgroundColor;
        //     messageElement.appendChild(avatarElement);
        //
        //     var usernameElement = document.createElement('span');
        //     var usernameText = document.createTextNode(sender.name + ' ' + sender.surname);
        //     usernameElement.appendChild(usernameText);
        //     messageElement.appendChild(usernameElement);
        //
        //     var textElement = document.createElement('p');
        //     var messageText = document.createTextNode(sender.content);
        //     textElement.appendChild(messageText);
        //
        //     messageElement.appendChild(textElement);
        //
        //     var messageArea = document.getElementById("messageArea");
        //     messageArea.prepend(messageElement);
        //     //messageArea.appendChild(messageElement);
        //     //messageArea.scrollTop = messageArea.scrollHeight;
        // }


        /*
                model.sendMessage = function (content) {
                    console.log('sendMessage:', content);
                };
        */


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


    ///stompClient.subscribe('/topic/public', onMessageReceived);
    // Subscribe to the Public Topic
    // Tell your username to the server
    ///stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'})


    /*
            var model = this;

            model.$onInit = function () {

                var usernamePage = document.querySelector('#username-page');
                var chatPage = document.querySelector('#chat-page');
                var usernameForm = document.querySelector('#usernameForm');
                var messageForm = document.querySelector('#messageForm');
                var messageInput = document.querySelector('#message');
                var messageArea = document.querySelector('#messageArea');
                var connectingElement = document.querySelector('.connecting');

                var stompClient = null;
                var username = null;

                var colors = [
                    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
                    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
                ];

                function connect(event) {
                    username = document.querySelector('#name').value.trim();

                    if (username) {
                        usernamePage.classList.add('hidden');
                        chatPage.classList.remove('hidden');

                        var socket = new SockJS('http://127.0.0.1:8081/ws');
                        stompClient = Stomp.over(socket);

                        stompClient.connect({}, onConnected, onError);
                    }
                    event.preventDefault();
                }


                function onConnected() {
                    // Subscribe to the Public Topic
                    stompClient.subscribe('/topic/public', onMessageReceived);

                    // Tell your username to the server
                    stompClient.send("/app/chat.addUser",
                        {},
                        JSON.stringify({sender: username, type: 'JOIN'})
                    )

                    connectingElement.classList.add('hidden');
                }


                function onError(error) {
                    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
                    connectingElement.style.color = 'red';
                }


                function sendMessage(event) {
                    var messageContent = messageInput.value.trim();
                    if (messageContent && stompClient) {
                        var chatMessage = {
                            sender: username,
                            content: messageInput.value,
                            type: 'CHAT'
                        };
                        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                        messageInput.value = '';
                    }
                    event.preventDefault();
                }


                function onMessageReceived(payload) {
                    var message = JSON.parse(payload.body);

                    var messageElement = document.createElement('li');

                    if (message.type === 'JOIN') {
                        messageElement.classList.add('event-message');
                        message.content = message.sender + ' joined!';
                    } else if (message.type === 'LEAVE') {
                        messageElement.classList.add('event-message');
                        message.content = message.sender + ' left!';
                    } else {
                        messageElement.classList.add('chat-message');

                        var avatarElement = document.createElement('i');
                        var avatarText = document.createTextNode(message.sender[0]);
                        avatarElement.appendChild(avatarText);
                        avatarElement.style['background-color'] = getAvatarColor(message.sender);

                        messageElement.appendChild(avatarElement);

                        var usernameElement = document.createElement('span');
                        var usernameText = document.createTextNode(message.sender);
                        usernameElement.appendChild(usernameText);
                        messageElement.appendChild(usernameElement);
                    }

                    var textElement = document.createElement('p');
                    var messageText = document.createTextNode(message.content);
                    textElement.appendChild(messageText);

                    messageElement.appendChild(textElement);

                    messageArea.appendChild(messageElement);
                    messageArea.scrollTop = messageArea.scrollHeight;
                }


                function getAvatarColor(messageSender) {
                    var hash = 0;
                    for (var i = 0; i < messageSender.length; i++) {
                        hash = 31 * hash + messageSender.charCodeAt(i);
                    }
                    var index = Math.abs(hash % colors.length);
                    return colors[index];
                }

                usernameForm.addEventListener('submit', connect, true);
                messageForm.addEventListener('submit', sendMessage, true);


            }
    */

})();
