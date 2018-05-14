(function () {
    'use strict';
    angular.module('postNewsApp')
        .component('postNewsComp', {
            templateUrl: 'components/news/post/post-news.component.html',
            controller: ['$http', '$cookies', PostController],
            controllerAs: 'model',
            bindings: {
                userId: '=',
                post: '='
            }
        });

    function PostController($http, $cookies) {
        var model = this;

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

        model.changeStateLike = function () {
            var access_token = $cookies.get('access_token');
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/like/change_like",
                params: {
                    access_token: access_token,
                    postId: model.post.id
                }
            }).then(function mySuccess(response) {
                if (response.data > 0) {
                    model.post.likeCount++;
                    model.post.isLike = true;
                    if (model.post.isDislike) {
                        model.post.dislikeCount--;
                        model.post.isDislike = false;
                    }
                }
                if (response.data < 0) {
                    model.post.likeCount--;
                    model.post.isLike = false;
                }
            }, function myError(response) {
                console.log(response.statusText, 'changeLike: Sorry, I am tired');
            });
        }

        model.changeStateDislike = function () {
            var access_token = $cookies.get('access_token');
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/like/change_dislike",
                params: {
                    access_token: access_token,
                    postId: model.post.id
                }
            }).then(function mySuccess(response) {
                if (response.data > 0) {
                    model.post.dislikeCount++;
                    model.post.isDislike = true;
                    if (model.post.isLike) {
                        model.post.likeCount--;
                        model.post.isLike = false;
                    }
                }
                if (response.data < 0) {
                    model.post.dislikeCount--;
                    model.post.isDislike = false;
                }
            }, function myError(response) {
                console.log(response.statusText, 'changeDislike: Sorry, I am tired');
            });
        }

        model.viewComments = function () {
            model.isViewComments = !model.isViewComments;
            console.log('model.isViewComments: ', model.isViewComments);
        }

        model.deleteComment = function (commentId) {
            console.log('deleteComment commentId:', commentId);
            var access_token = $cookies.get('access_token');
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/comment/delete",
                params: {
                    access_token: access_token,
                    commentId: commentId
                }
            }).then(function mySuccess(response) {
                console.log('return to deleteComment:', response.data);
                if (response.data === true) {
                    for (var x in model.post.comments){
                        if (model.post.comments[x].id === commentId){
                            model.post.comments.splice(x,1);
                        }
                    }
                    model.post.commentCount--;
                }
            }, function myError(response) {
                console.log(response.statusText, 'addComment: Sorry, I am tired');
            });
        }

    }
})();
