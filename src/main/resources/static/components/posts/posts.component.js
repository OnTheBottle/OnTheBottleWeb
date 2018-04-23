'use strict';

angular.module('posts').component('posts', {
    templateUrl: 'components/posts/posts.template.html',
    controller: ['$routeParams', 'UserFactory', 'PostFactory', 'SecurityFactory', 'CommentFactory','LikeFactory',
        function PostController($routeParams, UserFactory, PostFactory, SecurityFactory, CommentFactory,LikeFactory) {
            var self = this;
            this.userId = $routeParams.userId;
            self.user = UserFactory.getUser({user_Id: this.userId});
            self.posts = PostFactory.getPosts({user_Id: this.userId});
            self.orderProp = 'date';


            self.securities = SecurityFactory.getSecurities();
            //        self.comments=CommentFactory.getComments({post_Id:self.post_id});
            self.post = {id: null, user_id: $routeParams.userId, security: {description: ''}, text: '', title: ''};

            self.commenting = '';
            this.comment = {id: null, user_id: $routeParams.userId, post_id: null, comment: ''};
            self.reset = reset;
            self.submit = submit;
            self.edit = edit;
            self.deletePost = deletePost;
            self.keyPressed=keyPressed;
self.like=like;
self.dislike=dislike;

function like(id){
    LikeFactory.addLike({post_id: id,user_id:$routeParams.userId,status:'like'}, function (data) {
        console.log('like added')

    }, function (errResponse) {
        console.error('Error while adding like');
    })
}
function dislike(id){
    LikeFactory.addLike({post_id: id,user_id:$routeParams.userId,status:'dislike'}, function (data) {
        console.log('dislike added')

    }, function (errResponse) {
        console.error('Error while adding dislike');
    })
}

             function keyPressed(keyEvent, post_id) {
                if (keyEvent.keyCode === 13) {
                    console.log('comm', self.commenting);
                    submitComment(post_id, self.commenting);
                }
            }

            function submitComment(post_id, comment) {
                if (post_id === null) {
                    console.log('Error while creating Comment', post_id);
                } else {
                    console.log('Created comment', post_id);
                    CommentFactory.createComment({
                        user_id: self.userId,
                        post_id: post_id,
                        comment: comment
                    }, function (data) {
                        resetComment();
                        console.log('Created comment');
                    }, function (errResponse) {
                        console.error('Error while creating Comment');
                    })

                }
            }

            function resetComment() {
                self.commenting = '';
            }

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
                self.post = {id: null,user_id:$routeParams.userId, text: '', title: '', security: {description: ''}};
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
        commenting: '<'
    }

});





