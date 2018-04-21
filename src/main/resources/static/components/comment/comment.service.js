'use strict';

angular.
module('comment').factory('CommentFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/getComment', {}, {
            getComment: {method: "GET"},
            getComments: {
                url: 'http://localhost:8083/getComments',
                method: "GET",
                isArray: true
                },
            createComment:{
                url:'http://localhost:8083/:path',
                params:{path:'saveComment'},
                method:"POST"
                },
            deleteComment:{
                url:'http://localhost:8083/deleteComment',
                method:"POST"

            }
            
        });
    }
]);
