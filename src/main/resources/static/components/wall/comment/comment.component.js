'use strict';

angular.module('comment').component('comment', {
    templateUrl: 'components/wall/comment/comment.template.html',
    controller: ['$routeParams', 'CommentFactory', 'UserFactory', '$localStorage', 'UsersIdEmptyInfo', '$resource', '$q', '$scope', '$interval',
        function PostController($routeParams, CommentFactory, UserFactory, $localStorage, UsersIdEmptyInfo, $resource, $q, $scope, $interval) {
            var self = this;
            self.user = {};
            var defer = $q.defer();
            var promise = defer.promise;
            var commentUserId = null;

            var broadcast = $scope.$on('post', function (event, data) {
                console.log(data);
                if (data === 'true') {
                    defer.resolve($localStorage.users.getUser(commentUserId));
                    broadcast();
                }
            });

            moment.locale('ru');
            self.differ = null;
            self.dateComment = null;
            self.dateUTCTOlocal = null;
            self.format = null;

            var b = $interval(function () {
                differ();
            }, 3600000);

            function differ() {
                self.differ = moment(new Date()).diff(self.dateComment, 'h');
                if (self.differ < 23) {
                    self.watch = true;
                }
                else {
                    self.watch = false;
                }
            }

            function convertUTCDateToLocalDate(date) {
                var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                var offset = date.getTimezoneOffset() / 60;
                var hours = date.getHours();
                newDate.setHours(hours - offset);
                return newDate;
            }

            self.getStartInfo = function (id, date) {
                var dateC = moment(date, "MM-YYYY-DD HH:mm:ss");
                self.date = dateC;
                self.dateComment = moment(date, "MM-YYYY-DD HH:mm:ss");
                var datel = convertUTCDateToLocalDate(new Date(dateC));
                var t = datel.toLocaleString();
                self.dateUTCTOlocal = moment(t, "DD.MM.YYYY, HH:mm:ss");
                self.format = self.dateUTCTOlocal.format(' D MMM в HH:mm ');

                self.user = $localStorage.users.getUser(id);
                differ();

                self.user = $localStorage.users.getUser(id);
                if (!self.user) {
                    commentUserId = id;
                    promise.then(function (user) {
                        self.user = user;
                    });
                }
            };

            self.buttonDeleteCommentIsActive = function (userId) {
                var user = $localStorage.authUser;
                if (user.id === userId) {
                    return true
                }
                else {
                    return false
                }
            };

            self.deleteComment = function (commentId) {
                CommentFactory.deleteComment({commentId: commentId}, function (data) {
                    self.dropComment(commentId);
                }, function (errResponse) {
                    console.error('Error while deleting Comment', errResponse);
                })
            };
        }
    ],
    bindings: {
        dropComment: '=',
        comment: '='
    }
});
