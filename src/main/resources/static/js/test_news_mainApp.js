'use strict';

const USER_PATH = 'http://127.0.0.1:8081';
const PLACE_PATH = 'http://127.0.0.1:8082';
const MESSAGE_PATH = 'http://127.0.0.1:8083';


const userId = 'ea50cb0e-3b87-48e0-9455-8f517212b8a5';

(function () {
    'use strict';

    angular.module('mainApp', ['ngRoute', 'registration', 'friends', 'newsApp'])
        .controller('MainController', MainController);

    function MainController() {
        this.userId = userId;
    }
})();
