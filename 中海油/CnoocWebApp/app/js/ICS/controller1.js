angular.module('app.ics', ['ics_service.event', 'cnooc_service', 'cnooc_service.Weather', 'cnooc_service.organiztion_user'])
angular.module('app.ics', ['ics_service.event', 'cnooc_service', 'cnooc_service.Weather', 'cnooc_service.organiztion_user'])

var curApp = angular.module('app.ics');

curApp.directive('paneltool', paneltool);

curApp.directive('resizer', function ($document) {

    return function ($scope, $element, $attrs) {

        $element.on('mousedown', function (event) {
            event.preventDefault();

            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {

            if ($attrs.resizer == 'vertical') {
                // Handle vertical resizer
                var wholewidth = document.body.clientWidth
                var x = event.pageX - 250;

                //if ($attrs.resizerMax && x > $attrs.resizerMax) {
                //    x = parseInt($attrs.resizerMax);
                //}

                $element.css({
                    left: (x + 15) + 'px'
                });

                $($attrs.resizerLeft).css({
                    width: x + 'px'
                });
                $($attrs.resizerRight).css({
                    width: (wholewidth - 300 - x - parseInt($attrs.resizerWidth)) + 'px'
                });

            } else {
                // Handle horizontal resizer
                var y = window.innerHeight - event.pageY;

                $element.css({
                    bottom: y + 'px'
                });

                $($attrs.resizerTop).css({
                    bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
                });
                $($attrs.resizerBottom).css({
                    height: y + 'px'
                });
            }
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
        }
    };
});

curApp.directive("markdown", function () {
    var converter = new showdown.Converter();
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            function renderMarkdown() {
                var htmlText = converter.makeHtml(scope.$eval(attrs.markdown) || '');
                element.html(htmlText);
            }
            scope.$watch(attrs.markdown, renderMarkdown);
            renderMarkdown();
        }
    };
});

paneltool.$inject = ['$compile', '$timeout'];
function paneltool($compile, $timeout) {
    var directive = {
        link: link,
        restrict: 'E',
        scope: false
    };
    return directive;

    function link(scope, element, attrs) {

        var templates = {
            /* jshint multistr: true */
            collapse: '<a href="#" panel-collapse="" uib-tooltip="Collapse Panel" ng-click="{{panelId}} = !{{panelId}}"> \
                        <em ng-show="{{panelId}}" class="fa fa-plus ng-no-animation"></em> \
                        <em ng-show="!{{panelId}}" class="fa fa-minus ng-no-animation"></em> \
                      </a>',
            dismiss: '<a href="#" panel-dismiss="" uib-tooltip="Close Panel">\
                       <em class="fa fa-times"></em>\
                     </a>',
            refresh: '<a href="#" panel-refresh="" data-spinner="{{spinner}}" uib-tooltip="Refresh Panel">\
                       <em class="fa fa-refresh"></em>\
                     </a>'
        };

        var tools = scope.panelTools || attrs;

        $timeout(function () {
            element.html(getTemplate(element, tools)).show();
            $compile(element.contents())(scope);

            element.addClass('pull-right');
        });

        function getTemplate(elem, attrs) {
            var temp = '';
            attrs = attrs || {};
            if (attrs.toolCollapse)
                temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')));
            if (attrs.toolDismiss)
                temp += templates.dismiss;
            if (attrs.toolRefresh)
                temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
            return temp;
        }
    }// link
}

curApp.filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);

curApp.controller('prejudgmentCtrl', prejudgmentCtrl)
    .controller('eventhistoryCtrl', eventhistoryCtrl)
    .controller('icsindexCtrl', icsindexCtrl)
    .controller('eventtypeselectCtrl', eventtypeselectCtrl)
    .controller('systemindexCtrl', systemindexCtrl)
    .controller('primarytableCtrl', primarytableCtrl)
    .controller('reactiontableCtrl', reactiontableCtrl)
    .controller('viewCtrl', viewCtrl)
    .controller('systemroleCtrl', systemroleCtrl)
    .controller('judgmentCtrl', judgmentCtrl)
    .controller('relieveCtrl', relieveCtrl)
    .controller('firstmeetingCtrl', firstmeetingCtrl)
    .controller('eventtablelistCtrl', eventtablelistCtrl)
    .controller('addperiodCtrl', addperiodCtrl)
    .controller('webmessageCtrl', webmessageCtrl)
    .controller('ics2011Ctrl', ics2011Ctrl)
    .controller('ics2012Ctrl', ics2012Ctrl)
    .controller('ics234Ctrl', ics234Ctrl)
    .controller('ics202Ctrl', ics202Ctrl)
    .controller('ics204Ctrl', ics204Ctrl)
    .controller('ics230Ctl', ics230Ctl)
    .controller('ics2016Ctl', ics2016Ctl)
    .controller('messageCtrl', messageCtrl)
    .controller('publicCtrl', publicCtrl)
    .controller('MarkerManageCtrl', MarkerManageCtrl)
    .controller('systemguideCtrl', systemguideCtrl)
    .controller('socialmessageCtrl', socialmessageCtrl)
    .controller('icsrolemgrControl', icsrolemgrControl)
    .controller('icsroleeditControl', icsroleeditControl)
    .controller('tableviewCtrl', tableviewCtrl)
    .controller('organiztionCtrl', organiztionCtrl)
    .controller('eventorganizationCtl', eventorganizationCtl)
    .controller('icsroleCtrl', icsroleCtrl)
    .controller('publicinfoCtl', publicinfoCtl)
    .controller('actiondutyctrl', actiondutyctrl)
    .controller('actionguidmgrCtl', actionguidmgrCtl)
    .controller('messageboardCtl', messageboardCtl)
    .controller('fileuploadCtl', fileuploadCtl)
    .controller('icsfilesCtl', icsfilesCtl)
    .controller('addicsfileCtl', addicsfileCtl)
    ;

icsindexCtrl.$inject = ['$scope'];
function icsindexCtrl($scope) {
    var ele = angular.element('#mapFrame')[0];
    ele.onload = ele.onreadystatechange = function () {
        ele.height = document.body.offsetHeight - 255;
    };
}

MarkerManageCtrl.$inject = ['$scope', 'icsdb', 'FileUploader'];
function MarkerManageCtrl($scope, icsdb, FileUploader) {
    $scope.markerlist = [];
    icsdb.get("eventmark").then(function (data) {
        $scope.markerlist = data;
    });

    $scope.changeMarker = function () {
        $scope.imgsrc = $scope.curMarker.url;
    }

    $scope.deletemarker = function () {
        if ($scope.curMarker) {
            if ($scope.curMarker.id) {
                icsdb.delete("eventmark", $scope.curMarker.id).then(function (data) {

                });
            }
            angular.forEach($scope.markerlist, function (item, index) {
                if (item == $scope.curMarker) {
                    $scope.markerlist.splice(index, 1);
                }
            });
        }
    };

    $scope.addmarker = function () {
        var obj = {};
        obj.name = $scope.name;
        obj.url = "";
        if (obj.name && obj.name != "")
            $scope.markerlist.push(obj);
    }

    var uploader = $scope.uploader = new FileUploader({
        //url: '/zh-cn/digitalmap/UploadImage',
        url: 'apis/api/ExSystemUploadMgr',
        queueLimit: 1,   //文件个数
        autoUpload: true,
        removeAfterUpload: false  //上传后删除文件
    });
    uploader.onBeforeUploadItem = function (item) {
        $scope.updateStatus = false;
        var file = item.file.name;
        if (file == '' || file == null) {
            layer.msg('请选择所要上传的文件！');
        } else {
            return true;
        }

        return false;
    };
    uploader.onCompleteAll = function () {
        uploader.clearQueue();
    }
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        //console.info('onCompleteItem', fileItem, response, status, headers);
        //$scope.vm.pic = "upload/"+response.path;
        $scope.imgsrc = "http://10.78.173.167/upload/" + response.path;
        if ($scope.curMarker)
            $scope.curMarker.url = $scope.imgsrc;
        //$scope.imgsrc = "http://"+$location.host()+':'+$location.port()+ response.path;
    };

    $scope.submitForm = function () {
        angular.forEach($scope.markerlist, function (item, index) {
            if (item.id) {
                icsdb.update("eventmark", item.id, item).then(function (data) {

                });
            } else {
                icsdb.add("eventmark", item).then(function (data) {

                });
            }
        });
    }
}

systemguideCtrl.$inject = ['$scope', 'icsdb'];
function systemguideCtrl($scope, icsdb) {
    icsdb.get("icsguide").then(function (data) {
        if (data.length > 0) {
            $scope.thecontent = data[0].document;
        }
    });
    //var ele = angular.element('#mapFrame')[0];
    //ele.onload = ele.onreadystatechange = function() {
    //     ele.height = document.body.offsetHeight - 255;
    //};
}

actiondutyctrl.$inject = ['$scope', '$sce', 'icsdb'];
function actiondutyctrl($scope, $sce, icsdb) {
    $scope.eventid = localStorage.eventid;
    icsdb.getdetail("eventstatus", '?eventid=' + $scope.eventid).then(function (data) {
        if (data.length > 0) {
            $scope.modifyURL = $sce.trustAsResourceUrl(data[0].actiondutyurl);
        }
    });
    //$scope.modifyURL = $sce.trustAsResourceUrl("http://10.78.173.167/actionguid/actionguid.htm");
    //$scope.modifyURL = "http://10.78.173.167/actionguid/actionguid.htm";
}

eventtypeselectCtrl.$inject = ['$scope', '$state', 'eventorgusers', 'eventorganization'];
function eventtypeselectCtrl($scope, $state, eventorgusers, eventorganization) {
    $scope.type = "0";
    $scope.cancel = function () {
        $state.go("app.ics_eventindex");
    };

    $scope.orgs = [];

    $scope.userid = localStorage.userid;
    $scope.interCompany = null;
    eventorganization.get().then(function (data) {
        var rootOrgList = [];
        angular.forEach(data, function (item) {
            if (item.parentid == -1) {
                rootOrgList.push(item);
            };
        });
        rootOrgList = rootOrgList.sort(function (a, b) {
            return a.sort - b.sort;
        });
        $.each(rootOrgList, function (i, root) {
            if (root.sort == 1) {//国际公司
                $scope.orgs.push(root);
                $scope.interCompany = root;
            } else if (root.sort == 2) {
                angular.forEach(data, function (item) {
                    if (item.parentid == root.id) {
                        $scope.orgs.push(item);
                    }
                });
            }
        });
        $scope.curOrg = $scope.orgs.length > 0 ? $scope.orgs[0] : null;
    });

    $scope.submit = function () {
        // var ids = '';
        // if ($scope.curOrg.parentid != -1){
        //     ids = $scope.interCompany.id + ','+$scope.curOrg.id;
        // }else {
        //     ids = $scope.curOrg.id;
        // }
        if ($scope.type == "0") {
            $state.go("app.ics_primarytable", { type: "", organiztionid: $scope.curOrg.id });
        }
        else if ($scope.type == "1") {
            $state.go("app.ics_unprimarytable");
        }
        else if ($scope.type == "2") {
            $state.go("app.ics_primarytable", { type: "国家撤离", organiztionid: $scope.curOrg.id });
        }
        else if ($scope.type == "3") {
            $state.go("app.ics_primarytable", { type: "地震灾害", organiztionid: $scope.curOrg.id });
        }
    }
}

systemindexCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'steptask', 'periodtask', 'roletask', 'icsuser', 'eventroles', 'eventorganization', 'eventpublicinfo', 'eventorgusers', 'icsdb', 'operator'];
function systemindexCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, eventservice, eventperiod, eventtables, steptask, periodtask, roletask, icsuser, eventroles, eventorganization, eventpublicinfo, eventorgusers, icsdb, operator) {

    var ele1 = angular.element('#sidebar-resizer');
    var ele2 = angular.element('#sidebar');
    //var height = ele.height();
    var x = ele2.width() + 12;
    ele1.css({
        left: x + 'px'
    });

    $scope.events = [];
    $scope.eventdetails = [];
    $scope.allperiods = [];
    $scope.periods = [];
    $scope.allperiodtask = [];
    $scope.allsteptask = [];
    $scope.tasks = [];
    $scope.alltables = [];
    $scope.tables = [];
    $scope.tablestatus = [];
    $scope.meeting = {};
    $scope.status1 = { isFirstOpen: true };
    $scope.status2 = { isFirstOpen: true };
    $scope.status3 = { isFirstOpen: true };
    // $scope.userRole="4";
    //$scope.userRolename = "应急管理协调办公室主任";
    //角色显示的模块
    $scope.roles = [];
    //行动指南
    $scope.guides = [];
    $scope.guidetables = [];
    $scope.actioncontent = "";
    $scope.nextaction = "";
    //当前行动表
    $scope.groupworks = [];
    $scope.bShowActionDuty = false;


    $scope.users = [];

    $scope.vieweventmap = function () {
        layer.open({
            type: 2,
            area: ['700px', '530px'],
            fix: false, //不固定
            maxmin: true,
            offset: ['100px', '1200px'],
            content: './app/views/ics/AccidentMap.html'
        });
        // layer.open({
        //     type: 2,
        //     area: ['500px', '500px'],
        //     title: '应急状态图',
        //     content: './app/views/ics/AccidentMap.html'
        //     //end: function(index, layero) {
        //     //    loadAllUsers();
        //    // }
        // });
    }


    icsuser.get().then(function (data) {
        $scope.orgs = data;

        $scope.userid = localStorage.userid;
        if ($scope.userid) {
            angular.forEach($scope.orgs, function (item, index) {
                angular.forEach(item.users, function (item2, index2) {
                    if ($scope.userid == item2.userid) {
                        $scope.curOrg = item;
                        $scope.curUser = item2;
                    }
                });
            });
        } else {
            $scope.curOrg = $scope.orgs[0];
            $scope.curUser = $scope.orgs[0].users[0];
            $scope.userid = $scope.curUser.userid;
            localStorage.userid = $scope.userid;
        }

        if ($scope.curUser) {
            eventroles.getdetail("?roleid=" + $scope.curUser.roleid).then(function (data) {
                if (data.length > 0) {
                    $scope.curRole = data[0];
                }
            });
        }

        $scope.loadDatas();
    });

    $scope.corrds = ["46,29,247,68", "140,104,347,151", "139,175,346,218", "140,249,346,280", "140,316,346,355", "140,386,346,423", "140,451,346,494", "140,520,346,564"];

    $scope.load = function () {
        //$scope.$on('$viewContentLoaded', function(){
        var ele = angular.element('#workflowimg');
        //var height = ele.height();
        var width = ele.width();
        var oriheight = 602;
        var oriwidth = 375;
        var scale = width / oriwidth;

        angular.forEach($scope.corrds, function (item, index) {
            var cors = item.split(',');
            if (cors.length == 4) {
                cors[0] = cors[0] * scale;
                cors[1] = cors[1] * scale;
                cors[2] = cors[2] * scale;
                cors[3] = cors[3] * scale;
                $scope.corrds[index] = cors[0] + ',' + cors[1] + ',' + cors[2] + ',' + cors[3];
            }
        });
    };



    $scope.changestep = function (step) {
        $scope.curevent.step = step;
        $scope.filtertask();
        $scope.filtertables();

        $scope.workflowurl = "app/img/workflow_step" + $scope.curevent.step + ".png";
        $scope.getnextaction();
    };

    $scope.getRole = function (roleid) {
        var role = "";
        angular.forEach($scope.users, function (item, index) {
            if (item.roleid == roleid) {
                role = item.role;
                return;
            }
        });
        return role;
    };


    $scope.getparentroleid = function (userRole) {
        if (userRole == "8")
            return "7"
        else if (userRole == "10")
            return "9"
        else if (userRole == "12")
            return "11"
        else if (userRole == "14")
            return "13"
    };

    $scope.getchildroleid = function (userRole) {
        if (userRole == "7")
            return "8"
        else if (userRole == "9")
            return "10"
        else if (userRole == "11")
            return "12"
        else if (userRole == "13")
            return "14"
    };

    $scope.getgroupworks = function () {
        //如果是组长，能看到自己和小组成员的报告
        //如果是组员，只能看到自己的报告
        $scope.groupworks = [];
        var userRole = $scope.curUser.roleid;
        if (userRole == "7" || userRole == "9" || userRole == "11" || userRole == "13") {
            var childid = $scope.getchildroleid(userRole);
            angular.forEach($scope.tables, function (item, index) {
                if (item.tablename == "ics2012") {
                    if (item.roleid == userRole || item.roleid == childid) {
                        $scope.groupworks.push(item);
                    }
                }
            });
        }
        else {
            var childid = $scope.getchildroleid(userRole);
            angular.forEach($scope.tables, function (item, index) {
                if (item.tablename == "ics2012") {
                    if (item.roleid == userRole) {
                        $scope.groupworks.push(item);
                    }
                }
            });
        }
    };

    $scope.getactioncontent = function () {
        $scope.actioncontent = [];
        var parentroleid = "0";
        var userRole = $scope.curUser.roleid;
        if (userRole == "8")
            parentroleid = "7"
        else if (userRole == "10")
            parentroleid = "9";
        else if (userRole == "12")
            parentroleid = "11";
        else if (userRole == "14")
            parentroleid = "13";
        eventtables.getactivetable($scope.cureventid, "ics204").then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.roleid == parentroleid || item.roleid == userRole) {
                    item.data = angular.fromJson(item.datajson);
                    $scope.actioncontent.push(item);
                }
            });
        });
        // angular.forEach($scope.tables, function (item, index) {
        //     if (item.tablename == "ics204" && (item.roleid == parentroleid || item.roleid == userRole)) {
        //         var data = angular.fromJson(item.datajson);
        //         $scope.actioncontent = data.workarrangement;
        //         //$scope.primarytable.data = angular.fromJson(item.datajson);
        //     }
        // });
    }

    $scope.getnextaction = function () {
        if ($scope.curevent.step == "1") {
            $scope.nextaction = "填写基本情况表,等待应急协调办公室发布初步形势判断";
        }
        else if ($scope.curevent.step == "2") {
            $scope.nextaction = "等待应急管理委员会启动应急并召开首次应急会议";
        }
        else if ($scope.curevent.step == "3") {
            $scope.nextaction = "各小组分配任务，应急协调办公室根据各小组的行动报告进行形势判断";
        }
        else if ($scope.curevent.step == "4") {
            $scope.nextaction = "等待应急管理委员会启动应急并召开应急过程会议";
        }
        else if ($scope.curevent.step == "5") {
            $scope.nextaction = "各小组分配任务，应急协调办公室根据各小组的行动报告进行形势判断";
        }
        else if ($scope.curevent.step == "6") {
            $scope.nextaction = "各小组分配任务，应急协调办公室根据各小组的行动报告进行形势判断";
        }
        else if ($scope.curevent.step == "7") {
            $scope.nextaction = "各小组分配任务，应急协调办公室根据各小组的行动报告进行形势判断并确定应急过程会议时间";
        }
        else if ($scope.curevent.step == "8") {
            $scope.nextaction = "应急解除";
        }
    };


    // roletask.get().then(function (data) {
    //     $scope.roles = data;
    // });

    $scope.summarytable = {};

    $scope.showpanel = function (panel) {
        var bshow = false;
        if (!$scope.curevent) return bshow;
        if (!$scope.curRole) return bshow;
        $.each($scope.curRole.role, function (i, role) {
            if (role.step == $scope.curevent.step) {//当前阶段
                var roles = role.roles;//该阶段对应角色的所有可控制权限
                $.each(roles.panels, function (j, rolepanel) {
                    if (rolepanel == panel) {
                        bshow = true;
                        return false;
                    }
                });
                return false;
            }
        });
        return bshow;
    };
    //$scope.task_tables=[];
    //$scope.plan_tables=[];
    //$scope.log_tables=[];

    $scope.workflowurl = "app/img/workflow_step1.png";

    $scope.responsecontent = "-领导国际公司的应急响应及应急处理工作，审批国际公司的应急管理预案，担任突发事件处置行动的最高指挥</br>-宣布国际公司应急状态的启动和结束 -主持首次应急处理会议 -批准重大应急决策 -决定向中海石油有限公司报告 -必要时派出相关领导及人员赴现场";

    // $scope.curevent = localStorage.eventid;
    // $scope.curperiod=localStorage.periodid;

    //$rootScope.curevent={};
    //$rootScope.curperiod={};

    $scope.replytask = function (item) {
        $state.go("app.ics204", { task: item });
    };

    $scope.edittable = function (item) {
        if (item.tableid) {
            eventtables.getdetail(item.tableid).then(function (data) {
                $state.go(item.url, { data: data });
            });
        }
        else {
            $state.go(item.url);
        }

    };

    $scope.cureventid = localStorage.eventid;

    $scope.loadtables = function () {
        $scope.tablestatus = [];
        periodtask.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                angular.forEach(item.tables, function (item2, index2) {
                    item2.type = item.type;
                    $scope.tablestatus.push(item2);
                });
            });

            eventtables.getdetail("?eventid=" + $scope.cureventid).then(function (data) {
                angular.forEach(data, function (item, index) {
                    angular.forEach($scope.tablestatus, function (item2, index2) {
                        if (item.eventid == $scope.cureventid) {
                            if (item.tablename == item2.tablename) {
                                item2.updatetime = item.time;
                                item2.tableid = item.id;
                                item2.user = item.user;
                            }
                        }
                    });
                });
                $scope.getgoals();
                $scope.getmeeting();
                $scope.getprimarytable();
                $scope.getguides();
                $scope.getactioncontent();
                $scope.getgroupworks();
            });
        });
    };

    $scope.getRolename = function (roleid) {
        var s = '';
        $.each($scope.roleList, function (i, item) {
            if (item.roleid == roleid) {
                s = item.rolename;
                return false;
            }
        });
        return s;
    };

    // $scope.changerole = function () {
    //     localStorage.userid = $scope.curUser.userid;
    //     //$scope.userRolename = $scope.curUser.role;
    //     $scope.getguides();
    //     $scope.getgoals();
    //     $scope.getactioncontent();
    //     $scope.getgroupworks();
    // };

    $scope.getguides = function () {
        if (!$scope.curevent)
            return;
        if (!$scope.curRole)
            return;
        $scope.guides = [];
        if ($scope.curevent.organiztion != $scope.curOrg.organiztionid)
            return;
        $.each($scope.curRole.role, function (i, steprole) {
            if (steprole.step == $scope.curevent.step) {
                $scope.guides = steprole.roles.guide;
                $scope.guidetables = steprole.roles.tables;
                return false;
            }
        });
        // angular.forEach($scope.roles, function (steprole, index) {
        //     if (steprole.step == $scope.curevent.step) {
        //         angular.forEach(steprole.roles, function (role, index2) {
        //             if (role.roleid == $scope.curUser.roleid) {
        //                 $scope.guides = role.guide;
        //                 $scope.guidetables = role.tables;
        //                 return;
        //             }
        //         });
        //     }
        // });
    };

    $scope.getprimarytable = function () {
        // angular.forEach($scope.tables, function (item, index) {
        //     if (item.tablename == "ics001") {
        //         $scope.primarytable = item;
        //         $scope.primarytable.data = angular.fromJson(item.datajson);
        //     }
        // });

        eventtables.getbytablename($scope.cureventid, "ics001").then(function (data) {
            angular.forEach(data, function (item, index) {
                //if (item.tablename == "ics001") {
                $scope.primarytable = item;
                $scope.primarytable.data = angular.fromJson(item.datajson);
                //}
            });
        });
    };

    $scope.event_goals = [];

    $scope.getgoals = function () {
        $scope.event_goals = [];
        // angular.forEach($scope.tables, function (item, index) {
        //     if (item.tablename == "ics204") {
        //         var task = angular.fromJson(item.datajson).task;
        //         if (task) {
        //             angular.forEach($scope.event_goals, function (item2, index2) {
        //                 if (item2.name == task.name) {
        //                     item2.updatetime = item.time;
        //                     item2.tableid = item.id;
        //                 }
        //             });
        //         }
        //     }
        // });
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.cureventid).then(function (data) {
            if (data.length > 0) {
                $scope.bShowActionDuty = false;
                if (data[0].actiondutyurl) {
                    if (data[0].actiondutyurl != "") {
                        $scope.bShowActionDuty = true;
                    }
                }
                var goals = data[0].task;
                //$scope.vm.data.task=goals;
                $scope.event_goals = [];
                angular.forEach(goals, function (item, index) {
                    angular.forEach(item.data, function (item2, index2) {
                        if (item2.checked == "true")
                            item2.checked = true;
                        else
                            item2.checked = false;
                    });
                });

                angular.forEach(goals, function (item2, index2) {
                    angular.forEach(item2.data, function (item3, index3) {
                        if (item3.checked == true) {
                            var obj = {};
                            obj.goal = item2.name;
                            obj.strategy = item3.name;
                            obj.name = item2.taskname;
                            obj.action = "";
                            var actions = angular.fromJson(item3.actionsjson);
                            angular.forEach(actions, function (item4, index4) {
                                if (obj.action != "")
                                    obj.action += ";";
                                obj.action += item4.action;
                            });
                            obj.status = item3.status;
                            if (item3.user) {
                                obj.username = item3.user.real_name + "(" + item3.person.name + ")";
                                obj.starttime = item3.starttime;
                            }

                            $scope.event_goals.push(obj);
                        }
                    });
                });
            };
        });
    };

    $scope.getgoals2 = function () {
        $scope.event_goals = [];
        angular.forEach($scope.tablestatus, function (item, index) {
            if (item.tablename == "ics234") {
                if (item.tableid) {
                    eventtables.getdetail(item.tableid).then(function (data) {
                        // var datas = angulardata.datajson;
                        var goals = angular.fromJson(data.datajson).goals;
                        //if ($scope.curUser.role == "4" || $scope.curUser.role == "5" || $scope.curUser.role == "6") {
                        if ($scope.showpanel('tasktable')) {
                            $scope.event_goals = goals;
                        }
                        else {
                            angular.forEach(goals, function (item2, index2) {
                                var groupids = item2.groupids;
                                var hasPermission = false;
                                angular.forEach(groupids, function (item3, index3) {
                                    if (item3 == $scope.curRole.organization) {
                                        hasPermission = true;
                                        return;
                                    }
                                });
                                if (hasPermission) {
                                    $scope.event_goals.push(item2);
                                }
                            });
                        }
                        // $scope.event_goals = angular.fromJson(data.datajson).goals;
                        // $scope.getgoalstatus();
                    });
                }
            }
        });

    };

    $scope.getmeeting = function () {
        $scope.meeting = {};
        eventtables.getactivetable($scope.cureventid, "meeting").then(function (data) {
            angular.forEach(data, function (item, index) {
                $scope.meeting = angular.fromJson(item.datajson);
            });
        });
        // angular.forEach($scope.tables, function (item, index) {
        //     if (item.tablename == "meeting") {
        //         var data = angular.fromJson(item.datajson);
        //         if (data) {
        //             $scope.meeting = data;
        //             return;
        //         }
        //     }
        // });
    };

    // $scope.loadtables();
    $scope.othertable = function (url) {
        var obj = {
            data: {
                evt: $scope.curevent,
                period: $scope.curperiod,
                user: $scope.curUser
            }
        };
        $state.go(url, obj);
    };

    $scope.viewtable = function (item) {
        $state.go(item.url, { data: item });
    };

    // $scope.curOrg ="0";

    $scope.changeorg = function () {
        $scope.loadDatas();
        //$scope.loadrolelist();
        $scope.curUser = $scope.curOrg.users[0];
        $scope.changeRoleEx();
    };

    $scope.bShowActionGuide = true;

    //$scope.curBelongs = !localStorage.belongs?"0":localStorage.belongs;
    $scope.loadDatas = function () {
        //localStorage.belongs = $scope.curBelongs;
        if (!$scope.curOrg.organiztionid)
            return;
        $scope.events = [];
        eventservice.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                //angular.forEach(item.organiztions,function(item2,index2){
                if (item.organiztion == $scope.curOrg.organiztionid) {
                    $scope.events.push(item);
                }
                else if ($scope.curOrg.organiztionid == "81940c2be8212921") {
                    eventorganization.getdetail(item.organiztion).then(function (item3) {
                        item.name += "(" + item3.organization + ")";
                        $scope.events.push(item);
                    });
                    //item.name+="("+")";
                    //$scope.events.push(item);
                }
                //});
                //if(item.organiztionid==$scope.curOrg.organiztionid||$scope.curOrg.organiztionid=="2016011801")
                //{
                //     $scope.events.push(item);
                // }
            });
            angular.copy($scope.events, $scope.eventdetails);
            eventperiod.get().then(function (data) {
                $scope.allperiods = $filter('orderBy')(data, '-starttime');
                if (data.length > 0) {
                    // if (localStorage.eventid) {
                    //     angular.forEach($scope.events, function (item, index) {
                    //         if (item.id == localStorage.eventid) {
                    //             $scope.curevent = item;
                    //             return;
                    //         }
                    //     });
                    // }
                    // else {
                    //     $scope.curevent = $scope.events[0];
                    // }

                    if (localStorage.eventid) {
                        var flag = false;
                        $.each($scope.events, function (i, item) {
                            if (item.id == localStorage.eventid) {
                                $scope.curevent = item;
                                flag = true;

                                if (item.organiztionid != "2016011801") {
                                    $scope.bShowActionGuide = false;
                                }
                                return false;
                            }
                        });
                        if (flag == false) {
                            $scope.curevent = $scope.events[0];
                        }
                    } else {
                        $scope.curevent = $scope.events[0];
                    }
                    $scope.changeevent();
                }
            });
        });
        // eventservice.getdetail("?organiztionid="+$scope.curOrg.organiztionid).then(function (data) {//国际公司的事件
        //     $scope.events = data;
        //     angular.copy($scope.events, $scope.eventdetails);
        //     eventperiod.get().then(function (data) {
        //         $scope.allperiods = $filter('orderBy')(data, '-starttime');
        //         if (data.length > 0) {
        //             if (localStorage.eventid){
        //                 var flag = false;
        //                 $.each($scope.events, function(i, item) {
        //                     if (item.id == localStorage.eventid) {
        //                         $scope.curevent = item;
        //                         flag = true;
        //                         return false;
        //                     }
        //                 });
        //                 if (flag == false){
        //                     $scope.curevent = $scope.events[0];
        //                 }
        //             }else{
        //                 $scope.curevent = $scope.events[0];
        //             }
        //             $scope.changeevent();
        //         }
        //     });
        // });
    };


    $scope.roleList = [];
    $scope.eventOrgList = [];

    $scope.loadrolelist = function () {
        $scope.roleList = [];
        if (!$scope.curOrg)
            return;
        if (!$scope.curOrg.organiztionid)
            return;
        eventroles.getdetail('?organizationid=' + $scope.curOrg.organiztionid).then(function (data) {//国际公司的角色列表
            $scope.roleList = data;
            if ($scope.roleList.length > 0) {
                $scope.curRole = $scope.roleList[0];
            }
            eventorganization.getdetail('?type=0').then(function (orgs) {//国际公司的组织机构
                $scope.eventOrgList = orgs;
                $scope.userid = localStorage.userid;
                if (!$scope.userid || $scope.userid == 'undefined') {//第一次登陆
                    $scope.curUser = $scope.eventOrgList[0].users[0];
                    $scope.userid = $scope.curUser.user.user_id;
                    $.each($scope.roleList, function (i, role) {
                        if ($scope.curUser.role == role.roleid) {
                            $scope.curRole = role;
                            return false;
                        }
                    });
                    localStorage.userid = $scope.userid;
                } else {
                    $.each($scope.eventOrgList, function (i, org) {
                        var flag = false;
                        $.each(org.users, function (j, u) {
                            if (u.user.user_id == $scope.userid) {
                                $scope.curUser = u;
                                $.each($scope.roleList, function (k, role) {
                                    if ($scope.curUser.role == role.roleid) {
                                        $scope.curRole = role;
                                        return false;
                                    }
                                });
                                flag = true;
                                return false;
                            }
                        });
                        if (flag) return false;
                    });
                }
                // $scope.changeRoleEx();
                // $scope.loadDatas();
            });
        });
    };

    $scope.loadrolelist();

    $scope.changeRoleEx = function () { //为了模拟不同用户登陆,测试改变用户角色
        $scope.userid = $scope.curUser.userid;
        localStorage.userid = $scope.userid;

        operator.getdetail($scope.userid).then(function (data) {
            $rootScope.userName = data.real_name;
        });
        eventroles.getdetail("?roleid=" + $scope.curUser.roleid).then(function (data) {
            if (data.length > 0) {
                $scope.curRole = data[0];
                $scope.getguides();
                $scope.getgoals();
                $scope.getactioncontent();
                $scope.getgroupworks();
            }
        });

        // $.each($scope.eventOrgList, function(j, org) {
        //     var flag = false;
        //     $.each(org.users, function(k, u) {
        //         if (u.role == $scope.curRole.roleid) {
        //             $scope.curUser = u;
        //             $scope.userid = $scope.curUser.user.user_id;
        //             localStorage.userid = $scope.userid;
        //             flag = true;
        //             return false;
        //         }
        //     });
        //     if (flag) return false;
        // });

        $scope.getguides();
        $scope.getgoals();
        $scope.getactioncontent();
        $scope.getgroupworks();

    };

    steptask.get().then(function (data) {
        $scope.allsteptask = data;
    });

    periodtask.get().then(function (data) {
        $scope.allperiodtask = data;
    });

    eventtables.getdetail("?eventid=" + $scope.cureventid).then(function (data) {
        $scope.alltables = $filter('orderBy')(data, "time");
    });

    $scope.filtertables = function () {
        $scope.tables = [];
        angular.forEach($scope.alltables, function (item, index) {
            if (item.eventid == $scope.curevent.id) {
                item.name = $scope.gettablename(item.tablename);
                item.url = $scope.gettableurl(item.tablename);
                $scope.tables.push(item);
            }
        });
        $scope.loadtables();
    };

    $scope.getRequird = function (item) {
        if (item)
            return "是";
        else
            return "否";
    };

    $scope.filtertask = function () {
        $scope.tasks = [];
        var step = $scope.curevent.step;
        if (step > 10)
            step = step % 10;

        angular.forEach($scope.allsteptask, function (item, index) {
            if (item.step == step) {
                angular.forEach(item.tables, function (item2, index2) {
                    var obj = {};
                    angular.copy(item2, obj);
                    obj.step = $scope.curevent.step;
                    $scope.tasks.push(obj);
                });
            }
        });

        angular.forEach($scope.allperiodtask, function (item, index) {
            $scope.tasks.push(item);
        });

        angular.forEach($scope.tasks, function (item, index) {
            item.status = "未填写";
            angular.forEach($scope.alltables, function (item2, index2) {
                if (item2.eventid == $scope.curevent.id && item2.step == $scope.curevent.step) {
                    if (item.tablename == item2.tablename) {
                        item.status = "已填写";
                        item.tableid = item2.id;
                        return;
                    }
                }
            });
        });

    }

    $scope.gettablename = function (tablename) {
        var name = "";
        angular.forEach($scope.allsteptask, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                if (item2.tablename == tablename) {
                    name = item2.name;
                    return;
                }
            });
        });
        return name;
    };

    $scope.gettableurl = function (tablename) {
        var name = "";
        angular.forEach($scope.allperiodtask, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                if (item2.tablename == tablename) {
                    name = item2.url;
                    return;
                }
            });
        });
        return name;
    };

    $scope.changeevent = function () {
        if (!$scope.curevent) return;
        localStorage.eventid = $scope.curevent.id;
        $scope.cureventid = localStorage.eventid;
        $scope.periods = [];
        angular.forEach($scope.allperiods, function (item, index) {
            if (item.eventid == $scope.curevent.id) {
                $scope.periods.push(item);
            }
        });
        if ($scope.periods.length > 0) {
            $scope.curperiod = $scope.periods[0];
            $scope.changeperiod();
        }
        $scope.filtertask();
        $scope.filtertables();

        $scope.workflowurl = "app/img/workflow_step" + $scope.curevent.step + ".png";
        $scope.getnextaction();
        $scope.getPublicInfos();
    }
    $scope.publicInfoList = [];
    $scope.getPublicInfos = function () {
        eventpublicinfo.getdetail('?eventid=' + $scope.cureventid).then(function (dt) {
            $scope.publicInfoList = dt;
        });
    };

    $scope.changeperiod = function () {
        localStorage.periodid = $scope.curperiod.id;
        $scope.filtertask();
    }

    //列表显示与隐藏
    $scope.visible = false;
    $scope.toggle = function (index) {
        $scope.visible = !$scope.visible;
    }

    $scope.attention = false;
    $scope.open = function (index) {
        $scope.attention = !$scope.attention;
    }

    $scope.setPublicInfos = function () {
        var par = {
            data: $scope.curRole
        };
        $state.go('app.publicinfos', par);
    };

    //应急事件列表（查看详情）
    // $scope.view=function () {
    //     $state.go('app.systemindexview');
    // };
}

prejudgmentCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', 'eventservice', 'eventperiod'];
function prejudgmentCtrl($rootScope, $resource, $scope, $timeout, $state, eventservice, eventperiod) {
    $scope.title = localStorage.belongs == "0" ? "国际公司初步形式判断" : "海外机构初步形式判断";
    $scope.subTitle = localStorage.belongs == "0" ? "是否满足启动国际公司应急条件" : "是否满足启动海外机构应急条件";
    $scope.vm = { startevent: '1', level: '1' };
    $scope.sendMsg = true;
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.curevent = data;
    });

    $scope.sendmessage = function () {
        if ($scope.sendMsg) {
            var content = "2016年5月5日12时，伊拉克公司在巴格达区域（场地）发生溢油事故，事故现场共造成0人伤害，财产损失0元，溢油1吨，事故等级为III级，目前现场正积极组织应急响应及事故。国际公司应急协调办公室2016年5月5日";
            var reg = new RegExp("\n", "g");
            content = content.replace(reg, "<br/>");
            var obj = {
                content: content,
                title: "应急事件通知",
                category_type: 2,
                type: 2,
                top: 0,
                is_return: 0,
                sms_content: content
            };
            //obj.content = content;
            //obj.sms_content = content;
            $state.go('app.writeMessage', { data: obj });
            //$state.go('app.ics_webmessage');
        }
        else {
            $state.go('app.ics_eventindex');
        }
    };


    $scope.useSend = false;
    $scope.submit = function () {
        if ($scope.vm.startevent == '1') {
            $scope.curevent.step = 2;
            $scope.curevent.level = $scope.vm.level;
            eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                // $state.go('app.ics_eventindex')
                if ($scope.sendMsg)
                    $scope.sendmessage();
                else
                    $state.go('app.ics_eventindex');
            });
        }
        else if ($scope.vm.startevent == '0') {
            $scope.curevent.step = 8;
            $scope.curevent.grade = 0;
            $scope.curevent.level = 0;
            eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                $state.go('app.ics_eventindex');
                //$scope.sendmessage();
            });
        }
    };
}

judgmentCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', 'eventservice', 'eventperiod', 'eventorganization', 'eventroles', 'eventorgusers', 'icsdb', 'tablecontent', 'eventtables'];
function judgmentCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, eventservice, eventperiod, eventorganization, eventroles, eventorgusers, icsdb, tablecontent, eventtables) {
    $scope.vm = { startevent: '1' };
    $scope.action = "0";
    $scope.dt = new Date();

    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.curevent = data;
    });

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    $scope.addperiod = function (data) {
        var period = { eventid: data.id, name: "阶段1" };
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        period.starttime = today.format("YYYY-MM-DD HH:mm:ss");
        period.endtime = endtime.format("YYYY-MM-DD HH:mm:ss");
        eventperiod.add(period).then(function (data) {
            //localStorage.periodid=data.id;
            $scope.vm.periodid = data.id;
            $scope.addtable(data);
        });
    };

    $scope.addorganiztion = function (evt) {
        var ary = [];
        eventorganization.get().then(function (data) {
            eventroles.get().then(function (evtRoles) { //角色
                eventorgusers.get().then(function (evtUsers) { //组织机构用户
                    angular.forEach(data, function (item) {
                        angular.forEach($scope.orgList, function (root) {
                            if (root == item.id) { //根节点
                                var org = angular.copy(item);
                                org.users = $scope.getOrgUsers(org.id, evtRoles, evtUsers);
                                org.children = $scope.getChildData(data, item.id, evtRoles, evtUsers);
                                ary.push(org);
                            }
                        });
                    });
                    icsdb.getdetail('eventstatus', '?eventid=' + evt.id).then(function (m) {
                        if (m.length > 0) {
                            var obj = m[0];
                            obj.org = angular.toJson(ary);
                            icsdb.update('eventstatus', obj.id, obj);
                        } else {
                            tablecontent.get('ics202').then(function (data) {
                                angular.forEach(data, function (d, index) {
                                    if (d.tablename == 'ics202') {
                                        m = {
                                            eventid: evt.id,
                                            task: d.content,
                                            org: angular.toJson(ary)
                                        };
                                        icsdb.add('eventstatus', m);
                                    }
                                });
                            });
                            tablecontent.get('ics202').then(function (data) {

                            });
                        }
                    });
                });
            });

        });
    };

    $scope.addevent = function () {
        var newevent = {};
        newevent.name = $scope.curevent.name;
        newevent.step = 1;
        newevent.grade = 1;
        newevent.organiztion = "81940c2be8212921";
        newevent.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        eventservice.add(newevent).then(function (data) {
            //$state.go('app.ics_eventindex');
            $scope.addperiod(data);
            // if($stateParams.organiztionid)
            $scope.addorganiztion(data);
        });
    };

    $scope.useSend = false;

    $scope.submit = function () {
        //维持
        if ($scope.action == 0) {
            if ($scope.curevent.step == "4" || $scope.curevent.step == "6") {
                $scope.curevent.step = "5";
                eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                    $state.go('app.ics_eventindex');
                });
            }
        }
        else if ($scope.action == 1) {
            if ($scope.curevent.organiztion == "81940c2be8212921") {//国际公司
                $scope.curevent.grade = 3;
                //if($scope.curevent.step=="4"||$scope.curevent.step=="6")
                {
                    $scope.curevent.step = 7;
                }
                eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                    $state.go('app.ics_eventindex');
                });
            } else {//海外机构扩大应急则事件则上报到国际公司，又国际公司开始进行初步判断是否启动国际公司应急反应
                // $scope.curevent.grade = 1;
                // $scope.curevent.step = 1;
                // $scope.curevent.belongs = 0;
                //localStorage.belongs = "0";
                //eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                //    $state.go('app.ics_eventindex');
                // });
                //$scope.addevent();
                $state.go('app.ics_primarytable', { sourceid: $scope.curevent.id, organiztionid: "81940c2be8212921" });
            }
        }
        else if ($scope.action == 2) {
            $scope.curevent.step = 8;
            $scope.curevent.grade = 0;
            eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                $state.go('app.ics_eventindex');
            });
        }

        // if($scope.vm.startevent=='1')
        // {
        //     $scope.curevent.step=2;
        //     eventservice.update($scope.curevent.id,$scope.curevent).then(function(data){
        //         $state.go('app.ics_eventindex');
        //     });
        // }
        if ($scope.useSend)
            $state.go('app.ics_webmessage');
    };
}

relieveCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', 'eventservice'];
function relieveCtrl($rootScope, $resource, $scope, $timeout, $state, eventservice) {
    $scope.vm = { startevent: '1' };
    $scope.action = "0";
    $scope.dt = new Date();

    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.curevent = data;
    });


    $scope.submit = function () {
        if ($scope.action == 0) {
        }
        else if ($scope.action == 1) {
            $scope.curevent.grade = 3;
            eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                $state.go('app.ics_eventindex');
            });
        }
        else if ($scope.action == 2) {
            $scope.curevent.step = 5;
            eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                $state.go('app.ics_eventindex');
            });
        }

        // if($scope.vm.startevent=='1')
        // {
        //     $scope.curevent.step=2;
        //     eventservice.update($scope.curevent.id,$scope.curevent).then(function(data){
        //         $state.go('app.ics_eventindex');
        //     });
        // }
        $state.go('app.ics_webmessage');
    };
}

systemroleCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', 'eventservice'];
function systemroleCtrl($rootScope, $resource, $scope, $timeout, $state, eventservice) {


}

publicinfoCtl.$inject = ['$scope', '$state', '$stateParams', 'eventservice', 'eventpublicinfo', 'SweetAlert'];
function publicinfoCtl($scope, $state, $stateParams, eventservice, eventpublicinfo, SweetAlert) {
    $scope.eventid = localStorage.eventid;
    $scope.role = $stateParams.data;
    $scope.model = null;
    $scope.flag = true;//true add, false - edit
    $scope.getModel = function () {
        eventpublicinfo.getdetail('?eventid=' + $scope.eventid).then(function (dt) {
            if (dt.length == 0) {
                $scope.model = { eventid: $scope.eventid, roleid: $scope.role.roleid, content: '' };
            } else {
                $scope.model = dt[0];
                $scope.flag = false;
            }
        });
    };
    eventservice.getdetail($scope.eventid).then(function (dt) {
        $scope.evtModel = dt;
        $scope.getModel();
    });
    $scope.save = function () {
        if ($scope.flag) {//add
            eventpublicinfo.add($scope.model).then(function (dt) {
                $state.go('app.ics_eventindex');
            }, function (status) {
                SweetAlert.swal('错误', '设置错误', 'error');
            });
        } else {
            eventpublicinfo.update($scope.model.id, $scope.model).then(function (dt) {
                $state.go('app.ics_eventindex');
            }, function (status) {
                SweetAlert.swal('错误', '设置错误', 'error');
            })
        }
    };
};

firstmeetingCtrl.$inject = ['$rootScope', '$resource', '$scope', '$stateParams', '$timeout', '$state', '$filter', 'eventservice', 'eventtables', 'users', 'icsdb'];
function firstmeetingCtrl($rootScope, $resource, $scope, $stateParams, $timeout, $state, $filter, eventservice, eventtables, users, icsdb) {
    $scope.vm = { startevent: '1', tablename: "meeting", active: "1", datajson: "" };
    $scope.vm.data = { meetingtype: "首次应急会议", locate: "会议室", user: {} };
    $scope.vm.data.topic = "命名此次应急活动；通报事件情况；落实各工作组组长及联络人，明确工作任务；初步判断所需内外资源；确定下次应急会议时间；";
    $scope.vm.data.person = "应急委员会主任、应急委员会副主任、应急委员会委员、应急协调办公室主任、副主任、各工种组负责人、应急协调办公室成员";
    $scope.sendMsg = false;
    $scope.dt = new Date();

    $scope.oldactivetable = [];

    $scope.unactive = function () {
        angular.forEach($scope.oldactivetable, function (item, index) {
            item.active = "0";
            eventtables.update(item.id, item).then();
        })
    };

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    $scope.init = function () {
        //$scope.vm.eventid = localStorage.eventid;
        eventtables.getactivetable(localStorage.eventid, $scope.vm.tablename).then(function (data) {
            $scope.oldactivetable = data;
        });

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;

        users.getdetail(localStorage.userid).then(function (data) {
            $scope.vm.data.user = data.real_name;
            $scope.vm.data.sign = data.real_name;
            $scope.getuserroleid(data.user_id);
        });

        //icsuser.getdetail($scope.vm.userid).then(function(data){
        //    $scope.vm.data.user = data;
        //$scope.vm.roleid = data.roleid;
        // });
    };

    $scope.init();

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                //$scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                $scope.dt = new Date($scope.vm.data.meetingtime);

                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
    }

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.curevent = data;
        $scope.vm.data.meetingname = data.name + " 首次会议";
        $scope.vm.eventid = data.id;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.step = data.step;
    });


    $scope.submit = function () {
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
        $scope.vm.data.meetingtime = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);

        eventtables.add($scope.vm).then(function (data) {
            //$state.go('app.ics_eventindex');
            // if(localStorage.belongs == "0"){
            if ($scope.curevent.organiztion == "81940c2be8212921") {
                $scope.curevent.grade = 2;
                $scope.curevent.step = 3;
                eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                    //$state.go('app.ics_eventindex');
                    if ($scope.sendMsg) {
                        var content = $scope.content;//"2016年5月5日12时，伊拉克公司在巴格达区域（场地）发生溢油事故，事故现场共造成0人伤害，财产损失0元，溢油1吨，事故等级为III级，目前现场正积极组织应急响应及事故。国际公司应急协调办公室2016年5月5日";
                        var reg = new RegExp("\n", "g");
                        content = content.replace(reg, "<br/>");
                        var obj = {
                            content: content,
                            title: "应急事件通知",
                            category_type: 2,
                            type: 2,
                            top: 0,
                            is_return: 0,
                            sms_content: content
                        };
                        //obj.content = content;
                        //obj.sms_content = content;
                        $state.go('app.writeMessage', { data: obj });

                        // $state.go('app.ics_webmessage');
                    }
                    else {
                        $state.go('app.ics_eventindex');
                    }

                });
            } else {
                $scope.curevent.grade = 1;
                $scope.curevent.step = 3;
                eventservice.update($scope.curevent.id, $scope.curevent).then(function (data) {
                    if ($scope.sendMsg) {
                        var content = $scope.content;
                        var reg = new RegExp("\n", "g");
                        content = content.replace(reg, "<br/>");
                        var obj = {
                            content: content,
                            title: "应急事件通知",
                            category_type: 2,
                            type: 2,
                            top: 0,
                            is_return: 0,
                            sms_content: content
                        };
                        $state.go('app.writeMessage', { data: obj });
                    }
                    else {
                        $state.go('app.ics_eventindex');
                    }
                });
            }
        })
    }

    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }


}

eventhistoryCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', 'eventservice', 'eventstatus'];
function eventhistoryCtrl($rootScope, $resource, $scope, $timeout, $state, eventservice, eventstatus) {
    $scope.eventdetails = [];

    eventservice.get().then(function (data) {
        //$scope.events = data;
        angular.copy(data, $scope.eventdetails);
    });

    $scope.viewtables = function () {
        $state.go("app.ics_eventtablelist");
    };

    $scope.getstepname = function (step) {
        return eventstatus.getstepname(step);
    }

    $scope.deletetable = function (id, index) {
        eventservice.delete(id).then(function (data) {
            $scope.eventdetails.splice(index, 1);
        });
    };

}

primarytableCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'users', 'eventorgusers', 'eventorganization', 'countryrisk', 'countrycity', 'eventroles', 'icsdb', 'tablecontent'];
function primarytableCtrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, users, eventorgusers, eventorganization, countryrisk, countrycity, eventroles, icsdb, tablecontent) {
    $scope.vm_event = { step: '1', name: '', grade: '1', level: "0", belongs: localStorage.belongs };
    $scope.vm = { step: '1', tablename: 'ics001', datajson: '', active: '1' };
    $scope.vm.data = {};
    $scope.vm.data.user = {};
    $scope.dt = new Date();
    $scope.isedit = false;
    $scope.oldactivetable = [];

    $scope.countries = [];
    $scope.allcities = [];

    $scope.loadcountries = function () {
        countryrisk.get().then(function (data) {
            $scope.countries = data;
            if ($scope.countries.length > 0) {
                $scope.vm.data.country = $scope.countries[0];
            }
            $scope.loadcities();
        }, function (error) {

        });
    };

    $scope.loadcities = function () {
        countrycity.get().then(function (data) {
            $scope.allcities = data;
            $scope.filtercity();
        }, function (error) {

        });
    };

    $scope.filtercity = function () {
        $scope.cities = [];
        angular.forEach($scope.allcities, function (item, index) {
            if (item.country_id == $scope.vm.data.country.country_id) {
                $scope.cities.push(item);
            }
        });
        if ($scope.cities.length > 0) {
            $scope.vm.data.city = $scope.cities[0];
            $scope.changecity();
        }
    };

    $scope.changecity = function () {
        $scope.vm.data.lon = $scope.vm.data.city.lon;
        $scope.vm.data.lat = $scope.vm.data.city.lat;
    }

    // $scope.loadcities();
    $scope.loadcountries();

    $scope.unactive = function () {
        angular.forEach($scope.oldactivetable, function (item, index) {
            item.active = "0";
            eventtables.update(item.id, item).then();
        })
    };

    $scope.init = function () {
        //$scope.vm.eventid = localStorage.eventid;
        eventtables.getactivetable(localStorage.eventid, $scope.vm.tablename).then(function (data) {
            $scope.oldactivetable = data;
        });

        $scope.vm.userid = localStorage.userid;
        eventorgusers.getdetail($scope.vm.userid).then(function (data) {
            $scope.vm.data.user = data;
            //$scope.vm.roleid = data.roleid;
        });
    };

    $scope.init();

    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        if ($scope.isedit) {
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        else {
            $scope.addevent();
        }
    };


    var pdata = $stateParams.data;
    if (pdata) {
        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.vm_event.name = data.name;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });
        eventperiod.getdetail(localStorage.periodid).then(function (data) {
            $scope.vm.periodid = data.id;
        });

        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                //$scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.dt = new Date($scope.vm.time);
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
                $scope.vm.id = "";
                $scope.vm.active = "1";
            });
        }
    }

    if ($stateParams.type) {
        $scope.vm.type = $stateParams.type;
    }

    $scope.orgList = [];
    if ($stateParams.organiztionid) {
        // $scope.vm_event.organiztionid = $stateParams.organiztionid;
        var s = $stateParams.organiztionid.split(',');
        angular.forEach(s, function (id) {
            $scope.orgList.push(id);
        });
    }

    if ($stateParams.sourceid) {
        $scope.vm_event.sourceid = $stateParams.sourceid;
        eventservice.getdetail($stateParams.sourceid).then(function (data) {
            $scope.vm_event.name = data.name;
        });
        // $scope.vm_event.organiztionid = $stateParams.organiztionid;
        //var s = $stateParams.organiztionid.split(',');
        //angular.forEach(s, function (id) {
        //    $scope.orgList.push(id);
        //});
    }

    $scope.addorganiztion = function (evt) {
        var ary = [];
        eventorganization.get().then(function (data) {
            eventroles.get().then(function (evtRoles) { //角色
                eventorgusers.get().then(function (evtUsers) { //组织机构用户
                    angular.forEach(data, function (item) {
                        angular.forEach($scope.orgList, function (root) {
                            if (root == item.id) { //根节点
                                var org = angular.copy(item);
                                org.users = $scope.getOrgUsers(org.id, evtRoles, evtUsers);
                                org.children = $scope.getChildData(data, item.id, evtRoles, evtUsers);
                                ary.push(org);
                            }
                        });
                    });
                    icsdb.getdetail('eventstatus', '?eventid=' + evt.id).then(function (m) {
                        if (m.length > 0) {
                            var obj = m[0];
                            obj.org = angular.toJson(ary);
                            icsdb.update('eventstatus', obj.id, obj);
                        } else {
                            tablecontent.get('ics202').then(function (data) {
                                angular.forEach(data, function (d, index) {
                                    if (d.tablename == 'ics202') {
                                        m = {
                                            eventid: evt.id,
                                            task: d.content,
                                            org: angular.toJson(ary)
                                        };
                                        icsdb.add('eventstatus', m);
                                    }
                                });
                            });
                        }
                    });
                });
            });

        });
    };
    $scope.getChildData = function (data, parent, evtRoles, evtUsers) {
        var ary = [];
        angular.forEach(data, function (item) {
            if (item.parentid == parent) {
                var org = angular.copy(item);
                org.users = $scope.getOrgUsers(item.id, evtRoles, evtUsers);
                ary.push(org);
                var child = $scope.getChildData(data, item.id, evtRoles, evtUsers);
                angular.forEach(child, function (c) {
                    ary.push(c);
                });
            }
        });
        return ary;
    };

    $scope.getOrgUsers = function (id, evtRoles, evtUsers) {
        var users = [];
        var ids = [];
        angular.forEach(evtUsers, function (u) {
            if (u.orgid == id) {
                ids.push(u);
            }
        });
        ids = ids.sort(function (a, b) {
            return a.sort - b.sort;
        });
        angular.forEach(ids, function (u) {
            $.each(evtRoles, function (i, role) {
                if (role.roleid == u.roleid) {
                    users.push({
                        userid: u.userid,
                        sort: u.sort,
                        role: role
                    });
                }
            });
        });
        return users;
    };

    $scope.addevent = function () {
        $scope.vm_event.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm:ss');
        $scope.vm_event.datajson = angular.toJson($scope.vm.data);
        //$scope.vm_event.organiztions=[];
        angular.forEach($scope.orgList, function (item) {
            $scope.vm_event.organiztion = item;
        });
        // $scope.vm_event.organiztions.push($scope.vm_event.organiztionid);
        //$scope.vm_event.organiztionid = $scope.vm.data.user.companyid;
        eventservice.add($scope.vm_event).then(function (data) {
            localStorage.eventid = data.id;
            $scope.vm.eventid = data.id;
            $scope.addperiod(data);
            if ($stateParams.organiztionid)
                $scope.addorganiztion(data);
        });
    };

    $scope.addperiod = function (data) {
        var period = { eventid: data.id, name: "阶段1" };
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        period.starttime = today.format("YYYY-MM-DD HH:mm:ss");
        period.endtime = endtime.format("YYYY-MM-DD HH:mm:ss");
        eventperiod.add(period).then(function (data) {
            localStorage.periodid = data.id;
            $scope.vm.periodid = data.id;
            $scope.addtable(data);
        });
    };

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

reactiontableCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables'];
function reactiontableCtrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables) {
    $scope.vm = { step: '1', tablename: 'ics002', datajson: '' };
    $scope.vm.data = {};
    $scope.dt = new Date();
    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        if ($scope.isedit) {
            if ($scope.vm.id) {
                $scope.vm.datajson = angular.toJson($scope.vm.data);
                eventtables.update($scope.vm.id, $scope.vm).then(function (data) {
                    $state.go('app.ics_eventindex');
                })
            }
            else {
                $scope.vm.datajson = angular.toJson($scope.vm.data);
                eventtables.add($scope.vm).then(function (data) {
                    $state.go('app.ics_eventindex');
                })
            }
        }
        else {
            $scope.addevent();
        }
    };

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.dt = new Date($scope.vm.time);
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }

    $scope.addevent = function () {
        eventservice.add($scope.vm).then(function (data) {
            $scope.vm.eventid = data.id;
            $scope.addperiod(data);
        });
    };

    $scope.addperiod = function (data) {
        var period = { eventid: data.id, name: "阶段1" };
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        period.starttime = today.format("YYYY-MM-DD HH:mm");
        period.endtime = endtime.format("YYYY-MM-DD HH:mm");
        eventperiod.add(period).then(function (data) {
            $scope.vm.periodid = data.id;
            $scope.addtable(data);
        });
    };

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

organiztionCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables'];
function organiztionCtrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables) {

    // $scope.eventid = localStorage.eventid;
    // $scope.periodid = localStorage.periodid;
    $scope.url = './app/views/ics/eventOrg.html?eventid=' + localStorage.eventid + '&periodid=' + localStorage.periodid;
    // $scope.obj = {
    //     'TOPNODE': {
    //         'name': '应急管理委员会主任',
    //         'desg': '陈明',
    //         'type': 'admin',
    //         'img': '1.png',
    //         'nodes': {
    //             'lab21': {
    //                 'name': '应急管理委员会副主任',
    //                 'type': 'department',
    //                 'nodes': {
    //                     'lab211': {
    //                         'name': '应急协调办公室主任',
    //                         'desg': '王志中',
    //                         'type': 'user',
    //                         'img': '2.png',
    //                         'nodes': {
    //                             'lab212': {
    //                                 'name': '应急协调办公室副主任',
    //                                 'desg': '郭长太',
    //                                 'type': 'user',
    //                                 'img': '3.jpg'
    //                             }
    //                         }
    //                     },
    //                     'lab212': {
    //                         'name': '公共关系及法律支持组',
    //                         'desg': '王志中',
    //                         'type': 'user',
    //                         'img': '2.png',
    //                         'nodes': {
    //                             'lab212': {
    //                                 'name': '应急协调办公室副主任',
    //                                 'desg': '郭长太',
    //                                 'type': 'user',
    //                                 'img': '3.jpg'
    //                             }
    //                         }
    //                     },
    //                     'lab213': {
    //                         'name': '后勤支持组',
    //                         'desg': '王志中',
    //                         'type': 'user',
    //                         'img': '2.png',
    //                         'nodes': {
    //                             'lab212': {
    //                                 'name': '应急协调办公室副主任',
    //                                 'desg': '郭长太',
    //                                 'type': 'user',
    //                                 'img': '3.jpg'
    //                             }
    //                         }
    //                     },
    //                     'lab214': {
    //                         'name': '资源协调组',
    //                         'desg': '王志中',
    //                         'type': 'user',
    //                         'img': '2.png',
    //                         'nodes': {
    //                             'lab212': {
    //                                 'name': '应急协调办公室副主任',
    //                                 'desg': '郭长太',
    //                                 'type': 'user',
    //                                 'img': '3.jpg'
    //                             }
    //                         }
    //                     },
    //                     'lab215': {
    //                         'name': '财产及保险组',
    //                         'desg': '王志中',
    //                         'type': 'user',
    //                         'img': '2.png',
    //                         'nodes': {
    //                             'lab212': {
    //                                 'name': '应急协调办公室副主任',
    //                                 'desg': '郭长太',
    //                                 'type': 'user',
    //                                 'img': '3.jpg'
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //         }
    //     }
    // };
    // //
    // // Code for the delete key.
    // //
    // var deleteKeyCode = 46;
    //
    // //
    // // Code for control key.
    // //
    // var ctrlKeyCode = 17;
    //
    // //
    // // Set to true when the ctrl key is down.
    // //
    // var ctrlDown = false;
    //
    // //
    // // Code for A key.
    // //
    // var aKeyCode = 65;
    //
    // //
    // // Code for esc key.
    // //
    // var escKeyCode = 27;
    //
    // //
    // // Selects the next node id.
    // //
    // var nextNodeID = 10;
    //
    // //
    // // Setup the data-model for the chart.
    // //
    // var chartDataModel = {
    //
    //     nodes: [
    //         {
    //             name: "应急管理委员会主任\n陈明",
    //             id: 0,
    //             x: 0,
    //             y: 0,
    //             width: 350,
    //             inputConnectors: [],
    //             outputConnectors: [
    //                 {
    //                     name: "A",
    //                 },
    //             ],
    //         },
    //
    //         {
    //             name: "应急管理委员会副主任\n赵顺强",
    //             id: 1,
    //             x: 400,
    //             y: 200,
    //             inputConnectors: [
    //                 {
    //                     name: "A",
    //                 },
    //             ],
    //             outputConnectors: [
    //                 {
    //                     name: "A",
    //                 },
    //                 {
    //                     name: "B",
    //                 },
    //                 {
    //                     name: "C",
    //                 },
    //             ],
    //         },
    //
    //     ],
    //
    //     connections: [
    //         {
    //             name: 'Connection 1',
    //             source: {
    //                 nodeID: 0,
    //                 connectorIndex: 0,
    //             },
    //
    //             dest: {
    //                 nodeID: 1,
    //                 connectorIndex: 0,
    //             },
    //         },
    //
    //     ]
    // };
    //
    // //
    // // Event handler for key-down on the flowchart.
    // //
    // $scope.keyDown = function (evt) {
    //
    //     if (evt.keyCode === ctrlKeyCode) {
    //
    //         ctrlDown = true;
    //         evt.stopPropagation();
    //         evt.preventDefault();
    //     }
    // };
    //
    // //
    // // Event handler for key-up on the flowchart.
    // //
    // $scope.keyUp = function (evt) {
    //
    //     if (evt.keyCode === deleteKeyCode) {
    //         //
    //         // Delete key.
    //         //
    //         $scope.chartViewModel.deleteSelected();
    //     }
    //
    //     if (evt.keyCode == aKeyCode && ctrlDown) {
    //         //
    //         // Ctrl + A
    //         //
    //         $scope.chartViewModel.selectAll();
    //     }
    //
    //     if (evt.keyCode == escKeyCode) {
    //         // Escape.
    //         $scope.chartViewModel.deselectAll();
    //     }
    //
    //     if (evt.keyCode === ctrlKeyCode) {
    //         ctrlDown = false;
    //
    //         evt.stopPropagation();
    //         evt.preventDefault();
    //     }
    // };
    //
    // //
    // // Add a new node to the chart.
    // //
    // $scope.addNewNode = function () {
    //
    //     var nodeName = prompt("Enter a node name:", "New node");
    //     if (!nodeName) {
    //         return;
    //     }
    //
    //     //
    //     // Template for a new node.
    //     //
    //     var newNodeDataModel = {
    //         name: nodeName,
    //         id: nextNodeID++,
    //         x: 0,
    //         y: 0,
    //         inputConnectors: [
    //             {
    //                 name: "X"
    //             },
    //             {
    //                 name: "Y"
    //             },
    //             {
    //                 name: "Z"
    //             }
    //         ],
    //         outputConnectors: [
    //             {
    //                 name: "1"
    //             },
    //             {
    //                 name: "2"
    //             },
    //             {
    //                 name: "3"
    //             }
    //         ],
    //     };
    //
    //     $scope.chartViewModel.addNode(newNodeDataModel);
    // };
    //
    // //
    // // Add an input connector to selected nodes.
    // //
    // $scope.addNewInputConnector = function () {
    //     var connectorName = prompt("Enter a connector name:", "New connector");
    //     if (!connectorName) {
    //         return;
    //     }
    //
    //     var selectedNodes = $scope.chartViewModel.getSelectedNodes();
    //     for (var i = 0; i < selectedNodes.length; ++i) {
    //         var node = selectedNodes[i];
    //         node.addInputConnector({
    //             name: connectorName,
    //         });
    //     }
    // };
    //
    // //
    // // Add an output connector to selected nodes.
    // //
    // $scope.addNewOutputConnector = function () {
    //     var connectorName = prompt("Enter a connector name:", "New connector");
    //     if (!connectorName) {
    //         return;
    //     }
    //
    //     var selectedNodes = $scope.chartViewModel.getSelectedNodes();
    //     for (var i = 0; i < selectedNodes.length; ++i) {
    //         var node = selectedNodes[i];
    //         node.addOutputConnector({
    //             name: connectorName,
    //         });
    //     }
    // };
    //
    // //
    // // Delete selected nodes and connections.
    // //
    // $scope.deleteSelected = function () {
    //
    //     $scope.chartViewModel.deleteSelected();
    // };
    //
    // //
    // // Create the view-model for the chart and attach to the scope.
    // //
    // $scope.chartViewModel = new flowchart.ChartViewModel(chartDataModel);

}

viewCtrl.$inject = ['$resource', '$scope', '$timeout', '$state', 'eventservice', 'eventperiod', 'eventtables'];
function viewCtrl($resource, $scope, $timeout, $state, eventservice, eventperiod, eventtables) {
    var vm = this;
    activate();
    function activate() {
        vm.my_tree_handler = function (branch) {
            if (branch.data && branch.data.href) {
                $state.go(branch.data.href);
            }
        };
        var treedata_avm = [];
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
        vm.try_changing_the_tree_data = function () {
            if (vm.my_data === treedata_avm) {
                vm.my_data = treedata_geography;
            } else {
                vm.my_data = treedata_avm;
            }
            return vm.my_data;
        };

        $scope.curevent = {};
        $scope.periods = [];

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.curevent = data;
            eventperiod.get().then(function (data) {
                //$scope.allperiod=data;
                angular.forEach(data, function (item, index) {
                    if (item.eventid == $scope.curevent.id) {
                        $scope.periods.push(item);
                    }
                });

                treedata_avm = [];
                var obj = {};
                obj.label = $scope.curevent.name;
                obj.children = [];
                obj.expand = true;
                angular.forEach($scope.periods, function (item, index) {
                    var obj2 = {};
                    obj2.label = item.name + "(" + item.starttime + "-" + item.endtime + ")";
                    obj2.data = { href: 'app.view.jieduan' };
                    obj2.children = [];
                    obj.children.push(obj2);
                });
                treedata_avm.push(obj);
                vm.my_data = treedata_avm;
            });

        });


        eventperiod.getdetail(localStorage.periodid).then(function (data) {
            //$scope.vm.periodid = data.id;
        });


        $state.go('app.ics_view.firstmeet');
    }
}

eventtablelistCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'steptask', 'periodtask', 'users'];
function eventtablelistCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, eventservice, eventperiod, eventtables, steptask, periodtask, users) {
    $scope.dtInstance = {};
    $scope.events = [];
    $scope.eventdetails = [];
    $scope.allperiods = [];
    $scope.periods = [];
    $scope.allperiodtask = [];
    $scope.allsteptask = [];
    $scope.tasks = [];
    $scope.alltables = [];
    $scope.tables = [];
    $scope.tablestatus = [];
    $scope.userList = [];
    users.users().then(function (data) {
        $scope.userList = data;
    });
    $scope.getUserName = function (id) {
        var s = '';
        for (var i = 0; i < $scope.userList.length; i++) {
            if ($scope.userList[i].user_id == id) {
                s = $scope.userList[i].real_name;
                break;
            }
        }
        return s;
    };
    //$scope.task_tables=[];
    //$scope.plan_tables=[];
    //$scope.log_tables=[];

    // $scope.workflowurl = "app/img/workflow_step1.png";

    // $scope.responsecontent = "-领导国际公司的应急响应及应急处理工作，审批国际公司的应急管理预案，担任突发事件处置行动的最高指挥<br/>-宣布国际公司应急状态的启动和结束 -主持首次应急处理会议 -批准重大应急决策 -决定向中海石油有限公司报告 -必要时派出相关领导及人员赴现场";

    // $scope.curevent = localStorage.eventid;
    // $scope.curperiod=localStorage.periodid;

    //$rootScope.curevent={};
    //$rootScope.curperiod={};

    $scope.edittable = function (item) {
        $state.go(item.url, { data: item });
    };

    $scope.cureventid = localStorage.eventid;

    periodtask.get().then(function (data) {
        angular.forEach(data, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                item2.type = item.type;
                $scope.tablestatus.push(item2);
            });
        });

    });


    $scope.viewtable = function (item) {
        $state.go(item.url, { data: item });
    };

    $scope.init = function () {
        eventservice.get().then(function (data) {
            $scope.events = data;
            angular.copy($scope.events, $scope.eventdetails);
            eventperiod.get().then(function (data) {
                $scope.allperiods = $filter('orderBy')(data, '-starttime');
                if (data.length > 0) {
                    if (localStorage.eventid) {
                        //$scope.curevent = $scope.events[0];
                        angular.forEach($scope.events, function (item, index) {
                            if (item.id == localStorage.eventid) {
                                $scope.curevent = item;
                                return;
                            }
                        });
                    }
                    else {
                        $scope.curevent = $scope.events[0];
                    }
                    $scope.changeevent();
                }
            });
        });
    };



    steptask.get().then(function (data) {
        $scope.allsteptask = data;
    });

    periodtask.get().then(function (data) {
        $scope.allperiodtask = data;
    });

    eventtables.getdetail('?{"$fields": {"datajson": 0}}').then(function (data) {
        $scope.alltables = data;
        $scope.init();
    });

    $scope.filtertables = function () {
        // $scope.tables = [];
        var ary = [];
        angular.forEach($scope.alltables, function (item, index) {
            if (item.eventid == $scope.curevent.id) {
                if ($scope.curperiod.id) {
                    if (item.periodid == $scope.curperiod.id) {
                        item.name = $scope.gettablename(item.tablename);
                        item.url = $scope.gettableurl(item.tablename);
                        if (item.userid) {
                            // users.getdetail(item.userid).then(function(data){
                            //     item.user = data.real_name;
                            //     if(item.url!="") ary.push(item);
                            //         // $scope.tables.push(item);
                            // },function(error){
                            //     if(item.url!="") ary.push(item);
                            //         // $scope.tables.push(item);
                            // });
                            item.user = $scope.getUserName(item.userid);
                            if (item.url != "") ary.push(item);
                        }
                    }

                } else {
                    item.name = $scope.gettablename(item.tablename);
                    item.url = $scope.gettableurl(item.tablename);
                    if (item.userid) {
                        // users.getdetail(item.userid).then(function(data){
                        //     item.user = data.real_name;
                        //     if(item.url!="") ary.push(item);
                        //         // $scope.tables.push(item);
                        // },function(error){
                        //     if(item.url!="") ary.push(item);
                        //         // $scope.tables.push(item);
                        // });
                        item.user = $scope.getUserName(item.userid);
                        if (item.url != "") ary.push(item);
                    }
                    //if(item.url!="")
                    //    $scope.tables.push(item);
                }

            }

        });
        $scope.tables = ary;
        // console.log(ary.length);
    };

    $scope.getRequird = function (item) {
        if (item)
            return "是";
        else
            return "否";
    };

    $scope.gettablename = function (tablename) {
        var name = "";
        angular.forEach($scope.allperiodtask, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                if (item2.tablename == tablename) {
                    name = item2.name;
                    return;
                }
            });
        });
        return name;
    };

    $scope.gettableurl = function (tablename) {
        var name = "";
        angular.forEach($scope.allperiodtask, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                if (item2.tablename == tablename) {
                    name = item2.url;
                    return;
                }
            });
        });
        return name;
    };

    $scope.changeevent = function () {
        localStorage.eventid = $scope.curevent.id;
        $scope.periods = [];
        $scope.periods.push({ name: "全部阶段" });
        angular.forEach($scope.allperiods, function (item, index) {
            if (item.eventid == $scope.curevent.id) {
                $scope.periods.push(item);
            }
        });
        if ($scope.periods.length > 0) {
            $scope.curperiod = $scope.periods[0];
        }
        $scope.filtertables();

        $scope.workflowurl = "app/img/workflow_step" + $scope.curevent.step + ".png";
    }

    $scope.changeperiod = function () {
        //$scope.periodid = $scope.curperiod.id;
        $scope.filtertables();
    }

    //列表显示与隐藏
    $scope.visible = false;
    $scope.toggle = function (index) {
        $scope.visible = !$scope.visible;
    }

    $scope.attention = false;
    $scope.open = function (index) {
        $scope.attention = !$scope.attention;
    }

    //应急事件列表（查看详情）
    // $scope.view=function () {
    //     $state.go('app.systemindexview');
    // };
}

addperiodCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', 'eventservice', 'eventperiod', 'eventstatus'];
function addperiodCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, eventservice, eventperiod, eventstatus) {
    $scope.vm = { eventid: '', starttime: '', endtime: '' };
    var today = new moment();
    var endtime = (new moment()).add(1, 'days');
    $scope.date1 = today.toDate();
    //$scope.time1 = new Date(today.format('YYYY-MM-DDT H:mm:ss'));
    $scope.date2 = endtime.toDate();
    //$scope.time2 = new Date(endtime.format('YYYY-MM-DD HH:mm:ss'));
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }
    $scope.eventid = localStorage.eventid;

    eventperiod.get().then(function (data) {
        var count = 0;
        angular.forEach(data, function (item, index) {
            if (item.eventid == $scope.eventid) {
                count++;
            }
        });
        count++;
        $scope.vm.name = "阶段" + count + "-" + eventstatus.getstepname($scope.vm.step);
    });

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.step = data.step;
        $scope.vm.name = "阶段1-" + eventstatus.getstepname(data.step);
    });

    $scope.submit = function () {
        if ($scope.vm.eventid != '') {
            $scope.vm.starttime = $filter('date')($scope.date1, 'yyyy-MM-dd HH:mm:ss');
            $scope.vm.endtime = $filter('date')($scope.date2, 'yyyy-MM-dd HH:mm:ss');
            eventperiod.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            });
        }
    };
}

webmessageCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', 'eventservice', 'eventperiod'];
function webmessageCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, eventservice, eventperiod) {

    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    }
    $scope.templateType = "0";

    $scope.content = "";
    $scope.event = {};

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.event = data;
    });

    $scope.changeTemplate = function () {
        if ($scope.templateType == "0") {
            $scope.content = "各位应急管理委员会成员：XX年XX月XX日XX时，XX公司在XX区域（场地）发生XX事故，事故现场共造成XX人伤害，财产损失XX元，溢油XX，事故等级为XX级，目前现场正积极组织应急响应及事故。国际公司应急协调办公室XX年XX月XX日";
        }
        else if ($scope.templateType == "1") {
            $scope.content = "各位应急管理委员会成员：XX年XX月XX日XX时，XX公司在XX区域（场地）发生XX事故，根据对事故的评估，经国际公司应急管理委员会主任批准，决定启动国际公司应急响应，请于XX年XX月XX日XX时前，到国际公司应急指挥中心报道";
        }
        else if ($scope.templateType == "2") {
            $scope.content = "XXXX：根据XX年XX月XX日XX时，在XX召开的国际公司应急管理委员会首次会议决议，XX小组下一步主要工作是XX，请收悉，详情见会议纪要。";
        }
        else if ($scope.templateType == "3") {
            $scope.content = "2016年5月5日12时，伊拉克公司在巴格达区域（场地）发生溢油事故，事故现场共造成0人伤害，财产损失0元，溢油1吨，事故等级为III级，目前现场正积极组织应急响应及事故。国际公司应急协调办公室2016年5月5日";
        }
        else if ($scope.templateType == "4") {
            $scope.content = "各应急管理委员会成员：根据国际公司对XX事故应急响应情况的评估，经国际公司应急管理委员会管理委员会主任批准，决定召开国际公司应急响应会议，请于XX年XX月XX日XX时前，到国际公司应急指挥中心报道。国际公司应急协调办公室 XX年XX月XX日XX时";
        }
    };

    $scope.changeTemplate();


    $scope.submitForm = function () {
        var content = $scope.content;//"2016年5月5日12时，伊拉克公司在巴格达区域（场地）发生溢油事故，事故现场共造成0人伤害，财产损失0元，溢油1吨，事故等级为III级，目前现场正积极组织应急响应及事故。国际公司应急协调办公室2016年5月5日";
        var reg = new RegExp("\n", "g");
        content = content.replace(reg, "<br/>");
        var obj = {
            content: content,
            title: "应急事件通知",
            category_type: 2,
            type: 2,
            top: 0,
            is_return: 0,
            sms_content: content
        };
        //obj.content = content;
        //obj.sms_content = content;
        $state.go('app.writeMessage', { data: obj });
    };
}

