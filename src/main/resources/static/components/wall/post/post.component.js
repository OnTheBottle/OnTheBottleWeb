'use strict';

angular.module('post')
    .service('postIdStorage', function () {
        var massiv = null;

        return {
            setId: function (mass) {
                massiv = mass;


            },
            getId: function () {
                return massiv;

            }
        }
    })

    .component('post', {
        templateUrl: 'components/wall/post/post.template.html',
        controller: ['$routeParams', 'LikeFactory', 'PostFactory', 'CommentFactory', 'UserFactory', 'idStorage', 'postIdStorage',
            function PostController($routeParams, LikeFactory, PostFactory, CommentFactory, UserFactory, idStorage, postIdStorage) {
                var self = this;
                self.userid = idStorage.getId();
                self.user = {name: '', surname: '', avatarUrl: ''};
                self.commenting = '';
                self.comment = {id: null, user_id: self.userid, post_id: null, comment: ''};
                self.random = '';
                random();

                self.$onInit = function () {
                    console.log('ready!')
                };

                self.getUser = function (id, postId) {
                    console.log('userId', id);
                    UserFactory.getUsr({userId: id}, function (data) {
                            self.user.name = data.name;
                            self.user.surname = data.surname;
                            self.user.avatarUrl = data.avatarUrl;
                            counter(postId);
                        },
                        function (errResponce) {
                            console.error('Error while get User');
                        });
                };

                self.focus = function () {
                    var id = self.random;
                    var string = '#' + id;
                    $(string).focus()
                };
                self.update = function () {
                    this.getPosts()
                };

                function random() {
                    self.random = Math.floor(Math.random() * 100000);
                }

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
                    LikeFactory.addLike({post_id: id, user_id: self.userid, status: 'like'},
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
                };

                this.open = function (id) {
                    console.log('open with', id);
                    information(id);
                };

                function counter(id) {
                    self.countLike = 0;
                    self.countDislike = 0;
                    var countL = 0;
                    var countD = 0;
                    LikeFactory.getLikes({postId: id}, function (data) {
                            data.forEach(function (value) {
                                if (value.status === 'like') {
                                    countL++
                                }
                                else {
                                    countD++
                                }
                            });
                            self.countLike = countL;
                            self.countDislike = countD;
                        },
                        function (errResponce) {
                            console.log('Error while fetching likes list')
                        }
                    )
                }

                function information(id) {
                    console.log('postId', id);
                    LikeFactory.getLikes({postId: id}, function (data) {

                            var likes = data;

                            likes.forEach(function (value) {

                                getLikeUser(value.user.id, value.status);
                            })
                        },
                        function (errResponce) {
                            console.log('Error while fetching likes list')
                        }
                    )
                }

                function getLikeUser(id, status) {
                    UserFactory.getUsr({userId: id}, function (data) {
                        var userLike = {name: '', surname: '', avatarUrl: ''};
                        userLike.name = data.name;
                        userLike.surname = data.surname;
                        userLike.avatarUrl = data.avatarUrl;
                        getLikeData(status, userLike)
                    });
                }

                function getLikeData(status, user) {
                    var likesUser = [];
                    var likeData = {};
                    likeData.userName = user.name;
                    likeData.userSurname = user.surname;
                    likeData.userAvatarUrl = user.avatarUrl;
                    likeData.status = status;
                    likesUser.push(likeData);
                    getLikesUser(likesUser)
                }

                function getLikesUser(lu) {
                    self.setLikesUser(lu);
                }
            }],

        bindings: {
            getPosts: '&',
            orderProp: '=',
            post: '=',
            userId: '=',
            setLikesUser: '='
        }

    });

