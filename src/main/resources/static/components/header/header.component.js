'use strict';

(function () {
    'use strict';

    angular.module('mainApp')
        .component('headerComp', {
            templateUrl: 'components/header/header.component.html',
            controller: ['$http', '$window', '$cookies', '$localStorage', '$interval', HeaderController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function HeaderController($http, $window, $cookies, $localStorage, $interval) {

        var cache = $localStorage;
        var model = this;
        model.name = '';
        model.activeMenu = 'news';
        model.chatNotifier = cache.notifiers.chat.newMessageCounter;

        //console.log('webSocket.onmessage cache.notifiers: ', cache.notifiers);

        model.$onInit = function () {
            model.getUser();

            $interval(function () {
                model.chatNotifier = cache.notifiers.chat.newMessageCounter;
                //console.log('webSocket.onmessage cache.notifiers: ', cache.notifiers);
            }, 1000);

        };

/*
        model.$doCheck = function () {
            model.notifier = cache.notifiers.chat.newMessageCounter;
            console.log('$onChanges model.notifier: ', model.notifier);
        };
*/

        model.getUser = function () {
            $http({
                method: "POST",
                url: USER_PATH + "/user/get_by_id",
                params: {'userId': model.userId}
            }).then(function mySuccess(response) {
                model.name = response.data.name + ' ' + response.data.surname;

                if(response.data.avatarUrl===null){
                    model.avatar="images/userspictures/default-avatar.jpeg"
                }
                else{
                    model.avatar =response.data.avatarUrl ;
                }
                cache.authUser = response.data;
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
