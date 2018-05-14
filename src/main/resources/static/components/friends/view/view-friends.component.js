(function () {
    'use strict';
    angular.module('viewFriendsApp')
        .component('viewFriendsComp', {
            templateUrl: 'components/friends/view/view-friends.component.html',
            controller: ['$http', '$cookies', viewController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function viewController($http, $cookies) {

        var model = this;

        model.$onInit = function () {
            getFriendsByUserId(model.userId);
        };

        function getFriendsByUserId(userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_confirmed_friends",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
