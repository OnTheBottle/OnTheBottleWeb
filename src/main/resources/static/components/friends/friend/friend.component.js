(function () {
    'use strict';
    angular.module('friendApp')
        .component('friendComp', {
            templateUrl: 'components/friends/friend/friend.component.html',
            controller: ['$http', FriendController],
            controllerAs: 'model',
            bindings: {
                friend: '='
            }
        });

    function FriendController($http) {

        var model = this;

        model.$onInit = function () {
        }

    }
})();
