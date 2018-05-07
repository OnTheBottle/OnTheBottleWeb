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

        model.$onInit = function () {
            model.checked = false;
            model.user.id = model.userId;
            // console.log('profile-info - userId: ', model.user.id);
            // $http({
            //     method: "GET",
            //     url: USER_PATH + "/showUsers",
            //     params: model.user
            // }).then(function mySuccess(response) {
            //     model.user.name = response.data.name;
            //     model.user.surname = response.data.surname;
            //     model.user.age = response.data.age;
            //     model.user.email = response.data.email;
            //     model.user.country = response.data.country;
            //     model.user.city = response.data.city;
            //     model.user.avatarUrl = response.data.avatarUrl;
            //     model.user.status = response.data.status;
            // }, function myError(response) {
            // });
            model.showUser();
        };

        model.showUser = function () {
            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.user
            }).then(function mySuccess(response) {
                model.user.name = response.data.name;
                model.user.surname = response.data.surname;
                model.user.age = response.data.age;
                model.user.email = response.data.email;
                model.user.country = response.data.country;
                model.user.city = response.data.city;
                model.user.avatarUrl = response.data.avatarUrl;
                model.user.status = response.data.status;
            }, function myError(response) {
            });
        };

        model.cancel = function () {
            model.checked = false;
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
