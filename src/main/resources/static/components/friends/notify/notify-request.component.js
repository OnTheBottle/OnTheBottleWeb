(function () {
    'use strict';
    angular.module('notifyFriendRequestApp')
        .component('notifyFriendRequestComp', {
            templateUrl: 'components/friends/notify/notify-request.component.html',
            controller: ['$http', '$cookies', notifyController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function notifyController($http, $cookies) {

        var model = this;

        model.$onInit = function () {
            console.log('notifyController model.userId: ', model.userId);
            getUsersWantRelationship();
        };

        function getUsersWantRelationship() {
            console.log('notifyController access_token: ', $cookies.get('access_token'));
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_users_want_relationship",
                params: {access_token: $cookies.get('access_token')}
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response notconfirmed friends: ', model.friends);
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
