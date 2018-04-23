'use strict';

angular.module('events').component('events', {
    templateUrl: 'components/events/events.template.html',
    controller: ['$routeParams', 'EventFactory', '$resource', '$scope',
        function UserController($routeParams, EventFactory, $resource, $scope) {
            var self = this;
            self.userId = $routeParams.userId;
            this.orderProp = 'date'; //TODO понять принцип сортировки
            self.events = EventFactory.getEvents({user_Id: this.userId});
            self.places = getPlaces();

            self.submit = submit;

            function submit() {
                //$scope.myModal.modal('hide'); //TODO понять как скрыть форму
                EventFactory.createEvent({
                    id: null,
                    title: self.title,
                    text: self.text,
                    startTime: self.startTime,
                    endTime: self.endTime,
                    place: self.place,
                    owner: self.userId
                }, function (data) {
                    $scope.eventCreateForm.$setPristine();
                    $scope.eventCreateForm.$setPristine(); //TODO понять как очистить форму
                    self.title = '';
                    self.text = '';
                    self.startTime = '';
                    self.endTime = '';
                    getEvents();
                }, function (errResponse) {
                    console.error('Error while creating Event');
                });
            }

            function getEvents() {
                self.events = EventFactory.getEvents({user_Id: self.userId});
            }

            function getPlaces() {
                return $resource('http://localhost:8083/getPlaces',
                    {charge: {method: 'GET', isArray: true}}).query(function (data) {
                        self.place = data[0].id;
                        return data;
                });
            }
        }]
});

