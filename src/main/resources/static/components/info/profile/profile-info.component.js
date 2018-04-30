(function () {
    'use strict';
    angular.module('profileInfoApp')
        .component('profileInfoComp', {
            templateUrl: 'components/info/profile/profile-info.component.html',
            controller: ['$http', '$cookies', profileController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

     function profileController($http, $cookies) {

        var model = this;
        model.user = {};
        // model.user.id = "ee031f35-b5df-4cc6-96fc-98cb4c40b5a8";
        model.user.id = $cookies.get('id');
        model.checked = false;

        model.showUser = function(){
            console.log("init works");
            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.user
            }).then(function mySuccess(response) {
                console.log('response userInfo: ', response.data.name);
                model.user.name = response.data.name;
                model.user.surname = response.data.surname;
                model.user.age = response.data.age;
            }, function myError(response) {
            });
        };

        model.$onInit = function () {
            model.showUser();
        };
        
        model.editUser = function () {
            model.checked = true;
        };

        model.saveEditUser = function(){
            model.checked = false;
            $http({
                method: "POST",
                url: USER_PATH + "/editProfile",
                params: model.user
            }).then(function mySuccess(response) {
            }, function myError(response) {
            });
        }

    }
})();
