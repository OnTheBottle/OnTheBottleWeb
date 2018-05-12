'use strict';

angular.module('postsApp').component('postsComp', {
    templateUrl: 'components/wall/posts.template.html',
    controller: ['$routeParams', 'UserFactory', 'PostFactory', 'SecurityFactory', 'idStorage',
        function PostController($routeParams, UserFactory, PostFactory, SecurityFactory, idStorage) {
            var self = this;
            // self.userId = $routeParams.userId;
            // self.user = UserFactory.getUser({userId: this.userId});
            self.userid = idStorage.getId();
            console.log('id', this.userid);
            self.posts = [];
            getPosts();

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
            self.securities = SecurityFactory.getSecurities();
            //        changeUserId();
            //       self.userId='';
            self.post = {id: null, user_id: self.userid, security: {description: ''}, text: '', title: ''};
            self.reset = reset;
            self.submit = submit;
            self.edit = edit;
            //    self.$onInit=function () {console.log('userId',self.userId) };


            this.fetchPosts = function () {
                getPosts()
            };

            //         function changeUserId(){
            //             if ($routeParams.userId) {
            //                 self.userId=$routeParams.userId;
            //                 console.log("on change userId=",self.userId)
            //             }
            //             else{
            //                 self.userId=userId;
            //                 console.log("on change userId=",self.userId)
            //             }
            //         }

            function submit() {
                if (self.post.id === null) {
                    console.log('Saving New Post', self.post);
                    savePost(self.post);

                } else {
                    updatePost(self.post);
                    console.log('Post updated with id ', self.post.id);
                }

            }

            function savePost(post) {
                PostFactory.createPost({postDTO: post}, function (data) {
                    reset();
                    getPosts();

                }, function (errResponse) {
                    console.error('Error while creating Post');
                })
            }

            function reset() {
                self.post = {id: null, user_id: self.userid, text: '', title: '', security: {description: ''}};
            }


            //      function getPosts() {
            //          if ($routeParams.userId) {
            //              PostFactory.getPosts({userId: $routeParams.userId}, function (data) {
            //                  self.posts = data;
            //              }, function (errResponce) {
            //                  console.error('Error while fetching posts');
            //              });
            //          }
            //          else {
            //              self.posts=PostFactory.getPosts({userId: self.userid})
            //          }
            //      }


            function updatePost(post) {
                PostFactory.rewritePost({postDTO: post}, function (data) {
                    reset();
                    getPosts()
                }, function (errResponse) {
                    console.error('Error while updating Post');
                })
            }

            function edit(id) {
                console.log('id to be edited', id);
                for (var i = 0; i < self.posts.length; i++) {
                    if (self.posts[i].id === id) {
                        self.post = angular.copy(self.posts[i]);
                        break;
                    }
                }
            }

            self.setLikesUser = function (likes) {
                self.likesUser = likes;
            };
        }],
    bindings: {}

});





