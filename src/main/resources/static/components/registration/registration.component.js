(function () {
    'use strict';

    angular.module('registrationApp')
        .component('registrationComp', {
            templateUrl: 'components/registration/registration.template.html',
            controller: ['$http', regController],
            controllerAs: 'model',
            bindings: {
                userId: '<'
            }
        });

    function regController($http) {

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
                url: USER_PATH + "/registration",
                params: model.newUser
            }).then(function mySuccess(response) {
                console.log('response: ', response.data);
                if (response.data.successful === true) {
                    model.isAddNewUser = true;
                    model.newUser = {};
                    console.log('clean newUser: ', model.newUser);
                }
            }, function myError(response) {
                alert(response.statusText);
            });

        }
    }

})();
