(function () {
    'use strict';
    angular.module('userInfoApp')
        .component('userInfoComp', {
            templateUrl: 'components/info/user/user-info.component.html',
            controller: ['$routeParams', '$http', InfoController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function InfoController($routeParams, $http) {

        var model = this;
        model.requestData = {};
        model.requestData.id = '';
        model.user = {};

        model.$onInit = function () {
            console.log("showUser works");
            model.requestData.id = $routeParams.id;

            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.requestData
            }).then(function mySuccess(response) {
                // console.log('response userInfo: ', response.data.name);
                model.user.name = response.data.name;
                model.user.surname = response.data.surname;
                model.user.age = response.data.age;
                model.user.email = response.data.email;
                model.user.country = response.data.country;
                model.user.city = response.data.city;
                if (response.data.avatarUrl) {
                    model.user.avatarUrl = response.data.avatarUrl;
                }
                else {
                    model.user.avatarUrl = "images/userspictures/default-avatar.jpeg";
                }
                model.user.status = response.data.status;
                model.user.info = response.data.info;
            }, function myError(response) {
            });
        }
    }
})();
