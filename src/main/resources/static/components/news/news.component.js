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
                model.posts = adapterPostArray(response.data[0], response.data[1]);
                console.log('getNewsPosts model.posts:\n', model.posts);
            }, function myError(response) {
                console.log('Error News Component: ', response.statusText);
            });
        }

        function getFriendById(friends, id) {
            for (var i = 0; i < friends.length; i++) {
                if (friends[i].id === id) {
                    return friends[i];
                }
            }
            return null;
        }

        function adapterPostArray(friends, posts) {
            var arr = [];
            for (var x in posts) {
                var friend = getFriendById(friends, posts[x].user.id);
                var obj = {};
                obj.id = posts[x].id;
                obj.ownerId = friend.id;
                obj.ownerName = friend.name + ' ' + friend.surname;
                obj.ownerAvatar = 'images/userspictures/default-avatar.jpeg';
                if (friend.avatarUrl) {obj.ownerAvatar = friend.avatarUrl;};
                obj.title = posts[x].title;
                obj.date = posts[x].date;
                obj.text = posts[x].text;
                obj.images = posts[x].images;
                obj.comments = posts[x].comments;
                obj.commentCount = obj.comments.length;

                obj.likes = posts[x].likeUsers;
                obj.likeCount = obj.likes.length;
                obj.isLike = function () {
                    if (obj.likes.length > 0) {
                        for (var x in obj.likes) {
                            if (obj.likes[x].id === model.userId) return true;
                        }
                    }
                    return false;
                }();

                obj.favorites = posts[x].favoriteUsers;
                obj.isFavorite = function () {
                    if (obj.favorites.length > 0) return true;
                    return false;
                }();
                arr.push(obj);
            }
            return arr;
        }

    }
})();
