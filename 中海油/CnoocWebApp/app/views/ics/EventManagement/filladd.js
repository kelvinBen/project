/**
 * Created by ym on 2016/7/19.
 */
'use strict';

angular.module('myApp.filladd', [])
    .controller('filladdCtrl', filladdCtrl);

filladdCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function filladdCtrl($resource,$scope,$timeout,$state) {

    //返回列表
    $scope.cancel = function () {
        $state.go('app.fill');
    };
    // $scope.vm = {};
    //
    // $scope.submit=function () {
    //     userlistService.add($scope.vm).then(function (data) {
    //         $state.go('app.systemrole');
    //     })
    // }

}