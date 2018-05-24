(function () {
    'use strict';
    angular.module('mainApp')
        .component('headerComp', {
            templateUrl: 'components/header/v2header.component.html',
            controller: ['$http', '$window', '$cookies', '$localStorage', HeaderController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function HeaderController($http, $window, $cookies, $localStorage) {

        var model = this;
        model.name = '';
        model.activeMenu = 'news';

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
                model.avatar = response.data.avatarUrl;
                $localStorage.users.push(response.data);
            }, function myError(response) {
                console.log('error get_by_id: ', response.statusText);
            });
        };

        model.checkActive = function (x) {
            model.activeMenu = x;
        };

        model.getProfile = function () {
            model.activeMenu = '';
        };

        model.quit = function () {
            model.activeMenu = '';
            $cookies.remove('access_token');
        }
    }
})();
