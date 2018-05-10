(function () {
    'use strict';

    angular.module('newsApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$cookies', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function NewsController($http, $cookies, $interval) {

        var model = this;
        model.posts = [];
        model.friends = [];
        model.orderBy = '-date';

        model.$onInit = function () {
            console.log('NewsController userId: ', model.userId);
            getNewsPosts(model.userId, $cookies.get('access_token'));
        };

        function getNewsPosts(userId, access_token) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {
                    id: userId,
                    access_token: access_token
                }
            }).then(function mySuccess(response) {
                model.posts = adapterPostArray(response.data[0], response.data[1], userId);
                console.log('getNewsPosts model.posts:\n', model.posts);
            }, function myError(response) {
                console.log('Error News Component: ', response.statusText);
            });
        }

    }



})();
