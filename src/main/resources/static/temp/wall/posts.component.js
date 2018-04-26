'use strict';

angular.module('posts').component('posts', {
    templateUrl: 'components/wall/posts.template.html',
    controller: ['$routeParams', 'UserFactory', 'PostFactory', 'SecurityFactory',
        function PostController($routeParams, UserFactory, PostFactory, SecurityFactory) {
            var self = this;
            this.userId = $routeParams.userId;
            self.user = UserFactory.getUser({user_Id: this.userId});
            self.posts = PostFactory.getPosts({user_Id: this.userId});
            self.orderProp = 'date';
            self.securities = SecurityFactory.getSecurities();
            self.post = {id: null, user_id: $routeParams.userId, security: {description: ''}, text: '', title: ''};


            self.reset = reset;
            self.submit = submit;
            self.edit = edit;
            self.deletePost = deletePost;


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
                self.post = {id: null, user_id: $routeParams.userId, text: '', title: '', security: {description: ''}};
                //       self.myForm.$setPristine();

            }

            function getPosts() {
                self.posts = PostFactory.getPosts({user_Id: self.userId});
            }

            function updatePost(post) {
                PostFactory.rewritePost({postDTO: post}, function (data) {
                    reset();
                    getPosts()
                }, function (errResponse) {
                    console.error('Error while updating Post');
                })
            }

            function deletePost(id) {
                PostFactory.dropPost({id: id}, function (data) {
                    getPosts()

                }, function (errResponse) {
                    console.error('Error while deleting Post');
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
        }],
    bindings: {
        posts: '='
    }

});





