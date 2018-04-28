(function () {
    'use strict';
    angular.module('userInfoApp')
        .component('userInfoComp', {
            templateUrl: 'components/info/user/user-info.component.html',
            controller: ['$http', infoController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function infoController($http) {

        var model = this;
        model.requestData = {};
        model.requestData.id = "0f24d8a4-9176-42a5-bc52-affb483e3308";
        model.$onInit = function () {
        }
        model.showUser = function(){
            console.log("init works");
            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.requestData
            }).then(function mySuccess(response) {
                console.log('response userInfo: ', response.data.name);
                model.userName = response.data.name;
            }, function myError(response) {
            });
        }

    }
})();
