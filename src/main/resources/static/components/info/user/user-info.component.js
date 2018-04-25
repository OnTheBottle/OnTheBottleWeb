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

        model.$onInit = function () {
        }

    }
})();
