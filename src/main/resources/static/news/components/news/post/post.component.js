var app = angular.module('postApp', []);

app.controller('postCtrl', function ($scope, $http, $interval) {

    //test user uuid
    $scope.userId = '57c49497-918c-4ece-81d9-629d11c5ad6b';
    const SUBMESSAGEPATH = 'http://127.0.0.1:8083';

    $scope.getFriendsPosts = function (userId) {
        $http({
            method: "POST",
            url: SUBMESSAGEPATH + "/news/getfriendsposts",
            params: {id: userId}
        }).then(function mySuccess(response) {
            //console.log('response: ', response.data);
            $scope.friends = adapterFriendArray(response.data[0]);
            $scope.posts = adapterPostArray(response.data[1]);
        }, function myError(response) {
            alert(response.statusText);
        });
    };

    function adapterFriendArray(friends) {
        var arr = [];
        for (x in friends) {
            var obj = {};
            obj.friendId = friends[x].id;
            obj.friendName = friends[x].name;
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
            obj.postOwnerId = posts[x].authorId;
            obj.postOwner = getFriendNameById(obj.postOwnerId);
            obj.postOwnerAvatar = getFriendAvatarById(obj.postOwnerId);
            obj.postTitle = posts[x].title;
            obj.postDate = posts[x].date;
            obj.postText = posts[x].post;
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
            }($scope.userId);

            obj.postFavorites = posts[x].favorites;
            obj.isPostFavorite = function () {
                if (obj.postFavorites.length > 0) return true;
                return false;
            }();
            arr.push(obj);
        }
        return arr;
    }

    function getFriendNameById(id) {
        for (var x in $scope.friends) {
            if (id === $scope.friends[x].friendId) {
                return $scope.friends[x].friendName;
            }
        }
    }

    function getFriendAvatarById(id) {
        for (var x in $scope.friends) {
            if (id === $scope.friends[x].friendId) {
                return $scope.friends[x].friendPathAvatar;
            }
        }
    }

    $scope.getUserPosts = function (userId) {
        $http({
            method: "POST",
            url: SUBMESSAGEPATH + "/news/getuserposts",
            params: {id: userId}
        }).then(function mySuccess(response) {
            $scope.posts = response.data;
        }, function myError(response) {
            alert(response.statusText);
        });
    };

    $scope.getFriends = function (userId) {
        $http({
            method: "POST",
            url: SUBMESSAGEPATH + "/news/getfriends",
            params: {id: userId}
        }).then(function mySuccess(response) {
            $scope.friends = response.data;
            //console.log($scope.friends);
        }, function myError(response) {
            alert(response.statusText);
        });
    };

    $scope.changePostLike = function (postId, isPostLike) {
        var userId = $scope.userId;
        console.log('userid: ', userId, ' postid: ', postId, ' isLike: ', isPostLike);
        $http({
            method: "POST",
            url: SUBMESSAGEPATH + "/news/setlike",
            params: {
                userId: userId,
                postId: postId,
                isLike: isPostLike
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            //if (response.data)//alert(response.statusText, ' All right!');
        }, function myError(response) {
            alert(response.statusText, ' Sorry, I am tired');
        });
    }

    $scope.changePostFavorite = function (postId, isFavorite) {
        var userId = $scope.userId;
        console.log('userid: ', userId, ' postid: ', postId, ' isFavorite: ', isFavorite);
        $http({
            method: "POST",
            url: SUBMESSAGEPATH + "/news/favorite/change",
            params: {
                userId: userId,
                postId: postId,
                isFavorite: isFavorite
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            //if (response.data)//alert(response.statusText, ' All right!');
        }, function myError(response) {
            alert(response.statusText, ' Sorry, I am tired');
        });
    }

    //$scope.getFriends($scope.userId);

    $scope.getFriendsPosts($scope.userId);
    $interval(function () {
        $scope.getFriendsPosts($scope.userId);
    }, 1000000);

    /*        $scope.posts = [
                {
                    postId: '8acd4c77-1472-49a9-9ce8-7a863166b4a6',
                    authorId: '57c49497-918c-4ece-81d9-629d11c5ad6b',
                    postOwner: 'owner 1',
                    postTitle: 'Topic 1',
                    postDate: '2018-03-05 16:11:14',
                    postText: 'Go all to drinking party! part 1',
                    postComment: [
                        '2457258472457',
                        '9058469548668',
                        '2394782374244',
                        '3458235943533',
                        '3455345543545'
                    ],
                    postLike: [
                        '42554-345345-54345',
                        '56757-664566-34534'
                    ],
                    postFavorite: 'true',
                },
                {
                    postId: '22947654678957468',
                    postOwner: 'owner 2',
                    postTitle: 'Topic 2',
                    postDate: '23.02.2018 13:23',
                    postText: 'Go all to drinking party! part 2',
                    postComment: [
                        '3457258472457',
                        '3058469548668',
                        '3458235943533',
                        '3455345543545'
                    ],
                    postLike: [
                        '32554-345345-54345',
                        '36757-664566-34534'
                    ],
                    postFavorite: 'false',
                },
                {
                    postId: '33347654678957468',
                    postOwner: 'owner 3',
                    postTitle: 'Topic 3',
                    postDate: '24.02.2018 13:23',
                    postText: 'Go all to drinking party! part 3',
                    postComment: [
                        '4457258472457',
                        '4058469548668',
                        '4394782374244'
                    ],
                    postLike: [
                        '46757-664566-34534'
                    ],
                    postFavorite: 'true',
                },
            ];*/
});


app.component('appPost', {
    controller: 'postCtrl',
    templateUrl: 'components/news/post/post.component.html',
    bindings: {
        post: '='
    }
});

