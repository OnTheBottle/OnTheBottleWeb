(function () {
    'use strict';
    angular.module('postsApp')
        .component('postsComp', {
            templateUrl: 'components/news/posts/posts.component.html',
            controller: PostsController,
            controllerAs: 'model',
            bindings: {
                userId: '=',
                likeClick: '<',
                favoriteClick: '<',
                posts: '='
            }
        });

    function PostsController() {
        var model = this;
        model.$onInit = function () {
        };
    }

})();
