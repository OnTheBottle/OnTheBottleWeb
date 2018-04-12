var app = angular.module('newsApp', ['postApp']);

app.component('appNews', {
    templateUrl: 'components/news/news.component.html',
    bindings: {
        userId: '='
    }
});

