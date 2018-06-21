/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.systemrole', ['ics_service.user'])
    .controller('systemroleCtrl', systemroleCtrl);

systemroleCtrl.$inject = ['$resource','$scope','$timeout','$state','userlistService'];
function systemroleCtrl($resource,$scope,$timeout,$state,userlistService) {
    userlistService.get().then(function(data){
        $scope.items=data;
    },function(error){
    
    });
    // $scope.items=[
    //     {
    //         department:'有限公司应急协调办公室',
    //         name:'魏文普',
    //         post:'主任',
    //         telephone:'0086-10-84521959',
    //         phone:'0086-13910617153'
    //     },
    //     {
    //         department:'有限公司应急协调办公室',
    //         name:'赵兰祥',
    //         post:'副主任',
    //         telephone:'0086-10-84521153',
    //         phone:'0086-13910321690'
    //     },
    //     {
    //         department:'有限公司应急协调办公室',
    //         name:'于波',
    //         post:'成员',
    //         telephone:'0086-10-84523903',
    //         phone:'0086-139118705973'
    //     },
    //     {
    //         department:'有限公司应急协调办公室',
    //         name:'魏文普',
    //         post:'主任',
    //         telephone:'0086-10-84521959',
    //         phone:'0086-13910617153'
    //     },
    //     {
    //         department:'应急管理委员会',
    //         name:'陈明',
    //         post:'主任',
    //         telephone:'0086-10-84526676',
    //         phone:'0086-13661281100'
    //     },
    //     {
    //         department:'应急管理委员会',
    //         name:'赵顺强',
    //         post:'副主任',
    //         telephone:'0086-10-84526677',
    //         phone:'0086-13661281117'
    //     },
    //     {
    //         department:'应急管理委员会',
    //         name:'周洪波',
    //         post:'委员',
    //         telephone:'0086-10-84528386',
    //         phone:'0086-13811568706'
    //     }
    // ];
    //跳转到添加用户
    $scope.add = function () {
        $state.go('app.systemroleadd');
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