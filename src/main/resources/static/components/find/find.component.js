(function () {
    'use strict';
    angular.module('findApp')
        .component('findComp', {
            templateUrl: 'components/find/find.component.html',
            controller: ['$routeParams', '$http', findController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function findController($routeParams, $http) {

        var model = this;

        model.$onInit = function () {
            //console.log('findController model.userId: ', model.userId);
            model.whatToFind = $routeParams.whatToFind;
            //console.log('findController model.whatToFind: ', model.whatToFind);
        }

    }
})();
