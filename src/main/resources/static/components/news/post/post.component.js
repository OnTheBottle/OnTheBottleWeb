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

        model.changeFavorite = function () {
            //var userId = model.post.id;
            //console.log('userid: ', userId, ' postid: ', postId, ' isFavorite: ', isFavorite);
            $http({
                method: "POST",
                url: "/news/favorite/change",
                params: {
                    userId: model.post.ownerId,
                    postId: model.post.id,
                    //isFavorite: model.post.isFavorite
                }
            }).then(function mySuccess(response) {
                console.log(response.data);
                //if (response.data)//alert(response.statusText, ' All right!');
            }, function myError(response) {
                alert(response.statusText, ' Sorry, I am tired');
            });
        }

    }
})();
