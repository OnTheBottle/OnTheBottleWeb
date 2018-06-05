'use strict';

angular.module('fileApp').component('fileComp', {
    templateUrl: 'components/wall/upload/upload.template.html',
    controller: ['$scope', '$element',
        function UploadController($scope, element) {
            var self = this;
            var div = angular.element(document.querySelector("#total-progress .progress-bar"));
            self.uploadFile = function () {
                $scope.processDropzone();
            };

            self.reset = function () {
                $scope.resetDropzone();
                div.css("width", '0%');
            };

            $scope.width = function (progress) {
                var width = progress + "%";
                div.css("width", width);
            };

            $scope.onsending = function () {
                angular.element(document.querySelector("#total-progress")).css("opacity", "1");
                angular.element(document.querySelector(".start")).attr("disabled", "disabled");
            };

            $scope.queuecomplete = function () {
                console.log('ok')
            };

            $scope.showInformationDialog = function (files, serverResponce) {
                //    angular.element(document.querySelector("#total-progress")).css("opacity", "0");
                //    angular.element(document.querySelector(".start")).removeAttr("disabled");
                self.setUploadsFiles(serverResponce);
            };

            self.init = function (init) {
                if (init) {
                    self.showUpload();
                    self.showReset();
                }
            };
            self.showReset = function () {
                return true;
            };
            self.showUpload = function () {
                return true;
            };
            self.input = '';

            $scope.remove = function (file) {
                console.log(file)
            };

            $scope.getDropzoneQueue = function () {
                var count = $scope.getQueuedFiles()
            };

            self.proverka = function () {
                var count = $scope.returnCount();
                if(!count){
                    self.setUploadsFiles([]);
                }
                else{
                    self.uploadFile();
                }
            };
            var expression = element.attr('state');

            $scope.$parent.$watch(expression, function () {
                var a = angular.element(document.querySelector("file-comp")).attr("stata");
                console.log('atribute', a);
                if (a === 'download') {
                    console.log('download');
                    self.proverka();
               //     self.uploadFile();
                }
                if (a === 'reset') {
                    console.log('reset');
                    self.reset();

                }
            });
        }],
    bindings: {
        setUploadsFiles: '='
    }
});






