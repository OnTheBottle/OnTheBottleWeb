'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controllerAs: 'self',
    bindings: {
        userId: '='
    },
    controller: ['$routeParams', 'EventFactory', '$scope',
        function UserController($routeParams, EventFactory, $scope) {
            var self = this;
            //self.userId = $routeParams.userId;
            self.options = {allEvents: 'true', activeEvents: false, passedEvents: false};
            self.today = new Date();

            self.event = {
                getEvents: function () {
                    self.events = EventFactory.getEvents({userId: self.userId, options: self.options});
                },
                createEvent: function () {
                    angular.element('#myModal').modal('hide');
                    EventFactory.createEvent({
                        id: null,
                        title: self.title,
                        text: self.text,
                        startTime: self.startTime,
                        endTime: self.endTime,
                        place: self.place,
                        owner: self.userId
                    }, function (data) {
                        self.event.resetEvent();
                        self.event.getEvents();
                    }, function (errResponse) {
                        console.error('Error while creating Event');
                    });
                },
                resetEvent: function () {
                    angular.element('#myModal').modal('hide');
                    $scope.createEvent.$setUntouched();
                    $scope.createEvent.$setPristine();
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                }
            };

            self.event.getEvents();
            self.places = EventFactory.getPlaces({}, function (data) {
                self.place = data[0].id;
            }, function (errResponse) {
                console.error('Error while read places');
            });
        }]
});

