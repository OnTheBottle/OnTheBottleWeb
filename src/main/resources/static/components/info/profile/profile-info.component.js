(function () {
    'use strict';
    angular.module('profileInfoApp')
        .component('profileInfoComp', {
            templateUrl: 'components/info/profile/profile-info.component.html',
            controller: ['$http', profileController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

     function profileController($http) {

        var model = this;
        model.user = {};
        // model.user.id = "e89faed1-f000-40ec-99d7-01c40e9d4e6b";
        model.checked = false;
        model.user.id = model.userId;
        console.log(model);

        model.$onInit = function () {
            console.log("init works");
            $http({
                method: "POST",
                url: USER_PATH + "/showUsers",
                params: model.user
            }).then(function mySuccess(response) {
                model.user.name = response.data.name;
                model.user.surname = response.data.surname;
                model.user.age = response.data.age;
            }, function myError(response) {
            });
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
