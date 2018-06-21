/**
 * Created by sea on 2016/7/20.
 */
'use strict';

angular.module('myApp.message', ['ics_service.message'])
    .controller('messageCtrl', messageCtrl);

messageCtrl.$inject = ['$resource','$scope','$timeout','$state','messagelistService'];
function messageCtrl($resource,$scope,$timeout,$state,messagelistService) {
    messagelistService.get().then(function(data){
        $scope.items=data;
    },function(error){
    
    })
    //跳转到添加用户
    $scope.add=function(){
        $state.go('app.messageadd');
    }

    $scope.delete =function (id) {
        messagelistService.delete(id).then(function(data){
            messagelistService.get().then(function (data) {
                $scope.items = data;
            },function(error){

            });
        },function(error){

        })
    }
    // $scope.items=[
    //     {
    //         date:'2016-06-20',
    //         country:'印尼',
    //         event:'印尼爪哇岛发生洪灾与山体滑坡 致35人死25人失踪',
    //         resource:'http://news.sina.com.cn/o/2016-06-20/doc-ifxtfsae5853005.shtml',
    //         check:'未录入'
    //     },
    //     {
    //         date:'2016-06-20',
    //         country:'伊拉克',
    //         event:'外媒称伊拉克应分裂为“三国”',
    //         resource:'http://news.sina.com.cn/w/zx/2016-06-20/doc-ifxtfrrc3902055.shtml	',
    //         check:'已录入'
    //     },
    //     {
    //         date:'2016-06-20',
    //         country:'伊拉克',
    //         event:'驻科威特使馆经商处提醒斋月期间注意事项 驻科威特各中资机构',
    //         resource:'http://www.mofcom.gov.cn/article/ztxx/xmlh/xmg/201606/20160601333997.shtml',
    //         check:'已录入'
    //     }
    // ];
}