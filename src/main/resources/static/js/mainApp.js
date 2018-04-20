(function () {
    'use strict';

    var userId = '57c49497-918c-4ece-81d9-629d11c5ad6b';

    angular.module('mainApp', [])
        .controller('MainController', MainController);

    function MainController() {
        this.userId = userId;
    }
})();
