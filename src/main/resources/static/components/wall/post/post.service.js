'use strict';

angular.module('post').factory('PostFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(MESSAGE_PATH + '/:path', {}, {
            getPosts: {
                params: {path: 'getPosts', access_token: $cookies.get('access_token'), userId: '@Id'},
                method: "GET",
                isArray: true
            },
            createPost: {
                params: {path: 'savePost', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            rewritePost: {
                params: {path: 'updatePost', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            dropPost: {
                params: {path: 'deletePost', access_token: $cookies.get('access_token'), postId: '@postId'},
                method: "DELETE"
            },
            getPostsFriend: {
                params: {path: 'getPostsFriend', access_token: $cookies.get('access_token'), userId: '@userId'},
                method: "GET",
                isArray: true
            },
            savePostToWall: {
                params: {
                    path: 'savePostToMyWall',
                    access_token: $cookies.get('access_token'),
                    postId: '@postId',
                    saverId: '@saverId'
                },
                method: "POST"
            },
            dropFromWall: {
                params: {
                    path: 'dropFromWall',
                    access_token: $cookies.get('access_token'),
                    postId: '@postId',
                    saverId: '@saverId'
                },
                method: "DELETE"
            },
            getMorePosts: {
                params: {
                    path: 'getMorePosts',
                    access_token: $cookies.get('access_token'),
                    lastPostId: '@lastPostId',
                    userId: '@userId'
                },
                method: "GET",
                isArray: true
            }
        });
    }
]);
