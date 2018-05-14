(function () {
    'use strict';
    angular.module('creatorCommentNewsApp')
        .component('creatorCommentNewsComp', {
            templateUrl: 'components/news/comment/creator/creator-comment-news.component.html',
            controller: ['$http', '$cookies', CreatorController],
            controllerAs: 'model',
            bindings: {
                post: '<',
            }
        });

    function CreatorController($http, $cookies) {

        var model = this;

        model.$onInit = function () {
        }

        model.addComment = function () {
            var access_token = $cookies.get('access_token');
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/comment/add",
                params: {
                    access_token: access_token,
                    postId: model.post.id,
                    text: model.text
                }
            }).then(function mySuccess(response) {
                if (response.data != null) {
                    var comment = response.data;
                    model.post.comments.push(comment);
                    model.text = '';
                    model.post.commentCount++;
                }
            }, function myError(response) {
                console.log(response.statusText, 'addComment: Sorry, I am tired');
            });
        }



    }
})
();
