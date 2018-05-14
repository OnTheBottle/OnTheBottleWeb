(function () {
    'use strict';
    angular.module('commentNewsApp')
        .component('commentNewsComp', {
            templateUrl: 'components/news/comment/comment-news.component.html',
            controller: ['$http', CommentController],
            controllerAs: 'model',
            bindings: {
                userId: '=',
                comment: '=',
                deleteComment: '<'
            }
        });

    function CommentController($http) {

        var model = this;
        //model.authId = idStorage.getId();

        model.$onInit = function () {
            model.comment.owner = function (id) {
                $http({
                    method: "POST",
                    url: USER_PATH + "/user/get_by_id",
                    params: {userId: id}
                }).then(function mySuccess(response) {
                    model.comment.ownerName = response.data.name + ' ' + response.data.surname;
                }, function myError(response) {
                    console.log('Error News Component: ', response.statusText);
                });
            }(model.comment.user.id);
        }

    }
})();
