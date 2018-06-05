'use strict';

angular.module('comment').factory('CommentFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(MESSAGE_PATH + '/:path', {}, {
            getComments: {
                params: {path: 'getComments', access_token: $cookies.get('access_token'), postId: '@postId'},
                method: "GET",
                isArray: true
            },
            createComment: {
                params: {path: 'saveComment', access_token: $cookies.get('access_token')},
                method: "POST"
            },
            deleteComment: {
                params: {path: 'deleteComment', access_token: $cookies.get('access_token'), commentId: '@commentId'},
                method: "Delete"
            }
        });
    }
]);
