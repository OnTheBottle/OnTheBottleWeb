'use strict';

angular.module('post',{
templateUrl: 'components/wall/post/post.template.html',
    controller: ['$routeParams','CommentFactory','LikeFactory',
    function PostController($routeParams, CommentFactory,LikeFactory) {
        self.commenting = '';
        self.comment = {id: null, user_id: $routeParams.userId, post_id: null, comment: ''};

        self.keyPressed = keyPressed;
        self.like = like;
        self.dislike = dislike;

        function like(id) {
            LikeFactory.addLike({post_id: id, user_id: $routeParams.userId, status: 'like'}, function (data) {
                console.log('like added')

            }, function (errResponse) {
                console.error('Error while adding like');
            })
        }

        function dislike(id) {
            LikeFactory.addLike({post_id: id, user_id: $routeParams.userId, status: 'dislike'}, function (data) {
                console.log('dislike added')

            }, function (errResponse) {
                console.error('Error while adding dislike');
            })
        }

        function keyPressed(keyEvent, post_id) {
            if (keyEvent.keyCode === 13) {
                console.log('comm', self.commenting);
                submitComment(post_id, self.commenting);
            }
        }

        function submitComment(post_id, comment) {
            if (post_id === null) {
                console.log('Error while creating Comment', post_id);
            } else {
                console.log('Created comment', post_id);
                CommentFactory.createComment({
                    user_id: self.userId,
                    post_id: post_id,
                    comment: comment
                }, function (data) {
                    resetComment();
                    console.log('Created comment');
                }, function (errResponse) {
                    console.error('Error while creating Comment');
                })

            }
        }

        function resetComment() {
            self.commenting = '';
        }


    }],
    bindings: {
    post: '='
}

});

