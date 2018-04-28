(function () {
    'use strict';

    angular.module('registrationApp')
        .component('registrationComp', {
            templateUrl: 'components/registration/start-registration.component.html',
            controller: ['$http', '$window', RegController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function RegController($http, $window) {

        var model = this;
        model.newUser = {};

        model.$onInit = function () {
            /*
                        model.newUser = {
                            age: "22",
                            avatarUrl: "sdafdsf",
                            city: "dsafdsf",
                            country: "dsfsdfsdf",
                            email: "adad@dsafdsf",
                            login: "aasdads",
                            name: "sdfsdfsda",
                            password: "adasda",
                            surname: "sda"
                        };
            */
        };

        model.addRegistration = function () {
            console.log('New User: ', model.newUser);
            model.isAddNewUser = false;
            $http({
                method: "POST",
                url: USER_PATH + "/auth/registration",
                params: model.newUser
            }).then(function mySuccess(response) {
                console.log('response Auth: ', response.data.token);
                if (response.data.token !== null) {
                    model.isAuthUser = true;
                    model.token = response.data.token;
                    token = response.data.token;
                    $window.location.href = 'test_news_index.html';
                }
            }, function myError(response) {
                console.log(response.statusText);
            });

        }
    }

})();
