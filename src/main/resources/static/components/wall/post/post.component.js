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
                console.log('likes', self.likesFromPost);
//    self.length=function () {
//    if(!self.comments){return 0}
//    else{return self.comments.length}
//};
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
                    console.log('likes on-init',likes);
                    self.user = $localStorage.users.getUser(id);
                    self.showStateButtonLike(likes);
                    self.showStateButtonDislike(likes);
                    if (!self.user) {
                        UsersIdEmptyInfo.setId(id);
                    }
                    self.likesFromPost.forEach(function (like) {
                        var idUserLike = like.user.id;
                        if (!$localStorage.users.getUser(idUserLike)) {
                            UsersIdEmptyInfo.setId(idUserLike)
                        }
                    });
                    counter(postId);
                };

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

                this.dropComment = function (commentId) {
                    for (var i = self.comments.length - 1; i >= 0; i--) {
                        if (self.comments[i].id === commentId) {
                            self.comments.splice(i, 1);
                        }
                    }
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
                            userId: self.userid,
                            postId: post_id,
                            comment: comment
                        }, function (data) {
                            resetComment(data);
                            console.log('Created comment');
                        }, function (errResponse) {
                            console.error('Error while creating Comment', errResponse);
                        })
                    }
                }

                function resetComment(data) {
                    self.comments.push(data);
                    self.commenting = '';
                }

                this.like = function (id) {
                    LikeFactory.addLike({postId: id, userId: self.userid, status: 'like'},
                        function (data, headers, statusCode) {
                            if (statusCode === 204) {
                                $('#warning').modal('show');
                                self.warning = "your regard will be added some times before";
                            }
                            if (statusCode === 200) {
                                var respLikes = data.data;
                                for (var a = self.likesFromPost.length - 1; a >= 0; a--) {
                                    for (var i = respLikes.length - 1; i >= 0; i--) {
                                        if (self.likesFromPost[a].id === respLikes[i].id) {
                                            self.likesFromPost.push(self.likesFromPost[a]);
                                        }
                                    }
                                }
                                self.countLike = +1;
                                self.warning = 'like added';
                            }
                        }, function (errResponse) {
                            console.error('Error while adding like', errResponse);
                        })
                };

                self.warning = '';
                self.showBtnLike=null;
                self.showStateButtonLike = function (likeArray) {
                    var likes = [];
                    likes = likeArray;
                    var count = 0;
                    for (var a = 0; a++; a <= likes.length) {
                        if (likes[a].user.id === $localStorage.authId) {
                            if (likes[a].status === 'like') {
                                count++;
                            }
                        }
                    }
                    if (count > 0) {
                        self.showBtnLike=true;
                    }
                    else {
                        self.showBtnLike = false;
                    }
                  };

                self.showBtnDislike=null;
                self.showStateButtonDislike = function (likeArray) {
                    var likes = [];
                    likes = likeArray;
                    var count = 0;
                    for (var a = 0; a++; a <= likes.length) {
                        if (likes[a].user.id === $localStorage.authId) {
                            if (likes[a].status === 'dislike') {
                                count++;
                            }
                        }
                    }
                    if (count > 0) {
                        self.showBtnDislike= true;
                    }
                    else {
                        self.showBtnDislike= false;
                    }
                };

                self.deleteLike = function () {
                    for (var a = self.likesFromPost.length - 1; a >= 0; a--) {
                        if (self.likesFromPost[a].user.id === $localStorage.authId) {
                            LikeFactory.deleteLike({likeId: self.likesFromPost[a].id}, function (data) {
                                self.likesFromPost.slice(a, 1);
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
                                self.warning = "your regard will be added some times before";

                            }
                            if (statusCode === 200) {

                                self.likesFromPost = data.data;
                                console.log('likes', self.likesFromPost);
                                self.countDislike = +1;
                                self.warning = 'dislike added';
                            }
                        }, function (errResponse) {
                            console.error('Error while adding dislike', errResponse);
                        })
                };

                this.clear = function () {
                    self.warning = '';
                };

                this.open = function (id, stats) {
                    console.log('open with', id);
                    information(id, stats);
                };

                function counter(id) {
                    var countL = 0;
                    var countD = 0;
                    self.likesFromPost.forEach(function (value) {
                        if (value.status === 'like') {
                            countL++
                        }
                        else {
                            countD++
                        }
                    });
                    self.countLike = countL;
                    self.countDislike = countD;
                }

                self.statLike = 'like';
                self.statDislike = 'dislike';

                function information(id, stats) {
                    var likesUser = [];
                    console.log('likes', self.likesFromPost);
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


                //            self.lengthImages = function () {
                //                if(!self.images){
                //                    return false;
                //                }
                //                if (self.images.length === 1) {
                //                   return true;
                //                } else {
                //                    return false;
                //                }
                //            };

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
            likes:'<'
        }

    });

