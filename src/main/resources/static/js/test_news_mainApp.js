'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';


(function () {

    var userId = '57c49497-918c-4ece-81d9-629d11c5ad6b';

    angular.module('mainApp', ['ngRoute', 'registration', 'friends', 'newsApp'])
        .controller('MainController', MainController);

    function MainController() {
        this.userId = userId;
    }
})();
