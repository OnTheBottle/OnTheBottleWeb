(function () {
    'use strict';
    angular.module('mainApp')
        .component('footerComp', {
            templateUrl: 'components/footer/footer-component.html',
            controller: ['$http', FooterController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    const USER_PATH = 'http://127.0.0.1:8081';
    const PLACE_PATH = 'http://127.0.0.1:8082';
    const MESSAGE_PATH = 'http://127.0.0.1:8083';

    function FooterController($http) {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
