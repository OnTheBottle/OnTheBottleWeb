(function () {
    'use strict';
    angular.module('friendApp')
        .component('friendComp', {
            templateUrl: 'components/friends/friend/friend.component.html',
            controller: ['$http', '$cookies', FriendController],
            controllerAs: 'model',
            bindings: {
                friend: '=',
            }
        });

    function FriendController($http, $cookies) {

        var model = this;

        model.$onInit = function () {
        }

        model.setUserInfoId = function (id) {
            $cookies.put('infoId', id);
        }
    }
})();
