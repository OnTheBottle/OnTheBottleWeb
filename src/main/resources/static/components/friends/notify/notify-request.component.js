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
            getUsersWantRelationship(model.userId);
        };

        function getUsersWantRelationship(userId) {
            console.log('notifyController access_token: ', $cookies.get('access_token'));
            console.log('notifyController userId: ', userId);
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_notconfirmed_friends",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response notconfirmed friends: ', model.friends);
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
