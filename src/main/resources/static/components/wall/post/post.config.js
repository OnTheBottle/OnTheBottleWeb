'use strict';

angular.module('post')
    .config(['$compileProvider', function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|blob|chrome-extension):/);

    }]);