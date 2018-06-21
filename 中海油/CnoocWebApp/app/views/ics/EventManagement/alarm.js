/**
 * Created by sea on 2016/7/10.
 */
'use strict';

angular.module('myApp.alarm', [])
    .controller('alarmCtrl', alarmCtrl);

alarmCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function alarmCtrl($resource,$scope,$timeout,$state) {

    //填写应急事件初报表
    $scope.primarytable = function () {
        $state.go('app.primarytable');
    };
    //填写国际应急事件反应表
    $scope.reactiontable = function () {
        $state.go('app.reactiontable');
    };
    $scope.basic = function () {
        $state.go('app.alarm.tasks');
    };
}