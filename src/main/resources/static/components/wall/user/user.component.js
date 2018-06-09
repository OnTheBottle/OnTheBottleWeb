'use strict';

angular.module('userOk')
    .service('UsersIdEmptyInfo', function () {
            var massivId = [];

            return {
                setId: function (id) {
                    massivId.push({id: id});
                },
                getId: function (userPostId) {
                    massivId.forEach(function (id) {
                        if (userPostId === id) {
                            return true
                        }
                        else {
                            return false
                        }
                    });
                },
                setIdUsersEmpty: function () {
                    massivId = [];
                },
                getUsersId: function () {
                    return massivId;
                }
            }
        }
    )
    .component('userOk', {
        templateUrl: 'components/wall/user/user.template.html',
        controller: ['$routeParams', 'UserFactory', 'idStorage', '$localStorage', '$resource', '$q', 'UsersIdEmptyInfo',
            function UserController($routeParams, UserFactory, idStorage, $localStorage, $resource, $q, UsersIdEmptyInfo) {
                var self = this;
                self.userId = null;
                self.user = {};
                change();
                var defer = $q.defer();
                var promise = defer.promise;


                function change() {
                    if ($routeParams.id) {
                        self.userId = $routeParams.id;
                        console.log("on change userId routeParams=", self.userid);
                        getInfo();
                    }
                    else {
                        self.userId = idStorage.getId();
                        console.log("on change user idStorage=", self.user);
                        getInfo();
                    }
                }

                function getInfo() {
                    var userId = self.userId;
                    self.user = $localStorage.authUser;
                    if (!self.user.avatarUrl) {
                        self.user.avatarUrl = "images/userspictures/default-avatar.jpeg"
                    }
                    if (!self.user) {
                        UsersIdEmptyInfo.setId(userId);
                        promise.then(function (val) {
                            self.user = val;
                        });
                        UserFactory.getUser({userId: userId}, function (user) {
                            if (!user.avatarUrl) {
                                user.avatarUrl = "images/userspictures/default-avatar.jpeg"
                            }
                            defer.resolve(self.user = user);
                        }, function (errResponce) {
                            console.error('Error,havent user', errResponce);
                        })
                    }
                }
            }],
        bindings: {}

    });