'use strict';

angular.module('messagesystemuser')
    .component('messagesystemuser', {
        templateUrl: '../components/messagesystemuser/messagesystemuser.template.html',
        controller: ['$routeParams', 'UserFactory', '$scope',
            function UserController($routeParams, UserFactory, $scope) {
                var self = this;
                self.userId = $routeParams.userId;
                this.user = UserFactory.getUser({user_Id: this.userId});
                self.selection={value:''};
                self.value=value;
                function value(value) {
                    self.selection={value:value}
                }


            }]
    });