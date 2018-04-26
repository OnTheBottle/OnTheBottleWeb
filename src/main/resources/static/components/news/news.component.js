(function () {
    'use strict';

    angular.module('newsApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function NewsController($http) {

        var model = this;
        model.posts = [];
        model.friends = [];

        model.$onInit = function () {
            console.log('userId: ', model.userId);
            getNewsPosts(model.userId);
        };

        function getNewsPosts(userId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {id: userId}
            }).then(function mySuccess(response) {
                //console.log('response: ', response.data);
                model.friends = adapterFriendArray(response.data[0]);
                model.posts = adapterPostArray(response.data[1]);
                console.log('response data1:\n', response.data[0]);
                console.log('response data2:\n', response.data[1]);
                //model.friends = response.data[0];
                //model.posts = response.data[1];
                //console.log('response posts:\n', $scope.posts);
            }, function myError(response) {
                console.log('Error News Component: ', response.statusText);
            });
        }

        this.likeClick = function () {
            console.log('I click like!');
        }

        this.favoriteClick = function () {
            console.log('I click favorite');
        }


        function adapterFriendArray(friends) {
            var arr = [];
            for (var x in friends) {
                var obj = {};
                obj.friendId = friends[x].id;
                obj.friendName = friends[x].name + ' ' + friends[x].surname;
                obj.friendPathAvatar = friends[x].pathAvatarImage;
                arr.push(obj);
            }
            return arr;
        }

        function adapterPostArray(posts) {
            var arr = [];
            for (var x in posts) {
                //console.log('post: ', posts[x]);
                var obj = {};
                obj.postOwnerAvatar = '';
                obj.postId = posts[x].id;
                obj.postOwnerId = posts[x].user.id;
                obj.postOwner = posts[x].user.name;
                obj.postOwnerAvatar = posts[x].user.avatarUrl;
                obj.postTitle = posts[x].title;
                obj.postDate = posts[x].date;
                obj.postText = posts[x].text;
                obj.postComments = posts[x].comments;
                obj.postCommentCount = obj.postComments.length;
                obj.postLikes = posts[x].likes;
                obj.postLikeCount = obj.postLikes.length;
                obj.isPostLike = function (id) {
                    if (obj.postLikeCount > 0) {
                        for (var x in obj.postLikes) {
                            if (obj.postLikes[x].userId === id) return true;
                        }
                    }
                    return false;
                }(model.userId);

                obj.postFavorites = posts[x].favorites;
                obj.isPostFavorite = function () {
                    if (obj.postFavorites.length > 0) return true;
                    return false;
                }();
                arr.push(obj);
            }
            return arr;
        }

    }
})();
