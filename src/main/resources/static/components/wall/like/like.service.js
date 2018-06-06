'use strict';

angular.module('like').factory('LikeFactory', ['$resource', '$cookies',
    function ($resource, $cookies) {
        return $resource(MESSAGE_PATH + '/:path', {}, {
            addLike: {
                params: {path: 'addLike', access_token: $cookies.get('access_token')},
                method: "Post",
                transformResponse: function (data, headers, statusCode) {
                    console.log(statusCode);
                    var finalResponse = {
                        data: data,
                        responseStatusCode: statusCode
                    };
                    return finalResponse;
                },

            },
            getLikes: {
                params: {path: 'getLikes', access_token: $cookies.get('access_token'), postId: '@postId'},
                method: "GET",
                isArray: true
            },
            deleteLike:{
                params: {path: 'deleteLike', access_token: $cookies.get('access_token'), likeId: '@likeId'},
                method: "DELETE",
                isArray: true
            }
        });
    }
]);
