(function () {
    'use strict';
    angular.module('mainApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function NewsController() {

        var model = this;
        model.posts = [];
        model.friends = [];
        const NEWS_PATH = 'http://127.0.0.1:8083';

        model.$onInit = function () {
            getNewsPosts($http, model.userId);
        }

        function getNewsPosts($http, userId) {
            $http({
                method: "POST",
                url: NEWS_PATH + "/getfriendsposts",
                params: {id: userId}
            }).then(function mySuccess(response) {
                //console.log('response: ', response.data);
                $scope.friends = adapterFriendArray(response.data[0]);
                $scope.posts = adapterPostArray(response.data[1]);
                console.log('response data1:\n', response.data[1]);
                console.log('response posts:\n', $scope.posts);
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
