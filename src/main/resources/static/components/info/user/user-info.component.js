(function () {
    'use strict';
    angular.module('userInfoApp')
        .component('userInfoComp', {
            templateUrl: 'components/info/user/user-info.component.html',
            controller: ['$routeParams', '$http', InfoController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function InfoController($routeParams, $http) {

        var model = this;
        model.requestData = {};
        model.requestData.id = '';

        model.$onInit = function () {
            console.log("showUser works");
            model.requestData.id = $routeParams.id;

            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.requestData
            }).then(function mySuccess(response) {
                console.log('response userInfo: ', response.data.name);
                model.userName = response.data.name;
                model.userSurname = response.data.surname;
                model.userAge = response.data.age;
            }, function myError(response) {
            });
        }
    }
})();
