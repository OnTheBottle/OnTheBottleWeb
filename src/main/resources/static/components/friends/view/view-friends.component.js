(function () {
    'use strict';
    angular.module('viewFriendsApp')
        .component('viewFriendsComp', {
            templateUrl: 'components/friends/view/view-friends.component.html',
            controller: ['$http', viewController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function viewController($http) {

        var model = this;

        model.$onInit = function () {
            console.log('view $onInit friends userId:', model.userId);
            getFriendsByUserId(model.userId);
        };

/*
        model.$onChanges = function () {
            console.log('view $onChanges friends userId:', model.userId);
        };

*/
        function getFriendsByUserId(userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_friends_by_userid",
                params: {id: userId}
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response friends: ', model.friends);
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
