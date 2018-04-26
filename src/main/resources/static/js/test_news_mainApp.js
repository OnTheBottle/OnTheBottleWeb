'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';


const userId = 'acff954d-4ee5-439f-9fad-66db95be3b29';

(function () {
    'use strict';

    angular.module(
        'mainApp', [
            'ngRoute',
            'authApp',
            'findApp',
            'addFriendsApp',
            'linkFriendsApp',
            'viewFriendsApp',
            'registrationApp',
            'profileInfoApp',
            'userInfoApp',
            'newsApp',
            'footerApp'
        ])
        .controller('MainController', mainController);

    function mainController() {
        this.userId = userId;
    }
})();
