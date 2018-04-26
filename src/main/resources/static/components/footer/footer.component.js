(function () {
    'use strict';
    angular.module('footerApp')
        .component('footerComp', {
            templateUrl: 'components/footer/footer.component.html',
            controller: ['$http', footerController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function footerController($http) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
