'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', '$window', '$scope', 'UserEventFactory', 'EventFactory',
        function UserController($routeParams, $window, $scope, UserEventFactory, EventFactory) {
            var self = this;
            self.activeMenu = 'Info';
            self.today = new Date();

            self.$onInit = function () {
                self.event = getEvent();
            };

            self.control = function () {
                if (self.event.member) {
                    EventFactory.leaveEvent({
                        id: self.event.id
                    }, function (data) {
                        self.event = getEvent();
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while leave Event');
                        }
                    });
                } else {
                    EventFactory.joinEvent({
                        id: self.event.id
                    }, function (data) {
                        self.event = getEvent();
                    }, function (errResponse) {
                        angular.element('#myModalClosed').modal('show');
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while leave Event');
                        }
                    });
                }
            };

            self.places = EventFactory.getPlaces({}, function (data) {
            }, function (errResponse) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = '/auth.html';
                } else {
                    console.error('Error while read places');
                }
            });

            self.formatDate = function (event) {
                event.startTime = new Date(event.startTime.replace(' ', 'T') + "Z");
                event.endTime = new Date(event.endTime.replace(' ', 'T') + "Z");
            };

            self.resetEventUpdate = function () {
                self.activeMenu = 'Info';
                $scope.updateEventForm.$setUntouched();
                $scope.updateEventForm.$setPristine();
                copyEventToUpdate(self.event);
            };

            self.updateEvent = function () {
                EventFactory.updateEvent({
                    id: self.event.id,
                    title: self.updateTitle,
                    text: self.updateText,
                    startTime: self.updateStartTime,
                    endTime: self.updateEndTime,
                    place: self.place
                }, function (data) {
                    self.activeMenu = 'Info';
                    self.event = getEvent();
                }, function (errResponse) {
                    if (errResponse.data === 'Non-valid token') {
                        $window.location.href = '/auth.html';
                    } else {
                        console.error('Error while update Event');
                    }
                });
            };

            self.closeEvent = function () {
                EventFactory.closeEvent({
                    id: self.event.id
                }, function (data) {
                    $window.location.href = '#!/event';
                }, function (errResponse) {
                    if (errResponse.data === 'Non-valid token') {
                        $window.location.href = '/auth.html';
                    } else {
                        console.error('Error while close Event');
                    }
                });
            };

            var getEvent = function () {
                return EventFactory.getEvent(
                    {id: $routeParams.id},
                    function (event) {
                        self.formatDate(event);
                        copyEventToUpdate(self.event);
                        var infoOwner;

                        self.friendsPreliminary = UserEventFactory.getUsersInfo(
                            event.friends, function (data) {
                                infoOwner = setInfoOwner(data, event.owner);
                                return checkAvatar(data);
                            }, function (errResponse) {
                                if (errResponse.data === 'Non-valid token') {
                                    $window.location.href = '/auth.html';
                                } else {
                                    console.error('Error while read event');
                                }
                            }
                        );

                        self.usersPreliminary = UserEventFactory.getUsersInfo(
                            event.users, function (data) {
                                if (!infoOwner) setInfoOwner(data, event.owner);
                                return checkAvatar(data);
                            }, function (errResponse) {
                                if (errResponse.data === 'Non-valid token') {
                                    $window.location.href = '/auth.html';
                                } else {
                                    console.error('Error while read event');
                                }
                            }
                        );
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else if (errResponse.data === 'Doesn\'t exist event' ) {
                            $window.location.href = '#!/event';
                        } else {
                            console.log(errResponse.data.indexOf('JSON parse error'));
                            console.error('Error while read event');
                        }
                    });
            };

            var setInfoOwner = function (users, owner) {
                users.forEach(function (item) {
                    if (item.id === owner.id) {
                        self.owner = item;
                        return true;
                    }
                });
                return false;
            };

            var checkAvatar = function (users) {
                users.forEach(function (item) {
                    item.avatarUrl = item.avatarUrl === null ? 'images/userspictures/default-avatar.jpeg' : item.avatarUrl;
                });
                return users;
            };

            var copyEventToUpdate = function (event) {
                self.updateTitle = event.title;
                self.updateText = event.text;
                self.updateStartTime = event.startTime;
                self.updateEndTime = event.endTime;
                self.place = event.place.id;
            };
        }]
});

/*
            self.getUsersInfo = function () {
                self.activeMenu = 'Users';
                EventFactory.getUsersInfo(self.eventInfo.users, function (data) {
                    console.log(data);
                }, function (errResponse) {
                    if (errResponse.data === 'Non-valid token') {
                        $window.location.href = '/auth.html';
                    } else {
                        console.error('Error while read user info');
                    }
                });
            };
* */


