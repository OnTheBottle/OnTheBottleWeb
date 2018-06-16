(function () {
    'use strict';
    angular.module('userInfoApp')
        .component('userInfoComp', {
            templateUrl: 'components/info/user/user-info.component.html',
            controller: ['$routeParams', '$http', 'EventFactory', '$localStorage', InfoController],
            controllerAs: 'model',
            bindings: {
                authId: '='
            }
        });

    function InfoController($routeParams, $http, EventFactory, $localStorage) {

        var model = this;
        model.requestData = {};
        model.requestData.id = '';
        model.user = {};
        model.events = [];

        model.$onInit = function () {
            model.requestData.id = $routeParams.id;
            $http({
                method: "GET",
                url: USER_PATH + "/showUsers",
                params: model.requestData
            }).then(function mySuccess(response) {
                model.user.name = response.data.name;
                model.user.surname = response.data.surname;
                model.user.age = response.data.age;
                model.user.email = response.data.email;
                model.user.country = response.data.country;
                model.user.city = response.data.city;
                model.user.deleted = response.data.deleted;
                console.log(model.user.deleted);
                model.user.password = response.data.password;
                if (response.data.avatarUrl) {
                    model.user.avatarUrl = response.data.avatarUrl;
                }
                else {
                    model.user.avatarUrl = "images/userspictures/default-avatar.jpeg";
                }
                model.user.status = response.data.status;
                model.user.info = response.data.info;
            }, function myError(response) {
            });
        };

        model.getEvents = function () {
            model.isEvents = true;

            if (model.events.length === 0) {
                EventFactory.getEventsFromUser(
                    {id: $routeParams.id},
                    function (data) {
                        if (data[0] !== undefined) {
                            data.forEach(function (event) {
                                event.place = $localStorage.places.getPlace(event.place.id);
                                model.events.push(event);
                            });
                        }
                    }, function () {
                        console.error('Error while read events');
                    });
            }
        }
    }
})();
