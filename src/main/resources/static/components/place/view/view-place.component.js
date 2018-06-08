(function () {
    'use strict';
    angular.module('viewPlaceApp')
        .component('viewPlaceComp', {
            templateUrl: 'components/place/view/view-place.component.html',
            controller: ['PlaceFactory', '$window', '$scope', viewController],
            controllerAs: 'self'
        });

    function viewController(PlaceFactory, $window, $scope) {
        var self = this;
        self.image = '/images/places/';

        self.$onInit = function () {
            self.places = getPlaces();
        };

        self.createPlace = function () {
            PlaceFactory.createPlace({
                id: null,
                title: self.title,
                text: self.text,
                startTime: self.startTime,
                endTime: self.endTime,
                type: self.typePlace,
                image: self.image
            }, function () {
                self.showCreatePlace = false;
                notification('Место ' + self.title + ' созданно!');
                self.resetPlace();
                self.places = getPlaces();
            }, function (errResponse) {
                errResponseFunction(errResponse, 'Error while creating Place');
            });
        };

        self.typesPlace = PlaceFactory.getTypesPlace({}, function (data) {
            self.typePlace = data[0].id;
        }, function (errResponse) {
            errResponseFunction(errResponse, 'Error while read places');
        });

        self.resetPlace = function () {
            $scope.createPlaceForm.$setUntouched();
            $scope.createPlaceForm.$setPristine();
            self.title = '';
            self.text = '';
            self.startTime = '';
            self.endTime = '';
            self.image = '/images/places/';
        };

        function getPlaces() {
            return PlaceFactory.getPlaces({}, function (data) {
            }, function (errResponse) {
                errResponseFunction(errResponse, 'Error while read places');
            });
        }

        function errResponseFunction(errResponse, messageError) {
            if (errResponse.data === 'Non-valid token') {
                $window.location.href = AUTH_HTML;
            } else {
                console.error(messageError);
            }
        }

        function notification(text) {
            self.notificationText = text;
            angular.element('#notification').modal('show');
            $window.setTimeout(function () {
                angular.element('#notification').modal('hide');
            }, 2000);
        }
    }
})();
