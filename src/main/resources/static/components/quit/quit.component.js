(function () {
    'use strict';
    angular.module('quitApp')
        .component('quitComp', {
            templateUrl: 'components/quit/quit.component.html',
            controller: ['$http', '$window', '$cookies', QuitController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function QuitController($http, $window, $cookies) {

        var model = this;
        model.name = '';

        model.$onInit = function () {
            model.getUser();
        };

        model.getUser = function () {
            $http({
                method: "POST",
                url: USER_PATH + "/user/get_by_id",
                params: {'userId': model.userId}
            }).then(function mySuccess(response) {
                model.name = response.data.name + ' ' + response.data.surname;
            }, function myError(response) {
                console.log('error get_by_id: ', response.statusText);
            });
        }

        model.quit = function () {
            $cookies.remove('access_token');
            $window.location.href = AUTH_HTML;
        }
    }
})();
