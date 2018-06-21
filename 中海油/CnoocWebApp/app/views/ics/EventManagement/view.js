/**
 * Created by sea on 2016/7/19.
 */
'use strict';

angular.module('myApp.view', ['ics_service.event'])
    .controller('viewCtrl', viewCtrl);

viewCtrl.$inject = ['$resource','$scope','$timeout','$state','eventservice','eventperiod','eventtables'];
function viewCtrl($resource,$scope,$timeout,$state,eventservice,eventperiod,eventtables) {
    var vm = this;
    activate();
    function activate() {
        vm.my_tree_handler = function(branch) {
            if (branch.data && branch.data.href) {
                $state.go(branch.data.href);
            }
        };
        var treedata_avm=[];
        // var treedata_avm = [
        //     {
        //         label: '直升机掉海事故',
        //         data:'',
        //         children: [
        //             {
        //                 label: '阶段7（2015-08-20 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段6（2015-08-16 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段5（2015-08-12 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段4（2015-08-08 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段3（2015-08-04 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段2（2015-08-03 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             },
        //             {
        //                 label: '阶段1（2015-08-01 12：00）',
        //                 data:{href:'app.view.jieduan'},
        //                 children: [
        //                     {
        //                         label:'ICS201-7（对外联络）',
        //                         data:{href:'app.view.contact'}
        //                     },
        //                     {
        //                         label:'ICS208安全计划',
        //                         data:{href:'app.view.safe'}
        //                     },
        //                     {
        //                         label:'ICS234（事故简报 ICS任务表）',
        //                         data:{href:'app.view.eventinfolist'}
        //                     },
        //                     {
        //                         label:'ICS234A（事故简报任务及详细描述）',
        //                         data:{href:'app.view.eventinfoexlist'}
        //                     },
        //                     {
        //                         label:'ICS205通讯计划',
        //                         data:{href:'app.view.communication'}
        //                     },
        //                     {
        //                         label:'ICS206医疗计划',
        //                         data:{href:'app.view.medical'}
        //                     },
        //                     {
        //                         label:'ICS202（应急响应目标）',
        //                         data:{href:'app.view.responseaim'}
        //                     },
        //                     {
        //                         label:'ICS209事故状态总结',
        //                         data:{href:'app.view.accidentsummary'}
        //                     },
        //                     {
        //                         label:'ICS210资源状态变化',
        //                         data:{href:'app.view.resourcechange'}
        //                     },
        //                     {
        //                         label:'ICS220飞行作业总结工作表',
        //                         data:{href:'app.view.flightslist'}
        //                     },
        //                     {
        //                         label:'ICS232处于风险的周边区域状况',
        //                         data:{href:'app.view.areainfos'}
        //                     },
        //                     {
        //                         label:'ICS203(组织分工表)',
        //                         data:{href:'app.view.organization'}
        //                     },
        //                     {
        //                         label:'ICS204(任务分配清单)',
        //                         data:{href:'app.fill.task'}
        //                     },
        //                     {
        //                         label:'ICS211事故入场清单',
        //                         data:{href:'app.view.admission'}
        //                     },
        //                     {
        //                         label:'ICS214小组日志',
        //                         data:{href:'app.view.grouplog'}
        //                     },
        //                     {
        //                         label:'ICS214A个人日志',
        //                         data:{href:'app.view.personallog'}
        //                     },
        //                     {
        //                         label:'ICS215作业计划表',
        //                         data:{href:'app.view.workslist'}
        //                     },
        //                     {
        //                         label:'ICS221（复员退场）',
        //                         data:{href:'app.view.retire'}
        //                     },
        //                     {
        //                         label:'ICS230日常例会',
        //                         data:{href:'app.view.daymeetlist'}
        //                     },
        //                     // {
        //                     //     label:'媒体信息发布',
        //                     //     data:{href:'app.view.media'}
        //                     // },
        //                     {
        //                         label:'ICS231（会议描述）',
        //                         data:{href:'app.view.firstmeet'}
        //                     },
        //                     {
        //                         label:'响应过程会议记录',
        //                         data:{href:'app.view.meetlist'}
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // ];
        vm.my_data = treedata_avm;
        vm.try_changing_the_tree_data = function() {
            if (vm.my_data === treedata_avm) {
                vm.my_data = treedata_geography;
            } else {
                vm.my_data = treedata_avm;
            }
            return vm.my_data;
        };

        $scope.curevent={};
        $scope.periods=[];

        eventservice.getdetail(localStorage.eventid).then(function(data){
            $scope.curevent = data;
            eventperiod.get().then(function(data){
                //$scope.allperiod=data;
                angular.forEach(data,function(item,index){
                   if(item.eventid==$scope.curevent.id)
                   {
                       $scope.periods.push(item);
                   }
                });

                treedata_avm = [];
                var obj={};
                obj.label = $scope.curevent.name;
                obj.children=[];
                obj.expand=true;
                angular.forEach($scope.periods,function(item,index){
                    var obj2 = {};
                    obj2.label = item.name+"("+item.starttime+"-"+item.endtime+")";
                    obj2.data={href:'app.view.jieduan'};
                    obj2.children=[];
                    obj.children.push(obj2);
                });
                treedata_avm.push(obj);
                vm.my_data = treedata_avm;
            });

        });



        eventperiod.getdetail(localStorage.periodid).then(function(data){
            $scope.vm.periodid = data.id;
        });


        $state.go('app.view.firstmeet');
    }
}