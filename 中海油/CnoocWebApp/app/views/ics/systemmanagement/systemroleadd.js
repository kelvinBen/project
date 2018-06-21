/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.systemroleadd', ['ics_service.user'])
    .controller('systemroleaddCtrl', systemroleaddCtrl);

systemroleaddCtrl.$inject = ['$resource','$scope','$timeout','$state','userlistService'];
function systemroleaddCtrl($resource,$scope,$timeout,$state,userlistService) {

    //返回列表
    $scope.cancel = function () {
        $state.go('app.systemrole');
    };
    $scope.vm = {};

    $scope.submit=function () {
        userlistService.add($scope.vm).then(function (data) {
            $state.go('app.systemrole');
        })
    }

}