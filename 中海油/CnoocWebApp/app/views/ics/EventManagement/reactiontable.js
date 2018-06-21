/**
 * Created by sea on 2016/7/10.
 */
'use strict';

angular.module('myApp.reactiontable', ['ics_service.event'])
    .controller('reactiontableCtrl', reactiontableCtrl);

reactiontableCtrl.$inject = ['$rootScope','$resource','$scope','$timeout','$state','$stateParams','$filter','eventservice','eventperiod','eventtables'];
function reactiontableCtrl($rootScope,$resource,$scope,$timeout,$state,$stateParams,$filter,eventservice,eventperiod,eventtables) {
    $scope.vm = {step:'1',tablename:'ics001',datajson:''};
    $scope.vm.data={};
    $scope.dt=new Date();
    $scope.isedit = false;
    $scope.submit=function(){
        $scope.vm.time = $filter('date')($scope.dt,'yyyy-MM-dd HH:mm');
        if($scope.isedit)
        {
            if($scope.vm.id)
            {
                $scope.vm.datajson = angular.toJson($scope.vm.data);
                eventtables.update($scope.vm.id,$scope.vm).then(function(data){
                    $state.go('app.eventindex');
                })
            }
            else
            {
                $scope.vm.datajson = angular.toJson($scope.vm.data);
                eventtables.add($scope.vm).then(function(data){
                    $state.go('app.eventindex');
                })
            }
        }
        else
        {
            $scope.addevent();
        }
    };

    var pdata = $stateParams.data;
    if(pdata)
    {
        $scope.isedit = true;
        if(pdata.id)
        {
            eventtables.getdetail(pdata.id).then(function(data){
                $scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.dt = new Date($scope.vm.time);
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function(data2){
                    $scope.vm.name = data2.name;
                });
            });
        }
        else
        {
            eventservice.getdetail(localStorage.eventid).then(function(data){
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function(data){
                $scope.vm.periodid = data.id;
            });
        }
    }

    $scope.addevent=function(){
        eventservice.add($scope.vm).then(function(data) {
            $scope.vm.eventid = data.id;
           $scope.addperiod(data);
        });
    };

    $scope.addperiod=function(data) {
        var period = {eventid:data.id,name:"阶段1"};
        var today = new moment();
        var endtime = (new moment()).add(1,'days');
        period.starttime =  today.format("YYYY-MM-DD HH:mm");
        period.endtime = endtime.format("YYYY-MM-DD HH:mm");
        eventperiod.add(period).then(function(data){
            $scope.vm.periodid=data.id;
            $scope.addtable(data);
        });
    };

    $scope.addtable=function(data){
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function(data){
            $state.go('app.eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.eventindex');
    };
}