(function () {
    'use strict';
    angular.module('mainApp')
        .component('postsComp', {
            templateUrl: 'components/news/posts/posts-component.html',
            controller: PostsController,
            controllerAs: 'model',
            bindings: {
                userId: '=',
                likeClick: '<',
                favoriteClick: '<'

            }
        });

    function PostsController() {
        var model = this;
        model.$onInit = function () {
        };
    }

})();
