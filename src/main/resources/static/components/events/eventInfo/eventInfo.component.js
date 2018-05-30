'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', '$window', '$scope', '$localStorage', '$q', 'UserEventFactory', 'EventFactory',
        'PostFactory',
        function UserController($routeParams, $window, $scope, $localStorage, $q, UserEventFactory, EventFactory,
                                PostFactory) {
            var self = this;
            self.activeMenu = 'Info';
            self.today = new Date();

            self.$onInit = function () {
                self.event = getEvent();
                console.log($localStorage.users);
            };

            self.control = function () {
                if (self.event.member) {
                    EventFactory.leaveEvent({
                        id: self.event.id
                    }, function () {
                        notification('Вы покинули ивент "' + self.event.title + '"');
                        self.event = getEvent();
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while leave Event');
                    });
                } else {
                    EventFactory.joinEvent({
                        id: self.event.id
                    }, function () {
                        notification('Вы присоединились к ивенту "' + self.event.title + '"');
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
                    var noInfoUsers = [];
                    var processShowUsers = $q.defer();

                    processShowUsers.promise
                        .then(function () {
                            data.friends.forEach(function (eventFriend) {
                                var friend = $localStorage.users.getUser(eventFriend.id);
                                self.friends.push(friend);
                            });
                            return self.friends;
                        })
                        .then(function () {
                            data.users.forEach(function (eventUser) {
                                var user = $localStorage.users.getUser(eventUser.id);
                                if (user) {
                                    self.users.push(user);
                                } else {
                                    noInfoUsers.push(eventUser);
                                }
                            });
                            return noInfoUsers;
                        })
                        .then(function (noInfoUsers) {
                            if (noInfoUsers.length !== 0) {
                                UserEventFactory.getUsersInfo(
                                    noInfoUsers, function (data) {
                                        data.forEach(function (user) {
                                            $localStorage.users.addUser(user);
                                            self.users.push(user);
                                        });
                                    }, function (errResponse) {
                                        errResponseFunction(errResponse, 'Error while read users info');
                                    }
                                );
                            }
                            return self.users;
                        })
                        .then(function () {
                            $window.setTimeout(function () {
                                angular.element('#eventUsers').modal('show');
                            }, 300);
                        });
                    processShowUsers.resolve();
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

            self.shareFriends = function () {
                var day = formatTime(self.event.startTime.getDate());
                var month = formatTime(self.event.startTime.getMonth());
                var hours = formatTime(self.event.startTime.getHours());
                var minutes = formatTime(self.event.startTime.getMinutes());
                var seconds = formatTime(self.event.startTime.getSeconds());

                var post = {
                    id: null,
                    user_id: self.userId,
                    security: 'Anybody views a post',
                    text: 'Я иду ' + day + '.' + month + ' в ' + hours + ':' + minutes + ':' + seconds +
                    ' в ' + self.event.place.title + '.' +
                    ' Подробности по ссылке: http://localhost:8080/master.html#!/eventInfo/' + self.event.id,
                    title: 'Я участвую вивенте: ' + self.event.title
                };

                PostFactory.createPost(
                    post
                    , function () {
                        notification('Сообщение успешно опубликованно');
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while creating Post');
                    });
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
                            var friend = $localStorage.users.getUser(eventFriend.id);
                            self.friendsPreliminary.push(friend);
                        });

                        infoOwner = setInfoOwner(self.friendsPreliminary, event.owner);

                        var noInfoUsers = [];
                        event.users.forEach(function (eventUser) {
                            var user = $localStorage.users.getUser(eventUser.id);
                            if (user) {
                                self.usersPreliminary.push(user);
                            } else {
                                noInfoUsers.push(eventUser);
                            }
                        });

                        if (noInfoUsers.length !== 0) {
                            UserEventFactory.getUsersInfo(
                                noInfoUsers, function (data) {
                                    data.forEach(function (user) {
                                        $localStorage.users.addUser(user);
                                        self.usersPreliminary.push(user);
                                    });

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

            var copyEventToUpdate = function (event) {
                self.updateTitle = event.title;
                self.updateText = event.text;
                self.updateStartTime = event.startTime;
                self.updateEndTime = event.endTime;
                self.place = event.place.id;
            };

            function errResponseFunction(errResponse, messageError) {
                if (errResponse.data === 'Non-valid token') {
                    $window.location.href = AUTH_HTML;
                } else {
                    console.error(messageError);
                }
            }

            function formatTime(time) {
                return time >= 10 ? time : '0' + time;
            }

            function notification(text) {
                self.notification = text;
                angular.element('#notification').modal('show');
                $window.setTimeout(function () {
                    angular.element('#notification').modal('hide');
                }, 2000);
            }
        }]
});


