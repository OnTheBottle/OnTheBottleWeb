(function () {
    'use strict';
    angular.module('newsApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function NewsController($http) {

        var model = this;
        model.posts = [];
        model.friends = [];

        model.$onInit = function () {
            console.log('userId: ', model.userId);
            getNewsPosts(model.userId);
        }

        function getNewsPosts(userId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {id: userId}
            }).then(function mySuccess(response) {
                //console.log('response: ', response.data);
                //$scope.friends = adapterFriendArray(response.data[0]);
                //$scope.posts = adapterPostArray(response.data[1]);
                console.log('response data1:\n', response.data[0]);
                console.log('response data2:\n', response.data[1]);
                //console.log('response posts:\n', $scope.posts);
            }, function myError(response) {
                alert(response.statusText);
            });
        }

        this.likeClick = function () {
            console.log('I click like!');
        }

        this.favoriteClick = function () {
            console.log('I click favorite');
        }

    }
})();
