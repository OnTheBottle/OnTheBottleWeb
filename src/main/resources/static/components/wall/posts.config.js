'use strict';

angular.module('postsApp')
.config( [
    '$compileProvider',
    function( $compileProvider)
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https?|local|data|chrome-extension):/);


    }
]);