ics234Ctrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'users', 'icsdb'];
function ics234Ctrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, users, icsdb) {
    $scope.vm = { step: '1', tablename: 'ics234', active: "1", datajson: '' };
    $scope.vm.data = { task: [] };
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;
    $scope.vm.userid = localStorage.userid;
    $scope.goals = [];

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });


    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.vm.step = data.step;
        $scope.vm.name = data.name;
    });

    //icsuser.getdetail(localStorage.userid).then(function (data) {
    //     $scope.vm.user = data.name;
    //     $scope.vm.roleid =data.roleid;
    // });

    eventperiod.getdetail(localStorage.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });


    //$scope.allpurpose = [];

    $scope.getstrategy = function (item2) {
        var strategy = "";
        angular.forEach(item2.data, function (item3, index3) {
            if (item3.checked == true) {
                strategy += item3.name;
                return;
            }
        });
        return strategy;
    };

    $scope.getpurpose = function () {
        // $scope.allpurpose = [];
        $scope.goals = [];
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length > 0) {
                var goals = data[0].task;
                $scope.vm.data.task = goals;
                angular.forEach(goals, function (item, index) {
                    angular.forEach(item.data, function (item2, index2) {
                        if (item2.checked == "true")
                            item2.checked = true;
                        else
                            item2.checked = false;
                    });
                });

                $scope.goals = [];
                angular.forEach(goals, function (item2, index2) {
                    var ischecked = false;
                    var strategy = "";
                    var groupids = [];
                    angular.forEach(item2.data, function (item3, index3) {
                        if (item3.checked == true) {
                            strategy += item3.name;
                            ischecked = true;
                            groupids.push(item3.person.id);
                            return;
                        }
                    });
                    if (!item2.taskname) {
                        item2.taskname = item2.name;
                    }
                    if (ischecked) {
                        $scope.goals.push(item2);
                        // $scope.vm.data.goals.push({
                        //     goalid: item2.id,
                        //     groupids: groupids,
                        //     goal: item2.name,
                        //     strategy: strategy,
                        //     name: item2.name
                        // });
                    }
                });
            };
        });
        // eventtables.getdetail("?eventid="+$scope.vm.eventid+"&tablename=ics202").then(function (data) {
        //     angular.forEach(data, function (item, index) {
        //         //if (item.eventid == $scope.vm.eventid && item.tablename == "ics202")
        //         {
        //             var data = angular.fromJson(item.datajson);
        //             $scope.vm.data.goals = [];
        //             angular.forEach(data.content, function (item2, index2) {
        //                 var ischecked = false;
        //                 var strategy = "";
        //                 var groupids = [];
        //                 angular.forEach(item2.data, function (item3, index3) {
        //                     if (item3.checked == true) {
        //                         strategy += item3.name;
        //                         ischecked = true;
        //                         groupids.push(item3.person.id);
        //                         return;
        //                     }
        //                 });
        //                 if (ischecked) {
        //                     $scope.vm.data.goals.push({
        //                         goalid: item2.id,
        //                         groupids: groupids,
        //                         goal: item2.name,
        //                         strategy: strategy,
        //                         name: item2.name
        //                     });
        //                 }
        //             });
        //         }
        //     })
        // });
    };

    $scope.updatetask = function () {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length == 0) {
                var item = { eventid: $scope.vm.eventid };
                // item.task = $scope.vm.data.content;
                item.task = [];
                angular.copy($scope.vm.data.task, item.task);
                icsdb.add("eventstatus", item).then();
            }
            else {
                var item = data[0];
                angular.copy($scope.vm.data.task, item.task);
                icsdb.update("eventstatus", item.id, item).then();
            }
        });
    };

    $scope.addgoal = function () {
        var goal = {
            goal: '',
            name: '',
            strategy: '',
        };
        $scope.vm.data.goals.push(goal);
    };

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
        $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
        eventtables.add($scope.vm).then(function (data) {
            eventservice.getdetail($scope.vm.eventid).then(function (data) {
                if (data.step == 3) {
                    // data.step = 4;
                    $scope.vm.step = 4;
                    eventservice.update($scope.vm.eventid, $scope.vm).then(function (data) {
                        $state.go('app.ics_eventindex');
                    });
                }
                if (data.step == 5 || data.step == 7) {
                    data.step = 6;
                    eventservice.update($scope.vm.eventid, data).then(function (data) {
                        $state.go('app.ics_eventindex');
                    });
                } else {
                    $state.go('app.ics_eventindex');
                }
            });

        });
        $scope.updatetask();
    };

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                // $scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        eventtables.getactivetablewithid($scope.vm.eventid, $scope.vm.tablename, $scope.vm.roleid).then(function (data) {
            if (data.length > 0) {
                angular.copy(data[data.length - 1], $scope.vm);
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                $scope.vm.id = "";
            }
            else {
                $scope.getpurpose();
            }
        });

    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };

    $scope.removeUser = function (index) {
        $scope.vm.data.goals.splice(index, 1);
    };
}


ics230Ctl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'users', 'icsdb'];
function ics230Ctl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, users, icsdb) {
    $scope.vm = { step: '1', tablename: 'ics230', active: "1", datajson: '' };
    $scope.vm.data = { task: [] };
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;
    $scope.vm.userid = localStorage.userid;
    $scope.goals = [];

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });


    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.vm.step = data.step;
        $scope.vm.name = data.name;
    });

    //icsuser.getdetail(localStorage.userid).then(function (data) {
    //     $scope.vm.user = data.name;
    //     $scope.vm.roleid =data.roleid;
    // });

    eventperiod.getdetail(localStorage.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });


    //$scope.allpurpose = [];

    $scope.getstrategy = function (item2) {
        var strategy = "";
        angular.forEach(item2.data, function (item3, index3) {
            if (item3.checked == true) {
                strategy += item3.name;
                return;
            }
        });
        return strategy;
    };

    $scope.getpurpose = function () {
        // $scope.allpurpose = [];
        $scope.goals = [];
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length > 0) {
                var goals = data[0].task;
                $scope.vm.data.task = goals;
                angular.forEach(goals, function (item, index) {
                    angular.forEach(item.data, function (item2, index2) {
                        if (item2.checked == "true")
                            item2.checked = true;
                        else
                            item2.checked = false;
                    });
                });

                $scope.goals = [];
                angular.forEach(goals, function (item2, index2) {
                    var ischecked = false;
                    var strategy = "";
                    var groupids = [];
                    angular.forEach(item2.data, function (item3, index3) {
                        if (item3.checked == true) {
                            strategy += item3.name;
                            ischecked = true;
                            groupids.push(item3.person.id);
                            return;
                        }
                    });
                    if (!item2.taskname) {
                        item2.taskname = item2.name;
                    }
                    if (ischecked) {
                        $scope.goals.push(item2);
                        // $scope.vm.data.goals.push({
                        //     goalid: item2.id,
                        //     groupids: groupids,
                        //     goal: item2.name,
                        //     strategy: strategy,
                        //     name: item2.name
                        // });
                    }
                });
            };
        });
        // eventtables.getdetail("?eventid="+$scope.vm.eventid+"&tablename=ics202").then(function (data) {
        //     angular.forEach(data, function (item, index) {
        //         //if (item.eventid == $scope.vm.eventid && item.tablename == "ics202")
        //         {
        //             var data = angular.fromJson(item.datajson);
        //             $scope.vm.data.goals = [];
        //             angular.forEach(data.content, function (item2, index2) {
        //                 var ischecked = false;
        //                 var strategy = "";
        //                 var groupids = [];
        //                 angular.forEach(item2.data, function (item3, index3) {
        //                     if (item3.checked == true) {
        //                         strategy += item3.name;
        //                         ischecked = true;
        //                         groupids.push(item3.person.id);
        //                         return;
        //                     }
        //                 });
        //                 if (ischecked) {
        //                     $scope.vm.data.goals.push({
        //                         goalid: item2.id,
        //                         groupids: groupids,
        //                         goal: item2.name,
        //                         strategy: strategy,
        //                         name: item2.name
        //                     });
        //                 }
        //             });
        //         }
        //     })
        // });
    };

    $scope.updatetask = function () {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length == 0) {
                var item = { eventid: $scope.vm.eventid };
                // item.task = $scope.vm.data.content;
                item.task = [];
                angular.copy($scope.vm.data.task, item.task);
                icsdb.add("eventstatus", item).then();
            }
            else {
                var item = data[0];
                //item.task=[];
                angular.copy($scope.vm.data.task, item.task);
                icsdb.update("eventstatus", item.id, item).then();
                // icsdb.add("eventtask",item).then();
            }
        });
    };

    $scope.addgoal = function () {
        var goal = {
            goal: '',
            name: '',
            strategy: '',
        };
        $scope.vm.data.goals.push(goal);
    };

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        // if ($scope.isedit) {
        // if($scope.vm.id)
        // {
        //     $scope.vm.datajson = angular.toJson($scope.vm.data);
        //     eventtables.update($scope.vm.id,$scope.vm).then(function(data){
        //         $state.go('app.ics_eventindex');
        //     })
        // }
        // else
        //{
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
        $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
            // eventservice.getdetail($scope.vm.eventid).then(function (data) {
            //     if (data.step == 3) {
            //         data.step = 4;
            //         eventservice.update($scope.vm.eventid, data).then(function (data) {
            //             $state.go('app.ics_eventindex');
            //         });
            //     }
            //     if (data.step == 5 || data.step == 7) {
            //         data.step = 6;
            //         eventservice.update($scope.vm.eventid, data).then(function (data) {
            //             $state.go('app.ics_eventindex');
            //         });
            //     }
            //     else {
            //         $state.go('app.ics_eventindex');
            //     }

            // });

        })

        $scope.updatetask();


        // }
        // }
        // else {
        //     //$scope.addevent();
        //     $scope.vm.datajson = angular.toJson($scope.vm.data);
        //     eventtables.add($scope.vm).then(function (data) {
        //         // $state.go('app.ics_eventindex');
        //         eventservice.getdetail($scope.vm.eventid).then(function (data) {
        //             if (data.step == 3) {
        //                 data.step = 4;
        //                 eventservice.update($scope.vm.eventid, data).then(function (data) {
        //                     $state.go('app.ics_eventindex');
        //                 });
        //             }
        //             if (data.step == 5 || data.step == 7) {
        //                 data.step = 6;
        //                 eventservice.update($scope.vm.eventid, data).then(function (data) {
        //                     $state.go('app.ics_eventindex');
        //                 });
        //             }
        //             else {
        //                 $state.go('app.ics_eventindex');
        //             }
        //
        //         });
        //     })
        // }
    };

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                // $scope.vm.id = pdata.id;
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        eventtables.getactivetablewithid($scope.vm.eventid, $scope.vm.tablename, $scope.vm.roleid).then(function (data) {
            if (data.length > 0) {
                angular.copy(data[data.length - 1], $scope.vm);
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                $scope.vm.id = "";
            }
            else {
                $scope.getpurpose();
            }
        });

    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };

    $scope.removeUser = function (index) {
        $scope.vm.data.goals.splice(index, 1);
    };
}

ics202Ctrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'tablecontent', 'users', 'editableOptions', 'icsdb', 'eventorganization'];
function ics202Ctrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, tablecontent, users, editableOptions, icsdb, eventorganization) {
    editableOptions.theme = 'bs3';
    $scope.vm = { step: '1', tablename: 'ics202', active: '1', datajson: '' };
    $scope.vm.data = { goals: [] };
    $scope.vm.data.content = {};
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

    eventperiod.getdetail(localStorage.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });

    $scope.showStatus = function (id, name) {
        var selected = [];
        var tt = $scope.vm.data;
        $.each($scope.vm.data.content, function (i, item) {
            if (item.id == id) {
                $.each(item.data, function (j, node) {
                    if (node.name == name) {
                        var person = node.person;
                        return false;
                    }
                });
                return false;
            }
        });
        //  angular.forEach($scope.personlist, function(s) {
        //    if ($scope.vm.status.indexOf(s.value) >= 0) {
        //      selected.push(s.text);
        //    }
        //  });
        return selected.length ? selected.join(', ') : 'Not set';
    };
    $scope.statuslist = ["分配任务", "持续中", "完成"];
    $scope.personlist = [
        {
            "name": "公共关系及法律支持组",
            "roleid": "7"
        },
        {
            "name": "后勤支持组",
            "roleid": "9"
        },
        {
            "name": "资源协调支持组",
            "roleid": "11"
        },
        {
            "name": "财务及保险组",
            "roleid": "13"
        },
        {
            "name": "伊拉克",
            "roleid": "13"
        }
    ];

    $scope.updatetask = function () {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length == 0) {
                var item = { eventid: $scope.vm.eventid };
                // item.task = $scope.vm.data.content;
                item.task = [];
                angular.copy($scope.vm.data.content, item.task);
                icsdb.add("eventstatus", item).then();
            }
            else {
                var item = data[0];
                //item.task=[];
                angular.copy($scope.vm.data.content, item.task);
                icsdb.update("eventstatus", item.id, item).then();
                // icsdb.add("eventtask",item).then();
            }
        });

        var sourcegoals = [];
        angular.forEach($scope.vm.data.content, function (item, index) {
            var goal = {};
            angular.copy(item, goal);
            goal.data = [];
            angular.forEach(item.data, function (item2, index2) {
                if (item2.checked) {
                    if (item2.person.orgid == $scope.event.sourceorgid) {
                        goal.data.push(item2);
                    }
                }
            });
            if (goal.data.length > 0)
                sourcegoals.push(goal);
        });
        if (sourcegoals.length > 0) {
            $scope.addgoaltosource(sourcegoals);
        }

    };

    $scope.addgoaltosource = function (goals) {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.event.sourceid).then(function (data) {
            if (data.length > 0) {
                var exgoals = [];
                angular.copy(goals, exgoals);
                for (var i = 0; i < exgoals.length; ++i) {
                    var tag = exgoals[i];
                    for (var j = 0; j < data[0].task.length; ++j) {
                        var src = data[0].task[j];
                        if (src.id == tag.id) {
                            for (var n = 0; n < tag.data.length; ++n) {
                                for (var m = 0; m < src.data.length; ++m) {
                                    if (tag.data[n].name == src.data[m].name) {
                                        src.data[m] = tag.data[n];
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                // angular.forEach(exgoals, function (item, index) {
                //     data[0].task.push(item);
                // });
                icsdb.update("eventstatus", data[0].id, data[0]).then();
            }
        });
    };

    $scope.geteventorg = function () {
        //eventtables.getdetail("?eventid="+$scope.vm.eventid+"&tablename=ics2015").then(function(data){
        //    if(data.length>0){
        //        var orgdata = angular.fromJson(data[0].datajson);
        //       $scope.personlist = orgdata.orgs;
        //    }
        // });
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length > 0) {
                $scope.personlist = [];
                var status = angular.fromJson(data[0].org);
                angular.forEach(status, function (item, index) {
                    if (index == 0) {
                        angular.forEach(item.children, function (item2, index2) {
                            $scope.personlist.push({ name: item2.organization, orgid: item2.id });
                        });
                    }
                    else {
                        $scope.personlist.push({ name: item.organization, orgid: item.id });
                    }
                });
                eventservice.getdetail($scope.vm.eventid).then(function (data) {
                    if (data.sourceid) {
                        eventservice.getdetail(data.sourceid).then(function (data2) {
                            var orgid = data2.organiztion;
                            eventorganization.getdetail(data2.organiztion).then(function (data3) {
                                $scope.personlist.push({ name: data3.organization, orgid: data3.id });
                            });
                        });
                    }
                });
            }
        });
    };

    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;
    $scope.vm.userid = localStorage.userid;

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });

    $scope.event = {};
    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.event = data;
        if ($scope.event.sourceid) {
            eventservice.getdetail($scope.event.sourceid).then(function (data2) {
                $scope.event.sourceorgid = data2.organiztion;
            });
        }
        $scope.vm.step = $scope.event.step;
        $scope.geteventorg();
    });

    //获取当前ICS202响应目标
    icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
        if (data.length > 0) {//如果已经设置响应目标
            $scope.vm.data.content = data[0].task;
            angular.forEach($scope.vm.data.content, function (item, index) {
                angular.forEach(item.data, function (item2, index2) {
                    if (item2.checked == "true")
                        item2.checked = true;
                    else
                        item2.checked = false;
                });
            });
        };
    });

    // $scope.content={};
    // eventtables.getactivetable($scope.vm.eventid, $scope.vm.tablename).then(function (data) {
    //     if (data.length > 0) {
    //         // angular.copy(data[data.length-1],$scope.vm);
    //         // $scope.vm.id = "";
    //         //  $scope.vm.data = angular.fromJson($scope.vm.datajson);
    //     }
    // });

    $scope.additem = function (tb) {
        var obj = {
            "checked": false,
            "name": "其它",
            "person": "",
            "status": "持续中"
        };
        tb.data.push(obj);
    };

    $scope.addparam = function (tb) {
        var length = tb.length + 1;
        var obj = {
            "id": length,
            "name": "4." + length,
            "data": []
        };
        tb.push(obj);
    }

    $scope.removeitem = function (tb, index) {
        tb.splice(index, 1);
    }

    $scope.oldactive = [];

    eventtables.getactivetable($scope.vm.eventid, $scope.vm.tablename).then(function (data) {
        $scope.oldactive = data;
    });

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
        $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);

        angular.forEach($scope.oldactive, function (item, index) {
            item.active = "0";
            eventtables.update(item.id, item).then();
        });

        $scope.updatetask();

        eventtables.add($scope.vm).then(function (data2) {
            $state.go('app.ics_eventindex');
        });

    };

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        tablecontent.get('ics202').then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.tablename == $scope.vm.tablename) {
                    $scope.vm.data.content = item.content;
                }
            });
        });
    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };


}


