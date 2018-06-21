/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.jieduan', ['ui.bootstrap'])
    .controller('jieduanCtrl', jieduanCtrl);

jieduanCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function jieduanCtrl($resource,$scope,$timeout,$state) {
    $scope.perm = 1;
    $scope.newslistTab = function (_id) {
        if(_id == 0){
            $scope.perm = 1;
        }
        else{
            $scope.perm = 2;
        }
    }
    $scope.open=function () {
        $state.go("app.fill.jieduan.objectivesmeeting")
    }
    $scope.update=function () {
        $state.go("app.fill.jieduan.update")
    }
    $scope.ready=function () {
        $state.go("app.fill.jieduan.prepformeeting")
    }
    $scope.brief=function () {
        $state.go("app.fill.jieduan.incidentbrief")
    }
    $scope.open1=function () {
        $state.go("app.fill.jieduan.prepforbrief")
    }
    $scope.notification=function () {
        $state.go("app.fill.jieduan.notifications")
    }

    $scope.visible=false;
    $scope.a=function (index) {
        $scope.visible=!$scope.visible;
    }
}