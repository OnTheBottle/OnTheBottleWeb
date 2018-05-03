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

    function NewsController($http, $interval) {

        var model = this;
        model.posts = [];
        model.friends = [];

        model.$onInit = function () {
            console.log('NewsController userId: ', model.userId);
            getNewsPosts(model.userId);
        };

        function getNewsPosts(userId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {id: userId}
                //console.log('response: ', response.data);
            }).then(function mySuccess(response) {
                console.log('getNewsPosts response.data[0] friends:\n', response.data[0]);
                console.log('getNewsPosts response.data[1] posts:\n', response.data[1]);
                //model.friends = response.data[0];
                model.posts = adapterPostArray(response.data[0], response.data[1]);
                console.log('getNewsPosts response friends:\n', model.friends);
                console.log('getNewsPosts response posts:\n', model.posts);
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
                obj.friendPathAvatar = friends[x].avatarUrl;
                arr.push(obj);
            }
            return arr;
        }

        function getFriend(friends, id) {
            console.log('getFriend friends:', friends);
            console.log('getFriend id:', id);

            for (var i = 0; i < friends.length; i++) {
                if (friends[i].id === id) {
                    return friends[i];
                }
            }
            return null;
        }

        function adapterPostArray(friends, posts) {
            console.log('adapterPostArray friends:', friends);
            console.log('adapterPostArray posts:', posts);

            var arr = [];
            for (var x in posts) {
                var friend = getFriend(friends, posts[x].user.id);
                console.log('adapterPostArray friend:', friend);
                var obj = {};
                obj.postOwnerAvatar = 'images/userspictures/default-avatar.jpeg';
                obj.postId = posts[x].id;
                obj.postOwnerId = friend.id;
                obj.postOwner = friend.name + ' ' + friend.surname;
                if (friend.avatarUrl) obj.postOwnerAvatar = friend.avatarUrl;
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
