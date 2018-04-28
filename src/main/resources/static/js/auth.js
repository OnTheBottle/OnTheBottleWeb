'use strict';

const USER_PATH = 'http://127.0.0.1:8081';

var userId = '';
var token = '';

console.log('start auth.js');

(function () {
    'use strict';

    angular.module(
        'mainApp', [
            'authApp',
            'registrationApp'
        ])
        .controller('MainController', mainController);

    function mainController() {
        console.log('start mainController');
        this.userId = userId;
        this.token = token;
    }
})();
