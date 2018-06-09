(function () {
    'use strict';
    angular.module('findApp')
        .component('findComp', {
            templateUrl: 'components/find/find.component.html',
            controller: ['$routeParams', '$http', findController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function findController($routeParams, $http) {

        var model = this;
        model.listOfPersons = [];

        model.$onInit = function () {
            //console.log('findController model.userId: ', model.userId);
            model.whatToFind = $routeParams.whatToFind;
            //console.log('findController model.whatToFind: ', model.whatToFind);
            model.request = {};
            model.request.search = model.whatToFind;

            $http({
                method: 'POST',
                url: USER_PATH + "/person_search",
                params: model.request
            }).then(function mySuccess(response) {
                model.listOfPersons = response.data.listOfPersons;
            }, function myError(response) {
            });

        };

        model.setOrderRule = function (rule) {
            if (model.orderRule == rule) {
                model.orderRule = '-' + rule;
            } else {
                model.orderRule = rule;
            }
        };

        // model.filter('ageRange', function () {
        //     return function (item) {
        //         var goals = [];
        //         for (var i = 0; i < item.length; i++) {
        //             if (item[i].age >= model.ageFrom && item[i].age <= model.ageTo) {
        //                 goals.push(item[i]);
        //             }
        //         }
        //         return goals;
        //     };
        // })
    }
})();
