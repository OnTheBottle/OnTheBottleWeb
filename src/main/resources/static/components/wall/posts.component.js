'use strict';

angular.module('postsApp').component('postsComp', {
    templateUrl: 'components/wall/posts.template.html',
    controller: ['$routeParams', 'UserFactory', 'PostFactory', 'SecurityFactory', 'idStorage',
        function PostController($routeParams, UserFactory, PostFactory, SecurityFactory, idStorage) {
            var self = this;
            self.userid = null;
            self.whoUser = false;
            self.posts = [];
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
                        console.error('Error while fetching posts');
                    })
            }

            function getPosts() {
                PostFactory.getPosts({userId: self.userid}, function (data) {
                        self.posts = data;
                        console.log('PostFactory.getPosts:', data);
                    },
                    function (errResponce) {
                        console.error('Error while fetching posts');
                    })
            }

            self.orderProp = 'date';

            function securities() {
                SecurityFactory.getSecurities(function (data) {
                    self.securities = data;
                    self.post.security.description = data[0];
                });
            }

            self.post = {id: null, user_id: self.userid, security: {description: ''}, text: '', title: ''};
            self.postEdit = {id: null, user_id: self.userid, security: {description: ''}, text: '', title: ''};
            self.reset = reset;
            self.submit = submit;

            this.fetchPosts = function () {
                changePostsFor()
            };

            function submit() {
                if (self.post.id === null) {
                    console.log('Saving New Post', self.post);
                    savePost(self.post);

                } else {
                    updatePost(self.postEdit);
                    console.log('Post updated with id ', self.postEdit.id);
                }
            }

            function savePost(post) {
                PostFactory.createPost({postDTO: post}, function (data) {
                    reset();
                    changePostsFor();
                }, function (errResponse) {
                    console.error('Error while creating Post');
                })
            }

            function reset() {
                self.post = {id: null, user_id: self.userid, text: '', title: '', security: {description: ''}};
            }

            self.update = function () {
                PostFactory.rewritePost({postDTO: self.postEdit}, function (data) {
                    $('#editPost').modal('hide');
                    changePostsFor()
                }, function (errResponse) {
                    console.error('Error while updating Post');
                })
            };

            self.edit = function (id) {
                console.log('id to be edited', id);
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

            self.clear = function () {
                self.likesUser = [];
            }
 }],
    bindings: {}

});





