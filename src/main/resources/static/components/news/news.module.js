'use strict';

angular.module('newsApp', ['ngRoute', 'ngCookies', 'postNewsApp', 'commentNewsApp', 'creatorCommentNewsApp']);

function adapterPostArray(friends, posts, userId) {
    var arr = [];
    for (var x in posts) {
        var friend = getFriendById(friends, posts[x].user.id);
        var obj = {};
        obj.id = posts[x].id;
        obj.ownerId = friend.id;
        obj.ownerName = friend.name + ' ' + friend.surname;
        obj.ownerAvatar = 'images/userspictures/default-avatar.jpeg';
        if (friend.avatarUrl && !friend.deleted) {
            obj.ownerAvatar = friend.avatarUrl;
        }
        if (friend.deleted){
            obj.ownerAvatar = 'images/userspictures/deleted-avatar.jpg';
        }
        obj.title = posts[x].title;
        obj.date = posts[x].date;
        obj.text = posts[x].text;
        obj.images = posts[x].images;
        obj.comments = posts[x].comments;
        obj.commentCount = obj.comments.length;

        obj.likes = [];
        obj.dislikes = [];

        if (posts[x].likes.length > 0) {
            for (var y in posts[x].likes) {
                if (posts[x].likes[y].status === 'like') {
                    obj.likes.push(posts[x].likes[y]);
                }
                if (posts[x].likes[y].status === 'dislike') {
                    obj.dislikes.push(posts[x].likes[y]);
                }
            }
        }

        obj.likeCount = obj.likes.length;
        obj.isLike = function () {
            if (obj.likes.length > 0) {
                for (var x in obj.likes) {
                    if (obj.likes[x].user.id === userId) return true;
                }
            }
            return false;
        }();

        obj.dislikeCount = obj.dislikes.length;
        obj.isDislike = function () {
            if (obj.dislikes.length > 0) {
                for (var x in obj.dislikes) {
                    if (obj.dislikes[x].user.id === userId) return true;
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

function getFriendById(friends, id) {
    for (var i = 0; i < friends.length; i++) {
        if (friends[i].id === id) {
            return friends[i];
        }
    }
    return null;
}
