/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.icsformadd', ['ics_service.user'])
    .controller('icsformaddCtrl', icsformaddCtrl);

icsformaddCtrl.$inject = ['$resource','$scope','$timeout','$state','icsformService'];
function icsformaddCtrl($resource,$scope,$timeout,$state,icsformService) {

    //返回列表
    $scope.cancel = function () {
        $state.go('app.icsform');
    };
    $scope.vm = {};

    $scope.submit=function () {
        icsformService.add($scope.vm).then(function (data) {
            $state.go('app.icsform');
        })
    }

}