(function () {
    'use strict';
    angular.module('friendApp')
        .component('friendComp', {
            templateUrl: 'components/friends/friend/friend.component.html',
            controller: ['$http', '$cookies', '$route', FriendController],
            controllerAs: 'model',
            bindings: {
                friend: '='
            }
        });

    function FriendController($http, $cookies, $route) {

        var model = this;

        model.$onInit = function () {
        }

        model.denyRelation = function () {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/remove_relationship",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: model.friend.id
                }
            }).then(function mySuccess(response) {
                console.log('denyRelation: done');
                $route.reload();
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

        model.confirmRelation = function () {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/add_oneway_relation",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: model.friend.id
                }
            }).then(function mySuccess(response) {
                console.log('confirmRelation: done');
                $route.reload();
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }
    }
})();
