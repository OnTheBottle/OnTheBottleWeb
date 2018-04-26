(function () {
    'use strict';
    angular.module('postNewsApp')
        .component('postNewsComp', {
            templateUrl: 'components/news/post/post.component.html',
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
