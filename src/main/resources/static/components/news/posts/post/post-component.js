(function () {
    'use strict';
    angular.module('mainApp')
        .component('postComp', {
            templateUrl: 'components/news/posts/post/post-component.html',
            controller: PostController,
            controllerAs: 'model',
            bindings: {
                userId: '=',
                likeClick: '<',
                favoriteClick: '<'
            }
        });

    function PostController() {
        var model = this;
        model.$onInit = function () {
        }
    }
})();
