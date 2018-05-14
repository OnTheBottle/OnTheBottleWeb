(function () {
    'use strict';
    angular.module('authApp')
        .component('authComp', {
            templateUrl: 'components/auth/start-auth.component.html',
            controller: ['$http', '$window', '$cookies', AuthController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    //AuthController.$inject = ['$window'];

    function AuthController($http, $window, $cookies) {

        var model = this;
        model.authData = {};
        model.authData.login = '';
        model.authData.password = '';

        model.$onInit = function () {
        }

        model.auth = function () {
            if (model.authData.login === '' || model.authData.password === '') {
                return;
            }
            model.isAuthUser = '';
            $http({
                method: "POST",
                url: USER_PATH + "/auth/authorization",
                params: model.authData
            }).then(function mySuccess(response) {
                if (response.data.token !== null) {
                    //model.isAuthUser = true;
                    $cookies.put('access_token',response.data.token);
                    $window.location.href = INDEX_FILE;
                } else {
                    model.isAuthUser = false;
                }
            }, function myError(response) {
                model.isAuthUser = false;
                console.log('error Auth: ', response.statusText);
            });
        }

    }
})();
