'use strict';

angular.module('comment').
    component('comment', {
    templateUrl: 'components/comment/comment.template.html',
    controller: ['$routeParams','CommentFactory',
        function PostController($routeParams,CommentFactory) {

        }],
    bindings: {
        comment: '=',
   }

});
