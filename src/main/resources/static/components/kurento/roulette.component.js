(function () {
    'use strict';
    angular.module('rouletteApp')
        .component('rouletteComp', {
            templateUrl: 'components/kurento/roulette.component.html',
            controller: ['$http', rouletteController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function rouletteController($http) {

        var model = this;
        model.registerName = '';
        model.peerName = '';

        model.$onInit = function () {
            console.log('authId: ', model.authId);
            model.registerName = model.authId;
            console.log('set register');
            //var ws = new WebSocket('ws://' + location.hostname + ':8083' + '/call');
            //model.register();
            console.log('ws roulette: ', ws);
        };

        model.$onDestroy = function () {
            console.log('$onDestroy OK');
            ws.close();
        };

        //var ws = new WebSocket('ws://' + location.host + '/call');
        var ws = new WebSocket('ws://' + location.hostname + ':8083' + '/call');
        // var ws = new WebSocket('wss://' + location.host + '/call');
        var videoInput;
        var videoOutput;
        var webRtcPeer;
        var response;
        var callerMessage;
        var from;

        var registerName = null;
        var registerState = null;
        const NOT_REGISTERED = 0;
        const REGISTERING = 1;
        const REGISTERED = 2;

        function setRegisterState(nextState) {
            switch (nextState) {
                case NOT_REGISTERED:
                    enableButton('#register', 'register()');
                    setCallState(NO_CALL);
                    break;
                case REGISTERING:
                    disableButton('#register');
                    break;
                case REGISTERED:
                    disableButton('#register');
                    setCallState(NO_CALL);
                    break;
                default:
                    return;
            }
            registerState = nextState;
        }

        var callState = null;
        const NO_CALL = 0;
        const PROCESSING_CALL = 1;
        const IN_CALL = 2;

        function setCallState(nextState) {
            switch (nextState) {
                case NO_CALL:
                    //enableButton('#call', 'call()');
                    enableButton('#call');
                    disableButton('#terminate');
                    disableButton('#play');
                    break;
                case PROCESSING_CALL:
                    disableButton('#call');
                    disableButton('#terminate');
                    disableButton('#play');
                    break;
                case IN_CALL:
                    disableButton('#call');
                    //enableButton('#terminate', 'stop()');
                    enableButton('#terminate');
                    disableButton('#play');
                    break;
                default:
                    return;
            }
            callState = nextState;
        }

        window.onload = function () {
            //console = new Console();
            setRegisterState(NOT_REGISTERED);
            var drag = new Draggabilly(document.getElementById('videoSmall'));
            videoInput = document.getElementById('videoInput');
            videoOutput = document.getElementById('videoOutput');
            document.getElementById('name').focus();
        }

        window.onbeforeunload = function () {
            ws.close();
        }


        ws.onopen = function () {
            console.log('ws.onopen OK');
            model.register();
        };

        ws.onmessage = function (message) {
            var parsedMessage = JSON.parse(message.data);
            console.info('Received message: ' + message.data);

            switch (parsedMessage.id) {
                case 'resgisterResponse':
                    resgisterResponse(parsedMessage);
                    break;
                case 'callResponse':
                    callResponse(parsedMessage);
                    break;
                case 'incomingCall':
                    incomingCall(parsedMessage);
                    break;
                case 'startCommunication':
                    startCommunication(parsedMessage);
                    break;
                case 'stopCommunication':
                    console.info('Communication ended by remote peer');
                    stop(true);
                    break;
                case 'iceCandidate':
                    webRtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
                        if (error)
                            return console.error('Error adding candidate: ' + error);
                    });
                    break;
                default:
                    console.error('Unrecognized message', parsedMessage);
            }
        }

        function resgisterResponse(message) {
            if (message.response == 'accepted') {
                setRegisterState(REGISTERED);
            } else {
                setRegisterState(NOT_REGISTERED);
                var errorMessage = message.message ? message.message
                    : 'Unknown reason for register rejection.';
                console.log(errorMessage);
                alert('Error registering user. See console for further information.');
            }
        }

        function callResponse(message) {
            if (message.response != 'accepted') {
                console.info('Call not accepted by peer. Closing call');
                var errorMessage = message.message ? message.message
                    : 'Unknown reason for call rejection.';
                console.log(errorMessage);
                stop();
            } else {
                setCallState(IN_CALL);
                webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
                    if (error)
                        return console.error(error);
                });
            }
        }

        function startCommunication(message) {
            setCallState(IN_CALL);
            webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
                if (error)
                    return console.error(error);
            });
        }

        function incomingCall(message) {
            // If bussy just reject without disturbing user
            if (callState != NO_CALL) {
                var response = {
                    id: 'incomingCallResponse',
                    from: message.from,
                    callResponse: 'reject',
                    message: 'bussy'
                };
                return sendMessage(response);
            }

            setCallState(PROCESSING_CALL);

            from = message.from;
            var options = {
                localVideo: videoInput,
                remoteVideo: videoOutput,
                onicecandidate: onIceCandidate,
                onerror: onError
            };
            webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    webRtcPeer.generateOffer(onOfferIncomingCall);
                });


        }

        /*
                    if (confirm('User ' + message.from
                        + ' is calling you. Do you accept the call?')) {
                        //showSpinner(videoInput, videoOutput);

                        from = message.from;
                        var options = {
                            localVideo: videoInput,
                            remoteVideo: videoOutput,
                            onicecandidate: onIceCandidate,
                            onerror: onError
                        }
                        webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
                            function (error) {
                                if (error) {
                                    return console.error(error);
                                }
                                webRtcPeer.generateOffer(onOfferIncomingCall);
                            });

                    } else {
                        var response = {
                            id: 'incomingCallResponse',
                            from: message.from,
                            callResponse: 'reject',
                            message: 'user declined'
                        };
                        sendMessage(response);
                        stop();
                    }
                }
        */

        function onOfferIncomingCall(error, offerSdp) {
            if (error)
                return console.error("Error generating the offer");
            var response = {
                id: 'incomingCallResponse',
                from: from,
                callResponse: 'accept',
                sdpOffer: offerSdp
            };
            sendMessage(response);
        }

        model.register = function () {
            //function register() {
            //var name = document.getElementById('name').value;
            var registerName = model.registerName;
            console.log('register name', registerName);
            if (registerName == '') {
                window.alert('You must insert your user name');
                return;
            }
            setRegisterState(REGISTERING);

            var message = {
                id: 'register',
                name: registerName
            };
            sendMessage(message);
            //document.getElementById('peer').focus();
        };

        model.call = function () {
            var peerName = model.peerName;
            console.log('peer name', peerName);
            /*
                        if (peerName == '') {
                            window.alert('You must specify the peer name');
                            return;
                        }
            */
            setCallState(PROCESSING_CALL);
            //showSpinner(videoInput, videoOutput);

            var options = {
                localVideo: videoInput,
                remoteVideo: videoOutput,
                onicecandidate: onIceCandidate,
                onerror: onError
            }
            webRtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options,
                function (error) {
                    if (error) {
                        return console.error(error);
                    }
                    webRtcPeer.generateOffer(onOfferCall);
                });
        };

        model.stop = function (message) {
            setCallState(NO_CALL);
            if (webRtcPeer) {
                webRtcPeer.dispose();
                webRtcPeer = null;

                if (!message) {
                    var message = {
                        id: 'stop'
                    }
                    sendMessage(message);
                }
            }
            //hideSpinner(videoInput, videoOutput);
        };

        function onOfferCall(error, offerSdp) {
            if (error)
                return console.error('Error generating the offer');
            console.log('Invoking SDP offer callback function');
            var message = {
                id: 'call',
                from: model.registerName,
                to: model.peerName,
                sdpOffer: offerSdp
            };
            /*
                        var message = {
                            id: 'call',
                            from: document.getElementById('name').value,
                            to: document.getElementById('peer').value,
                            sdpOffer: offerSdp
                        };
            */
            sendMessage(message);
        }


        function onError() {
            setCallState(NO_CALL);
        }

        function onIceCandidate(candidate) {
            console.log("Local candidate" + JSON.stringify(candidate));

            var message = {
                id: 'onIceCandidate',
                candidate: candidate
            };
            sendMessage(message);
        }

        function sendMessage(message) {
            var jsonMessage = JSON.stringify(message);
            console.log('Senging message: ' + jsonMessage);
            ws.send(jsonMessage);
        }

        function showSpinner() {
            for (var i = 0; i < arguments.length; i++) {
                arguments[i].poster = 'images/ico/transparent-1px.png';
                arguments[i].style.background = 'center transparent url("images/ico/spinner.gif") no-repeat';
            }
        }

        function hideSpinner() {
            for (var i = 0; i < arguments.length; i++) {
                arguments[i].src = '';
                arguments[i].poster = 'images/ico/webrtc.png';
                arguments[i].style.background = '';
            }
        }

        function disableButton(id) {
            $(id).attr('disabled', true);
            $(id).removeAttr('onclick');
        }

        function enableButton(id, functionName) {
            $(id).attr('disabled', false);
            $(id).attr('onclick', functionName);
        }

        /**
         * Lightbox utility (to display media pipeline image in a modal dialog)
         */
        $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
            event.preventDefault();
            $(this).ekkoLightbox();
        });


    }
})();
