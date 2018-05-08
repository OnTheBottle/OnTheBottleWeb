angular.module('post').component('modal', {
    templateUrl: 'components/wall/post/modal.template.html',
    controller: ['$routeParams', 'LikeFactory', 'PostFactory', 'CommentFactory', 'UserFactory', 'postIdStorage',
        function ModalController($routeParams, LikeFactory, PostFactory, CommentFactory, UserFactory, postIdStorage) {
            var self = this;

            self.information = function () {
                console.log('postId', postIdStorage.getId());
                LikeFactory.getLikes({postId: postIdStorage.getId()}, function (data) {
                        postIdStorage.setId('');
                        var likes = data;

                        likes.forEach(function (value) {

                            getLikeUser(value.user.id, value.status);
                        })
                    },
                    function (errResponce) {
                        console.log('Error while fetching likes list')
                    }
                )
            };

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
                getLikesUser(likesUser);
            }

            function getLikesUser(data) {
                self.likesUser = data;
            }

            self.reset = function () {
                self.likesUser = [];
            }
        }],
    bindings: {
        postId: '='
    }
});