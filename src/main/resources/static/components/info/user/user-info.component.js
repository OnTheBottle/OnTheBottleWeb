(function () {
    'use strict';
    angular.module('userInfoApp')
        .component('userInfoComp', {
            templateUrl: 'components/info/user/user-info.component.html',
            controller: ['$http', '$cookies', InfoController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function InfoController($http, $cookies) {

        var model = this;
        model.requestData = {};
        model.requestData.id = '';

        model.$onInit = function () {
            console.log("showUser works");
            model.requestData.id = $cookies.get('infoId');
            console.log('USER-INFO model.requestData.id: ', model.requestData.id);

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
