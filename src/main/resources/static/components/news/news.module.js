'use strict';

angular.module('newsApp', ['ngRoute', 'ngCookies', 'postNewsApp', 'commentNewsApp']);

function adapterPostArray(friends, posts, userId) {
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
                    if (obj.likes[x].id === userId) return true;
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
