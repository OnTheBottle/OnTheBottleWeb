(function () {
    'use strict';
    angular.module('postNewsApp')
        .component('postNewsComp', {
            templateUrl: 'components/news/post/post-news.component.html',
            controller: ['$http', PostController],
            controllerAs: 'model',
            bindings: {
                userId: '=',
                post: '='
            }
        });

    function PostController($http) {
        var model = this;
        model.isViewComments;

        model.$onInit = function () {
        };

        model.changeFavorite = function () {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/favorite/change",
                params: {
                    userId: model.userId,
                    postId: model.post.id
                }
            }).then(function mySuccess(response) {
                model.post.isFavorite = response.data;
            }, function myError(response) {
                console.log(response.statusText, 'changeFavorite: Sorry, I am tired');
            });
        };

        model.changeLike = function () {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/like/change",
                params: {
                    userId: model.userId,
                    postId: model.post.id
                }
            }).then(function mySuccess(response) {
                model.post.isLike = response.data;
                if (response.data) {
                    model.post.likeCount++;
                }else{
                    model.post.likeCount--;
                }
            }, function myError(response) {
                console.log(response.statusText, 'changeLike: Sorry, I am tired');
            });
        }

        model.viewComments = function () {
            model.isViewComments = !model.isViewComments;
            console.log('model.isViewComments: ', model.isViewComments);
        }
    }
})();
