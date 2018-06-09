'use strict';

angular.module('post')
    .component('post', {
        templateUrl: 'components/wall/post/post.template.html',
        controller: ['$routeParams', 'LikeFactory', 'PostFactory', 'CommentFactory', 'UserFactory', 'idStorage', 'Lightbox', '$localStorage', 'UsersIdEmptyInfo', '$resource', '$q', '$window', '$timeout', '$scope', '$interval',
            function PostController($routeParams, LikeFactory, PostFactory, CommentFactory, UserFactory, idStorage, Lightbox, $localStorage, UsersIdEmptyInfo, $resource, $q, $window, $timeout, $scope, $interval) {
                var self = this;
                self.userid = idStorage.getId();
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
                var defer = $q.defer();
                var promise = defer.promise;
                var postUserId = null;
                var usersIdComment = [];
                moment.locale('ru');
                self.differ = null;
                self.datePost = null;
                self.dateUTCTOlocal = null;
                self.format = null;

                var a = $interval(function () {
                    differ();
                }, 3600000);

                function differ() {
                    self.differ = moment(new Date()).diff(self.datePost, 'h');
                    if (self.differ < 23) {
                        self.watch = true;
                    }
                    else {
                        self.watch = false;
                    }
                }

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

                self.getUser = function (id, postId, images, likes, comments, date) {
                    var dateP = moment(date, "MM-YYYY-DD HH:mm:ss");
                    self.datePost = dateP;
                    var datel = convertUTCDateToLocalDate(new Date(dateP));
                    var t = datel.toLocaleString();
                    self.dateUTCTOlocal = moment(t, "DD.MM.YYYY, HH:mm:ss");
                    self.format = self.dateUTCTOlocal.format(' D MMM в HH:mm ');
                    self.user = $localStorage.users.getUser(id);
                    differ();

                    if (!self.user) {
                        postUserId = id;
                        promise.then(function (val) {
                            self.user = val;
                        });
                    }
                    self.comments = comments;
                    self.images = images;
                    self.likesFromPost = likes;
                    showStates(self.likesFromPost);
                    showStateComment(self.comments);
                };

                function convertUTCDateToLocalDate(date) {
                    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                    var offset = date.getTimezoneOffset() / 60;
                    var hours = date.getHours();
                    newDate.setHours(hours - offset);
                    return newDate;
                }


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
                    if (del === 'Удалить') {
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
                            }
                            if (statusCode === 200) {

                                var likesResponce = JSON.parse(data.data);
                                self.likesFromPost = likesResponce;
                                showStates(likesResponce);
                            }
                        }, function (errResponse) {
                            console.error('Error while adding like', errResponse);
                        })
                };


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
                            }
                            if (statusCode === 200) {
                                var likesResponce = JSON.parse(data.data);
                                self.likesFromPost = likesResponce;
                                showStates(likesResponce);
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

                function information(postId, stats) {
                    var likesUser = [];
                    var usersNoInfo = [];


                    self.likesFromPost.forEach(function (value) {
                        if (value.status === stats) {
                            var userLike = $localStorage.users.getUser(value.user.id);
                            if (!userLike) {
                                usersNoInfo.push({id: value.user.id});
                            } else {
                                likesUser.push(userLike);
                            }

                        }
                    });

                    UserFactory.getUsersInfo(usersNoInfo, function (users) {
                            users.forEach(function (user) {
                                $localStorage.users.addUser(user);
                                likesUser.push(user);
                            });

                        }, function (errResponce) {
                            console.error('Error,havent user', errResponce);
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
                        return 'Удалить';
                    } else {
                        return 'Удалить из стены';
                    }
                };

                self.edit = function (id) {
                    self.editPost(id);
                };

                self.openLightboxModal = function (index) {
                    self.openImage(self.images, index);
                };

                var broadcast = $scope.$on('parent', function (event, data) {
                    if (data === 'true') {
                        defer.resolve($localStorage.users.getUser(postUserId));
                        getCommentsUserId();
                        broadcast()
                    }
                });

                function getCommentsUserId() {
                    self.comments.forEach(function (value) {
                        if (!$localStorage.users.getUser(value.user.id)) {
                            usersIdComment.push({id: value.user.id});
                        }
                    });
                    if (usersIdComment.length > 0) {
                        UserFactory.getUsersInfo(usersIdComment, function (users) {
                                users.forEach(function (user) {
                                    $localStorage.users.addUser(user);

                                });
                                $scope.$broadcast('post', 'true');
                            }, function (errResponce) {
                                console.error('Error,havent user', errResponce);
                            }
                        );

                    }
                }
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
            addUsers: '='
        }
    })
;

