(function () {
    'use strict';
    angular.module('viewFriendsApp')
        .component('viewFriendsComp', {
            templateUrl: 'components/friends/view/view-friends.component.html',
            controller: ['$http', viewController],
            controllerAs: 'model',
            bindings: {
                userId: '='
            }
        });

    function viewController($http) {

        var model = this;

        model.$onChanges = function () {
            console.log('view friends userId:', model.userId);
        };
    }
})();
