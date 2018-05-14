(function () {
    'use strict';

    angular.module('newsApp')
        .component('userNewsComp', {
            templateUrl: 'components/news/news.component.html',
            controller: ['$http', '$interval', '$cookies', UserNewsController],
            controllerAs: 'model',
            bindings: {
                userId: '=',
                authId: '='
            }
        });

    function UserNewsController($http, $interval, $cookies) {

        var model = this;
        model.orderBy = '-date';

        model.$onInit = function () {
           getUserNewsPosts(model.authId, model.userId, $cookies.get('access_token'));
        };

        function getUserNewsPosts(authId, userId, access_token) {
            $http({
                method: "POST",
                url: MESSAGE_PATH + "/news/get_user_posts",
                params: {
                    id: userId,
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
