'use strict';

angular.module('comment').
    component('comment', {
    templateUrl: 'components/wall/comment/comment.template.html',
    controller: ['$routeParams','CommentFactory','UserFactory',
        function PostController($routeParams,CommentFactory,UserFactory) {
        var self=this;
        self.user={name:'',surname:'',avatarUrl:''};
            self.getUser=function (id) {
                console.log('userId',id);
                UserFactory.getUsr({userId: id},function (data) {
                        self.user.name = data.name;
                        self.user.surname=data.surname;
                        self.user.avatarUrl=data.avatarUrl;
                    },
                    function (errResponce) {
                        console.error('Error while get User');

                    });
            };


        }],
    bindings: {
 comment: '=',
 userId:'='
   }

});
