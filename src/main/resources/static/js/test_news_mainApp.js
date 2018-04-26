'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';


var userId = '';
//var userId = 'acff954d-4ee5-439f-9fad-66db95be3b29';

(function () {
    'use strict';

    angular.module(
        'mainApp', [
            'ngRoute',
            'ngResource',
            'authApp',
            'findApp',
            'addFriendsApp',
            'linkFriendsApp',
            'viewFriendsApp',
            'registrationApp',
            'profileInfoApp',
            'userInfoApp',
            'newsApp',
            'events',
            'event',
            'footerApp'
        ])
        .controller('MainController', mainController);

    function mainController() {
        this.userId = userId;
    }
})();
