'use strict';

angular.module('userOk').component('userOk', {
    templateUrl: 'components/wall/user/user.template.html',
    controller: ['$routeParams', 'UserFactory', 'idStorage',
        function UserController($routeParams, UserFactory, idStorage) {
            var self = this;
            self.userid = null;
            change();

            function change() {
                if ($routeParams.id) {
                    self.userid = $routeParams.id;
                    console.log("on change userId=", self.userid);
                }
                else {
                    self.userid = idStorage.getId();
                    console.log("on change userId=", self.userid);
                }
            }

            self.user = UserFactory.getUsr({userId: self.userid});
        }],
    bindings: {}

});