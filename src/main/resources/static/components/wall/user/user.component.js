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
                getUsersId: function(){
                    return massivId;
                }
            }
        }
    )
    .component('userOk', {
        templateUrl: 'components/wall/user/user.template.html',
        controller: ['$routeParams', 'UserFactory', 'idStorage', 'UserEventFactory', '$localStorage',
            function UserController($routeParams, UserFactory, idStorage, UserEventFactory, $localStorage) {
                var self = this;
                self.userid = null;
                self.user = {};
                change();

                self.getFriendsInfo = function () {
                    self.user=$localStorage.users.getUser(self.userid);
   //                 var userAuth = $localStorage.authUser;
   //                 self.arrayId = [];
   //                 var usersId = userAuth.friendsId;
   //                 console.log('usersId', usersId);
   //                 usersId.forEach(function (value) {
   //                     var user = {id: value};
   //                     self.arrayId.push(user);
   //                 });
   //                 self.arrayId.push({id: self.userid});
   //                 console.log('arrayId', self.arrayId);
   //                 UserFactory.getSmallInfoAboutUsers(self.arrayId, function (data) {
   //                         data.forEach(function (userFriend) {
   //                             var user = {};
   //                             user = $localStorage.users.getUser(userFriend.id);
   //                             if (!user) {
   //                                 $localStorage.users.addUser(userFriend);
   //                             }
   //                         });
   //                         var userAuth = $localStorage.users.getUser(self.userid);
   //                         self.user = userAuth;
   //                     },
   //                     function (errResponce) {
   //                         console.error('Error ');
   //                     });
                };

                function change() {
                    if ($routeParams.id) {
                        self.userid = $routeParams.id;
                        console.log("on change userId routeParams=", self.userid);
                        //   self.user = $localStorage.users.getUser(self.userid);
                    }
                    else {
                        self.userid = idStorage.getId();
                        //     self.user=$localStorage.
                        console.log("on change userId idStorage=", self.userid);

                        //  self.user = $localStorage.getUser(self.userid);
                        console.log("on change user idStorage=", self.user);
                    }
                }

                // self.user = UserFactory.getUsr({userId: self.userid});
            }],
        bindings: {}

    });