ics204Ctrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'tablecontent', 'eventorganization', 'users', 'eventorgusers', 'icsdb'];
function ics204Ctrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, tablecontent, eventorganization, users, eventorgusers, icsdb) {
    $scope.vm = { step: '1', tablename: 'ics204', active: "1", datajson: '' };
    $scope.vm.data = { resource: [] };
    $scope.vm.data.content = {};
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;
    $scope.vm.userid = localStorage.userid;

    $scope.vm.data.resource.push({});

    $scope.event_goals = [];
    $scope.event = {};
    $scope.groupusers = [];

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
                $scope.getgoals();
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid + "&companyid=" + $scope.event.organiztion).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.vm.orgid = data[0].orgid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    // users.getdetail(localStorage.userid).then(function (data) {
    //     $scope.vm.data.user = data.real_name;
    //     $scope.vm.data.sign = data.real_name;
    //     $scope.getuserroleid(data.user_id);
    // });

    eventorgusers.getdetail("?userid=" + $scope.vm.userid).then(function (data) {
        if (data.length > 0) {
            //$scope.orgid = data.orgid;
            $scope.groupusers = [];
            eventorgusers.getdetail("?orgid=" + data[0].orgid).then(function (data2) {
                angular.forEach(data2, function (item, index) {
                    users.getdetail(item.userid).then(function (data3) {
                        $scope.groupusers.push(data3);
                    });
                });
            });
        }
    });


    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.event = data;

        users.getdetail(localStorage.userid).then(function (data) {
            $scope.vm.data.user = data.real_name;
            $scope.vm.data.sign = data.real_name;
            $scope.getuserroleid(data.user_id);
        });
    });

    //icsuser.getdetail(localStorage.userid).then(function (data) {
    //     $scope.vm.user = data.name;
    //     $scope.vm.roleid =data.roleid;
    // });

    eventperiod.getdetail(localStorage.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });

    $scope.oldactive = [];

    eventtables.getactivetablewithid($scope.vm.eventid, $scope.vm.tablename, $scope.vm.roleid).then(function (data) {
        $scope.oldactive = data;
        if (data.length > 0) {
            angular.copy(data[data.length - 1], $scope.vm);
            $scope.vm.data = angular.fromJson($scope.vm.datajson);
            $scope.vm.id = "";
        }
    });


    $scope.getgoals = function () {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length > 0) {
                //var goals=data[0].task;
                $scope.vm.data.task = data[0].task;
                angular.forEach($scope.vm.data.task, function (item, index) {
                    angular.forEach(item.data, function (item2, index2) {
                        if (item2.checked == "true")
                            item2.checked = true;
                        else
                            item2.checked = false;
                    });
                });

                $scope.goals = [];
                angular.forEach($scope.vm.data.task, function (item2, index2) {
                    angular.forEach(item2.data, function (item3, index3) {
                        if (item3.checked == true) {
                            if (item3.person && item3.person.orgid) {
                                if (item3.person.orgid == $scope.vm.orgid) {
                                    $scope.goals.push({ goalindex: index2, strategyindex: index3, name: item2.taskname + "(" + item3.name + ")", workarrangement: item3.workarrangement, user: item3.user });
                                }
                            }
                        }
                    });
                });
            };
        });
        // eventtables.get().then(function (data) {
        //     angular.forEach(data, function (item, index) {
        //         if (item.eventid == $scope.vm.eventid && item.tablename == "ics234") {
        //             $scope.event_goals = angular.fromJson(item.datajson).goals;
        //         }
        //     });
        // });
    };
    // $scope.getgoals();
    // $scope.content={};


    $scope.addresource = function () {
        $scope.vm.data.resource.push({});
    };

    $scope.additem = function (tb) {
        var obj = {
            "checked": false,
            "name": "其它",
            "person": "",
            "status": ""
        };
        tb.data.push(obj);
    };

    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.vm.step = data.step;
        $scope.vm.name = data.name;
    });

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
        $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
        eventtables.add($scope.vm).then(function (data) {
            angular.forEach($scope.oldactive, function (item, index) {
                item.active = "0";
                eventtables.update(item.id, item).then();
            });
            if ($scope.vm.data.task) {
                var goalindex = $scope.vm.data.curtask.goalindex;
                var strategyindex = $scope.vm.data.curtask.strategyindex;
                if ($scope.vm.data.task[goalindex].data[strategyindex]) {
                    var obj = $scope.vm.data.task[goalindex].data[strategyindex];
                    obj.user = {};
                    angular.copy($scope.vm.data.taskuser, obj.user);
                    //obj.user = $scope.vm.data.user;
                    obj.workarrangement = $scope.vm.data.workarrangement;
                    obj.taskname = $scope.vm.data.taskname;
                    obj.starttime = $scope.vm.time;
                }
                icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data2) {
                    if (data2.length > 0) {
                        angular.copy($scope.vm.data.task, data2[0].task);
                        icsdb.update("eventstatus", data2[0].id, data2[0]).then();
                    }
                });

            }
            $state.go('app.ics_eventindex');
        })
    };

    var task = $stateParams.task;
    var tasks = $stateParams.tasks;
    if (task && tasks) {
        $scope.tasks = tasks;
        $scope.vm.data.taskname = task.name;
        $scope.vm.data.task = task;
    }

    $scope.taskchange = function () {
        $scope.vm.data.taskname = $scope.vm.data.curtask.name;
        $scope.vm.data.workarrangement = $scope.vm.data.curtask.workarrangement;
        $scope.vm.data.taskuser = $scope.vm.data.curtask.user;
    }

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        tablecontent.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.tablename == $scope.vm.tablename) {
                    $scope.vm.data.content = item.content;
                }
            });
        });
    }


    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

messageCtrl.$inject = ['$resource', '$scope', '$timeout', '$state', 'messagelistService'];
function messageCtrl($resource, $scope, $timeout, $state, messagelistService) {
    messagelistService.get().then(function (data) {
        $scope.items = data;
    }, function (error) {

    })
    //跳转到添加用户
    $scope.add = function () {
        $state.go('app.messageadd');
    }

    $scope.delete = function (id) {
        messagelistService.delete(id).then(function (data) {
            messagelistService.get().then(function (data) {
                $scope.items = data;
            }, function (error) {

            });
        }, function (error) {

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

publicCtrl.$inject = ['$resource', '$scope', '$timeout', 'pubsentiment'];
function publicCtrl($resource, $scope, $timeout, pubsentiment) {
    $scope.perm = 1;
    $scope.newslistTab = function (_id) {
        if (_id == 0) {
            $scope.perm = 1;
        }
        else if (_id == 1) {
            $scope.perm = 2;
        }
        else {
            $scope.perm = 3;
        }
    }
    $scope.items = [];

    $scope.hasPermit = false;

    $scope.userid = localStorage.userid;


    pubsentiment.get().then(function (data) {
        $scope.items = data;
    });

    $scope.deletes = function (id) {
        pubsentiment.delete(id).then(function (data) {

        });
    };
}

socialmessageCtrl.$inject = ['$resource', '$scope', '$timeout', 'pubsentiment', 'icsdb'];
function socialmessageCtrl($resource, $scope, $timeout, pubsentiment, icsdb) {
    $scope.perm = 1;
    $scope.newslistTab = function (_id) {
        if (_id == 0) {
            $scope.perm = 1;
        }
        else if (_id == 1) {
            $scope.perm = 2;
        }
        else {
            $scope.perm = 3;
        }
    }
    $scope.items = [{
        name: "百度新闻",
        address: "news.baidu.com",
        type: "新闻",
        keywords: "中海油",
        updatetime: "10",
        depth: "1",
        level: "1"
    }];

    icsdb.get("socialcrawler").then(function (data) {
        $scope.items = data;
    });

    $scope.saveTable = function () {
        angular.forEach($scope.items, function (item, index) {
            icsdb.update("socialcrawler", item.id, item).then();
        });
    };

}

ics2011Ctrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'tablecontent', 'users', 'icsdb'];
function ics2011Ctrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, tablecontent, users, icsdb) {

    if (document.createElement("input").webkitSpeech === undefined) {
        alert("Speech input is not supported in your browser.");
    }

    $scope.vm = { step: '1', tablename: 'ics2011', datajson: '' };
    $scope.vm.data = { goals: [] };
    $scope.vm.data.content = {};
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;

    $scope.event = {};

    // $scope.content={};


    $scope.additem = function (tb) {
        var obj = {
            "checked": false,
            "name": "其它",
            "person": "",
            "status": ""
        };
        tb.data.push(obj);
    };

    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.event.step = data.step;
        $scope.event.name = data.name;
    });

    eventperiod.getdetail($scope.vm.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });

    // icsuser.getdetail(localStorage.userid).then(function(data){
    //     $scope.vm.data.role = data.role;
    //     $scope.vm.user = data.name;
    //     $scope.vm.roleid = data.roleid;
    // });

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        tablecontent.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.tablename == $scope.vm.tablename) {
                    $scope.vm.data.content = item.content;
                }
            });
        });
    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

ics2016Ctl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'tablecontent', 'users', 'weatherex', 'icsdb'];
function ics2016Ctl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, tablecontent, users, weatherex, icsdb) {
    $scope.vm = { step: '1', tablename: 'ics2016', datajson: '' };
    $scope.vm.data = { goals: [] };
    $scope.vm.data.content = {};
    $scope.dt = new Date();
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;

    $scope.event = {};

    // $scope.content={};


    $scope.additem = function (tb) {
        var obj = {
            "checked": false,
            "name": "其它",
            "person": "",
            "status": ""
        };
        tb.data.push(obj);
    };

    eventservice.getdetail($scope.vm.eventid).then(function (data) {
        $scope.event.step = data.step;
        $scope.event.name = data.name;
    });

    eventperiod.getdetail($scope.vm.periodid).then(function (data) {
        $scope.starttime = new Date(data.starttime);
        $scope.endtime = new Date(data.endtime);
    });

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
                //$scope.getgoals();
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.vm.orgid = data[0].orgid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    $scope.getweather = function () {
        eventtables.getdetail("?eventid=" + $scope.vm.eventid + "&tablename=ics001").then(function (data) {
            if (data.length > 0) {
                var tabledata = angular.fromJson(data[0].datajson);
                var cityid = tabledata.city.city_id;

                // var cityid = $scope.select_utility.city_id;
                weatherex.GetLatestWeather(cityid).then(function (data) {
                    $scope.vm.data.weathers = angular.fromJson(data.jsondata);
                    if ($scope.vm.data.weathers.days.length > 0) {
                        $scope.vm.data.curweather = $scope.vm.data.weathers.days[0];
                    }
                    angular.forEach($scope.vm.data.weathers.days, function (item, i) {
                        item.icon = "qing01";
                    });

                }, function (error) {
                });

            }
        });
    };

    $scope.getweather();

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        tablecontent.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.tablename == $scope.vm.tablename) {
                    $scope.vm.data.content = item.content;
                }
            });
        });
    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

ics2012Ctrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$stateParams', '$filter', 'eventservice', 'eventperiod', 'eventtables', 'tablecontent', 'users', 'icsdb'];
function ics2012Ctrl($rootScope, $resource, $scope, $timeout, $state, $stateParams, $filter, eventservice, eventperiod, eventtables, tablecontent, users, icsdb) {
    $scope.vm = { step: '1', tablename: 'ics2012', active: "1", datajson: '' };
    $scope.showExBtn = false;
    $scope.vm.data = { actions: [], currentaimList: [] };
    $scope.vm.data.content = {};
    $scope.dt = new Date();
    var today = new moment();
    var endtime = (new moment()).add(1, 'days');
    $scope.starttime = new Date();
    $scope.endtime = new Date();
    $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

    $scope.vm.eventid = localStorage.eventid;
    $scope.vm.periodid = localStorage.periodid;
    $scope.event = {};
    //$scope.vm.userid = localStorage.roleid;

    eventservice.getdetail(localStorage.eventid).then(function (data) {
        $scope.event = data;
        $scope.vm.eventid = data.id;
        $scope.vm.step = data.step;
    });

    $scope.getrole = function (roleid) {
        icsdb.getdetail("eventroles", "?roleid=" + roleid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.data.role = data[0].rolename;
                for (var i = 0; i < data[0].role.length; ++i) {
                    if (data[0].role[i].step == $scope.event.step) {
                        var ps = data[0].role[i].roles.panels;
                        for (var j = 0; j < ps.length; ++j) {
                            if (ps[j] == "submitactions") {
                                $scope.showExBtn = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                $scope.gettasks();
                $scope.getchildwork();
            }
        });
    };

    $scope.getuserroleid = function (userid) {
        icsdb.getdetail("eventorgusers", "?userid=" + userid).then(function (data) {
            if (data.length > 0) {
                $scope.vm.roleid = data[0].roleid;
                $scope.getrole(data[0].roleid);
            }
        });
    }

    users.getdetail(localStorage.userid).then(function (data) {
        $scope.vm.data.user = data.real_name;
        $scope.vm.data.sign = data.real_name;
        $scope.getuserroleid(data.user_id);
    });

    $scope.changetask = function () {
        var bAdd = true;
        for (var i = 0; i < $scope.vm.data.currentaimList.length; ++i) {
            if ($scope.vm.data.currentaimList[i].name == $scope.vm.data.currentaim.name) {
                bAdd = false;
                break;
            }
        }
        if (bAdd) $scope.vm.data.currentaimList.push($scope.vm.data.currentaim);

        $scope.vm.data.curtask += $scope.vm.data.currentaim.taskname;
        $scope.vm.data.curtask += "(" + $scope.vm.data.currentaim.user.real_name + ")\n";
        // $scope.vm.data.actions = [];
        var actions = angular.fromJson($scope.vm.data.currentaim.actionsjson);
        angular.forEach(actions, function (item, index) {
            var dt = new Date(item.time);
            $scope.vm.data.actions.push({ time: dt, action: item.action });
        });
    };

    $scope.gettasks = function () {
        icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data) {
            if (data.length > 0) {
                var goals = data[0].task;
                $scope.vm.data.task = goals;
                angular.forEach(goals, function (item, index) {
                    angular.forEach(item.data, function (item2, index2) {
                        if (item2.checked == "true")
                            item2.checked = true;
                        else
                            item2.checked = false;
                    });
                });

                $scope.tasks = [];
                angular.forEach(goals, function (item2, index2) {
                    angular.forEach(item2.data, function (item3, index3) {
                        if (item3.checked == true) {
                            if (!item3.taskname) {
                                item3.taskname = item2.name + "(" + item3.name + ")";
                            }
                            $scope.tasks.push(item3);
                            return;
                        }
                    });
                });
            };
        });
    };


    var ischildroleid = function (userRole, roleid) {
        if (userRole == roleid) return true;
        var ischild = false;
        if (userRole == "7") {
            if (roleid == "8")
                return true;
        }
        else if (userRole == "9") {
            if (roleid == "10")
                return true;
        }
        else if (userRole == "11") {
            if (roleid == "12")
                return true;
        }
        else if (userRole == "13") {
            if (roleid == "14")
                return true;
        }
        else if (userRole < 6) {
            if (roleid == "7" || roleid == "9" || roleid == "11" || roleid == "13")
                return true;
        }
        else if ((userRole == "27" || userRole == "28") && roleid == "29") {
            return true;
        }
        else if ((userRole == "30" || userRole == "31") && roleid == "32") {
            return true;
        }
        else if ((userRole == "33" || userRole == "34") && roleid == "35") {
            return true;
        }
        else if (userRole <= 25 && userRole >= 21) {
            // if (roleid == "27" || roleid == "28" || roleid == "30" || roleid == "31" || roleid == "33" || roleid == "34")
            return true;
        }
        return false;
    };


    $scope.getchildwork = function () {
        //var childid =  $scope.getchildroleid($scope.vm.roleid);
        var content = "";
        eventtables.getactivetable($scope.vm.eventid, "ics2012").then(function (data) {
            angular.forEach(data, function (item, index) {
                if (ischildroleid($scope.vm.roleid, item.roleid)) {
                    var tempdata = angular.fromJson(item.datajson);
                    if (tempdata.currentaimList) {
                        angular.forEach(tempdata.currentaimList, function (item) {
                            content += item.taskname;
                            content += "(" + item.user.real_name + ")\n";
                        });
                        // content += tempdata.currentaim.taskname;
                        // content += "(" + tempdata.currentaim.user.real_name + ")";
                        // content += "\n";
                    }
                    angular.forEach(tempdata.actions, function (item2, index2) {
                        $scope.vm.data.actions.push(item2);
                    });
                }
            });
            $scope.vm.data.curtask = content;
        });

    };

    $scope.additem = function (tb) {
        var obj = {
            "time": new Date(),
            "action": ""
        };
        tb.push(obj);
    };

    $scope.removeitem = function (tb, index) {
        tb.splice(index, 1);
    };

    $scope.isedit = false;
    $scope.submit = function () {
        $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        return;
        eventtables.add($scope.vm).then(function (data) {
            // if ($scope.vm.data.currentaim) {
            //     var obj = $scope.vm.data.currentaim;
            //     var actions = [];
            //     angular.forEach($scope.vm.data.actions, function (item, index) {
            //         item.time = $filter('date')(item.time, 'yyyy-MM-dd HH:mm');
            //         actions.push({ time: item.time, action: item.action });
            //     });
            //     obj.actionsjson = angular.toJson(actions);
            //     //angular.copy($scope.vm.data.actions,obj.actions);
            //     icsdb.getdetail("eventstatus", "?eventid=" + $scope.vm.eventid).then(function (data2) {
            //         if (data2.length > 0) {
            //             angular.copy($scope.vm.data.task, data2[0].task);
            //             icsdb.update("eventstatus", data2[0].id, data2[0]).then();
            //         }
            //     });
            // }
            var actions = [];
            angular.forEach($scope.vm.data.currentaimList, function (currentaim) {                
                angular.forEach(currentaim.actions, function (item, index) {
                    item.time = $filter('date')(item.time, 'yyyy-MM-dd HH:mm');
                    actions.push({ time: item.time, action: item.action });
                });
                currentaim.actionsjson = angular.toJson(actions);
            });

            $state.go('app.ics_eventindex');
        });
    };

    $scope.subminEx = function () {
        $scope.submit();
        icsdb.getdetail('event', '?sourceid=' + $scope.event.id).then(function (data) {
            if (data.length > 0) {
                var sourceId = $scope.event.id;//海外事件ID
                var eId = data[0].id;//国际公司ID
                icsdb.getdetail('eventstatus', '?eventid=' + sourceId).then(function (sevent) {
                    var stask = sevent[0].task;
                    icsdb.getdetail('eventstatus', '?eventid=' + eId).then(function (tevent) {
                        var ttask = tevent[0].task;
                        for (var i = 0; i < stask.length; ++i) {
                            for (var j = 0; j < ttask.length; ++j) {
                                if (stask[i].id != ttask[j].id) {
                                    break;
                                }
                                for (var ii = 0; ii < stask[i].data.length; ++ii) {
                                    if (stask[i].data[ii].checked == "true") {
                                        var bAdd = true;
                                        for (var jj = 0; jj < ttask[j].data.length; ++jj) {
                                            if (stask[i].data[ii].name == ttask[j].data[jj].name) {
                                                ttask[j].data[jj] = stask[i].data[ii];
                                                bAdd = false;
                                            }
                                        }
                                        if (bAdd) {
                                            ttask[j].data.push(stask[i].data[ii]);
                                        }
                                    }
                                }
                            }
                        }
                        icsdb.update('eventstatus', tevent[0].id, tevent[0]);
                    });
                });
            }
        });
    }

    var pdata = $stateParams.data;
    if (pdata) {
        $scope.isedit = true;
        if (pdata.id) {
            eventtables.getdetail(pdata.id).then(function (data) {
                $scope.vm = data;
                $scope.vm.id = "";
                $scope.dt = new Date();
                $scope.vm.data = angular.fromJson($scope.vm.datajson);
                eventservice.getdetail(data.eventid).then(function (data2) {
                    $scope.vm.name = data2.name;
                });
            });
        }
        else {
            eventservice.getdetail(localStorage.eventid).then(function (data) {
                $scope.vm.name = data.name;
                $scope.vm.eventid = data.id;

                $scope.vm.step = data.step;
            });

            eventperiod.getdetail(localStorage.periodid).then(function (data) {
                $scope.vm.periodid = data.id;
            });
        }
    }
    else {
        tablecontent.get().then(function (data) {
            angular.forEach(data, function (item, index) {
                if (item.tablename == $scope.vm.tablename) {
                    $scope.vm.data.content = item.content;
                }
            });
        });
    }

    $scope.addtable = function (data) {
        $scope.vm.datajson = angular.toJson($scope.vm.data);
        eventtables.add($scope.vm).then(function (data) {
            $state.go('app.ics_eventindex');
        })
    };

    //返回
    $scope.cancel = function () {
        $state.go('app.ics_eventindex');
    };
}

tableviewCtrl.$inject = ['$rootScope', '$resource', '$scope', '$timeout', '$state', '$filter', '$http', 'eventservice', 'eventperiod', 'eventtables', 'steptask', 'periodtask'];
function tableviewCtrl($rootScope, $resource, $scope, $timeout, $state, $filter, $http, eventservice, eventperiod, eventtables, steptask, periodtask) {

    $scope.download = function (url) {

    };

    $scope.tables = [];


    periodtask.get().then(function (data) {
        angular.forEach(data, function (item, index) {
            angular.forEach(item.tables, function (item2, index2) {
                item2.type = item.type;
                $scope.tables.push(item2);
            });
        });

    });

    // $scope.download = function (url) {
    //     $http.get({
    //         url: url,
    //         method: 'get'
    //     }).success(function (data) {
    //         // 怎么保存？
    //     });
    // };
};

