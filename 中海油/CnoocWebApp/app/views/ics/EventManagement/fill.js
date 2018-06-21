/**
 * Created by sea on 2016/7/19.
 */
angular.module('myApp.fill', ['angularBootstrapNavTree'])
    .controller('myCtrl', myCtrl)
;


myCtrl.$inject = ['$resource','$scope','$timeout','$state'];
function myCtrl($resource,$scope,$timeout,$state) {
    var vm = this;
    activate();
    function activate() {
        vm.my_tree_handler = function(branch) {
            if (branch.data && branch.data.href) {
                $state.go(branch.data.href);
            }
        };
        var treedata_avm = [
            {
                label: '直升机掉海事故',
                data:'',
                children: [
                    {
                          label: '阶段7（2015-08-20 12：00）',
                          data:{ href:'app.fill.jieduan'},
                          children: [
                              // {
                              //     label:'ICS_Map(事故地图)',
                              //     data:{href:''}
                              // },
                              {
                                  label:'ICS201-7（对外联络）',
                                  data:{href:'app.fill.contact'}
                              },
                              {
                                  label:'ICS208（安全计划）',
                                  data:{href:'app.fill.safe'}
                              },
                              {
                                  label:'ICS234（事故简报 ICS任务表）',
                                  data:{href:'app.fill.eventinfolist'}
                              },
                              {
                                  label:'ICS234A（事故简报任务及详细描述）',
                                  data:{href:'app.fill.eventinfoexlist'}
                              },
                              {
                                  label:'ICS205（通讯计划）',
                                  data:{href:'app.fill.communication'}
                              },
                              {
                                  label:'ICS206（医疗计划）',
                                  data:{href:'app.fill.medical'}
                              },
                              {
                                  label:'ICS202（应急响应目标）',
                                  data:{href:'app.fill.responseaim'}
                              },
                              {
                                  label:'ICS209（事故状态总结）',
                                  data:{href:'app.fill.accidentsummary'}
                              },
                              {
                                  label:'ICS210（资源状态变化）',
                                  data:{href:'app.fill.resourcechange'}
                              },
                              {
                                  label:'ICS220(飞行作业总结工作表)',
                                  data:{href:'app.fill.flightslist'}
                              },
                              {
                                  label:'ICS232(处于风险的周边区域状况)',
                                  data:{href:'app.fill.areainfos'}
                              },
                              {
                                  label:'ICS203(组织分工表)',
                                  data:{href:'app.fill.organization'}
                              },
                              {
                                  label:'ICS204(任务分配清单)',
                                  data:{href:'app.fill.task'}
                              },
                              {
                                  label:'ICS211事故入场清单',
                                  data:{href:'app.fill.admission'}
                              },
                              {
                                  label:'ICS214（小组日志）',
                                  data:{href:'app.fill.grouplog'}
                              },
                              {
                                  label:'ICS214A（个人日志）',
                                  data:{href:'app.fill.personallog'}
                              },
                              {
                                  label:'ICS215（作业计划工作表）',
                                  data:{href:'app.fill.workslist'}
                              },
                              {
                                  label:'ICS221（复员退场）',
                                  data:{href:'app.fill.retire'}
                              },
                              {
                                  label:'ICS230（日常会议）',
                                  data:{href:'app.fill.daymeetlist'}
                              },
                              {
                                  label:'ICS231（会议描述）',
                                  data:{href:'app.fill.firstmeet'}
                              },
                              // {
                              //     label:'首次会议记录表',
                              //     data:{href:'app.fill.firstmeet'}
                              // },
                              {
                                  label:'响应过程会议记录',
                                  data:{href:'app.fill.meetlist'}
                              }
                              // {
                              //     label:'媒体信息发布',
                              //     data:{href:'app.fill.media'}
                              // }
                          ]
                    },
                    {
                        label: '阶段6（2015-08-19 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    },
                    {
                        label: '阶段5（2015-08-18 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    },
                    {
                        label: '阶段4（2015-08-17 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    },
                    {
                        label: '阶段3（2015-08-16 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    },
                    {
                        label: '阶段2（2015-08-15 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    },
                    {
                        label: '阶段1（2015-08-14 12：00）',
                        data:{ href:'app.fill.jieduan'},
                        children: [
                            // {
                            //     label:'ICS_Map(事故地图)',
                            //     data:{href:''}
                            // },
                            {
                                label:'ICS201-7（对外联络）',
                                data:{href:'app.fill.contact'}
                            },
                            {
                                label:'ICS208（安全计划）',
                                data:{href:'app.fill.safe'}
                            },
                            {
                                label:'ICS234（事故简报 ICS任务表）',
                                data:{href:'app.fill.eventinfolist'}
                            },
                            {
                                label:'ICS234A（事故简报任务及详细描述）',
                                data:{href:'app.fill.eventinfoexlist'}
                            },
                            {
                                label:'ICS205（通讯计划）',
                                data:{href:'app.fill.communication'}
                            },
                            {
                                label:'ICS206（医疗计划）',
                                data:{href:'app.fill.medical'}
                            },
                            {
                                label:'ICS202（应急响应目标）',
                                data:{href:'app.fill.responseaim'}
                            },
                            {
                                label:'ICS209（事故状态总结）',
                                data:{href:'app.fill.accidentsummary'}
                            },
                            {
                                label:'ICS210（资源状态变化）',
                                data:{href:'app.fill.resourcechange'}
                            },
                            {
                                label:'ICS220(飞行作业总结工作表)',
                                data:{href:'app.fill.flightslist'}
                            },
                            {
                                label:'ICS232(处于风险的周边区域状况)',
                                data:{href:'app.fill.areainfos'}
                            },
                            {
                                label:'ICS203(组织分工表)',
                                data:{href:'app.fill.organization'}
                            },
                            {
                                label:'ICS204(任务分配清单)',
                                data:{href:'app.fill.task'}
                            },
                            {
                                label:'ICS211事故入场清单',
                                data:{href:'app.fill.admission'}
                            },
                            {
                                label:'ICS214（小组日志）',
                                data:{href:'app.fill.grouplog'}
                            },
                            {
                                label:'ICS214A（个人日志）',
                                data:{href:'app.fill.personallog'}
                            },
                            {
                                label:'ICS215（作业计划工作表）',
                                data:{href:'app.fill.workslist'}
                            },
                            {
                                label:'ICS221（复员退场）',
                                data:{href:'app.fill.retire'}
                            },
                            {
                                label:'ICS230（日常会议）',
                                data:{href:'app.fill.daymeetlist'}
                            },
                            {
                                label:'ICS231（会议描述）',
                                data:{href:'app.fill.firstmeet'}
                            },
                            // {
                            //     label:'首次会议记录表',
                            //     data:{href:'app.fill.firstmeet'}
                            // },
                            {
                                label:'响应过程会议记录',
                                data:{href:'app.fill.meetlist'}
                            }
                            // {
                            //     label:'媒体信息发布',
                            //     data:{href:'app.fill.media'}
                            // }
                        ]
                    }
                ]
            }
        ];
        vm.my_data = treedata_avm;
        vm.try_changing_the_tree_data = function() {
            if (vm.my_data === treedata_avm) {
                vm.my_data = treedata_geography;
            } else {
                vm.my_data = treedata_avm;
            }
            return vm.my_data;
        };
        $state.go('app.fill.jieduan');
    }
    
    $scope.add = function () {
        $state.go('app.filladd');
    };
}