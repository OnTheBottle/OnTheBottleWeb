'use strict';

angular.module('post')
    .component('post', {
        templateUrl: 'components/wall/post/post.template.html',
        controller: ['$routeParams', 'LikeFactory', 'PostFactory', 'CommentFactory', 'UserFactory', 'idStorage', 'Lightbox', '$localStorage', 'UsersIdEmptyInfo',
            function PostController($routeParams, LikeFactory, PostFactory, CommentFactory, UserFactory, idStorage, Lightbox, $localStorage, UsersIdEmptyInfo) {
                var self = this;
                self.userid = idStorage.getId();
                //      self.user = {name: '', surname: '', avatarUrl: ''};
                self.user = {};
                self.commenting = '';
                self.comment = {id: null, user_id: self.userid, post_id: null, comment: ''};
                self.random = '';
                self.images = [];
                self.likesFromPost = [];
                self.countLike = 0;
                self.countDislike = 0;
                self.comments = [];
                self.images = [];
                self.description = function (string) {
                    if (string === "Anybody views a post") {
                        return 'globe'
                    }
                    if (string === "Friends view a post") {
                        return 'friend'
                    }
                    if (string === "Only owner views a post") {
                        return 'self'
                    }
                };
                random();

                self.getUser = function (id, postId, images, likes, comments) {
                    self.comments = comments;
                    self.images = images;
                    self.likesFromPost = likes;
                    console.log('self.likes', self.likesFromPost);
                    showStates(self.likesFromPost);
                    showStateComment(self.comments);
                    self.user = $localStorage.users.getUser(id);

                    if (!self.user) {
                        UsersIdEmptyInfo.setId(id);
                    }
                    self.likesFromPost.forEach(function (like) {
                        var idUserLike = like.user.id;
                        if (!$localStorage.users.getUser(idUserLike)) {
                            UsersIdEmptyInfo.setId(idUserLike)
                        }
                    });
                };

                function showStates(likesArray) {
                    if (likesArray.length === 0) {
                        self.dislikeUser = false;
                        self.likeUser = false;
                    }

                    var countDislikes = 0;
                    var countLikes = 0;

                    likesArray.forEach(function (like) {
                        if (like.status === "dislike") {
                            countDislikes++;
                            if (like.user.id === $localStorage.authId) {
                                self.dislikeUser = true;
                            }
                            else {
                                self.dislikeUser = false;
                            }
                        }
                        if (like.status === "like") {
                            countLikes++;
                            if (like.user.id === $localStorage.authId) {
                                self.likeUser = true;
                            }
                            else {
                                self.likeUser = false;
                            }
                        }
                    });
                    self.countLike = countLikes;
                    self.countDislike = countDislikes;
                }

                self.focus = function () {
                    var id = self.random;
                    var string = '#' + id;
                    $(string).focus()
                };

                function random() {
                    self.random = Math.floor(Math.random() * 100000);
                }

                this.dropPost = function (id, del) {
                    if (del === 'Delete') {
                        PostFactory.dropPost({postId: id}, function (data) {
                            self.deletePost(id);
                        }, function (errResponse) {
                            console.error('Error while deleting Post', errResponse);
                        })
                    } else {
                        PostFactory.dropFromWall({postId: id, saverId: self.userid}, function (data) {
                            self.deletePost(id);
                        }, function (errResponse) {
                            console.error('Error while deleting Post', errResponse);
                        })
                    }
                };

                function showStateComment(array) {

                    array.forEach(function (t) {
                        if (t.user.id === $localStorage.authId) {
                            self.stateComment = true;

                        } else {
                            self.stateComment = false;
                        }
                    });

                }

                this.dropComment = function (commentId) {
                    for (var i = self.comments.length - 1; i >= 0; i--) {
                        if (self.comments[i].id === commentId) {
                            self.comments.splice(i, 1);
                        }
                    }
                };

                this.keyPressed = function (keyEvent, post_id) {
                    if (keyEvent.keyCode === 13) {
                        submitComment(post_id, self.commenting);
                    }
                };

                function submitComment(post_id, comment) {
                    if (post_id === null) {
                        console.log('Error while creating Comment', post_id);
                    } else {
                        console.log('Created comment', post_id);
                        CommentFactory.createComment({
                            userId: self.userid,
                            postId: post_id,
                            comment: comment
                        }, function (data) {
                            resetComment(data);
                        }, function (errResponse) {
                            console.error('Error while creating Comment', errResponse);
                        })
                    }
                }

                function resetComment(data) {
                    self.comments.push(data);
                    console.log('comments', self.comments);
                    showStateComment(self.comments);
                    self.commenting = '';
                }

                this.like = function (id) {
                    LikeFactory.addLike({postId: id, userId: self.userid, status: 'like'},
                        function (data, headers, statusCode) {
                            if (statusCode === 204) {
                                $('#warning').modal('show');
                                self.warning = "Вы уже оценили пост";
                            }
                            if (statusCode === 200) {

                                var likesResponce = JSON.parse(data.data);
                                //  console.log('parseJson',a);
                                //  self.likeUser=true;
                                //  self.countLike ++;
                                self.likesFromPost = likesResponce;
                                showStates(likesResponce);
                            }
                        }, function (errResponse) {
                            console.error('Error while adding like', errResponse);
                        })
                };
                self.warning = '';

                self.deleteLike = function (state) {
                    for (var a = self.likesFromPost.length - 1; a >= 0; a--) {
                        if (self.likesFromPost[a].user.id === $localStorage.authId) {
                            LikeFactory.deleteLike({likeId: self.likesFromPost[a].id}, function (data) {
                                if (data.length === 0) {
                                    showStates(data);
                                    self.likesFromPost = [];
                                }
                                else {
                                    self.likesFromPost = JSON.parse(data);

                                    showStates(data);
                                }


                                //         self.likesFromPost = data;
                                //         if(state==='like'){
                                //             self.likeUser=false;
                                //             self.countLike --;
                                //         }
                                //         if(state==='dislike'){
                                //             self.dislikeUser=false;
                                //             self.countDislike --;
                                //         }
                                //showStates(self.likesFromPost);
                            }, function (errResponse) {
                                console.error('Error while deleting Post', errResponse);
                            })
                        }
                    }
                };

                this.dislike = function (id) {
                    LikeFactory.addLike({postId: id, userId: self.userid, status: 'dislike'},
                        function (data, headers, statusCode) {
                            if (statusCode === 204) {
                                $('#warning').modal('show');
                                self.warning = "Вы уже оценили пост";
                            }
                            if (statusCode === 200) {
                                var likesResponce = JSON.parse(data.data);
                                self.likesFromPost = likesResponce;
                                showStates(likesResponce);
                                //   self.likesFromPost=data.data;
                                //  self.dislikeUser=true;
                                //  self.countDislike ++;
                            }
                        }, function (errResponse) {
                            console.error('Error while adding dislike', errResponse);
                        })
                };

                this.clear = function () {
                    self.warning = '';
                };

                this.open = function (id, stats) {
                    information(id, stats);
                };

                self.statLike = 'like';
                self.statDislike = 'dislike';

                function information(id, stats) {
                    var likesUser = [];
                    console.log(self.likesFromPost);
                    self.likesFromPost.forEach(function (value) {
                            if (value.status === stats) {
                                var likeData = {};
                                var user = $localStorage.users.getUser(value.user.id);
                                likeData.userName = user.name;
                                likeData.userSurname = user.surname;
                                likeData.userAvatarUrl = user.avatarUrl;
                                likeData.status = value.status;
                                likesUser.push(likeData);
                            }
                        }
                    );
                    getLikesUser(likesUser, stats);
                }

                function getLikesUser(lu, stats) {
                    self.setLikesUser(lu, stats);
                }

                this.PostToMyWall = function (id) {
                    PostFactory.savePostToWall({postId: id, saverId: self.userid}, function (data) {
                    }, function (errResponce) {
                        console.log('Error while add Post to my Wall', errResponce)
                    })
                };

                self.showSaveButton = function (id) {
                    if (id === $localStorage.authId) {
                        return false;
                    }
                    else {
                        return true;
                    }
                };

                self.showEditButton = function (id) {
                    if (id === $localStorage.authId) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                self.showButtonDelete = function (id, wallUserId) {
                    if (id === $localStorage.authId || $localStorage.authId === wallUserId) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                self.changeDelete = function (id) {
                    if (id === $localStorage.authId) {
                        return 'Delete';
                    } else {
                        return 'Delete from Wall';
                    }
                };

                self.edit = function (id) {
                    self.editPost(id);
                };

                self.openLightboxModal = function (index) {
                    self.openImage(self.images, index);
                };

            }],

        bindings: {
            deletePost: '=',
            orderProp: '=',
            post: '<',
            setLikesUser: '=',
            bnShow: '<',
            wallUserId: '<',
            editPost: '=',
            openImage: '=',
            last: '<',
        }
    });

