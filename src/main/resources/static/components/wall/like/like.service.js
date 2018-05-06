'use strict';

angular.
module('like').factory('LikeFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/:path', {}, {
            addLike: {
                params: {path: 'addLike'},
                method: "Post",
                transformResponse: function (data, headers, statusCode) {
                    console.log(statusCode);

                    var finalResponse = {
                        data: data,
                        responseStatusCode: statusCode
                    };
                    return finalResponse;
                }
            }
            
        });
    }
]);
