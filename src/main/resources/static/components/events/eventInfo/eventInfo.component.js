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
                    var noInfoUsers = [];
                    var processShowUsers = $q.defer();

                    processShowUsers.promise
                        .then(function () {
                            noInfoUsers = setUsersToArr(data.friends, self.friends);
                            return noInfoUsers;
                        })
                        .then(function (noInfoUsers) {
                            if (noInfoUsers.length !== 0) getUsersInfo(noInfoUsers, self.friends);
                            return true;
                        })
                        .then(function () {
                            noInfoUsers = setUsersToArr(data.users, self.users);
                            return noInfoUsers;
                        })
                        .then(function (noInfoUsers) {
                            if (noInfoUsers.length !== 0) getUsersInfo(noInfoUsers, self.users);
                            return true;
                        })
                        .then(function () {
                            angular.element('#eventUsers').modal('show');
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
                    userId: self.userId,
                    security: 'Anybody views a post',
                    text: 'Я иду ' + day + '.' + month + ' в ' + hours + ':' + minutes + ':' + seconds +
                    ' в ' + self.event.place.title + '.' +
                    ' Подробности по ссылке: http://localhost:8080/master.html#!/eventInfo/' + self.event.id,
                    title: 'Я участвую вивенте: ' + self.event.title,
                    uploadFiles: []
                };

                PostFactory.createPost(
                    post
                    , function () {
                        notification('Сообщение успешно опубликованно');
                    }, function (errResponse) {
                        errResponseFunction(errResponse, 'Error while creating Post');
                    });
            };

            function getEvent () {
                return EventFactory.getEvent(
                    {id: $routeParams.id},
                    function (event) {
                        self.friendsPreliminary = [];
                        self.usersPreliminary = [];
                        self.formatDate(event);
                        copyEventToUpdate(self.event);
                        var infoOwner;
                        var noInfoUsers;

                        noInfoUsers = setUsersToArr(event.friends, self.friendsPreliminary);
                        if (noInfoUsers.length !== 0) getUsersInfo(noInfoUsers, self.friendsPreliminary);
                        infoOwner = setInfoOwner(self.friendsPreliminary, event.owner);

                        noInfoUsers = setUsersToArr(event.users, self.usersPreliminary);
                        if (noInfoUsers.length !== 0) getUsersInfo(noInfoUsers, self.usersPreliminary);
                        if (!infoOwner) setInfoOwner(self.usersPreliminary, event.owner);
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
                UserEventFactory.getUsersInfo(
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
                users.forEach(function (item) {
                    if (item.id === owner.id) {
                        self.owner = item;
                        return true;
                    }
                });
                return false;
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
        }]
});


