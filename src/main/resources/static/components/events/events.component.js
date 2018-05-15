'use strict';

angular.module('eventsApp').component('eventsComp', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['EventFactory', '$scope', '$window',
        function UserController(EventFactory, $scope, $window) {
            var self = this;
            self.options = {allEvents: 'true', activeEvents: 'true', ownerEvents: false};
            self.today = new Date();
            self.orderProp = 'startTime';

            self.util = {
                getEvents: function () {
                    EventFactory.getEvents(
                        {userId: self.userId, options: self.options},
                        function (data) {
                            self.formatDate(data);
                            self.events = data;
                        }, function (errResponse) {
                            if (errResponse.data === 'Non-valid token') {
                                $window.location.href = '/auth.html';
                            } else {
                                console.error('Error while read events');
                            }
                        });
                },
                createEvent: function () {
                    angular.element('#myModal').modal('hide');
                    EventFactory.createEvent({
                        id: null,
                        title: self.title,
                        text: self.text,
                        startTime: self.startTime,
                        endTime: self.endTime,
                        place: self.place,
                        owner: self.userId
                    }, function (data) {
                        self.util.resetEvent();
                        self.util.getEvents();
                    }, function (errResponse) {
                        if (errResponse.data === 'Non-valid token') {
                            $window.location.href = '/auth.html';
                        } else {
                            console.error('Error while creating Event');
                        }
                    });
                },
                resetEvent: function () {
                    $scope.createEventForm.$setUntouched();
                    $scope.createEventForm.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                },
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
            };

            self.$onInit = function () {
                self.util.getEvents();
            };

            self.checkMember = function (users) {
                var isMember = false;
                if (users === undefined) return isMember;
                users.forEach(function (item) {
                    if (item.id === self.userId) {
                        isMember = true;
                    }
                });
                return isMember;
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

            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = '/auth.html';
                } else {
                    console.error('Error while read places');
                }
            });

            self.formatDate = function (events) {
                events.forEach(function (item) {
                    item.startTime = new Date(item.startTime.replace(' ', 'T') + "Z");
                    item.endTime = new Date(item.endTime.replace(' ', 'T') + "Z");
                });
            };
        }]
});
