/**
 * Created by sea on 2016/7/10.
 */
'use strict';

angular.module('myApp.systemindex', [])
    .controller('systemindexCtrl', systemindexCtrl);

systemindexCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function systemindexCtrl($resource,$scope,$timeout,$state) {
    $scope.items=[
        {
            // name:'外媒称伊拉克应分为“三国” 防止宗派血腥冲突',
            // time:'20160320',
            // address:'伊拉克',
            // reason:'********',
            // ename:'印尼爪哇岛发生洪灾与滑坡 致35人死25人失踪',
            // elevel:'一级',
            // etime:'20160320',
            // econdition:'***********',
            // ereason:'******',
            // emethod:'****',
            // esecond:'***',
            tname:'1',
            tcondition:'***',
            treason:'',
            tmethod:''
        },
        {
            // name:'伊斯兰国枪杀8名伊拉克卧底警察并发布行刑视频',
            // time:'20160320',
            // address:'伊拉克',
            // reason:'********',
            // ename:'印尼爪哇岛发生洪灾与滑坡 致35人死25人失踪',
            // elevel:'二级',
            // etime:'20160320',
            // econdition:'***********',
            // ereason:'******',
            // emethod:'****',
            // esecond:'***',
            tname:'2',
            tcondition:'***',
            treason:'',
            tmethod:''
        },
        {
            // name:'驻科威特使馆经商处提醒斋月期间注意事项 驻科威特各中资机构',
            // time:'20160320',
            // address:'伊拉克',
            // reason:'********',
            // ename:'印尼爪哇岛发生洪灾与滑坡 致35人死25人失踪',
            // elevel:'三级',
            // etime:'20160320',
            // econdition:'***********',
            // ereason:'******',
            // emethod:'****',
            // esecond:'***',
            tname:'3',
            tcondition:'***',
            treason:'',
            tmethod:''
        },
        {
            // name:'外媒称伊拉克应分裂为“三国”',
            // time:'20160320',
            // address:'伊拉克',
            // reason:'********',
            // ename:'印尼爪哇岛发生洪灾与滑坡 致35人死25人失踪',
            // elevel:'二级',
            // etime:'20160320',
            // econdition:'***********',
            // ereason:'******',
            // emethod:'****',
            // esecond:'***',
            tname:'4',
            tcondition:'***',
            treason:'',
            tmethod:''
        }
    ];
  

    //列表显示与隐藏
    $scope.visible=false;
    $scope.toggle=function (index) {
        $scope.visible=!$scope.visible;
    }
    
    $scope.attention=false;
    $scope.open=function (index) {
        $scope.attention=!$scope.attention;
    }

    //应急事件列表（查看详情）
    // $scope.view=function () {
    //     $state.go('app.systemindexview');
    // };
}