(function () {
    'use strict';
    angular.module('viewPlaceApp')
        .component('viewPlaceComp', {
            templateUrl: 'components/place/view/view-place.component.html',
            controller: ['$http', '$cookies', '$route', viewController],
            controllerAs: 'model',
            bindings: {
                friend: '='
            }
        });

    function viewController($http, $cookies, $route) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
