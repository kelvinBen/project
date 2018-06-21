/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.icsform', ['ics_service.user'])
    .controller('icsformCtrl', icsformCtrl);

icsformCtrl.$inject = ['$resource','$scope','$timeout','$state','icsformService'];
function icsformCtrl($resource,$scope,$timeout,$state,icsformService) {
    icsformService.get().then(function(data){
        $scope.items=data;
    },function(error){

    });
    //跳转到添加用户
    $scope.add = function () {
        $state.go('app.icsformadd');
    };
    $scope.delete=function (id) {
        userlistService.delete(id).then(function(data){
            // $scope.items=data;
            userlistService.get().then(function(data){
                $scope.items=data;
            },function(error){

            });
        },function(error){

        });
    }
}