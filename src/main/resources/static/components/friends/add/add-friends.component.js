(function () {
    'use strict';
    angular.module('addFriendsApp')
        .component('addFriendsApp', {
            templateUrl: 'components/friends/add/add-friends.component.html',
            controller: ['$http', AddController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function AddController($http) {

        var model = this;

        model.$onInit = function () {
        }

    }
})();
