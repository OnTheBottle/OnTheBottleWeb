(function () {
    'use strict';
    angular.module('postApp')
        .component('postComp', {
            templateUrl: 'components/news/posts/post/post.component.html',
            controller: PostController,
            controllerAs: 'model',
            bindings: {
                userId: '=',
                likeClick: '<',
                favoriteClick: '<',
                post: '='
            }
        });

    function PostController() {
        var model = this;
        model.$onInit = function () {
        }
    }
})();
