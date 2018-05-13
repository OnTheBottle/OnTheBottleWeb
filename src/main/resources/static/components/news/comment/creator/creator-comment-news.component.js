(function () {
    'use strict';
    angular.module('creatorCommentNewsApp')
        .component('creatorCommentNewsComp', {
            templateUrl: 'components/news/comment/creator/creator-comment-news.component.html',
            controller: ['$http', '$cookies', '$route', CreatorController],
            controllerAs: 'model',
            bindings: {
                postId: '=',
            }
        });

    function CreatorController($http, $cookies, $route) {

        var model = this;

        model.$onInit = function () {
        }

        model.addComment = function (text) {
            var access_token = $cookies.get('access_token');
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/comment/add",
                params: {
                    access_token: access_token,
                    postId: model.postId,
                    text: text
                }
            }).then(function mySuccess(response) {
                if (response.data === true) {
                    console.log('Added new comment');
                    $route.reload();
                }
            }, function myError(response) {
                console.log(response.statusText, 'addComment: Sorry, I am tired');
            });
        }

    }
})
();
