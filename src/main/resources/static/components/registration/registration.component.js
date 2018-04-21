'use strict';

angular.module('registration')
    .component('registration', {
        templateUrl: '../components/registration/registration.template.html',
        controller: ['$http', regController],
        controllerAs: 'model',
        bindings: {
            userId: '<'
        }
    });

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';

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

