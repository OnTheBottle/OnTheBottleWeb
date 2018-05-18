'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', '$window', 'UserEventFactory', 'EventFactory',
        function UserController($routeParams, $window, UserEventFactory, EventFactory) {
            var self = this;
            self.activeMenu = 'Info';

            self.$onInit = function () {
                self.event = EventFactory.getEvent(
                    {eventId: $routeParams.id, userId: self.userId},
                    function (data) {
                        self.formatDate(data);

                        self.friendsPreliminary = UserEventFactory.getUsersInfo(
                            data.friends, function (data) {
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
                            data.users, function (data) {
                                return checkAvatar(data);
                            }, function (errResponse) {
                                if (errResponse.data === 'Non-valid token') {
                                    $window.location.href = '/auth.html';
                                } else {
                                    console.error('Error while read event');
                                }
                            }
                        );

                        return data;
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while read event');
                        }
                    });
            };

            self.test = function () {
                console.log();
            };

            self.formatDate = function (event) {
                event.startTime = new Date(event.startTime.replace(' ', 'T') + "Z");
                event.endTime = new Date(event.endTime.replace(' ', 'T') + "Z");
            };

            var checkAvatar = function (users) {
                users.forEach(function (item) {
                    item.avatarUrl = item.avatarUrl === null ? 'images/userspictures/default-avatar.jpeg' : item.avatarUrl;
                });
                return users;
            }

        }]
});

/*
                resetEventUpdate: function () {
                    self.isUpdate = false;
                    $scope.eventInfoForm.$setUntouched();
                    $scope.eventInfoForm.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                },
                control: function () {
                    if (self.checkMember(self.eventInfo.users)) {
                        self.util.isLeaveEvent();
                    } else {
                        self.util.joinEvent();
                    }
                },
                joinEvent: function () {
                    EventFactory.joinEvent({
                        eventId: self.eventInfo.id,
                        userId: self.userId
                    }, function (data) {
                        self.util.getEvents();
                        self.eventInfo.users[self.eventInfo.users.length] = {id: self.userId};
                    }, function (errResponse) {
                        angular.element('#myModalClosed').modal('show');
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        }
                    });
                },
                isLeaveEvent: function (accept) {
                    if (self.userId === self.eventInfo.owner.id && accept) {
                        angular.element('#myModalClose').modal('hide');
                        self.util.leaveEvent();
                    } else if (self.userId === self.eventInfo.owner.id) {
                        angular.element('#myModalEvent').modal('hide');
                        angular.element('#myModalClose').modal('show');
                    } else {
                        self.util.leaveEvent();
                    }
                },
                leaveEvent: function () {
                    EventFactory.leaveEvent({
                        eventId: self.eventInfo.id,
                        userId: self.userId
                    }, function (data) {
                        self.util.getEvents();
                        self.eventInfo.users.splice(getIndexOfUser(), 1);
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while leave Event');
                        }
                    });
                },
                updateEvent: function () {
                    self.isUpdate = false;
                    EventFactory.updateEvent({
                        id: self.eventInfo.id,
                        title: self.eventInfo.title,
                        text: self.eventInfo.text,
                        startTime: self.eventInfo.startTime,
                        endTime: self.eventInfo.endTime,
                        place: self.eventInfo.place.id
                    }, function (data) {
                        self.activeMenu = 'Info';
                        self.util.getEvents();
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while update Event');
                        }
                    });
                },
                closeEvent: function () {
                    self.isUpdate = false;
                    angular.element('#myModalEvent').modal('hide');
                    EventFactory.closeEvent({
                        id: self.eventInfo.id
                    }, function (data) {
                        self.util.getEvents();
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while close Event');
                        }
                    });
                }

            self.setEventInfo = function (event) {
                self.activeMenu = 'Info';
                self.eventInfo = event;
                self.isOwner = self.userId === (self.eventInfo.owner === null ? 0 : self.eventInfo.owner.id);
            };

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

            function getIndexOfUser() {
                var index = 0;
                for (var i = 0; i < self.eventInfo.users.length; i++) {
                    if (self.eventInfo.users[i].id === self.userId) {
                        index = i;
                        return index;
                    }
                }
                return index;
            }
* */


