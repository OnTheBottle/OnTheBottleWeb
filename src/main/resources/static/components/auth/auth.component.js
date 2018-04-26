(function () {
    'use strict';
    angular.module('authApp')
        .component('authComp', {
            templateUrl: 'components/auth/auth.component.html',
            controller: ['$http', authController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function authController($http) {

        var model = this;
        model.authData = {};
        model.authData.login = '';
        model.authData.password = '';

        model.$onInit = function () {
        }

        model.auth = function () {
            console.log('Auth User: ', model.authData);
            if (model.authData.login === '' || model.authData.password === '') {
                return;
            }
            model.isAuthUser = '';
            $http({
                method: "POST",
                url: USER_PATH + "/auth/authorigation",
                params: model.authData
            }).then(function mySuccess(response) {
                console.log('response Auth: ', response.data);
                if (response.data.userId !== null) {
                    model.isAuthUser = true;
                    model.userId = response.data.userId;
                } else {
                    model.isAuthUser = false;
                }
            }, function myError(response) {
                // model.isAuthUser = false;
                console.log('error Auth: ', response.statusText);
            });
        }

    }
})();
