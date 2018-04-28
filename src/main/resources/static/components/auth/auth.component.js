(function () {
    'use strict';
    angular.module('authApp')
        .component('authComp', {
            templateUrl: 'components/auth/start-auth.component.html',
            controller: ['$http', '$window', AuthController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    //AuthController.$inject = ['$window'];

    function AuthController($http, $window) {
        console.log('start authController');

        var model = this;
        model.authData = {};
        model.authData.login = '';
        model.authData.password = '';

        model.$onInit = function () {
            console.log('start authController $onInit');
        }

        model.auth = function () {
            console.log('start authController auth');
            console.log('authData: ', model.authData);
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
                if (response.data.token !== null) {
                    model.isAuthUser = true;
                    model.token = response.data.token;
                    token = response.data.token;
                    $window.location.href = 'test_news_index.html';
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
