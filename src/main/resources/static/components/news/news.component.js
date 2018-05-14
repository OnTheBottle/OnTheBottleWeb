(function () {
    'use strict';

    angular.module('newsApp')
        .component('newsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$cookies', '$interval', NewsController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function NewsController($http, $cookies, $interval) {

        var model = this;
        model.posts = [];
        model.friends = [];
        model.orderBy = '-date';

        model.$onInit = function () {
            getNewsPosts(model.authId, $cookies.get('access_token'));
        };

        function getNewsPosts(authId, access_token) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_friends_posts",
                params: {
                    id: authId,
                    access_token: access_token
                }
            }).then(function mySuccess(response) {
                model.posts = adapterPostArray(response.data[0], response.data[1], authId);
            }, function myError(response) {
                console.log('Error News Component: ', response.statusText);
            });
        }

    }



})();
