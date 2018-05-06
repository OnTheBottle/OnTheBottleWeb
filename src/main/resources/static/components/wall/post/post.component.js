'use strict';

angular.module('post').
    component('post', {
    templateUrl: 'components/wall/post/post.template.html',
    controller: ['$routeParams', 'LikeFactory', 'PostFactory', 'CommentFactory', 'UserFactory', 'idStorage',
        function PostController($routeParams, LikeFactory, PostFactory, CommentFactory, UserFactory, idStorage) {
            var self = this;
            self.userid = idStorage.getId();
            self.user={name:'',surname:'',avatarUrl:''};
            self.commenting = '';
            self.comment = {id: null, user_id: self.userid, post_id: null, comment: ''};

            self.getUser=function (id) {
                console.log('userId',id);
                UserFactory.getUsr({userId: id},function (data) {
                    self.user.name = data.name;
                    self.user.surname=data.surname;
                    self.user.avatarUrl=data.avatarUrl;
                    },
                    function (errResponce) {
                        console.error('Error while get User');

                });
            };

            self.update = function () {
                this.getPosts()
            };

            this.dropPost = function (id) {
                PostFactory.dropPost({id: id}, function (data) {
                    self.update()

                }, function (errResponse) {
                    console.error('Error while deleting Post');
                })
            };

            this.keyPressed = function (keyEvent, post_id) {
                if (keyEvent.keyCode === 13) {
                    console.log('comm', self.commenting);
                    submitComment(post_id, self.commenting);
                }
            };

            function submitComment(post_id, comment) {
                if (post_id === null) {
                    console.log('Error while creating Comment', post_id);
                } else {
                    console.log('Created comment', post_id);
                    CommentFactory.createComment({
                        user_id: self.userid,
                        post_id: post_id,
                        comment: comment
                    }, function (data) {
                        resetComment();
                        self.update();
                        console.log('Created comment');

                    }, function (errResponse) {
                        console.error('Error while creating Comment');
                    })
                }
            }

            function resetComment() {
                self.commenting = '';
            }

            this.like = function (id) {
                LikeFactory.addLike({post_id: id,user_id: self.userid, status: 'like'},
                function (data, headers, statusCode) {
                    if (statusCode === 204) {
                        self.warning = "your regard will be added some times before";
                    }
                    if (statusCode === 200) {
                        self.update();
                        self.warning = 'like added';
                    }
                }, function (errResponse) {
                    console.error('Error while adding like');
                })
            };

            this.dislike = function (id) {
                LikeFactory.addLike({post_id: id, user_id: self.userid, status: 'dislike'},
                    function (data, headers, statusCode) {
                        if (statusCode === 204) {
                            self.warning = "your regard will be added some times before";
                        }
                        if (statusCode === 200) {
                            self.update();
                            self.warning = 'dislike added';
                        }
                    }, function (errResponse) {
                        console.error('Error while adding dislike');
                    })
            };

            this.clear = function () {
                self.warning = ''
            }

        }],
    bindings: {

        getPosts: '&',
        orderProp: '=',
        post: '=',
        userId:'='
    }

});