eventorganizationCtl.$inject = ['$scope', '$state', '$filter', 'users', 'eventorganization', 'ngDialog', 'SweetAlert', 'editableOptions', 'eventroles', 'eventorgusers', 'organiztion'];
function eventorganizationCtl($scope, $state, $filter, users, eventorganization, ngDialog, SweetAlert, editableOptions, eventroles, eventorgusers, organiztion) {
    $scope.orgType = "0";
    editableOptions.theme = 'bs3';
    $scope.orgName = "";
    $scope.treeDatas = [];
    $scope.group_tree = {};
    $scope.allUsers = null;//all users
    $scope.selOrgUsers = [];
    $scope.selOrg = null;//当前选中组织机构
    $scope.showRoleList = [];
    $scope.my_tree_handler = function (branch) {
        $scope.selOrg = branch;
        $scope.selOrgUsers = [];
        eventorgusers.getdetail('?orgid=' + branch.id).then(function (data) {
            data = data.sort(function (a, b) {
                return a.sort - b.sort;
            });
            angular.forEach(data, function (item) {
                $.each($scope.allUsers, function (j, user) {
                    if (user.user_id == item.userid) {
                        var u = angular.copy(user);
                        u.id = item.id;
                        u.orgid = item.orgid;
                        u.roleid = item.roleid;
                        u.sort = item.sort;
                        u.companyid = item.companyid;
                        $scope.selOrgUsers.push(u);
                    }
                });
            });
        });
        $scope.addUserList();
        var ary = [];
        angular.forEach($scope.roles, function (item) {
            if (item.organization == branch.id) {
                ary.push(item);
            }
        });
        $scope.showRoleList = ary;
    };
    users.users().then(function (data) {//get all users
        $scope.allUsers = data;
        $scope.loadRoles();
    });
    $scope.orgList = [];
    $scope.roles = [];
    $scope.loadRoles = function () {
        eventroles.get().then(function (data) {
            $scope.roles = data;
            $scope.loadEventOrgList();
        });
    };
    $scope.srcData = null;
    $scope.loadEventOrgList = function () {//get all event organiztion
        $scope.treeDatas = [];
        eventorganization.get().then(function (data) {
            $scope.srcData = data;
            $scope.treeDatas = $scope.getOrgTreeDatas(data, -1);
            $scope.group_tree.expand_all();
        });
    };
    $scope.getOrgTreeDatas = function (data, parentid) {//查找该父节点下所以的孩子节点
        var ary = [];
        angular.forEach(data, function (item) {
            if (item.parentid == parentid) {
                item.label = item.organization;
                item.expanded = true;
                item.children = $scope.getOrgTreeDatas(data, item.id);
                ary.push(item);
            }
        });
        ary = ary.sort(function (a, b) {
            return a.sort - b.sort;
        });
        return ary;
    };
    $scope.addOrg = function () {
        $scope.orgOperatorTitle = '添加应急组织机构';
        ngDialog.open({
            template: "orgOperator",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 400,
            height: 400,
            controller: function ($scope, ngDialog, organiztion) {
                $scope.name = '';
                $scope.type = "81940c2be8212921";
                $scope.companyList = [];
                organiztion.getorganiztion().then(function (data) {//公司组织机构
                    $scope.companyList = data;
                    $scope.loadCompanyOrgList();
                });
                $scope.overCompanyList = [];
                $scope.loadCompanyOrgList = function () {
                    $scope.overCompanyList = [];
                    if ($scope.type == '6212c89274b7c9ad') {
                        $scope.overCompanyList = [];
                        angular.forEach($scope.companyList, function (item) {
                            if (item.parent_id == '2016011802') {
                                $scope.overCompanyList.push(item);
                            }
                        });
                        $scope.overCompany = $scope.overCompanyList.length > 0 ? $scope.overCompanyList[0].organiztion_id : null;
                    }
                };
                $scope.selTreeDatas = [];
                $scope.selectParent = function () {
                    $scope.selTreeDatas = [];
                    eventorganization.get().then(function (data) {
                        $.each(data, function (i, item) {
                            if (item.id == $scope.type) {
                                var obj = angular.copy(item);
                                obj.label = item.organization;
                                obj.expanded = true;
                                obj.children = $scope.$parent.getOrgTreeDatas(data, $scope.type);
                                $scope.selTreeDatas.push(obj);
                                return false;
                            }
                        });
                        $scope.selParentDlg = ngDialog.open({
                            template: "parentOrgTree",
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByDocument: false,
                            showClose: true,
                            width: 300,
                            controller: function ($scope) {
                                $scope.cancel = function () {
                                    $scope.$parent.closeSelParentDialog();
                                };
                                $scope.parent = null;
                                $scope.selectParent = function (branch) {
                                    $scope.parent = branch;
                                };
                                $scope.ok = function () {
                                    $scope.$parent.selParent = $scope.parent;
                                    $scope.cancel();
                                };
                            }
                        });
                    });
                };
                $scope.closeSelParentDialog = function () {
                    if ($scope.selParentDlg) $scope.selParentDlg.close();
                };
                $scope.selParent = { organization: '' };
                $scope.add = function () {
                    if (!$scope.name) {
                        SweetAlert.swal('错误', '应急组织机构名称不能为空', 'error');
                        return false;
                    }
                    if (!$scope.selParent.organization) {
                        SweetAlert.swal('错误', '所属应急组织机构不能为空', 'error');
                        return false;
                    }
                    var companyid = null;
                    var parent = $scope.selParent.id;
                    var root = null;
                    if ($scope.selParent.parentid == -1 || $scope.selParent.parentid == '6212c89274b7c9ad') {
                        companyid = parent;
                    } else {
                        var sel = angular.copy($scope.selParent);
                        while (!(sel.parentid == -1 || sel.parentid == '6212c89274b7c9ad')) {
                            $.each($scope.$parent.srcData, function (i, item) {
                                if (item.id == sel.parentid) {
                                    sel = angular.copy(item);
                                    return false;
                                }
                            });
                        }
                        companyid = sel.id;
                    }
                    eventorganization.getdetail('?parentid=' + parent).then(function (data) {
                        $scope.$parent.addOrgPost(companyid, parent, $scope.name, data.length + 1);
                    });
                };
            }
        });
    };
    $scope.editOrg = function () {
        if ($scope.selOrg == null) {
            SweetAlert.swal('错误', '无选中的组织机构。', 'error');
            return;
        }
        if ($scope.selOrg.parentid == -1) {
            SweetAlert.swal('错误', '不可编辑的选择项', 'error');
            return;
        }
        $scope.editParent = null;
        var sel = $scope.selOrg;
        while ($scope.editParent == null) {//获取根节点
            sel = $scope.group_tree.get_parent_branch(sel);
            if (sel.parentid == -1) $scope.editParent = angular.copy(sel);
        }
        $scope.orgOperatorTitle = '编辑组织机构';
        ngDialog.open({
            template: "orgOperator",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 400,
            height: 400,
            controller: function ($scope, ngDialog, organiztion) {
                $scope.selOrg = angular.copy($scope.$parent.selOrg);
                $scope.name = $scope.$parent.selOrg.organization;
                $scope.type = $scope.$parent.editParent.id;
                $scope.companyList = [];
                organiztion.getorganiztion().then(function (data) {//公司组织机构
                    $scope.companyList = data;
                    $scope.loadCompanyOrgList();
                });
                $scope.overCompanyList = [];
                $scope.loadCompanyOrgList = function () {
                    $scope.overCompanyList = [];
                    if ($scope.type == '6212c89274b7c9ad') {
                        $scope.overCompanyList = [];
                        angular.forEach($scope.companyList, function (item) {
                            if (item.parent_id == '2016011802') {
                                $scope.overCompanyList.push(item);
                            }
                        });
                        $scope.overCompany = $scope.overCompanyList.length > 0 ? $scope.overCompanyList[0].organiztion_id : null;
                    }
                };
                $scope.selTreeDatas = $scope.$parent.editParent;
                $scope.selectParent = function () {
                    $scope.selTreeDatas = [];
                    eventorganization.get().then(function (data) {
                        $.each(data, function (i, item) {
                            if (item.id == $scope.type) {
                                var obj = angular.copy(item);
                                obj.label = item.organization;
                                obj.expanded = true;
                                obj.children = $scope.$parent.getOrgTreeDatas(data, $scope.type);
                                $scope.selTreeDatas.push(obj);
                                return false;
                            }
                        });
                        $scope.selParentDlg = ngDialog.open({
                            template: "parentOrgTree",
                            className: 'ngdialog-theme-default',
                            scope: $scope,
                            closeByDocument: false,
                            showClose: true,
                            width: 300,
                            controller: function ($scope) {
                                $scope.cancel = function () {
                                    $scope.$parent.closeSelParentDialog();
                                };
                                $scope.parent = null;
                                $scope.selectParent = function (branch) {
                                    $scope.parent = branch;
                                };
                                $scope.ok = function () {
                                    $scope.$parent.selParent = $scope.parent;
                                    $scope.cancel();
                                };
                            }
                        });
                    });
                };
                $scope.closeSelParentDialog = function () {
                    if ($scope.selParentDlg) $scope.selParentDlg.close();
                };
                $scope.selParent = $scope.$parent.group_tree.get_parent_branch($scope.$parent.selOrg);
                $scope.add = function () {
                    if (!$scope.name) {
                        SweetAlert.swal('错误', '应急组织机构名称不能为空', 'error');
                        return false;
                    }
                    if (!$scope.selParent.organization) {
                        SweetAlert.swal('错误', '所属应急组织机构不能为空', 'error');
                        return false;
                    }
                    var companyid = null;
                    var parent = $scope.selParent.id;
                    // if ($scope.type == '6212c89274b7c9ad'){//海外机构
                    //     companyid = $scope.overCompany;
                    // }else if ($scope.type == '81940c2be8212921'){
                    //     companyid = '2016011801';
                    // }else if ($scope.type == 'c435509cf11c6abd'){
                    //     companyid = '2016011800';
                    // }
                    var root = null;
                    if ($scope.selParent.parentid == -1 || $scope.selParent.parentid == '6212c89274b7c9ad') {
                        companyid = parent;
                    } else {
                        var sel = angular.copy($scope.selParent);
                        while (!(sel.parentid == -1 || sel.parentid == '6212c89274b7c9ad')) {
                            $.each($scope.$parent.srcData, function (i, item) {
                                if (item.id == sel.parentid) {
                                    sel = angular.copy(item);
                                    return false;
                                }
                            });
                        }
                        companyid = sel.id;
                    }
                    $scope.selOrg.organization = $scope.name;
                    $scope.selOrg.companyid = companyid;
                    $scope.selOrg.parentid = parent;
                    eventorganization.update($scope.selOrg.id, $scope.selOrg).then(function (data) {
                        $scope.loadEventOrgList();
                    }, function (status) {
                        SweetAlert.swal('错误', '编辑应急组织机构失败', 'error');
                    });
                    ngDialog.closeAll();
                };
            }
        });
    };
    $scope.addOrgPost = function (companyid, parent, name, sort) {
        var org = {
            organization: name,
            sort: sort,
            parentid: parent,
            companyid: companyid
        };
        eventorganization.add(org).then(function () {
            $scope.loadEventOrgList();
        }, function (status) {
            SweetAlert.swal('错误', '添加组织机构失败', 'error');
        })
        ngDialog.closeAll();
    };
    $scope.closeDialog = function () {
        ngDialog.closeAll();
    };
    $scope.deleteOrg = function () {
        if ($scope.selOrg == null) {
            SweetAlert.swal('错误', '无选中的组织机构。', 'error');
            return;
        }
        if ($scope.selOrg.parentid == -1) {
            SweetAlert.swal('错误', '无效的选择', 'error');
            return;
        }
        SweetAlert.swal({
            title: '确定删除？',
            text: '是否确实删除该组织机构，该操作不可恢复!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                eventorganization.delete($scope.selOrg.id).then(function () { //删除默认
                    SweetAlert.swal('删除!', '参数删除成功.', 'success');
                    $scope.loadEventOrgList();
                }, function () {
                    SweetAlert.swal('删除!', '参数删除失败.', 'error');
                });
            } else {
                SweetAlert.swal('已取消', '删除操作已取消.', 'error');
            }
        });
    };
    $scope.addOrgUser = function () {//设置组织机构成员
        if ($scope.selOrg == null) {
            SweetAlert.swal('错误', '无选中的组织机构。', 'error');
            return;
        }
        ngDialog.open({
            template: "addUsers",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 800,
            controller: function ($scope) {
                $scope.selAll = false;
                $scope.allUsers = [];
                $scope.orgUser = $scope.$parent.selOrgUsers;
                angular.forEach($scope.$parent.allUsers, function (item) {
                    var a = angular.copy(item);
                    a.checked = false;
                    // $.each($scope.orgUser,function (i, u) {
                    //     if (a.user_id == u.user_id){
                    //         a.checked = true;
                    //         return false;
                    //     }
                    // });

                    $scope.allUsers.push(a);
                });
                $scope.selAllFun = function () {
                    angular.forEach($scope.allUsers, function (item) {
                        item.checked = $scope.selAll;
                    });
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.set = function () {
                    angular.forEach($scope.allUsers, function (item) {
                        if (item.checked == true) {
                            item.orgid = $scope.selOrg.id;
                            item.roleid = '';
                            $scope.$parent.selOrgUsers.push(item);
                        }
                    });
                    ngDialog.closeAll();
                };
            }
        });

        // $scope.inserted = {
        //     role: '',
        //     user: {},
        // };
        // if (!$scope.selOrg.users){
        //     $scope.selOrg.users = [$scope.inserted];
        // }else {
        //     $scope.selOrg.users.push($scope.inserted);
        // }
    };
    $scope.addUserList = function () {
        $scope.filterUserList = [];
        if (!$scope.selOrg.users) {
            $scope.filterUserList = $scope.allUsers;
            return;
        }
        angular.forEach($scope.allUsers, function (user) {
            var flag = false;
            for (var i = 0; i < $scope.selOrg.users.length; ++i) {
                if (user.user_id == $scope.selOrg.users[i].user_id) {
                    flag = true;
                    break;
                }
            }
            if (flag == false) $scope.filterUserList.push(user);
        });
    };
    $scope.showRole = function (role) {
        var s = '';
        $.each($scope.roles, function (i, item) {
            if (item.roleid == role) {
                s = item.rolename;
                return false;
            }
        });
        return s;
    };
    $scope.showUserName = function (user) {
        return user.user.real_name;
    };
    $scope.saveUser = function () {
        if ($scope.selOrg == null) {
            SweetAlert.swal('错误', '无选中的组织机构。', 'error');
            return;
        }
        var companyid = null;
        var root = null;
        if ($scope.selOrg.parentid == -1 || $scope.selOrg.parentid == '6212c89274b7c9ad') {
            companyid = parent;
        } else {
            var sel = angular.copy($scope.selOrg);
            while (root == null) {//获取根节点
                sel = $scope.group_tree.get_parent_branch(sel);
                if (sel.parentid == -1 || sel.parentid == '6212c89274b7c9ad') root = angular.copy(sel);
            }
            companyid = sel.id;
        }
        angular.forEach($scope.selOrgUsers, function (item, i) {
            if (item.checked == true) {//add
                var obj = {
                    orgid: item.orgid,
                    userid: item.user_id,
                    roleid: item.roleid,
                    sort: i,
                    companyid: companyid
                };
                eventorgusers.add(obj);
            } else {//edit
                var obj = {
                    id: item.id,
                    orgid: item.orgid,
                    userid: item.user_id,
                    roleid: item.roleid,
                    sort: i,
                    companyid: item.companyid
                };
                eventorgusers.update(obj.id, obj);
            }
        });
        SweetAlert.swal('成功', '设置用户成功', 'success');
    };
    $scope.removeUser = function (index) {
        SweetAlert.swal({
            title: $filter('T')('singledelete') + "?",
            text: $filter('T')('determinedelete'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $filter('T')("singledelete"),
            cancelButtonText: $filter('T')('cancel'),
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    var sl = $scope.selOrgUsers[index];
                    eventorgusers.delete($scope.selOrgUsers[index].id).then(function () {
                        $scope.selOrgUsers.splice(index, 1);
                        swal($filter('T')('cancel'), $filter('T')('cancel') + $filter('T')('success'), "success");
                    }, function (status) {
                        swal($filter('T')('cancel'), $filter('T')('cancel') + $filter('T')('error'), "error");
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
    };
    $scope.sort = function (type, index) {//type:0-up,1-down
        var sl = angular.copy($scope.selOrgUsers[index]);
        var ary = [];
        if (type == 0) {//up
            var pre = angular.copy($scope.selOrgUsers[index - 1]);
            for (var i = 0; i < $scope.selOrgUsers.length; ++i) {
                if (i == (index - 1)) {
                    ary.push(sl);
                } else if (i == index) {
                    ary.push(pre);
                } else {
                    ary.push($scope.selOrgUsers[i]);
                }
            }
        } else if (type == 1) {//down
            var next = $scope.selOrgUsers[index + 1];
            for (var i = 0; i < $scope.selOrgUsers.length; ++i) {
                if (i == index) {
                    ary.push(next);
                } else if (i == (index + 1)) {
                    ary.push(sl);
                } else {
                    ary.push($scope.selOrgUsers[i]);
                }
            }
        }
        $scope.selOrgUsers = ary;
    };
};

icsroleCtrl.$inject = ['$scope', 'eventorganization', 'eventroles', 'organiztion', 'roletemp', 'SweetAlert'];
function icsroleCtrl($scope, eventorganization, eventroles, organiztion, roletemp, SweetAlert) {
    roletemp.get().then(function (data) {
        $scope.viewModel = data;
        $scope.srcViewModel = angular.copy(data);
    });
    $scope.groupList = [];
    $scope.roleList = [];
    $scope.selOrg = '';
    $scope.selRole = null;
    $scope.selPeriod = 1;
    $scope.periodList = [{
        step: 1,
        name: '接警、报告和记录'
    }, {
        step: 2,
        name: '初步形势判断'
    }, {
        step: 3,
        name: '首次应急会议'
    }, {
        step: 4,
        name: '形势判断'
    }, {
        step: 5,
        name: '应急过程会议'
    }, {
        step: 6,
        name: '形势判断'
    }, {
        step: 7,
        name: '扩大应急响应'
    }];
    $scope.groups = [];
    $scope.loadEventOrg = function () {
        eventorganization.get().then(function (data) {
            $scope.eventOrgList = data;
            $scope.loadRoles();
        });
    };
    $scope.loadEventOrg();
    $scope.loadRoles = function () {
        $scope.groupList = [];
        eventroles.get().then(function (data) {
            $scope.roles = data;
            angular.forEach(data, function (item) {
                var s = item.organizationid;
                var flag = true;
                $.each($scope.groupList, function (j, org) {
                    if (org.id == s) {
                        flag = false;
                        return false;
                    }
                });
                if (flag) {
                    $.each($scope.eventOrgList, function (i, gp) {
                        if (gp.id == s) {
                            $scope.groupList.push(gp);
                            return false;
                        }
                    });
                }
            });
            if ($scope.groupList.length > 0) $scope.selOrg = $scope.groupList[0];
            $scope.queryRoleList();
        });
    };
    // organiztion.getorganiztion().then(function (data) {
    //     $scope.groups = data;
    //     $scope.loadRoles();
    // });
    $scope.queryRoleList = function () {
        $scope.roleList = [];
        angular.forEach($scope.roles, function (item) {
            if (item.organizationid == $scope.selOrg.id) $scope.roleList.push(item);
        });
        if ($scope.roleList.length > 0) $scope.selRole = $scope.roleList[0].roleid;
    };
    $scope.$watchGroup(['selOrg', 'selRole', 'selPeriod'], function (newVal, oldVal) {
        $.each($scope.roleList, function (i, item) {
            if (item.roleid == $scope.selRole) {
                if (!item.role) item.role = [];
                $.each(item.role, function (j, step) {
                    if (step.step == $scope.selPeriod) {
                        var roles = step.roles;
                        $scope.viewModel = angular.copy($scope.srcViewModel);
                        $scope.setRoleModel(roles);
                        return false;
                    }
                });
                return false;
            }
        });
    });
    $scope.setRoleModel = function (rs) {
        if (rs.panels && rs.panels.length > 0) {
            angular.forEach($scope.viewModel, function (m) {
                m.checked = false;
                angular.forEach(rs.panels, function (ps) {
                    if (m.type == ps) {
                        m.checked = true;
                    }
                });
            });
        }
        if (rs.guide && rs.guide.length > 0) {
            angular.forEach($scope.viewModel, function (m) {//view
                if (m.guide && m.guide.length > 0) {//行动指南
                    $.each(m.guide, function (i, g) {
                        g.checked = false;
                        angular.forEach(rs.guide, function (gs) {//行动指南
                            if (gs.type) {
                                if (gs.type == g.type) g.checked = true
                            } else {//补充基本情况表格
                                if (gs.name == g.name) g.checked = true;
                            }
                        });
                        if (g.tables && g.tables.length > 0) {//补充基本情况表格 talbes
                            if (rs.tables && rs.tables.length > 0) {
                                angular.forEach(g.tables, function (gts) {
                                    gts.checked = false;
                                    angular.forEach(rs.tables, function (ts) {
                                        if (ts.url == gts.url) gts.checked = true;
                                    });
                                });
                            }
                        }
                    });
                }
            });
        }

        if (rs.log && rs.log.length > 0) {//日志
            angular.forEach($scope.viewModel, function (vm) {
                if (vm.type == 'log') {
                    angular.forEach(vm.tables, function (tb) {
                        tb.checked = false;
                        $.each(rs.log, function (i, l) {
                            if (l.url == tb.url) {
                                tb.checked = true;
                                return false;
                            }
                        });
                    });
                }
            });
        }

        if (rs.plan && rs.plan.length > 0) {//计划
            angular.forEach($scope.viewModel, function (vm) {
                if (vm.type == 'plan') {
                    angular.forEach(vm.tables, function (tb) {
                        tb.checked = false;
                        $.each(rs.plan, function (i, p) {
                            if (p.url == tb.url) {
                                tb.checked = true;
                                return false;
                            }
                        });
                    });
                }
            });
        }
    };
    $scope.getRoleModel = function () {
        $.each($scope.roleList, function (i, item) {
            if (item.roleid == $scope.selRole) {
                $.each(item.role, function (j, step) {
                    if (step.step == $scope.selPeriod) {
                        var roles = step.roles;
                        roles.panels = [];
                        roles.guide = [];
                        roles.tables = [];
                        roles.log = [];
                        roles.plan = [];
                        angular.forEach($scope.viewModel, function (vm) {
                            if (vm.checked == true) {
                                roles.panels.push(vm.type);
                                if (vm.type == 'plan' && vm.tables && vm.tables.length > 0) {
                                    angular.forEach(vm.tables, function (ptb) {
                                        if (ptb.checked) roles.plan.push({ name: ptb.table, url: ptb.url });
                                    });
                                }
                                if (vm.type == 'log' && vm.tables && vm.tables.length > 0) {
                                    angular.forEach(vm.tables, function (ltb) {
                                        if (ltb.checked) roles.log.push({ name: ltb.table, url: ltb.url });
                                    });
                                }
                                if (vm.type == 'guide' && vm.guide && vm.guide.length > 0) {//行动指南
                                    angular.forEach(vm.guide, function (g) {
                                        if (g.checked == true) {
                                            roles.guide.push({ name: g.name, type: g.type });
                                            if (g.type == 'othertables') {
                                                angular.forEach(g.tables, function (t) {
                                                    if (t.checked == true) roles.tables.push({ name: t.name, url: t.url });
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        eventroles.update(item.id, item).then(function (data) {
                            SweetAlert.swal('成功', '设置角色权限成功.', 'success');
                        }, function () {
                            $scope.loadRoles();
                            SweetAlert.swal('错误', '设置角色权限错误', 'error');
                        })
                        return false;
                    }
                });
                return false;
            }
        });
    };
};

icsrolemgrControl.$inject = ['$scope', '$state', '$stateParams', 'eventorganization', 'eventroles', 'organiztion', 'SweetAlert'];
function icsrolemgrControl($scope, $state, $stateParams, eventorganization, eventroles, organiztion, SweetAlert) {
    $scope.loadEventOrg = function () {
        $scope.groupList = [];
        eventorganization.get().then(function (data) {
            $scope.eventOrgList = data;
            angular.forEach(data, function (item) {
                if (item.parentid == -1) {
                    if (item.id != '6212c89274b7c9ad') {
                        $scope.groupList.push(item);
                    }
                } else if (item.parentid == '6212c89274b7c9ad') {
                    $scope.groupList.push(item);
                }
            });
            if ($scope.groupList.length > 0) $scope.selOrg = $scope.groupList[0];
            $scope.loadRoles();
        });
    };
    $scope.loadGroup = function () {

    };
    $scope.loadRoles = function () {
        eventroles.get().then(function (data) {
            $scope.roles = data;
            // angular.forEach(data,function (item) {
            //     var s = item.organizationid;
            //     var flag = true;
            //     $.each($scope.groupList, function (j, org) {
            //         if (org.id == s){
            //             flag = false;
            //             return false;
            //         }
            //     });
            //     if (flag){
            //         $.each($scope.eventOrgList,function (i, gp) {
            //             if (gp.id == s){
            //                 $scope.groupList.push(gp);
            //                 return false;
            //             }
            //         });
            //     }
            // });
            // if ($scope.groupList.length > 0) $scope.selOrg = $scope.groupList[0];
            $scope.queryRoleList();
        });
    };
    $scope.loadEventOrg();

    // organiztion.getorganiztion().then(function (data) {
    //     $scope.groups = data;
    //     $scope.loadEventOrg();
    //     $scope.loadRoles();
    // });
    $scope.queryRoleList = function () {
        $scope.roleList = [];
        angular.forEach($scope.roles, function (item) {
            if (item.organizationid == $scope.selOrg.id) $scope.roleList.push(item);
        });
    };
    $scope.eventOrgName = function (id) {
        var s = '';
        $.each($scope.eventOrgList, function (i, item) {
            if (item.id == id) {
                s = item.organization;
                return false;
            }
        });
        return s;
    };
    $scope.edit = function (id) {
        $state.go('app.ics_roleedit', { id: id });
    };
    $scope.add = function () {
        $state.go('app.ics_roleedit');
    };
    $scope.delete = function (id) {
        SweetAlert.swal({
            title: '确定删除？',
            text: '是否确实删除该组织机构，该操作不可恢复!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                eventroles.delete(id).then(function () { //删除默认
                    SweetAlert.swal('删除!', '删除成功.', 'success');
                    $scope.loadRoles();
                }, function () {
                    SweetAlert.swal('删除!', '删除失败.', 'error');
                });
            } else {
                SweetAlert.swal('已取消', '删除操作已取消.', 'error');
            }
        });
    };
};

icsroleeditControl.$inject = ['$scope', '$state', '$stateParams', 'eventorganization', 'eventroles', 'organiztion', 'SweetAlert'];
function icsroleeditControl($scope, $state, $stateParams, eventorganization, eventroles, organiztion, SweetAlert) {
    $scope.roleid = $stateParams.id;
    $scope.title = $scope.roleid ? '编辑' : '添加';
    eventroles.get().then(function (data) {
        if ($scope.roleid) {
            $.each(data, function (i, item) {
                if (item.id == $scope.roleid) {
                    $scope.vm = item;
                    return false;
                }
            });
        } else {
            var i = 0;
            angular.forEach(data, function (item) {
                i = parseInt(item.roleid) > i ? parseInt(item.roleid) : i;
            });
            $scope.vm = {
                rolename: '',
                roleid: i + 1,
                organization: '',
                job: '',
                organizationid: '',
                duty: ''
            }
        }
        // organiztion.getorganiztion().then(function(data) {
        //     $scope.groups = data;
        //     $scope.loadEventOrg();
        // });
        $scope.loadEventOrg();
    });
    $scope.loadEventOrg = function () {
        eventorganization.get().then(function (data) {
            $scope.eventOrgList = data;
            $scope.groupList = [];
            angular.forEach(data, function (item) {
                if (item.parentid == -1) {
                    if (item.id != '6212c89274b7c9ad') {
                        $scope.groupList.push(item);
                    }
                } else if (item.parentid == '6212c89274b7c9ad') {
                    $scope.groupList.push(item);
                }
            });
            // angular.forEach(data, function(item) {
            //     if (item.companyid) {
            //         var flag = true;
            //         $.each($scope.groupList, function(i, grp) {
            //             if (grp == item.companyid) {
            //                 flag = false;
            //                 return false;
            //             }
            //         });
            //         if (flag) $scope.groupList.push(item.companyid);
            //     }
            // });
            // var ary = [];
            // angular.forEach($scope.groupList, function (gp) {
            //     $.each(data,function (i,item) {
            //         if (item.id == gp){
            //             ary.push(item);
            //             return false;
            //         }
            //     });
            // });
            // $scope.groupList = ary;
            if (!$scope.roleid) $scope.vm.organizationid = $scope.groupList[0].id;
            $scope.loadEventOrgList();
        });
    };
    $scope.loadEventOrgList = function () {
        $scope.orgList = [];
        angular.forEach($scope.eventOrgList, function (item) {
            if (item.companyid == $scope.vm.organizationid) $scope.orgList.push(item);
        });
        if (!$scope.roleid) $scope.vm.organization = $scope.orgList[0].id;
    };

    $scope.add = function () {
        $scope.roleid =
            eventroles.add($scope.vm).then(function (data) {
                $scope.cancel();
            }, function (status) {

            });
    };
    $scope.edit = function () {
        eventroles.update($scope.vm.id, $scope.vm).then(function (data) {
            $scope.cancel();
        }, function (status) {

        });
    };
    $scope.validateInput = function (name, type) {
        var input = $scope.roleForm[name];
        return input.$invalid;
    };
    $scope.ok = function () {
        if ($scope.roleForm.$valid == false) return;
        if ($scope.roleid) $scope.edit();
        else $scope.add();
    };
    $scope.cancel = function () {
        $state.go("app.ics_role")
    };
};

actionguidmgrCtl.$inject = ['$scope', '$filter', 'FileUploader', 'SweetAlert', 'icsdb'];
function actionguidmgrCtl($scope, $filter, FileUploader, SweetAlert, icsdb) {
    $scope.eventid = localStorage.eventid;
    $scope.uploaderCtl = new FileUploader({
        queueLimit: 1,
        autoUpload: false,
        url: 'apis/api/ExSystemUploadMgr?type=1',
        filters: [{
            name: 'xlsefilter',
            fn: function (item) {// A user-defined filter
                var ext = item.name.substr(item.name.lastIndexOf(".")).toLowerCase();//获得文件后缀名
                if (ext == '.xlsx') return true;
                return false;
            }
        }]
    });
    $scope.updateData = function () {
        icsdb.getdetail('eventstatus', '?eventid=' + $scope.eventid).then(function (data) {
            if (data.length == 0) {//add
                var vm = {
                    eventid: $scope.eventid,
                    actiondutyurl: 'http://10.78.173.167/upload/actionguid/' + $scope.fileName
                };
                icsdb.add('eventstatus', vm).then(function (data) {
                    SweetAlert.swal($filter('T')('success'), $filter('T')('uploadfilesuccess'), 'success');
                }, function (status) {
                    SweetAlert.swal($filter('T')('error'), $filter('T')('uploadfilefailed'), 'error');
                });
            } else {//edit
                var vm = data[0];
                vm.actiondutyurl = 'http://10.78.173.167/upload/actionguid/' + $scope.fileName;
                icsdb.update('eventstatus', vm.id, vm).then(function (data) {
                    SweetAlert.swal($filter('T')('success'), $filter('T')('uploadfilesuccess'), 'success');
                }, function (status) {
                    SweetAlert.swal($filter('T')('error'), $filter('T')('uploadfilefailed'), 'error');
                });
            }
        });
    };
    $scope.uploaderCtl.onSuccessItem = function (fileItem, response, status, headers) {
        if (response.eCode == 0) {
            $scope.fileName = response.msg;
            $scope.updateData();
            // SweetAlert.swal($filter('T')('success'), $filter('T')('uploadfilesuccess'), 'success');
        } else {
            SweetAlert.swal($filter('T')('error'), $filter('T')('uploadfilefailed'), 'error');
        }
    };
    $scope.uploaderCtl.onErrorItem = function (fileItem, response, status, headers) {
        SweetAlert.swal($filter('T')('error'), $filter('T')('uploadfilefailed'), 'error');
    };
    $scope.errorFlag = false;
    $scope.uploaderCtl.onWhenAddingFileFailed = function (item, filter, options) {
        $scope.errorFlag = true;
    };
    $scope.upload = function () {
        angular.forEach($scope.uploaderCtl.queue, function (file) {
            var f = file.upload();
        })
    };
};

messageboardCtl.$inject = ['$scope', '$filter', 'icsdb', 'DTOptionsBuilder', 'SweetAlert', 'operator'];
function messageboardCtl($scope, $filter, icsdb, DTOptionsBuilder, SweetAlert, operator) {
    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ordering', false);
    $scope.messages = [];
    $scope.init = function () {
        icsdb.getdetail('eventmessageboard', '?eventid=' + localStorage.eventid).then(function (data) {
            data = data.sort(function (a, b) {
                return b.time.localeCompare(a.time) > 0;
            });
            $scope.messages = data;
        }, function (status) {

        });
    };
    $scope.users = [];
    $scope.InitUsers = function () {
        operator.get().then(function (data) {
            $scope.users = data;
        });
    };

    $scope.InitUsers();
    $scope.init();
    $scope.getUserName = function (id) {
        for (var i = 0; i < $scope.users.length; ++i) {
            if ($scope.users[i].user_id == id) {
                return $scope.users[i].real_name;
            }
        }
    };
    $scope.postmsg = "";
    $scope.write = function () {
        if ($scope.postmsg == "") {
            SweetAlert.swal('错误', '留言不能为空', 'error');
            return;
        }
        var msg = $scope.postmsg.replace(/[\r\n]/g, "<br />");
        var msg = {
            eventid: localStorage.eventid,
            userid: localStorage.userid,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            message: msg
        };
        icsdb.add('eventmessageboard', msg).then(function (data) {
            $scope.postmsg = "";
            SweetAlert.swal('成功', '发表留言成功', 'success');
            var ary = [data];
            angular.forEach($scope.messages, function (item) {
                ary.push(item);
            });
            $scope.messages = ary;
        }, function (status) {
            SweetAlert.swal('错误', '发表留言失败', 'error');
        });
    };
};

fileuploadCtl.$inject = ['$scope', '$filter', 'icsdb', 'SweetAlert', 'FileUploader'];
function fileuploadCtl($scope, $filter, icsdb, SweetAlert, FileUploader) {
    $scope.fileList = [];
    $scope.init = function () {
        icsdb.get('eventotherfiles', '?eventid=' + localStorage.eventid).then(function (data) {
            data = data.sort(function (a, b) {
                return b.time.localeCompare(a.time) > 0;
            });
            $scope.fileList = data;
        });
    };
    $scope.init();
    $scope.uploader = new FileUploader({
        url: 'apis/api/ExSystemUploadMgr?type=1&uid=2',
        queueLimit: 10,   //文件个数
        autoUpload: false,
        removeAfterUpload: false  //上传后删除文件
        //url: 'apisapi/ExSystemUploadMgr?type=1&uid=2'
    });
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        var obj = {
            eventid: localStorage.eventid,
            userid: localStorage.userid,
            filename: response.filename.replace('"', ''),
            url: response.url,
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        icsdb.add('eventotherfiles', obj).then(function (data) {
            $scope.init();
        });
    };
    $scope.delete = function (id) {
        SweetAlert.swal({
            title: $filter('T')('singledelete') + "?",
            text: $filter('T')('determinedelete'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $filter('T')("singledelete"),
            cancelButtonText: $filter('T')('cancel'),
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    icsdb.delete('eventotherfiles', id).then(function () {
                        $scope.init();
                        swal($filter('T')('success'), $filter('T')('singledelete') + $filter('T')('success'), "success");
                    }, function () {
                        swal($filter('T')('error'), $filter('T')('singledelete') + $filter('T')('error'), "error");
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
    };
};

icsfilesCtl.$inject = ['$scope', '$filter', 'icsdb', '$state', 'SweetAlert'];
function icsfilesCtl($scope, $filter, icsdb, $state, SweetAlert) {
    $scope.typeList = ['应急培训要求', '培训记录', '主要人员应急能力', '应急预案', '处置方案', '应急演练记录'];
    $scope.selType = $scope.typeList[0];
    $scope.insList = ['国际公司', '海外机构'];
    $scope.selIns = $scope.insList[0];
    $scope.add = function () {
        $state.go('app.addicsfile');
    };
    $scope.fList = [];
    $scope.search = function () {
        icsdb.get('eventfiles').then(function (data) {
            var ary = [];
            angular.forEach(data, function (item) {
                if (item.institutions == $scope.selIns &&
                    item.type == $scope.selType) {
                    ary.push(item);
                }
            });
            $scope.fList = ary;
        });
    };
    $scope.search();

    $scope.edit = function (id) {
        $state.go('app.addicsfile', { id: id });
    };

    $scope.delete = function (id) {
        SweetAlert.swal({
            title: '确定删除？',
            text: '是否确实删除，该操作不可恢复!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                icsdb.delete('eventfiles', id).then(function () { //删除默认
                    SweetAlert.swal('删除!', '删除成功.', 'success');
                    $scope.search();
                }, function () {
                    SweetAlert.swal('删除!', '删除失败.', 'error');
                });
            } else {
                SweetAlert.swal('已取消', '删除操作已取消.', 'error');
            }
        });
    }
};

addicsfileCtl.$inject = ['$scope', '$filter', '$stateParams', 'icsdb', '$state', 'SweetAlert'];
function addicsfileCtl($scope, $filter, $stateParams, icsdb, $state, SweetAlert) {
    $scope.typeList = ['应急培训要求', '培训记录', '主要人员应急能力', '应急预案', '处置方案', '应急演练记录'];
    $scope.selType = $scope.typeList[0];
    $scope.insList = ['国际公司', '海外机构'];
    $scope.selIns = $scope.insList[0];
    $scope.content = '';
    $scope.srcData = null;
    $scope.title = 'add';
    if ($stateParams.id) {
        $scope.title = 'edit';
        icsdb.getdetail('eventfiles', $stateParams.id).then(function (data) {
            $scope.srcData = data;
            $scope.selType = data.type;
            $scope.selIns = data.institutions;
            $scope.content = data.content;
        });
    }
    $scope.close = function () {
        $state.go('app.ics_files');
    };
    $scope.ok = function () {
        if ($scope.srcData == null) {
            var obj = {
                id: '',
                date: new moment().format('YYYY-MM-DD HH:mm:ss'),
                type: $scope.selType,
                institutions: $scope.selIns,
                content: $scope.content
            };
            icsdb.add('eventfiles', obj).then(function (data) {
                $scope.close();
            }, function (error) { });
        } else {
            var obj = {
                id: $scope.srcData.id,
                date: $scope.srcData.date,
                type: $scope.selType,
                institutions: $scope.selIns,
                content: $scope.content
            };
            icsdb.update('eventfiles', obj.id, obj).then(function (data) {
                $scope.close();
            }, function (err) { });
        }
    };

    $scope.reset = function () {
        if ($scope.srcData) {
            $scope.selType = $scope.srcData.type;
            $scope.selIns = $scope.srcData.institutions;
            $scope.content = $scope.srcData.content;
        } else {
            $scope.selType = $scope.typeList[0];
            $scope.selIns = $scope.insList[0];
            $scope.content = '';
        }
    }
};