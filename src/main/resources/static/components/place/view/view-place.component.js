(function () {
    'use strict';
    angular.module('viewPlaceApp')
        .component('viewPlaceComp', {
            templateUrl: 'components/place/view/view-place.component.html',
            controller: ['$http', viewController],
            controllerAs: 'model',
            bindings: {
                friend: '='
            }
        });

    function viewController($http) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
