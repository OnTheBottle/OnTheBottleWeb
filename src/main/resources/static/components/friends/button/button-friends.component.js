(function () {
    'use strict';
    angular.module('buttonFriendsApp')
        .component('buttonFriendsComp', {
            templateUrl: 'components/friends/button/button-friends.component.html',
            controller: ['$http', '$cookies', '$route', '$localStorage', AddController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function AddController($http, $cookies, $route, $localStorage) {
        var cache = $localStorage;
        var model = this;

        model.$onInit = function () {
            getStatusByUserId(model.userId);
        };

        function getStatusByUserId(userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_status",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                model.user = response.data;
                //cache.friends = response.data;
            }, function myError(response) {
                console.log('Error response user: ', response.statusText);
            });
        }

        model.denyRelation = function (userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/remove_relationship",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                getFriendsByUserId(cache.authId);
                $route.reload();
            }, function myError(response) {
                console.log('Error response user: ', response.statusText);
            });
        };

        model.confirmRelation = function (userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/add_oneway_relation",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                //getFriendsByUserId(cache.authId);
                $route.reload();
            }, function myError(response) {
                console.log('Error response user: ', response.statusText);
            });
        };

        model.invite = model.confirmRelation;

        function getFriendsByUserId(userId) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/get_confirmed_friends",
                params: {
                    access_token: $cookies.get('access_token'),
                    userId: userId
                }
            }).then(function mySuccess(response) {
                cache.friends = response.data;
            }, function myError(response) {
                console.log('Error response friends: ', response.statusText);
            });
        }

    }
})();
