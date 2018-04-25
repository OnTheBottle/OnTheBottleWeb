(function () {
    'use strict';
    angular.module('profileInfoApp')
        .component('profileInfoComp', {
            templateUrl: 'components/info/profile/profile-info.component.html',
            controller: ['$http', profileController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function profileController($http) {

        var model = this;

        model.$onInit = function () {
        }

    }
})();
