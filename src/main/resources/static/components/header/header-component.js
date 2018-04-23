(function () {
    'use strict';
    angular.module('mainApp')
        .component('headerComp', {
            templateUrl: 'components/header/header-component.html',
            controller: ['$http', HeaderController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function HeaderController($http) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
