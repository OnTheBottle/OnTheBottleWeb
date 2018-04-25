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

        model.$onInit = function () {
        }

    }
})();
