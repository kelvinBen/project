/**
 * Created by sea on 2016/7/20.
 */
'use strict';

angular.module('myApp.viewjieduan', ['ui.bootstrap'])
    .controller('viewjieduanCtrl', viewjieduanCtrl);

viewjieduanCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function viewjieduanCtrl($resource,$scope,$timeout,$state) {
    $scope.perm = 1;
    $scope.newslistTab = function (_id) {
        if(_id == 0){
            $scope.perm = 1;
        }
        else{
            $scope.perm = 2;
        }
    }

    $scope.visible=false;
    $scope.a=function (index) {
        $scope.visible=!$scope.visible;
    }
}