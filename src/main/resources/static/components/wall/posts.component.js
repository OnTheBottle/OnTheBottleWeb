'use strict';

angular.module('postsApp').component('postsComp', {
    templateUrl: 'components/wall/posts.template.html',
    controller: ['$scope', '$routeParams', 'UserFactory', 'PostFactory', 'SecurityFactory', 'idStorage', 'Lightbox', '$localStorage',
        function PostController($scope, $routeParams, UserFactory, PostFactory, SecurityFactory, idStorage, Lightbox, $localStorage) {
            var self = this;
            self.userid = null;
            self.whoUser = false;
            self.posts = [];
            self.files = [];
            self.orderProp = 'none';
            self.postEdit = {
                id: null,
                user_id: self.userid,
                security: {description: ''},
                text: '',
                title: '',
                comments: [],
                likes: [],
                uploadFiles: []
            };
            self.wait = false;
            self.scroll = true;
            self.reset = reset;
            self.submit = submit;

            changeUserId();
            securities();

            function changeUserId() {
                if ($routeParams.id) {
                    self.userid = $routeParams.id;
                    console.log("on change userId=", self.userid);
                    self.whoUser = false;
                    self.showForm = false;
                    getPostsFriend();
                }
                else {
                    self.userid = idStorage.getId();
                    console.log("on change userId=", self.userid);
                    self.whoUser = true;
                    self.showForm = true;
                    getPosts();
                }
            }

            self.post = {
                id: null,
                user_id: self.userid,
                security: {id: '', name: '', description: ''},
                text: '',
                title: '',
                uploadFiles: [],
                comments: [],
                likes: []
            };

            function changePostsFor() {
                if ($routeParams.id) {
                    getPostsFriend();
                } else {
                    getPosts();
                }
            }

            function getPostsFriend() {
                PostFactory.getPostsFriend({userId: self.userid}, function (data) {
                        self.posts = data;
                    },
                    function (errResponce) {
                        console.error('Error while fetching posts', errResponce);
                    })
            }

            function getPosts() {
                self.wait = true;
                PostFactory.getPosts({userId: self.userid}, function (data) {
                        self.wait = false;
                        var usersIdPosts = [];
                        data.forEach(function (value) {
                            if (!$localStorage.users.getUser(value.user.id)) {
                                usersIdPosts.push({id: value.user.id});
                            }
                        });
                        if (usersIdPosts.length > 0) {
                            UserFactory.getUsersInfo(usersIdPosts, function (users) {
                                    users.forEach(function (user) {
                                        $localStorage.users.addUser(user);

                                    });
                                    $scope.$broadcast('parent', 'true');
                                }, function (errResponce) {
                                    console.error('Error,havent user', errResponce);
                                }
                            );
                        }
                        self.posts = data;
                        self.scroll = false;
                    },
                    function (errResponce) {
                        console.error('Error while fetching posts', errResponce);
                    })
            }

            //
            //
            //  var usersIdLikes = [];
            //  self.posts.
            //
            //      var id = user.id;
            //      ;
            //      var postComments = value.comments;
            //      var postLikes = value.likes;
            //      postComments.forEach(function (value) {
            //          var userComment = value.user;
            //          var idUserComment = userComment.id;
            //          usersIdComment.push(idUserComment);
            //      });
            //      postLikes.forEach(function (value) {
            //          var userLike = value.user;
            //          var idUserLike = userLike.id;
            //          usersIdLikes.push(idUserLike);
            //                      });
            //                  });
            //                  var bufferArray = [...new
            //                  Set([...usersIdPosts,...usersIdComment
            //              ])]
            //                  ;
            //                  var usersId = [...new
            //                  Set([...bufferArray,...usersIdLikes
            //              ])]
            //                  ;
            //                  self.usersToCache(usersId);
            //              },
            //              function (errResponce) {
            //                  console.error('Error while fetching posts');


            //         self.usersToCache = function (usersId) {
            //             self.arrayId = [];
            //             usersId.forEach(function (value) {
            //                 var user = {id: value};
            //                 if(!$localStorage.users.getUser(value)){
            //                     self.arrayId.push(user);
            //                 }
//
            //             });
            //             if(self.arrayId){
            //             UserFactory.getUsersInfo(self.arrayId, function (data) {
            //                     var users = data;
            //                     users.forEach(function (userPost) {
            //                         var user = $localStorage.users.getUser(userPost.id);
            //                         if (!user) {
            //                             $localStorage.users.addUser(userPost);
            //                         }
            //                     });
            //                 },


            function securities() {
                SecurityFactory.getSecurities(function (data) {
                    self.securities = data;
                    self.post.security = data[0];
                });
            }

            self.deletePost = function (id) {
                for (var i = self.posts.length - 1; i >= 0; i--) {
                    if (self.posts[i].id === id) {
                        self.posts.splice(i, 1);
                    }
                }
            };

            function submit() {
                PostFactory.createPost({
                    id: self.post.id,
                    userId: self.post.user_id,
                    security: self.post.security.description,
                    text: self.post.text,
                    title: self.post.title,
                    uploadFiles: self.files
                }, function (data) {
                    if (data.user.id === $localStorage.authUser.id) {
                        data.user = $localStorage.authUser;
                    }
                    else {
                        UserFactory.getSmallInfo({userId: data.user.id}, function (data) {
                               if(!$localStorage.users.getUser(data.id)){
                                   $localStorage.users.addUser(data)
                               }
                              self.post.user=data
                            }, function (errResponce) {
                                console.error('Error while get UserInfo', errResponce);
                            }
                        )
                    }
                    self.posts.unshift(data);
                    reset();
                    self.resetAll();
                    //    changePostsFor();
                }, function (errResponse) {
                    console.error('Error while creating Post', errResponse);
                })
            }

            function reset() {
                self.post = {id: null, user_id: self.userid, text: '', title: '', security: self.post.security};
            }

            self.update = function () {
                PostFactory.rewritePost({
                    id: self.postEdit.id,
                    userId: self.postEdit.user_id,
                    security: self.postEdit.security.description,
                    text: self.postEdit.text,
                    title: self.postEdit.title

                }, function () {
                    $('#editPost').modal('hide');
                    changePostsFor()
                }, function (errResponse) {
                    console.error('Error while updating Post', errResponse);
                })
            };

            self.edit = function (id) {
                for (var i = 0; i < self.posts.length; i++) {
                    if (self.posts[i].id === id) {
                        self.postEdit = angular.copy(self.posts[i]);
                        break;
                    }
                }
                $('#editPost').modal('show');
            };

            self.setLikesUser = function (likes, stats) {
                self.likesUser = likes;
                self.stat = stats;
                $('#listLikes').modal('show');
            };

            self.openImage = function (images, index) {
                Lightbox.openModal(images, index);
            };

            self.clear = function () {
                self.likesUser = [];
            };

            self.stan = null;

            self.resetAll = function () {
                self.stan = true;
                angular.element(document.querySelector("file-comp")).attr("stata", "reset");
            };

            self.download = function () {
                self.stan = false;
                angular.element(document.querySelector("file-comp")).attr("stata", "download");
            };

            self.setUploadFiles = function (files) {
                self.files = files;
                submit();
            };

            //     self.scroll = function(state){
            //         if(self.posts.length===0){
            //             return true;
            //         }
            //         if(state){
            //             return state;
            //         }
            //         else{
            //             return false;
            //         }
            //     };
            //
            self.loadMore = function () {
                //        self.scroll = true;
                //        var length = self.posts.length;
                //        var lastPost = self.posts[self.posts.length - 1];
                //        console.log(length);
                //        PostFactory.getMorePosts({lastPostId: lastPost.id, userId: self.userid}, function (data) {
//
                //                console.log('догрузились посты', data);
                //                if (data.length < 5) {
                //                    self.scroll = true;
                //                }
                //                else {
                //                    self.scroll = false;
                //                }
                //                data.forEach(function (post) {
                //                    self.posts.push(post);
//
                //                })
                //            },
                //            function (errResponce) {
                //                console.error('Error while fetching posts', errResponce);
                //            })
            };

            $(window).scroll(function () {
                //           if ($(document).height() > 3000) {
                //               self.addUsers()
                //           }
                if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                    if (self.scroll === false) {
                        self.scroll = true;
                        self.wait = true;
                        var lastPost = self.posts[self.posts.length - 1];
                        if (self.posts.length > 0) {
                            PostFactory.getMorePosts({lastPostId: lastPost.id, userId: self.userid}, function (data) {
                                    if (data.length < 5) {
                                        self.scroll = true;
                                    }
                                    else {
                                        self.scroll = false;
                                    }
                                    data.forEach(function (post) {
                                        self.posts.push(post);

                                    });
                                    self.wait = false;
                                },
                                function (errResponce) {
                                    console.error('Error while fetching posts', errResponce);
                                });
                        } else {
                            self.scroll = true;
                            self.wait = false;
                        }
                    }
                }
            });

            self.showDown = true;
            self.showTop = false;
            self.gotoTop = function () {
                $("body,html").animate({
                    scrollTop: 0
                }, 800);
            };

            self.gotoDown = function () {
                $("html, body").animate({scrollTop: $(document).height()}, "slow");
            };
        }
    ],
    bindings: {}

});





