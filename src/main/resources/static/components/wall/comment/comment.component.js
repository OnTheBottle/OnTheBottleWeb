'use strict';

angular.module('comment').component('comment', {
    templateUrl: 'components/wall/comment/comment.template.html',
    controller: ['$routeParams', 'CommentFactory', 'UserFactory', '$localStorage', 'UsersIdEmptyInfo',
        function PostController($routeParams, CommentFactory, UserFactory, $localStorage, UsersIdEmptyInfo) {
            var self = this;
            self.user = {};

            self.getUser = function (id, lastComment, lastPost) {
                self.user = $localStorage.users.getUser(id);
                if (!self.user) {
                    UsersIdEmptyInfo.setId(id);
                }
                if (lastPost && lastComment) {
                    if(UsersIdEmptyInfo.getUsersId().length!==0){
                        getUsersInfo();
                    }
                }
            };

            function getUsersInfo(){
                UserFactory.getSmallInfoAboutUsers(UsersIdEmptyInfo.getUsersId(), function (data) {
                        data.forEach(function (userPost) {
                            $localStorage.users.addUser(userPost);
                        });
                        UsersIdEmptyInfo.setIdUsersEmpty();
                    },
                    function (errResponce) {
                        console.error('Error while fetching posts');
                    })
            }

            self.buttonDeleteCommentIsActive = function (userId) {
                var user = $localStorage.authUser;
                if (user.id === userId) {
                    return true
                }
                else {
                    return false
                }
            };

            self.deleteComment = function (commentId) {
                CommentFactory.deleteComment({commentId: commentId}, function (data) {
                    self.dropComment(commentId);
                }, function (errResponse) {
                    console.error('Error while deleting Comment');
                })
            }
        }],
    bindings: {
        dropComment: '=',
        comment: '=',
        lastComment: '=',
        lastPost: '='
    }
});
