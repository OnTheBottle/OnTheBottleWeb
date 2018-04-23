'use strict';

angular.
module('like').factory('LikeFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/:path', {}, {
            addLike: {method: "Post",
                path:'addLike'
            }

            
        });
    }
]);
