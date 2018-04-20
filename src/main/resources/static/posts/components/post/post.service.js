'use strict';

angular.
module('post').factory('PostFactory', ['$resource',
    function ($resource) {
        return $resource('http://localhost:8083/getPost', {}, {
            getPost: {method: "GET"},
            getPosts: {
                url: 'http://localhost:8083/getPosts',
                method: "GET",
                isArray: true
                },
            createPost:{
                url:'http://localhost:8083/:path',
                params:{path:'savePost'},
                method:"POST"
                },
            rewritePost:{
                url:'http://localhost:8083/:path',
                params:{path:'updatePost'},
                method:"POST"
            },
            dropPost:{
                url:'http://localhost:8083/deletePost',
                method:"DELETE"
            }
        });
    }
]);
