'use strict';

angular.module('messagesystem')
    .component('messagesystem', {
        templateUrl: '../components/messagesystem/messagesystem.template.html',
        controller: ['$routeParams', 'UserFactory',
            function UserController($routeParams, UserFactory) {
                var self=this;
                self.users = UserFactory.getUsers();
                self.orderProp = 'name';
                self.user={name:'',surname:''};


                 self.saveUser=addUser;


                     function addUser() {
                        UserFactory.addUser({name:self.user.name,surname:self.user.surname},function (data) {
                            getUsers()
                        }, function (errResponse) {
                            console.error('Error while creating Post');
                        });
                    }

                    function getUsers(){
                         self.users=UserFactory.getUsers();
                    }
            }]
    });