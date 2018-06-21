/**
 * Created by sea on 2016/7/20.
 */
// 'use strict'
//
// angular.module('myApp.messageadd',['ics_service.message'])
//     .controller('messageaddCtrl',messageaddCtrl);
//
// messageaddCtrl.$inject=['$resource','$scope','$timeout','$state','messagelistService'];
// function messageaddCtrl($resource,$scope,$timeout,$state,messagelistService){
//    
//     $scope.vm={};
//     $scope.submit=function () {
//         messagelistService.add($scope.vm).then(function(data){
//             $state.go('app.message');
//         })
//     }
//
//     $scope.cancel = function () {
//         $state.go('app.message');
//     };
// }

'use strict';

angular.module('myApp.messageadd', ['ics_service.message'])
    .controller('messageaddCtrl', messageaddCtrl);

messageaddCtrl.$inject = ['$resource','$scope','$timeout','$state','messagelistService'];
function messageaddCtrl($resource,$scope,$timeout,$state,messagelistService) {

    //返回列表
    $scope.cancel = function () {
        $state.go('app.message');
    };
    $scope.vm = {};

    $scope.submit=function () {
        messagelistService.add($scope.vm).then(function (data) {
            $state.go('app.message');
        })
    }

}