'use strict';

angular.module('eventInfo').component('eventInfoComp', {
    templateUrl: 'components/events/eventInfo/eventInfo.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', '$window', '$scope', '$localStorage', '$q', 'UserEventFactory', 'EventFactory',
        'PostFactory', 'PlaceFactory',
        function UserController($routeParams, $window, $scope, $localStorage, $q, UserEventFactory, EventFactory,
                                PostFactory, PlaceFactory) {
            var self = this;
            self.activeMenu = 'Info';
            self.today = new Date();
            var process = $q.defer();
            var processShowEvent = $q.defer();

            self.$onInit = function () {
                var event = getEvent();
                process.promise
                    .then(function () {
                        self.event = event;
                    });
            };

            self.control = function () {
                if (self.event.member) {
                    EventFactory.leaveEvent({
                        id: self.event.id
                    }, function () {
                        notification('Вы покинули ивент "' + self.event.title + '"');
                        self.event = getEvent();
                    }, function (errResponse) {
                        if (errResponse.data === 'Closed event') {
                            self.notification('Ивент уже закончен :(');
                            self.event = getEvent();
                        } else {
                            errResponseFunction(errResponse, 'Error while leave Event');
                        }
                    });
                } else {
                    EventFactory.joinEvent({
                        id: self.event.id
                    }, function () {
                        notification('Вы присоединились к ивенту "' + self.event.title + '"');
                        self.event = getEvent();
                    }, function (errResponse) {
                        if (errResponse.data === 'Closed event') {
                            self.notification('Ивент уже закончен :(');
                            self.event = getEvent();
                        } else {
                            errResponseFunction(errResponse, 'Error while leave Event');
                        }
                    });
                }
            };

            self.places = PlaceFactory.getPlacesInfo([], function (data) {
                setPlacesToCache(data);
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
                    notification('Ивент успешно обновлен!');
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
                    var noInfoFriends = [];
                    var noInfoUsers = [];
                    var processShowUsers = $q.defer();

                    processShowUsers.promise
                        .then(function () {
                            noInfoFriends = setUsersToArr(data.friends, self.friends);
                        })
                        .then(function () {
                            noInfoUsers = setUsersToArr(data.users, self.users);
                        })
                        .then(function () {
                            $q.all([getUsersInfo(noInfoFriends, self.friends),
                                getUsersInfo(noInfoUsers, self.users)]).then(function () {
                                angular.element('#eventUsers').modal('show');
                            });
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

                var post = {
                    id: null,
                    userId: self.userId,
                    security: 'Anybody views a post',
                    text: 'Я иду ' + day + '.' + month + ' в ' + hours + ':' + minutes + ':' + ' в ' +
                    self.event.place.title + '.' + ' Подробности по ссылке: http://localhost:8080/master.html#!/eventInfo/'
                    + self.event.id,
                    title: 'Я участвую в ивенте: ' + self.event.title,
                    uploadFiles: []
                };

                PostFactory.createPost(
                    post, function () {
                        notification('Сообщение успешно опубликованно');
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while creating Post');
                    });
            };

            function getEvent() {
                return EventFactory.getEvent(
                    {id: $routeParams.id},
                    function (event) {
                        self.friendsPreliminary = [];
                        self.usersPreliminary = [];
                        var infoOwner;
                        var noInfoFriends;
                        var noInfoUsers;

                        processShowEvent.promise
                            .then(function () {
                                event.place = $localStorage.places.getPlace(event.place.id);
                                self.formatDate(event);
                                copyEventToUpdate(event);
                            })
                            .then(function () {
                                noInfoFriends = setUsersToArr(event.friends, self.friendsPreliminary);
                            })
                            .then(function () {
                                noInfoUsers = setUsersToArr(event.users, self.usersPreliminary);
                            })
                            .then(function () {
                                $q.all([getUsersInfo(noInfoFriends, self.friendsPreliminary),
                                    getUsersInfo(noInfoUsers, self.usersPreliminary)]).then(function (result) {
                                    result[0].$promise.then(function (data) {
                                        infoOwner = setInfoOwner(data, event.owner);
                                        if (!infoOwner) {
                                            result[1].$promise.then(function (data) {
                                                infoOwner = setInfoOwner(data, event.owner);
                                            });
                                        }
                                    });
                                });
                                process.resolve();
                            });
                    }, function (errResponse) {
                        if (errResponse.data === 'Doesn\'t exist event') {
                            $window.location.href = '#!/event';
                        } else {
                            errResponseFunction(errResponse, 'Error while read event');
                        }
                    });
            }

            function setUsersToArr(input, output) {
                var noInfoUsers = [];
                input.forEach(function (item) {
                    var user = $localStorage.users.getUser(item.id);
                    if (user) {
                        output.push(user);
                    } else {
                        noInfoUsers.push(item);
                    }
                });
                return noInfoUsers;
            }

            function getUsersInfo(input, output) {
                return UserEventFactory.getUsersInfo(
                    input, function (data) {
                        data.forEach(function (user) {
                            $localStorage.users.addUser(user);
                            output.push(user);
                        });
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while read users info');
                    }
                );
            }

            function setInfoOwner(users, owner) {
                var info = false;
                users.forEach(function (item) {
                    if (item.id === owner.id) {
                        self.owner = item;
                        info = true;
                    }
                });
                return info;
            }

            function copyEventToUpdate(event) {
                self.updateTitle = event.title;
                self.updateText = event.text;
                self.updateStartTime = event.startTime;
                self.updateEndTime = event.endTime;
                self.place = event.place.id;
            }

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

            function setPlacesToCache(input) {
                input.forEach(function (item) {
                    $localStorage.places.addPlace(item);
                });
                processShowEvent.resolve();
            }
        }]
});


