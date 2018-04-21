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

    const USER_PATH = 'http://127.0.0.1:8081';
    const PLACE_PATH = 'http://127.0.0.1:8082';
    const MESSAGE_PATH = 'http://127.0.0.1:8083';

    function HeaderController($http) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
