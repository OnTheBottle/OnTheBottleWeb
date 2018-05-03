(function () {
    'use strict';
    angular.module('friendApp')
        .component('friendComp', {
            templateUrl: 'components/friends/friend/friend.component.html',
            controller: [FriendController],
            controllerAs: 'model',
            bindings: {
                friend: '=',
            }
        });

    function FriendController() {

        var model = this;

        model.$onInit = function () {
        }
    }
})();
