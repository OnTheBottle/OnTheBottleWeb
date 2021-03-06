(function () {
    'use strict';

    angular.module('linkFriendsApp')
        .component('linkFriendsComp', {
            templateUrl: 'components/friends/link/link-friends.component.html',
            controller: ['$http', '$route', linkController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function linkController($http, $route) {

        var model = this;
        model.friends = [];

        model.$onInit = function () {
            getAllUser();
        };

        function getAllUser() {
            $http({
                method: "POST",
                url: USER_PATH + "/user/get_all"
            }).then(function mySuccess(response) {
                model.friends = response.data;
            }, function myError(response) {
                alert(response.statusText);
            });
        }

        model.addOneWayRelation = function (firstFriend, secondFriend) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/manual_add_oneway_relation",
                params: {
                    firstFriendId: firstFriend.id,
                    secondFriendId: secondFriend.id
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
                getAllUser();
                $route.reload();
            }, function myError(response) {
                alert(response.statusText);
            });
        };

        model.addTwoWayRelation = function (firstFriend, secondFriend) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/manual_add_twoway_relation",
                params: {
                    firstFriendId: firstFriend.id,
                    secondFriendId: secondFriend.id
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
                getAllUser();
                $route.reload();
            }, function myError(response) {
                alert(response.statusText);
            });
        };
    }
})();
