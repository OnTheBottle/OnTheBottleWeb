'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', '$window', '$scope', '$localStorage', '$q', 'UserEventFactory', 'EventFactory',
        function UserController($routeParams, $window, $scope, $localStorage, $q, UserEventFactory, EventFactory) {
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
                    }, function () {
                        self.event = getEvent();
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while leave Event');
                    });
                } else {
                    EventFactory.joinEvent({
                        id: self.event.id
                    }, function () {
                        self.event = getEvent();
                    }, function (errResponse) {
                        angular.element('#myModalClosed').modal('show');
                        errResponseFunction(errResponse, 'Error while leave Event');
                    });
                }
            };

            self.places = EventFactory.getPlaces({}, function (data) {
            }, function (errResponse) {
                errResponseFunction(errResponse, 'Error while read places');
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
                }, function () {
                    self.activeMenu = 'Info';
                    self.event = getEvent();
                }, function (errResponse) {
                    errResponseFunction(errResponse, 'Error while update Event');
                });
            };

            self.closeEvent = function () {
                EventFactory.closeEvent({
                    id: self.event.id
                }, function () {
                    $window.location.href = '#!/event';
                }, function (errResponse) {
                    errResponseFunction(errResponse, 'Error while close Event');
                });
            };

            self.showUsers = function (usersSort) {
                self.sortType = usersSort;
                self.friends = [];
                self.users = [];

                EventFactory.getAllUsers({
                    id: self.event.id
                }, function (data) {
                    data.friends.forEach(function (eventFriend) {
                        $localStorage.friends.forEach(function (friend) {
                            if (eventFriend.id === friend.id) {
                                self.friends.push(friend);
                            }
                        });
                    });
                    self.friends = checkAvatar(self.friends);

                    var noInfoUsers = [];
                    data.users.forEach(function (eventUser) {
                        var isInfoUser = false;
                        $localStorage.users.forEach(function (user) {
                            if (eventUser.id === user.id) {
                                self.users.push(user);
                                isInfoUser = true;
                            }
                        });
                        if (!isInfoUser) {
                            noInfoUsers.push(eventUser);
                        }
                    });

                    if (noInfoUsers.length !== 0) {
                        UserEventFactory.getUsersInfo(
                            noInfoUsers, function (data) {
                                data.forEach(function (user) {
                                    self.users.push(user);
                                    $localStorage.users.push(user);
                                });

                                self.users = checkAvatar(self.usersPreliminary);
                            }, function (errResponse) {
                                errResponseFunction(errResponse, 'Error while read users info');
                            }
                        );
                    }

                    angular.element('#eventUsers').modal('show');
                }, function (errResponse) {
                    errResponseFunction(errResponse, 'Error while read users in Event');
                });
            };

            self.showUser = function (id) {
                angular.element('#eventUsers').modal('hide');
                $window.setTimeout(function () {
                    $window.location.href = '#!/userInfo/' + id;
                }, 500);
            };

            var getEvent = function () {
                return EventFactory.getEvent(
                    {id: $routeParams.id},
                    function (event) {
                        self.friendsPreliminary = [];
                        self.usersPreliminary = [];
                        self.formatDate(event);
                        copyEventToUpdate(self.event);
                        var infoOwner;

                        event.friends.forEach(function (eventFriend) {
                            $localStorage.friends.forEach(function (friend) {
                                if (eventFriend.id === friend.id) {
                                    self.friendsPreliminary.push(friend);
                                }
                            });
                        });

                        self.friendsPreliminary = checkAvatar(self.friendsPreliminary);
                        infoOwner = setInfoOwner(self.friendsPreliminary, event.owner);

                        var noInfoUsers = [];
                        event.users.forEach(function (eventUser) {
                            var isInfoUser = false;
                            $localStorage.users.forEach(function (user) {
                                if (eventUser.id === user.id) {
                                    self.usersPreliminary.push(user);
                                    isInfoUser = true;
                                }
                            });
                            if (!isInfoUser) {
                                noInfoUsers.push(eventUser);
                            }
                        });

                        if (noInfoUsers.length !== 0) {
                            UserEventFactory.getUsersInfo(
                                noInfoUsers, function (data) {
                                    data.forEach(function (user) {
                                        self.usersPreliminary.push(user);
                                        $localStorage.users.push(user);
                                    });

                                    self.usersPreliminary = checkAvatar(self.usersPreliminary);
                                    if (!infoOwner) setInfoOwner(self.usersPreliminary, event.owner);
                                }, function (errResponse) {
                                    errResponseFunction(errResponse, 'Error while read users info');
                                }
                            );
                        }
                    }, function (errResponse) {
                        if (errResponse.data === 'Doesn\'t exist event') {
                            $window.location.href = '#!/event';
                        } else {
                            errResponseFunction(errResponse, 'Error while read event');
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

            function errResponseFunction(errResponse, messageError) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = '/auth.html';
                } else {
                    console.error(messageError);
                }
            }
        }]
});


