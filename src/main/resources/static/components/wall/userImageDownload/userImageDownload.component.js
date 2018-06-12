'use strict';

angular.module('avatarDownload')
    .factory('AvatarFactory', ['$resource', '$cookies',
        function ($resource, $cookies) {
            return $resource(MESSAGE_PATH + '/:path', {}, {
                uploadAvatar: {
                    params: {path: 'uploadAvatar', access_token: $cookies.get('access_token')},
                    method: "POST"
                }
            });
        }
    ])
    .component('avatarDownload', {
        templateUrl: 'components/wall/userImageDownload/userImageDownload.html',
        controller: ['$routeParams', '$localStorage', '$resource', '$scope', '$timeout', 'AvatarFactory',
            function AvatarController($routeParams, $localStorage, $resource, $scope, $timeout, AvatarFactory) {
                var self = this;
                $scope.myCroppedImage = '';
                $scope.myImage = '';


                var handleFileSelect = function (evt) {
                    var file = evt.currentTarget.files[0];
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        $scope.$apply(function ($scope) {
                            $scope.myImage = evt.target.result;
                        });
                    };
                    reader.readAsDataURL(file);
                };

                $timeout(function () {
                    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
                }, 1000, false);

                self.download = function () {
                    AvatarFactory.uploadAvatar({
                            base64: $scope.myCroppedImage
                        }, function (data) {
                            var avatarUrl = data.url;
                            $scope.myCroppedImage = '';
                            self.setAvatarUrl(avatarUrl);
                        },
                        function (errResponce) {
                            console.log("Error while added avatar", errResponce)
                        })
                };

                self.close = function () {
                    $scope.myCroppedImage = '';
                    $scope.myImage = '';
                    $("#fileInput").val("");

                }
            }],
        bindings: {
            setAvatarUrl: '='
        }

    });