(function () {
    'use strict';
    angular.module('mainApp', [])
        .controller('MainController', MainController);

    function MainController() {
        this.personId = '12345678';
    }

    angular.module('mainApp')
        .component('myComp', {
            template: 'my-comp: {{model.name}}<br>{{model.in}}<br>{{model.out}}',
            controllerAs: 'model',
            controller: myCompController,
            bindings: {
                in: '='
            }
        });

    function myCompController() {
        var model = this;

        model.$onInit = function () {
            model.name = 'value of name';
            model.out = model.in; //How can I get 'in' to compController?
        }

        model.$onChanges = function () {
        }
    }
})();
