(function () {
    'use strict';
    angular.module('mainApp')
        .component('friendsComp', {
            templateUrl: 'components/friends/friends-component.html',
            controller: ['$http', friendsController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    const USER_PATH = 'http://127.0.0.1:8081';
    const PLACE_PATH = 'http://127.0.0.1:8082';
    const MESSAGE_PATH = 'http://127.0.0.1:8083';

    function friendsController($http) {

        var model = this;
        model.friends = [];

        model.$onInit = function () {
            getAllUser();
        }

        function getAllUser() {
            $http({
                method: "POST",
                url: USER_PATH + "/user/get_all"
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response: ', model.friends);
            }, function myError(response) {
                alert(response.statusText);
            });
        }

        model.addOneWayRelation = function (firstFriend, secondFriend) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/add_oneway_relation",
                params: {
                    firstFriendId: firstFriend.id,
                    secondFriendId: secondFriend.id
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response: ', model.friends);
                getAllUser();
            }, function myError(response) {
                alert(response.statusText);
            });
        };

        model.addTwoWayRelation = function (firstFriend, secondFriend) {
            $http({
                method: "POST",
                url: USER_PATH + "/friend/add_twoway_relation",
                params: {
                    firstFriendId: firstFriend.id,
                    secondFriendId: secondFriend.id
                }
            }).then(function mySuccess(response) {
                model.friends = response.data;
                console.log('response: ', model.friends);
                getAllUser();
            }, function myError(response) {
                alert(response.statusText);
            });
        };

    }
})();
