(function () {
    'use strict';
    angular.module('findApp')
        .component('findComp', {
            templateUrl: 'components/find/find.component.html',
            controller: ['$http', findController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function findController($http) {

        var model = this;

        model.$onInit = function () {
        }

    }
})();
