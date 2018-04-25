(function () {
    'use strict';
    angular.module('authApp')
        .component('authComp', {
            templateUrl: 'components/auth/auth.component.html',
            controller: ['$http', AuthController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function AuthController($http) {

        var model = this;

        model.$onInit = function () {
        }

    }
})();
