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
        model.tmpUser = {};
        // model.user.id = "e89faed1-f000-40ec-99d7-01c40e9d4e6b";

        model.$onInit = function () {
            model.checked = false;
            model.user.id = model.userId;
            model.showUser();
        };

        model.showUser = function () {
            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.user
            }).then(function mySuccess(response) {
                model.user = model.myClone(response.data);
            }, function myError(response) {
            });
        };

        model.cancel = function () {
            model.checked = false;
            model.user = model.myClone(model.tmpUser);
        };

        model.editUser = function () {
            model.checked = true;
            model.tmpUser = model.myClone(model.user);
        };

        model.saveEditUser = function () {
            model.checked = false;
            $http({
                method: "POST",
                url: USER_PATH + "/editProfile",
                params: model.user
            }).then(function mySuccess(response) {
            }, function myError(response) {
            });
        };

        model.myClone = function (copyFrom) {
            var copyTo = {};
            copyTo.name = copyFrom.name;
            copyTo.surname = copyFrom.surname;
            copyTo.age = copyFrom.age;
            copyTo.email = copyFrom.email;
            copyTo.country = copyFrom.country;
            copyTo.city = copyFrom.city;
            copyTo.avatarUrl = copyFrom.avatarUrl;
            copyTo.status = copyFrom.status;
            copyTo.info = copyFrom.info;
            copyTo.id = model.userId;
            return copyTo;
        }
    }
})();
