(function () {
    'use strict';

    angular.module('newsApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function NewsController($http, $interval) {

        var model = this;
        model.posts = [];
        model.friends = [];
        model.orderBy = '-date';

        model.$onInit = function () {
            console.log('NewsController userId: ', model.userId);
            getNewsPosts(model.userId);
        };

        function getNewsPosts(userId) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {id: userId}
            }).then(function mySuccess(response) {
                model.posts = adapterPostArray(response.data[0], response.data[1], model.userId);
                console.log('getNewsPosts model.posts:\n', model.posts);
            }, function myError(response) {
                console.log('Error News Component: ', response.statusText);
            });
        }

    }



})();
