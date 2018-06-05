'use strict';
angular.module('fileApp').directive('dropzone', dropzone);

function dropzone() {
    return function (scope, element, attrs) {
        var config = {
            url: 'http://localhost:8083/multiUpload',
            autoProcessQueue: false,
            uploadMultiple: true,
            maxFilesize: 2, // MB
            maxThumbnailFilesize: 1,
            dictFileTooBig: 'Хуек то великоват ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
            dictInvalidFileType: 'Файл с этим расширением нельзя добавить',
            dictMaxFilesExceeded: 'Можно добавить только 10 картинок',
            renameFile: true,
            parallelUploads: 10,
            maxFiles: 10,
            addRemoveLinks: true,
            acceptedFiles: "image/*"
        };
        var eventHandlers = {
            'success': function (file, response) {
            },
            //           "totaluploadprogress": function (progress) {
            //               scope.width(progress);
            //           },
            'successmultiple': function (files, serverResponse) {
                scope.showInformationDialog(files, serverResponse);
            }
            //           "sending": function (file) {
            //               scope.onsending();
            //           },
            //  'queuecomplete': function (progress) {
            //      scope.queuecomplete();
            //  }
        };
        var dropzone = new Dropzone(element[0], config);

        angular.forEach(eventHandlers, function (handler, event) {
            dropzone.on(event, handler);
        });

        scope.processDropzone = function () {
            dropzone.processQueue();
        };
        scope.resetDropzone = function () {
            dropzone.removeAllFiles();
        };
        scope.returnCount=function () {
            var a=dropzone.files.length;
            if(a===0){
                return false;}
            else{
                return true;
            }
        };
    };
}


//      var config = {
//          url: 'http://localhost:8083/uploaded',
//          autoProcessQueue: false,
//          uploadMultiple: true,
//          maxFilesize: 256, // MB
//          maxThumbnailFilesize: 1,
//          dictFileTooBig: 'Хуек то великоват ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
//          dictInvalidFileType: 'Файл с этим расширением нельзя добавить',
//          dictMaxFilesExceeded: 'You cant add more files',
//          renameFile: true,
//          parallelUploads: 100,
//          maxFiles: 5,
//          addRemoveLinks: true,
//        //  acceptedFiles:image/jpeg,application/pdf
//      };
//      var eventHandlers = {
//          "totaluploadprogress": function (progress) {
//              scope.width(progress);
//          },
//          "successmultiple": function (files, serverResponse) {
//              scope.showInformationDialog(files, serverResponse);
//
//          },
//          "sending": function (file) {
//              scope.onsending();
//          },
//
//          "queuecomplete": function (progress) {
//              scope.queuecomplete();
//          }
//
//      };
//
//      dropzone = new Dropzone(element[0], config);
//
//      angular.forEach(eventHandlers, function (handler, event) {
//          dropzone.on(event, handler);
//      });
//      scope.processDropzone = function () {
//          dropzone.processQueue();
//      };
//      scope.resetDropzone = function () {
//          dropzone.removeAllFiles();
//      };
//  };
//}
//
//
//
//
//
//