(function () {
    'use strict';

    angular.module('registrationApp')
        .component('registrationComp', {
            templateUrl: 'components/registration/start-registration.component.html',
            controller: ['$http', '$window', '$cookies', RegController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function RegController($http, $window, $cookies) {

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
            $http({
                method: "POST",
                url: USER_PATH + "/auth/registration",
                params: model.newUser
            }).then(function mySuccess(response) {
                console.log('response Auth: ', response.data.token);
                if (response.data.token !== null) {
                    model.isAuthUser = true;
                    $cookies.put('access_token', response.data.token);
                    $window.location.href = INDEX_FILE;
                }
                model.isAddNewUser = false;
            }, function myError(response) {
                console.log(response.statusText);
            });

        }
    }

})();
