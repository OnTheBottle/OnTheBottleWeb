'use strict';

angular.module('socketService', ['ngCookies', 'ngStorage']);

angular.module('socketService').factory('SocketService', ['$cookies', '$localStorage',
    function ($cookies, $localStorage) {
        var cache = $localStorage;
        cache.notifiers = {};
        cache.notifiers.chat = {};

        if (!webSocket) {
            connect();
        }

        return null;

        function connect() {

            init();

            webSocket.onopen = function (ev) {
                console.log("webSocket Connected", ev);
                var object = {access_token: $cookies.get('access_token')};
                webSocket.send(JSON.stringify(object));
            };
            webSocket.onclose = function (ev) {
                console.log("webSocket Disconnected", ev);
                console.log("Reconnect...", ev);
                webSocket.close();
                init();
            };
            webSocket.onmessage = function (data) {
                var notifier = JSON.parse(data.data);
                if (notifier.notificationType === 'chat') {
                    cache.notifiers.chat.newMessageCounter = notifier.newMessageCounter;
                    cache.notifiers.chat.newMessageCounterArray = notifier.newMessageCounterArray;
                    //console.log('webSocket.onmessage cache.notifiers: ', cache.notifiers);
                }
            }
        }

        function init() {
            if (webSocket === null) {
                webSocket = new WebSocket('ws' + '://' + location.hostname + ':8083' + '/api');
            }
        }

        function disconnect() {
            if (webSocket != null) {
                webSocket.close();
            }
            console.log("webSocket program Disconnected");
        }

        function send(object) {
            /*
                        //example object
                        var object = {
                            name: 'Alex',
                            surname: 'Assa',
                            age: '19'
                        };
            */
            webSocket.send(JSON.stringify(object));
        }

    }
]);