angular.module('app.publicsentiment', ['cnooc_service', 'app.storage', 'cnooc_service.sendmsg', 'cnooc_service.messagegroup_user', 'cnooc_service.Weather', 'pascalprecht.translate', 'cnooc_service.organiztion_user', 'cnooc_service.digitalmap', 'cnooc_service.webmessage', 'ics_service.event'])

var curApp = angular.module('app.publicsentiment');

curApp.controller('indexCtrl', function ($scope, $cookies, $http, $filter, PublicSentiment, highchartsNG, WebMessageEx, website_message) {

    $scope.security_total = 0;
    $scope.weather_total = 0;
    $scope.emergency_total = 0;
    $scope.chart_type = 0;
    $scope.pub_list = [];
    $scope.messages = [];
    $scope.active_tab = ["active", "", ""];
    //$scope.nodes = [];
    //$scope.lbls = [];
    //$scope.chart = { series: [] };

    $scope.user_id = 200;
    $scope.inboxcount = "0";

    $scope.writemessage = function (item) {
        var obj = {
            content: escape(item.content),
            title: escape(item.title),
            category_type: 1,
            type: 2,
            top: 0,
            is_return: 0,
        };
        obj.content = escape(item.content);
        //$cookies.put("websitemessage", obj);
        $cookies.putObject("websitemessage", obj, { path: '/' });
        //$cookieStore.put("persion", {
        //     name: "my name",
        //    age: 18
        // });
        window.location.href = '@Url.Action("Write")';
    };

    WebMessageEx.GetInboxMsgCount($scope.user_id).then(function (data) {
        $scope.inboxcount = data;
    }, function (error) {
    });

    $scope.getCate = function (type) {
        if (type == 1)
            return $filter('T')("安保预警");//'@Html.GetLangbyKey("security")';
        else if (type == 2)
            return $filter('T')("灾害天气")//'@Html.GetLangbyKey("disaster")';
        else if (type == 3)
            return $filter('T')("应急事件")//'@Html.GetLangbyKey("emergency")';
        return "";
    };

    $scope.viewdetail = function (id) {
        window.location.href = '@Url.Action("ViewMessageDetail")' + "/" + id;
    }

    $scope.activeindex = 0;

    $scope.ngActive = function (index) {
        $scope.active_tab = ["", "", ""];
        $scope.active_tab[index] = "active";
        $scope.activeindex = index;
    };

    $scope.ngshowlayer = function (url) {
        //弹出即全屏
        var index = layer.open({
            type: 2,
            content: url,
            area: ['500px', '500px'],
            maxmin: true
        });
        layer.full(index);
    };

    $scope.message_details = function (title, url, w, h) {
        //layer_show(title, url, w, h);
        var index = layer.open({
            type: 2,
            content: url,
            area: ['500px', '500px'],
            maxmin: true
        });
        layer.full(index);
    };

    WebMessageEx.GetLatestExamMessage(4).then(function (data) {
        $scope.messages = data;
    }, function (error) {
    });

    $scope.loaddata = function () {
        //var type = $scope.chart_type;
        $scope.chartConfig.series = [];


    };

    website_message.get().then(function (data) {
        $scope.security_total = 0;
        $scope.weather_total = 0;
        $scope.emergency_total = 0;

        var serial1 = { name: '安保预警类', data: [], color: '#0168B7' };
        var serial2 = { name: '灾害天气类', data: [], color: '#FFBA02' };
        var serial3 = { name: '应急事件类', data: [], color: '#E02423' };

        $scope.chartConfig.series = [];

        $scope.sortdata = $filter('orderBy')(data, 'create_time');
        var month = '';
        var index = 0;
        if ($scope.sortdata.length > 0) {
            $scope.chartConfig.xAxis = { categories: [] };
            month = $filter('date')($scope.sortdata[0].create_time, 'yyyyMM');
            serial1.data[0] = 0;
            serial2.data[0] = 0;
            serial3.data[0] = 0;
            $scope.chartConfig.xAxis.categories.push(month);
        }
        angular.forEach($scope.sortdata, function (item, i) {
            var curmonth = $filter('date')(item.create_time, 'yyyyMM');
            if (curmonth != month) {
                $scope.chartConfig.xAxis.categories.push(curmonth);
                index++;
                serial1.data[index] = 0;
                serial2.data[index] = 0;
                serial3.data[index] = 0;
                month = curmonth;
            }

            if (item.category_type == 1) {
                $scope.security_total++;
                serial1.data[index]++;
            }
            else if (item.category_type == 2) {
                $scope.weather_total++;
                serial2.data[index]++;
            }
            else if (item.category_type == 3) {
                $scope.emergency_total++;
                serial3.data[index]++;
            }
        });

        $scope.chartConfig.series.push(serial1);
        $scope.chartConfig.series.push(serial2);
        $scope.chartConfig.series.push(serial3);

        //angular.forEach($scope.events, function (item, i) {
        //    if (item.type == $scope.chart_type) {

        //        $scope.chartConfig.xAxis = { categories: [] };
        //        var serial1 = { name: '安保预警类', data: [] };
        //        var serial2 = { name: '灾害天气类', data: [] };
        //        var serial3 = { name: '应急事件类', data: [] };
        //        for (var i = 0; i < item.months.length; ++i) {
        //            serial1.data.push(item.months[i].total);
        //            serial2.data.push(item.months[i].send);
        //            serial3.data.push(item.months[i].passed);
        //            //serial4.data.push(item.months[i].unpassed);

        //            $scope.chartConfig.xAxis.categories.push(item.months[i].date);
        //        }
        //        $scope.chartConfig.series.push(serial1);
        //        $scope.chartConfig.series.push(serial2);
        //        $scope.chartConfig.series.push(serial3);
        //        //$scope.chartConfig.series.push(serial4);
        //    }
        //});
    }, function (error) {
    });

    //PublicSentiment.GetEventStatics().then(function (data) {
    //    $scope.events = data;

    //    angular.forEach($scope.events, function (item, i) {
    //        if (item.type == $scope.chart_type) {
    //            $scope.security_total = item.event_total;

    //            $scope.chartConfig.xAxis = { categories: [] };
    //            var serial1 = { name: '安保预警类', data: [] };
    //            var serial2 = { name: '灾害天气类', data: [] };
    //            var serial3 = { name: '应急事件类', data: [] };
    //            for (var i = 0; i < item.months.length; ++i) {
    //                serial1.data.push(item.months[i].total);
    //                serial2.data.push(item.months[i].send);
    //                serial3.data.push(item.months[i].passed);
    //                //serial4.data.push(item.months[i].unpassed);

    //                $scope.chartConfig.xAxis.categories.push(item.months[i].date);
    //            }
    //            $scope.chartConfig.series.push(serial1);
    //            $scope.chartConfig.series.push(serial2);
    //            $scope.chartConfig.series.push(serial3);
    //            //$scope.chartConfig.series.push(serial4);
    //        }
    //    });

    //    //$scope.loaddata();
    //}, function (error) {
    //});

    PublicSentiment.GetSecurityEvent(4).then(function (data) {
        $scope.pub_list = data;

        //$scope.type_select();
    }, function (error) {
    });

    $scope.disaster_list = [];
    PublicSentiment.GetDisasterEvent(4).then(function (data) {
        $scope.disaster_list = data;

        //$scope.type_select();
    }, function (error) {
    });


    $scope.chartConfig = {
        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.

            lang: {
                printChart: $filter('T')('printchart'),
                downloadJPEG: $filter('T')('downloadJPEG'),
                downloadPDF: $filter('T')('downloadPDF'),
                downloadPNG: $filter('T')('downloadPNG'),
                downloadSVG: $filter('T')('downloadSVG'),
                exportButtonTitle: $filter('T')('exportButtonTitle')
            },
            chart: {
                type: 'column'
            },
            tooltip: {
                style: {
                    padding: 10,
                    fontWeight: 'bold'
                }
            }
        },
        //chart: {
        //    type: 'column'
        //},
        title: {
            text: '舆情信息统计分析图'
        },
        subtitle: {
            text: '中海石油国际有限公司应急管理信息系统'
        },
        //xAxis: {
        //    categories: [
        //        'Jan',
        //        'Feb',
        //        'Mar',
        //        'Apr',
        //        'May',
        //        'Jun',
        //        'Jul',
        //        'Aug',
        //        'Sep',
        //        'Oct',
        //        'Nov',
        //        'Dec'
        //    ],
        //    crosshair: true
        //},
        yAxis: {
            min: 0,
            title: {
                text: "<s:text name='number' />"
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        //series: [{
        //    name: 'Tokyo',
        //    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        //}, {
        //    name: 'New York',
        //    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        //}, {
        //    name: 'London',
        //    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        //}, {
        //    name: 'Berlin',
        //    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        //}]
    };

    $scope.chartConfig2 = {
        chart: {
            type: 'column'
        },
        title: {
            text: "舆情统计折线图"
        },
        subtitle: {
            text: "中海石油国际有限公司应急管理信息系统"
        },
        //xAxis: {
        //    categories: $scope.lbls
        // },
        // xAxis: {
        //    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        // 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']//设置x轴的标题
        // },
        yAxis: {
            title: {
                text: "<s:text name='number' />"
            },
            labels: {
                formatter: function () {
                    return this.value
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        //series: $scope.nodes
        //series: [{
        //    name: 'Tokyo', //每条线的名称
        //    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]//每条线的数据
        //}, {
        //    name: 'New York',
        //    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        //}, {
        //    name: 'Berlin',
        //    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        //}, {
        //    name: 'London',
        //    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        //}]
    };

    highchartsNG.ready(function () {
        // init chart config, see lazyload example
    }, this);

});

curApp.controller('pubtypeCtrl', function ($scope, $cookies, $http, $stateParams, $filter, SecurityEvent, Citydisaster, PublicSentiment, DTOptionsBuilder) {
    $scope.checkAll = false;
    $scope.itemsByPage = 8;//每一页显示数量
    //$scope.msgs = JSON.parse('@Html.Raw(Json.Encode(Model))');
    $scope.security_msgs = [];
    $scope.disaster_msgs = [];
    $scope.emergy_msgs = [];
    //$scope.activeindex = 0;
    // $scope.tabindex = 1;

    $scope.activeindex = $stateParams.type;



    $scope.getcontenttype = function () {
        if ($scope.activeindex == '0')
            return $filter("T")("安保预警");
        else if ($scope.activeindex == '1')
            return $filter("T")("灾害天气");
        else if ($scope.activeindex == '2')
            return $filter("T")("应急事件");
    };

    $scope.contenttype = $scope.getcontenttype();


    $scope.activetab = function (index) {
        $scope.activeindex = index;
    };

    //$scope.activeindex=$scope.type;

    $scope.changeto = function () {
        var ii = $scope.activeindex;
    };

    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ordering', false);

    $scope.getCityName = function (cityid) {
        var area = "";
        angular.forEach($scope.allcities, function (data) {
            if (data.city_id == cityid) {
                area = data.name;
            }
        })
        return area;
    };

    // $scope.loadcities();

    $scope.writemessage = function (item) {
        var obj = {
            content: escape(item.content),
            title: escape(item.title),
            category_type: 1,
            type: 2,
            top: 0,
            is_return: 0,
        };
        obj.content = escape(item.content);
        //$cookies.put("websitemessage", obj);
        $cookies.putObject("websitemessage", obj, { path: '/' });
        //$cookieStore.put("persion", {
        //     name: "my name",
        //    age: 18
        // });
        // window.location.href = '@Url.Action("Write")';
    };

    $scope.load = function () {
        if ($scope.activeindex == '0') {
            PublicSentiment.GetSecurityEvent(-1).then(function (data) {
                $scope.msgs = $filter('orderBy')(data, '-event_date');
            }, function (error) {
            });
        }
        else if ($scope.activeindex == '1') {
            Citydisaster.get().then(function (data) {
                $scope.msgs = data;
                angular.forEach($scope.msgs, function (item, index) {
                    item.event_date = $filter('date')(item.time, 'yyyyMMdd');
                });
            }, function (error) {
            });
        }
        else if ($scope.activeindex == '2') {

        }
    };
    $scope.load();
});

curApp.controller('institutionalCtrl', function ($scope, $http, $filter, organiztion, organiztion_user, operator) {
    $scope.treeDatas = [];
    $scope.group_tree = {};
    $scope.lang = 'zh-cn';
    organiztion.getorganiztion().then(function (dt) {
        $scope.treeDatas = [];
        $.each(dt, function (i, item) {
            if (item.parent_id == -1) {
                var obj = {
                    id: item.organiztion_id,
                    label: $scope.lang == 'zh-cn' ? item.organiztion_name : item.organiztion_name_en,
                    sort: item.sort,
                    expanded: true,
                    children: $scope.initChildrenData(dt, item.organiztion_id)
                };
                $scope.treeDatas.push(obj);
                return false;
            }
        });
        //$scope.group_tree.expand_all();
    }, function (status) { });
    $scope.initChildrenData = function (array, parentid) {
        var ary = [];
        $.each(array, function (i, item) {
            if (item.parent_id == parentid)
                ary.push({
                    id: item.organiztion_id,
                    label: $scope.lang == 'zh-cn' ? item.organiztion_name : item.organiztion_name_en,
                    sort: item.sort,
                    expanded: true,
                    children: $scope.initChildrenData(array, item.organiztion_id)
                });
        });
        ary = ary.sort(function (a, b) { return a.sort - b.sort; });
        return ary;
    };


    $scope.getUser = function (userid) {
        var user = null;
        angular.forEach($scope.allusers, function (item, index) {
            if (item.user_id == userid) {
                user = item;
                return;
            }
        })
        return user;
    };

    $scope.vm = {};

    $scope.insName = '国际公司';
    $scope.my_tree_handler = function (branch) {
        var url = 'apis/api/Organiztion/' + branch.id;
        $http.get(url).success(function (dt) {
            $scope.vm = dt;
            // $scope.insName = dt.organiztion_name;
            // $scope.insDetail = dt.intro;
            // $scope.insEmail = dt.email;
            //  $scope.insPhone = dt.phone;
            // $scope.insFaxe = dt.faxes;
            // $scope.insAddress = dt.address_en;
        });

        $scope.users = [];
        angular.forEach($scope.orgs, function (item, index) {
            if (item.organiztion_id == branch.id) {
                $scope.cur_organiztion = item;
                return;
            }
        });
        angular.forEach($scope.org_users, function (item, index) {
            if (item.organiztion_id == branch.id) {

                var user = $scope.getUser(item.user_id);
                if (user) {
                    $scope.users.push(user);
                }
                //$scope.userids.push(item);
            }
        });
    };

    operator.get().then(function (data) {
        $scope.allusers = data;
    });

    organiztion_user.get().then(function (data) {
        $scope.org_users = data;
    }, function (error) {
    });
});

curApp.controller('communicationCtrl', function ($scope, $http, $filter, messageGroup, organiztion, organiztion_user, operator) {

    $scope.itemsByPage = 15;
    $scope.lang = '@lang';
    $scope.org_tree = {};
    //$scope.users = [];
    organiztion_user.get().then(function (data) { //获取所有群组用户分类表
        $scope.groupUsers = data;
        console.log($scope.groupUsers[0]);
    });

    operator.get().then(function (data) {//获取所有用户列表
        // $scope.users = data;
        //console.log($scope.users[0]);
    });


    organiztion.getorganiztion().then(function (comData) {      //获取所有群组信息表
        // $scope.treeDatas = $scope.formatDatas(comData);
    }, function (status) {
    })
    $scope.group_tree = {};
    $scope.comData = [];
    $scope.treeDatas = [];

    $scope.getOrganiztion = function (user_id) {
        var name = "";
        for (var i = 0; i < $scope.org_users.length; ++i) {
            if ($scope.org_users[i].user_id == user_id) {
                for (var j = 0; j < $scope.orgs.length; ++j) {
                    if ($scope.orgs[j].organiztion_id == $scope.org_users[i].organiztion_id) {
                        name = $scope.orgs[j].organiztion_name;
                        break;
                    }
                }
                break;
            }
        }
        return name;
    };
    //获取数据源
    $scope.load = function () {
        $scope.organiztions = [];
        // $http.get('@Url.Action("Organiztions","SystemMgr")').success(function (dt) {
        //     $scope.srcDatas = dt;
        //     $.each(dt, function (i, item) {
        //         if (item.parent_id == -1) {
        //             var obj = {
        //                 id: item.organiztion_id,
        //                 label: $scope.lang == 'zh-cn' ? item.organiztion_name : item.organiztion_name_en,
        //                 sort: item.sort,
        //                 children: $scope.initChildrenData(dt, item.organiztion_id)
        //             };
        //             $scope.organiztions.push(obj);
        //             return false;
        //         }
        //     });
        //     $scope.org_tree.expand_all();
        // });
    };
    $scope.load();
    $scope.initChildrenData = function (array, parentid) {
        var ary = [];
        $.each(array, function (i, item) {
            if (item.parent_id == parentid)
                ary.push({
                    id: item.organiztion_id,
                    label: $scope.lang == 'zh-cn' ? item.organiztion_name : item.organiztion_name_en,
                    sort: item.sort,
                    children: $scope.initChildrenData(array, item.organiztion_id)
                });
        });
        ary = ary.sort(function (a, b) { return a.sort - b.sort; });
        return ary;
    };
    $scope.tree_click_handler = function (item) {
        $scope.orgID = item.id;
        $http.post('@Url.Action("OrganiztionUsers", "SystemMgr")', { id: item.id }).success(function (dt) {
            $scope.users = dt;
        });
    };
    $scope.selectAll = false;
    $scope.checkAllSelected = function () {
        $scope.selectAll = !$scope.selectAll;
        angular.forEach($scope.displayedCollection, function (item, i) {
            $.each($scope.setting, function (i, item1) {
                if (item1.user_id == item.user_id) {
                    item1.select = $scope.selectAll;
                    return false;
                }
            });
        });
    };
    //排序
    $scope.sort = function (id, sort) {
        $http.post('@Url.Action("SortOrganiztionUsers")', { id: id, gid: $scope.orgID, sort: sort }).success(function (dt) {
            if (dt.errCode == 1) {
                $http.post('@Url.Action("OrganiztionUsers")', { id: $scope.orgID }).success(function (dt) {
                    $scope.users = dt;
                });
            } else layer.msg(dt.msg);
        });
    };
});

curApp.controller('messagegroupCtrl', function ($scope, $http, $filter, messageGroup, operator) {

    messageGroup.groupUserIDs().then(function (data) {//获取所有群组用户分类表
        $scope.groupUsers = data;
    });

    operator.get().then(function (data) {//获取所有用户列表
        $scope.users = data;
    }, function (status) {

    });

    messageGroup.groups().then(function (insDatas) {//获取所有群组信息表(ok)
        $scope.treeDatas = $scope.formatDatas(insDatas);
    }, function (status) {
    });

    //$scope.groups = JSON.parse('@Html.Raw(Json.Encode(Model))');
    $scope.group_tree = {};
    $scope.insDatas = [];

    $scope.formatDatas = function (data) {
        var tree = [];
        for (var i = 0; i < data.length; i++) {
            tree.push({ label: data[i].data_name, id: data[i].data_id });
        }
        return tree;
    }

    $scope.treeDatas = [];


    $scope.my_tree_handler = function (branch) {//群组点击时得到对应的所有用户信息列表
        var dataid = branch.id;//群组id
        var ary = [];
        //获取该群组下所有user id list
        angular.forEach($scope.groupUsers, function (item, i) {
            if (item.data_id == dataid)
                ary.push(item);
            // console.log(item);
        });
        //根据sort 排序
        ary = ary.sort(function (a, b) {
            return a.sort - b.sort;
        });
        //根据user id list获取user infos list (一个只有id的列表去对应所有信息表需要做两个循环来判断)
        $scope.showUsers = [];
        $.each(ary, function (i, item1) {
            $.each($scope.users, function (j, item2) {
                if (item1.user_id == item2.user_id) {
                    item2.group_sort = item1.sort;
                    $scope.showUsers.push(item2);
                    return false;
                }
            });
        });
        //$scope.showUsers=$filter('order')($scope.sho)
    };

});

curApp.controller('exammessageCtrl', function ($scope, $http, $filter, $state, website_message, WebMessageEx) {
    $scope.checkAll = false;
    $scope.itemsByPage = 17;//每一页显示数量
    $scope.msgs = [];
    $scope.filtermsgs = [];
    $scope.status_select = "0";
    //$scope.useStatus = 0;

    $scope.loaddata = function () {
        WebMessageEx.GetExamMessages().then(function (data) {
            $scope.msgs = data;
            $scope.filterData();
        }, function (error) {
        })
    };

    //$scope.init = function () {

    //};

    $scope.loaddata();
    ;

    $scope.filterData = function () {
        $scope.filtermsgs = [];
        angular.forEach($scope.msgs, function (item, i) {
            if (item.status == $scope.status_select) {
                $scope.filtermsgs.push(item);
            }
        });
    };

    $scope.status_change = function () {
        $scope.filterData();
    };


    $scope.type_select = "2";

    $scope.getCate = function (type) {
        if (type == 1)
            return $filter("T")("安保预警");
        else if (type == 2)
            return $filter("T")("灾害天气");
        else if (type == 3)
            return $filter("T")("应急事件");
        return "";
    };

    $scope.getType = function (type) {
        var t = "";
        if (type == 0)
            t = $filter("T")("短信")//'@Html.GetLangbyKey("message")';
        else if (type == 1)
            t = $filter("T")("电子邮件")//'@Html.GetLangbyKey("email")';
        else if (type == 2)
            t = $filter("T")("短信&电子邮件")// '@Html.GetLangbyKey("message")&@Html.GetLangbyKey("email")';
        return t;
    };

    $scope.getStatus = function (type) {
        var t = "";
        if (type == 0)
            t = $filter("T")("审核中")//'@Html.GetLangbyKey("pendingAudit")';
        else if (type == 1)
            t = $filter("T")("审核通过")//'@Html.GetLangbyKey("auditPass")';
        else if (type == 2)
            t = $filter("T")("审核未通过")//'@Html.GetLangbyKey("auditNotPass")';
        return t;
    };

    $scope.passmsg = function (id) {
        WebMessageEx.GetPassMessage(id).then(function (data) {
            for (var i = 0; i < $scope.msgs.length; ++i) {
                if ($scope.msgs[i].website_message_id == data.website_message_id) {
                    $scope.msgs[i].status = data.status;
                }
            }
            $scope.filterData();
        }, function (error) {
        });
        //website_message.update(id,)
        //WebMessageEx.GetMessageDataByMessageId(id).then(function (data) {
        //    var obj = data;
        //    obj.status = 1;

        //    website_message_data.update(obj.data_id, obj).then(function (data) {
        //        //刷新页面
        //        for (var i = 0; i < $scope.msgs.length; ++i) {
        //            if ($scope.msgs[i].website_message_id == id) {
        //                $scope.msgs[i].status = 1;
        //            }
        //        }
        //        $scope.filterData();

        //        //发送邮件
        //        WebMessageEx.GetSendMessage(obj.website_message_id).then(function (data) {
        //        }, function (error) {
        //        });
        //    }, function (error) {
        //    });
        //}, function (error) {
        //});
    };

    $scope.sumbit = function () {
        $scope.AddUserPost();
    };



    $scope.unpassmsg = function (id) {
        $scope.unpassid = id;
        var index = layer.open({
            type: 1,
            content: $('#addDiv'),
            title: '请输入拒绝理由',
            area: ['500px', '500px'],
            maxmin: false
        });
        layer.full(index);
    };

    $scope.AddUserPost = function () {
        //WebMessageEx.GetMessageDataByMessageId($scope.unpassid).then(function (data) {
        //    var obj = data;
        //    obj.status = 2;
        //    obj.refuse_reason = $scope.formdata.refuse_reason;
        //    website_message_data.update(obj.data_id, obj).then(function (data) {
        //        for (var i = 0; i < $scope.msgs.length; ++i) {
        //            if ($scope.msgs[i].website_message_id == id) {
        //                $scope.msgs[i].status = 2;
        //            }
        //        }
        //        $scope.filterData();

        //    }, function (error) {
        //    });
        //}, function (error) {
        //});
        WebMessageEx.GetUnPassMessage($scope.unpassid, $scope.formdata.refuse_reason).then(function (data) {
            for (var i = 0; i < $scope.msgs.length; ++i) {
                if ($scope.msgs[i].website_message_id == data.website_message_id) {
                    $scope.msgs[i].status = data.status;
                }
            }
            $scope.filterData();
        }, function (error) {
        });
        layer.closeAll();
    };

    $scope.viewdetail = function (id) {
        //window.location.href = '@Url.Action("ViewMessageDetail")' + "/" + id;
        $state.go('app.viewmessagedetail', { id: id });
    }
});

curApp.controller('inboxCtrl', function ($scope, $filter, $http, website_message, WebMessageEx, filterFilter, website_message_receiver) {
    $scope.checkAll = false;
    $scope.itemsByPage = 10;//每一页显示数量
    $scope.type_select = "2";
    $scope.count = 0;
    $scope.tops = [];
    $scope.untops = [];
    $scope.allmessages = [];
    $scope.messages = [];
    $scope.cate_select = 0;

    //$scope.user = window.sessionStorage.getItem("user");
    $scope.user_id = '';

    $scope.topFunc = function (e) {
        return e.top == 1;
    };

    $scope.untopFunc = function (e) {
        return e.top == 0;
    };

    WebMessageEx.GetInboxMsg($scope.user_id).then(function (data) {
        $scope.allmessages = data;
        var now = new Date();
        angular.forEach($scope.allmessages, function (item, i) {
            var dt = new Date(item.invalid_time);
            if (dt < now) {
                item.is_invalid = true;
            }
            else
                item.is_invalid = false;
        });
        //$scope.loadwebsitedata();
        $scope.filterData();
    }, function (error) {
    });


    //$scope.loadwebsitedata = function () {
    //    website_message_data.get().then(function (data) {
    //        $scope.messages_date = data;
    //        angular.forEach($scope.messages_date, function (item, i) {
    //            for (var index = 0; index < $scope.messages.length; index++) {
    //                if ($scope.messages[index].website_message_id == item.website_message_id) {
    //                    $scope.messages[index].status = item.status;
    //                    break;
    //                }
    //            }
    //        });
    //    }, function (error) {
    //    });
    //};


    $scope.getCate = function (type) {
        if (type == 1)
            return '@Html.GetLangbyKey("security")';
        else if (type == 2)
            return '@Html.GetLangbyKey("disaster")';
        else if (type == 3)
            return '@Html.GetLangbyKey("emergency")';
        return "";
    };

    $scope.replay = function (item) {
        var obj = {
            content: "",
            type: 1,
        };
        obj.category_type = item.category_type;
        obj.receiver_name = item.sender_name;
        obj.reply_message_id = item.website_message_id;
        //angular.copy($scope.formdata, obj);
        //obj.content = "";
        obj.title = escape("Re:" + item.title);
        // obj.type = 1;

        //obj.sms_content = escape($scope.formdata.sms_content);
        //obj.content = escape(item.content);
        //$cookies.put("websitemessage", obj, { path: '/' });
        $cookies.putObject("websitemessage", obj, { path: '/' });
        //$cookieStore.put("persion", {
        //     name: "my name",
        //    age: 18
        // });
        window.location.href = '@Url.Action("Write")';
    };

    $scope.getType = function (type) {
        var t = "";
        if (type == 0)
            t = '@Html.GetLangbyKey("message")';
        else if (type == 1)
            t = '@Html.GetLangbyKey("email")';
        else if (type == 2)
            t = '@Html.GetLangbyKey("message")&@Html.GetLangbyKey("email")';
        return t;
    };

    $scope.getStatus = function (type) {
        var t = "";
        if (type == 0)
            t = '@Html.GetLangbyKey("unread")';
        else if (type == 1)
            t = '@Html.GetLangbyKey("read")';
        return t;
    };

    //$scope.passmsg = function (id) {
    //    //website_message.update(id,)
    //    WebMessageEx.GetMessageDataByMessageId(id).then(function (data) {
    //        var obj = data;
    //        obj.status = 1;

    //        website_message_data.update(obj.data_id, obj).then(function (data) {
    //            //刷新页面
    //            for (var i = 0; i < $scope.msgs.length; ++i) {
    //                if ($scope.msgs[i].id == id) {
    //                    $scope.msgs[i].status = 1;
    //                }
    //            }
    //            //发送邮件
    //            WebMessageEx.GetMessageReceiver(obj.website_message_id, obj.receiver_id).then(function (data) {
    //            }, function (error) {
    //            });
    //        }, function (error) {
    //        });
    //    }, function (error) {
    //    });
    //};

    $scope.sumbit = function () {
        $scope.AddUserPost();
    };

    $scope.filterData = function () {
        if ($scope.cate_select == 0) {
            $scope.messages = [];
            angular.copy($scope.allmessages, $scope.messages);
        }
        else {
            $scope.messages = filterFilter($scope.allmessages, { category_type: $scope.cate_select });
        }
        //$scope.messages = filterFilter($scope.allmessages,);
        $scope.count = $scope.messages.length;
        $scope.tops = filterFilter($scope.messages, { top: 1 });
        $scope.untops = filterFilter($scope.messages, { top: 0 });
        //for (var i = 0; i < $scope.msgs.length; ++i) {
        //    if ($scope.msgs[i].type == $scope.type_select) {
        //        $scope.filtermsgs.push($scope.msgs[i]);
        //    }
        //}
    };

    $scope.filterData();

    //$scope.unpassmsg = function (id) {
    //    $scope.unpassid = id;
    //    var index = layer.open({
    //        type: 1,
    //        content: $('#addDiv'),
    //        title: '请输入拒绝理由',
    //        area: ['500px', '500px'],
    //        maxmin: false
    //    });
    //    layer.full(index);
    //};

    //$scope.AddUserPost = function () {
    //    WebMessageEx.GetMessageDataByMessageId($scope.unpassid).then(function (data) {
    //        var obj = data;
    //        obj.status = 2;
    //        obj.refuse_reason = $scope.formdata.refuse_reason;
    //        website_message_data.update(obj.data_id, obj).then(function (data) {
    //            for (var i = 0; i < $scope.msgs.length; ++i) {
    //                if ($scope.msgs[i].id == id) {
    //                    $scope.msgs[i].status = 2;
    //                }
    //            }
    //        }, function (error) {
    //        });
    //    }, function (error) {
    //    });
    //    layer.closeAll();
    //};

    $scope.viewdetail = function (id, msg_id) {

        website_message_receiver.getdetail(id).then(function (data) {
            data.isread = 1;
            website_message_receiver.update(id, data).then(function (data) {
                window.location.href = '@Url.Action("ViewMessageDetail")' + "/" + msg_id;
            }, function (error) {
            });
        }, function (error) {
        });

    }
});

curApp.controller('outboxCtrl', function ($scope, $http, $filter, $state, website_message, WebMessageEx, permissions) {
    // $scope.checkAll = false;
    // $scope.itemsByPage = 14;//每一页显示数量
    // $scope.msgs = JSON.parse('@Html.Raw(Json.Encode(Model))');
    $scope.type_select = "2";

    $scope.cate_select = "-1";
    $scope.status_select = "-1";
    $scope.messages = [];

    $scope.user_id = localStorage.userid;

    $scope.loaddata = function () {

        WebMessageEx.GetOutboxMsg($scope.user_id).then(function (data) {
            $scope.messages = data;
        }, function (error) {
        });
    };

    $scope.getemailcount = function (item) {
        var strs = new Array();
        //strs = $scope.formdata.sms_receiver.split(';');
        //$scope.sms_receiver_count = strs.length;
        return strs.length;
    };

    $scope.getsmscount = function (item) {
        var strs = new Array();
        strs = item.sms_receiver.split(';');
        return strs.length;
    };

    // WebMessageEx.GetOutboxMsg($scope.user_id).then(function (data) {
    //     $scope.messages = data;
    // }, function (error) {
    // });

    $scope.getCate = function (type) {
        if (type == 1)
            return $filter('T')("安保预警");//'@Html.GetLangbyKey("security")';
        else if (type == 2)
            return $filter('T')("灾害天气");//'@Html.GetLangbyKey("disaster")';
        else if (type == 3)
            return $filter('T')("应急事件"); //'@Html.GetLangbyKey("emergency")';
        return "";
    };

    $scope.getType = function (type) {
        var t = "";
        if (type == 0)
            t = $filter('T')("短信");//'@Html.GetLangbyKey("message")';
        else if (type == 1)
            t = $filter('T')("电子邮件");//'@Html.GetLangbyKey("email")';
        else if (type == 2)
            t = $filter('T')("短信&电子邮件");//'@Html.GetLangbyKey("message")&@Html.GetLangbyKey("email")';
        return t;
    };

    $scope.getStatus = function (type) {
        var t = "";
        if (type == 0)
            t = $filter('T')("审核中");// '@Html.GetLangbyKey("auditing")';
        else if (type == 1)
            t = $filter('T')("发送成功");//'@Html.GetLangbyKey("sendSuccess")';
        else if (type == 2)
            t = $filter('T')("发送失败");//'@Html.GetLangbyKey("sendDefeat")';
        return t;
    };

    $scope.filterData = function () {
        $scope.filtermsgs = [];
        //for (var i = 0; i < $scope.msgs.length; ++i) {
        //    if ($scope.msgs[i].type == $scope.type_select) {
        //        $scope.filtermsgs.push($scope.msgs[i]);
        //    }
        //}
    };

    $scope.loaddata();



    $scope.delete = function (id) {
        website_message.delete(id).then(function (data) {
            $scope.loaddata();
            //layer.msg('邮件已删除', { icon: 1, time: 1000 });
            //$timeout(caloutbox,1500);

        }, function (error) {
            //layer.msg(error, { icon: 1, time: 1000 });
        });;
    }

    $scope.viewdetail = function (id) {
        // window.location.href = '@Url.Action("ViewMessageDetail")' + "/" + id;
        $state.go("app.viewmessagedetail", { id: id });
    }
});

curApp.controller('inboxCtl', function ($scope, $http, $filter, $state, website_message, WebMessageEx, permissions, smsreceive) {
    $scope.checkAll = false;
    $scope.itemsByPage = 14;//每一页显示数量
    // $scope.msgs = JSON.parse('@Html.Raw(Json.Encode(Model))');
    $scope.type_select = "2";

    $scope.cate_select = "-1";
    $scope.status_select = "-1";
    $scope.messages = [];

    $scope.user_id = localStorage.userid;

    $scope.messages = []
    smsreceive.get().then(function (data) {
        $scope.messages = data;
    });

});

curApp.controller('viewmessageCtrl', function ($scope, $http, $filter, $cookies, $cookieStore, $stateParams, organiztion, operator, messageGroup, organiztion_user, messagegroup_user, website_message, WebMessageEx) {

    $scope.info = {
        description: ''
    };

    $scope.reply = function (id) {
        var obj = {
            content: "",
            type: 1,
        };
        obj.category_type = $scope.formdata.category_type;
        obj.receiver_name = $scope.formdata.sender_name;
        obj.reply_id = $scope.formdata.sender;
        //angular.copy($scope.formdata, obj);
        //obj.content = "";
        obj.title = escape("Re:" + $scope.formdata.title);
        obj.reply_message_id = $scope.formdata.website_message_id;
        // obj.type = 1;

        //obj.sms_content = escape($scope.formdata.sms_content);
        //obj.content = escape(item.content);
        //$cookies.put("websitemessage", obj, { path: '/' });
        $cookies.putObject("websitemessage", obj, { path: '/' });
        //$cookieStore.put("persion", {
        //     name: "my name",
        //    age: 18
        // });
        window.location.href = '@Url.Action("Write")';
    };

    $scope.forward = function (id) {
        var obj = {};
        angular.copy($scope.formdata, obj);
        obj.content = escape($scope.formdata.content);
        obj.title = escape($scope.formdata.title);
        obj.sms_content = escape($scope.formdata.sms_content);

        // $cookieStore.put("websitemessage", obj);
        $cookies.putObject("websitemessage", obj, { path: '/' });
        //window.location.href = '@Url.Action("Write")';
    };

    $scope.delete = function (id) {
    };

    $scope.getType = function (type) {
        var t = "";
        if (type == 0)
            t = $filter('T')("短信");//'@Html.GetLangbyKey("message")';
        else if (type == 1)
            t = $filter('T')("电子邮件");//'@Html.GetLangbyKey("email")';
        else if (type == 2)
            t = $filter('T')("短信&电子邮件");//'@Html.GetLangbyKey("message")&@Html.GetLangbyKey("email")';
        return t;
    };

    $scope.getCate = function (type) {
        if (type == 1)
            return $filter('T')("安保预警");//'@Html.GetLangbyKey("security")';
        else if (type == 2)
            return $filter('T')("灾害天气");//'@Html.GetLangbyKey("disaster")';
        else if (type == 3)
            return $filter('T')("应急事件");//'@Html.GetLangbyKey("emergency")';
        return "";
    };

    $scope.hasEmail = true;
    $scope.hasSMS = true;

    $scope.init = function () {

        // $scope.treeInstanceCompany = {};
        //$scope.treeInstanceGroup = {};
        $scope.id = $stateParams.id;

        WebMessageEx.GetDetailMsg($scope.id).then(function (data) {
            $scope.formdata = data;
            if (data.type == 1)
                $scope.hasSMS = false;
            if (data.type == 0)
                $scope.hasEmail = false;
            // $scope.users = datas;
            // AddorganiztionToUser();
            //AddMessagegroupToUser();
        }, function (error) {
        })

        function AddorganiztionToUser() {
            organiztion_user.get().then(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < $scope.users.length; ++j) {
                        if ($scope.users[j].user_id == data[i].user_id) {
                            $scope.users[j].organiztion_id = data[i].organiztion_id;
                            break;
                        }
                    }
                }
                angular.forEach($scope.users, function (item, i) {
                    if (item.organiztion_id != null) {
                        $scope.jsTreeDataCompany.push({ 'id': item.user_id, 'parent': item.organiztion_id, 'type': 'person', 'text': item.real_name });
                    }
                });

                $scope.treeConfigCompany.version++;
            }, function (error) {
            });
        }

        function AddMessagegroupToUser() {
            messagegroup_user.get().then(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < $scope.users.length; ++j) {
                        if ($scope.users[j].user_id == data[i].user_id) {
                            $scope.users[j].data_id = data[i].data_id;
                            break;
                        }
                    }
                }
                angular.forEach($scope.users, function (item, i) {
                    if (item.data_id != null) {
                        $scope.jsTreeDataGroup.push({ 'id': item.user_id, 'parent': item.data_id, 'type': 'person', 'text': item.real_name });
                    }
                });
                $scope.treeConfigGroup.version++;
            }, function (error) {
            });
        }

        organiztion.getorganiztion().then(function (insDatas) {
            //$scope.treeDatas = $scope.formatDatas(insDatas);
            $scope.jsTreeDataCompany = [];
            angular.forEach(insDatas, function (item, i) {
                if (item.parent_id == -1)
                    $scope.jsTreeDataCompany.push({ 'id': item.organiztion_id, 'parent': '#', 'text': item.organiztion_name, 'type': "group", 'level': item.organiztion_level, "state": { "opened": true } });
                else
                    $scope.jsTreeDataCompany.push({ 'id': item.organiztion_id, 'parent': item.parent_id, 'text': item.organiztion_name, 'type': "group", 'level': item.organiztion_level, "state": { "opened": true } });
            });

        }, function (status) {
        })

        messageGroup.groups().then(function (insDatas) {
            //$scope.treeDatas = $scope.formatDatas(insDatas);
            $scope.jsTreeDataGroup = [];
            angular.forEach(insDatas, function (item, i) {
                if (item.parent_data_id == -1)
                    $scope.jsTreeDataGroup.push({ 'id': item.data_id, 'parent': '#', 'text': item.data_name, 'type': "group", 'level': item.data_level, "state": { "opened": true } });
                else
                    $scope.jsTreeDataGroup.push({ 'id': item.data_id, 'parent': item.parent_id, 'text': item.data_name, 'type': "group", 'level': item.data_level, "state": { "opened": true } });
            });
        }, function (status) {
        })
    }

    $scope.init();

});

curApp.controller('writeCtrl', function ($scope, $cookies, $cookieStore, $http, $filter, $timeout, $stateParams, $state, Auth0Store, sendmsg, organiztion, operator, messageGroup, organiztion_user, messagegroup_user, website_message, SmsTemplate, eventorganization, eventorgusers) {
    $scope.template_name = "模板1";
    $scope.jsTreeDataCompany = [];
    $scope.formdata = {
        category_type: "1",
        title: '',
        smscontent: '',
        emailcontent: '',
        top: 0,
        is_return: 0,
        receiver_name: '',
        content: '',
        type: 1
    };
    if ($stateParams.data) {
        $scope.formdata = $stateParams.data;
    }
    //$scope.data = $stateParams.data;

    $scope.chk_istop = $scope.formdata.top > 0;
    $scope.chk_isreceipt = $scope.formdata.is_return > 0;


    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        language: "zh-CN",
        class: 'datepicker'
    };

    $scope.formdata.sms_receiver = '';
    $scope.formdata.email_receiver = '';

    $scope.changesmsreceiver = function () {
        var strs = new Array();
        strs = $scope.formdata.sms_receiver.split(';');
        $scope.sms_receiver_count = strs.length;
    };

    $scope.dt = $filter('date')(new Date(), 'yyyy-MM-dd');
    //$scope.initDate = new Date('2016-05-20');
    //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];

    //$scope.date = '2016-06-09';

    $scope.getType = function () {
        if ($scope.chk_email && $scope.chk_sms)
            return 2;
        else if ($scope.chk_email)
            return 1;
        else if ($scope.chk_sms)
            return 0;
    };

    $scope.setType = function (type) {
        if (type == 0 || type == 2)
            $scope.chk_sms = true;
        else
            $scope.chk_sms = false;

        if (type == 1 || type == 2)
            $scope.chk_email = true;
        else
            $scope.chk_email = false;
    };
    $scope.setType($scope.formdata.type);

    //read from cookie
    //$scope.temp_websitemessage = $cookieStore.get("websitemessage");
    $scope.temp_websitemessage = $cookies.getObject("websitemessage");

    if ($scope.temp_websitemessage != null) {
        $scope.formdata.title = unescape($scope.temp_websitemessage.title);
        $scope.formdata.content = unescape($scope.temp_websitemessage.content);
        $scope.formdata.sms_content = unescape($scope.temp_websitemessage.sms_content);
        $scope.formdata.type = $scope.temp_websitemessage.type;
        $scope.formdata.category_type = $scope.temp_websitemessage.category_type.toString();
        $scope.formdata.top = $scope.temp_websitemessage.top;
        $scope.formdata.is_return = $scope.temp_websitemessage.is_return;
        $scope.formdata.receiver_name = $scope.temp_websitemessage.receiver_name;
        $scope.reply_id = $scope.temp_websitemessage.reply_id;
        $scope.formdata.reply_message_id = $scope.temp_websitemessage.reply_message_id;
        //if($scope.temp_websitemessage.selectuser)
        //    $scope.selectuser =$scope.temp_websitemessage.selectuser;


        $scope.chk_istop = $scope.formdata.top > 0;
        $scope.chk_isreceipt = $scope.formdata.is_return > 0;
        $scope.setType($scope.formdata.type);

        $cookies.remove("websitemessage", { path: '/' });
    }

    $scope.savemsgtempate = function () {
        SmsTemplate.add({ name: $scope.template_name, content: $scope.formdata.sms_content }).then(function (data) {
            $scope.templates.push(data);
        }, function (error) {
        });
    };

    $scope.deletetemplate = function (id) {
        SmsTemplate.delete(id).then(function (data) {
            SmsTemplate.get().then(function (data) {
                $scope.templates = data;
            }, function (error) {
            });
        }, function (error) {
        });
    };

    function caloutbox() {
        $state.go("app.outbox");
    }

    $scope.sendmessage = function () {
        var obj = {};
        angular.copy($scope.formdata, obj);
        obj.website_message_id = $filter('date')(new Date(), 'yyMMddhhmmsss');//"160108170809100005";
        obj.sender = Auth0Store.get('user').user_id;
        obj.sender_name = Auth0Store.get('user').real_name;
        obj.type = $scope.getType();
        obj.send_person_type = true;
        obj.receiver_id = constructDataid($scope.selectuser);
        obj.invalid_time = $filter('date')($scope.dt, 'yyyy-MM-ddThh:mm:ss');
        obj.sender_status = 0;
        obj.status = "0";
        obj.refuse_reason = "";

        website_message.add(obj).then(function (data) {
            $timeout(caloutbox, 1500);
        }, function (error) {
        });
    };

    $scope.init = function () {
        $scope.treeConfigCompany = {
            core: {
                multiple: true,
                animation: true,
                error: function (error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback: true,
                worker: true
            },
            types: {
                default: {
                    icon: 'icon-notebook'
                },
                star: {
                    icon: 'icon-star'
                },
                cloud: {
                    icon: 'fa-cloud'
                }
            },
            version: 1,
            plugins: ['types', 'checkbox']
        };

        $scope.treeConfigGroup = {
            core: {
                multiple: true,
                animation: true,
                error: function (error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback: true,
                worker: true
            },
            types: {
                default: {
                    icon: 'icon-notebook'
                },
                star: {
                    icon: 'icon-star'
                },
                cloud: {
                    icon: 'fa-cloud'
                }
            },
            version: 1,
            plugins: ['types', 'checkbox']
        };

        $scope.treeConfigEm = {
            core: {
                multiple: true,
                animation: true,
                error: function (error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback: true,
                worker: true
            },
            types: {
                default: {
                    icon: 'icon-notebook'
                },
                star: {
                    icon: 'icon-star'
                },
                cloud: {
                    icon: 'fa-cloud'
                }
            },
            version: 1,
            plugins: ['types', 'checkbox']
        };

        $scope.treeInstanceCompany = {};
        $scope.treeInstanceEm = {};
        $scope.checkArray = [];

        $scope.treeEventsObj = {
            'select_node': selectNodeCB,
            'deselect_node': selectNodeCB
        }

        $scope.treeEventsObj2 = {
            'select_node': selectNodeCB2,
            'deselect_node': selectNodeCB2
        }

        $scope.treeEventsObj3 = {
            'select_node': selectNodeCB3,
            'deselect_node': selectNodeCB3
        }


        $scope.users = [];
        $scope.templates = [];
        $scope.selectuser = { orgs: [], groups: [], persons: [] };

        // $scope.treeInstanceCompany = {};
        //$scope.treeInstanceGroup = {};

        operator.get().then(function (datas) {
            $scope.users = datas;
            AddorganiztionToUser();
            AddMessagegroupToUser();
            AddEmgroupToUser();
        }, function (error) {
        })

        SmsTemplate.get().then(function (data) {
            $scope.templates = [];
            $scope.templates = data;
        }, function (error) {
        });

        $scope.isOrgExist = function (id) {
            var ret = false;
            angular.forEach($scope.orgs, function (item, i) {
                if (item.organiztion_id == id) {
                    ret = true;
                }
            });
            return ret;
        }

        $scope.isEmExist = function(id){
            var ret = false;
            for(var i=0;i<$scope.EmGroups.length; ++i){
                if ($scope.EmGroups[i].id == id){
                    ret = true;
                    break;
                }
            }
            return ret;
        }

        $scope.isGroupExist = function (id) {
            var ret = false;
            angular.forEach($scope.msggroups, function (item, i) {
                if (item.data_id == id) {
                    ret = true;
                }
            });
            return ret;
        }

        function AddorganiztionToUser() {
            organiztion_user.get().then(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < $scope.users.length; ++j) {
                        if ($scope.users[j].user_id == data[i].user_id) {
                            $scope.users[j].organiztion_id = data[i].organiztion_id;
                            break;
                        }
                    }
                }

                for (var i = 0; i < $scope.users.length; ++i) {
                    if ($scope.users[i].organiztion_id != null) {
                        if ($scope.isOrgExist($scope.users[i].organiztion_id)) {
                            $scope.jsTreeDataCompany.push({ 'id': $scope.users[i].user_id, 'parent': $scope.users[i].organiztion_id, 'type': 'person', 'text': $scope.users[i].real_name, 'phone': $scope.users[i].phone, 'email': $scope.users[i].email });
                        }
                    }
                }
                angular.forEach($scope.jsTreeDataCompany, function (item, i) {
                    if (item.id == $scope.receiver_id) {
                        item.status = { selected: true };
                        //$scope.treeInstanceCompany.select_branch(item);
                        // $scope.jsTreeDataCompany.push({ 'id': item.user_id, 'parent': item.organiztion_id, 'type': 'person', 'text': item.real_name });
                    }
                });

                $scope.treeConfigCompany.version++;
            }, function (error) {
            });
        }

        function AddMessagegroupToUser() {
            messagegroup_user.get().then(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < $scope.users.length; ++j) {
                        if ($scope.users[j].user_id == data[i].user_id) {
                            $scope.users[j].data_id = data[i].data_id;
                            break;
                        }
                    }
                }
                angular.forEach($scope.users, function (item, i) {
                    if (item.data_id != null && $scope.isGroupExist(item.data_id)) {
                        $scope.jsTreeDataGroup.push({ 'id': item.user_id, 'parent': item.data_id, 'type': 'person', 'text': item.real_name, 'phone': item.phone, 'email': item.email });
                    }
                });
                $scope.treeConfigGroup.version++;
            }, function (error) {
            });
        }

        function AddEmgroupToUser() {
            eventorgusers.get().then(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < $scope.users.length; ++j) {
                        if ($scope.users[j].user_id == data[i].userid) {
                            $scope.users[j].orgid = data[i].orgid;
                            break;
                        }
                    }
                }
                angular.forEach($scope.users, function (item, i) {
                    if (item.orgid != null && $scope.isEmExist(item.orgid)) {
                        $scope.jsTreeDataEm.push({ 'id': item.user_id, 'parent': item.orgid, 'type': 'person', 'text': item.real_name, 'phone': item.phone, 'email': item.email });
                    }
                });
                $scope.treeConfigEm.version++;
            }, function (error) {
            });
        }

        organiztion.getorganiztion().then(function (insDatas) {
            $scope.jsTreeDataCompany = [];
            $scope.orgs = [];
            insDatas = $filter('orderBy')(insDatas, 'sort');
            angular.forEach(insDatas, function (item, i) {
                if (item.parent_id == -1) {
                    $scope.orgs.push(item);
                    $scope.jsTreeDataCompany.push({ 'id': item.organiztion_id, 'parent': '#', 'text': item.organiztion_name, 'type': "group", 'level': item.organiztion_level, "state": { "opened": true } });
                }
                else if (item.parent_id == '2016011801' || item.parent_id == '2016011802' || item.parent_id == '2016011803') {
                    $scope.orgs.push(item);
                    $scope.jsTreeDataCompany.push({ 'id': item.organiztion_id, 'parent': item.parent_id, 'text': item.organiztion_name, 'type': "group", 'level': item.organiztion_level, "state": { "opened": true } });
                }
            });

        }, function (status) {
        })

        messageGroup.groups().then(function (insDatas) {
            //$scope.treeDatas = $scope.formatDatas(insDatas);
            $scope.jsTreeDataGroup = [];
            $scope.msggroups = [];
            angular.forEach(insDatas, function (item, i) {
                if (item.parent_data_id == -1) {
                    $scope.jsTreeDataGroup.push({ 'id': item.data_id, 'parent': '#', 'text': item.data_name, 'type': "group", 'level': item.data_level, "state": { "opened": true } });
                    $scope.msggroups.push(item);
                }
                else {
                    $scope.jsTreeDataGroup.push({ 'id': item.data_id, 'parent': item.parent_id, 'text': item.data_name, 'type': "group", 'level': item.data_level, "state": { "opened": true } });
                }
            });
        }, function (status) {
        });

        eventorganization.get().then(function (data) {
            $scope.EmGroups = data;
            $scope.jsTreeDataEm = [];
            var ary = [];
            angular.forEach(data, function (item, index) {
                if (item.parentid == -1) {
                    ary.push(item);
                }
            });
            ary = ary.sort(function (a, b) { return a.sort - b.sort; });
            angular.forEach(ary, function (item) {
                $scope.jsTreeDataEm.push({
                    'id': item.id,
                    'parent': '#',
                    'text': item.organization,
                    'type': "group",
                    'level': 0,
                    "state": { "opened": true }
                });
                $scope.getOrgTreeDatas(data, item.id, 1);
            });
        });

        $scope.getOrgTreeDatas = function (data, parentid, level) {//查找该父节点下所以的孩子节点
            var ary = [];
            angular.forEach(data, function (item) {
                if (item.parentid == parentid) {
                    ary.push(item);
                }
            });
            ary = ary.sort(function (a, b) {
                return a.sort - b.sort;
            });
            angular.forEach(ary, function (item) {
                $scope.jsTreeDataEm.push({
                    'id': item.id,
                    'parent': item.parentid,
                    'text': item.organization,
                    'level': level,
                    'type': "group",
                    "state": { "opened": true }
                });
                $scope.getOrgTreeDatas(data, item.id, level+1);
            });
        };
    }
    $scope.active = '0';

    $scope.changetab = function (index) {
        $scope.active = index;
    };


    function selectNodeCB(node, selected) {
        //$log.info('ready called');
        $scope.checkArray = $scope.treeInstanceCompany.jstree(true).get_selected();

        $scope.selectuser.orgs = [];
        $scope.selectuser.persons = [];

        var sms_receiver = "";
        var email_receiver = "";
        $scope.sms_receiver_count = 0;
        $scope.email_receiver_count = 0;

        if ($scope.checkArray.length == 0) {
            $scope.$apply();
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataCompany);
            if (obj.type == 'group' && obj.level == 1) {
                $scope.selectuser.orgs.push(obj);
            }
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataCompany);
            if (obj.type == 'person') {
                if (isInGroup(obj, $scope.selectuser.orgs) == false) {
                    $scope.selectuser.persons.push(obj);
                }
                // $scope.alluser.push(obj);
                if (obj.phone != null && obj.phone != "") {
                    if (sms_receiver == "") {
                        sms_receiver += obj.phone;
                    }
                    else {
                        sms_receiver += ";";
                        sms_receiver += obj.phone;
                    }
                    $scope.sms_receiver_count++;
                }

                if (obj.email != null && obj.email != "") {
                    if (email_receiver == "") {
                        email_receiver += obj.email;
                    }
                    else {
                        email_receiver += ";";
                        email_receiver += obj.email;
                    }
                    $scope.email_receiver_count++;
                }
            }
        }
        $scope.formdata.receiver_name = constructReceiver($scope.selectuser);
        //if($scope.chk_sms==true)
        {
            $scope.formdata.sms_receiver = sms_receiver;
            $scope.email_receiver = email_receiver;
        }
        //if ($scope.info.description != '')
        {
            $scope.$apply();
        }

    };

    function selectNodeCB2(node, selected) {
        //$log.info('ready called');
        $scope.checkArray = $scope.treeInstanceGroup.jstree(true).get_selected();

        $scope.selectuser.orgs = [];
        $scope.selectuser.persons = [];

        var sms_receiver = "";
        var email_receiver = "";
        $scope.sms_receiver_count = 0;
        $scope.email_receiver_count = 0;

        if ($scope.checkArray.length == 0) {
            $scope.$apply();
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataGroup);
            if (obj.type == 'group' && obj.level == 1) {
                $scope.selectuser.orgs.push(obj);
            }
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataGroup);
            if (obj.type == 'person') {
                if (isInGroup(obj, $scope.selectuser.orgs) == false) {
                    $scope.selectuser.persons.push(obj);
                }
                // $scope.alluser.push(obj);
                if (obj.phone != null && obj.phone != "") {
                    if (sms_receiver == "") {
                        sms_receiver += obj.phone;
                    }
                    else {
                        sms_receiver += ";";
                        sms_receiver += obj.phone;
                    }
                    $scope.sms_receiver_count++;
                }

                if (obj.email != null && obj.email != "") {
                    if (email_receiver == "") {
                        email_receiver += obj.email;
                    }
                    else {
                        email_receiver += ";";
                        email_receiver += obj.email;
                    }
                    $scope.email_receiver_count++;
                }
            }
        }
        $scope.formdata.receiver_name = constructReceiver($scope.selectuser);
        //if($scope.chk_sms==true)
        {
            $scope.formdata.sms_receiver = sms_receiver;
            $scope.email_receiver = email_receiver;
        }
        //if ($scope.info.description != '')
        {
            $scope.$apply();
        }

    };

    function selectNodeCB3(node, selected) {
        //$log.info('ready called');
        $scope.checkArray = $scope.treeInstanceEm.jstree(true).get_selected();

        $scope.selectuser.orgs = [];
        $scope.selectuser.persons = [];

        var sms_receiver = "";
        var email_receiver = "";
        $scope.sms_receiver_count = 0;
        $scope.email_receiver_count = 0;

        if ($scope.checkArray.length == 0) {
            $scope.$apply();
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataEm);
            if (obj.type == 'group' && obj.level == 1) {
                $scope.selectuser.orgs.push(obj);
            }
        }
        for (var i = 0; i < $scope.checkArray.length; ++i) {
            var obj = getItemObj($scope.checkArray[i], $scope.jsTreeDataEm);
            if (obj.type == 'person') {
                if (isInGroup(obj, $scope.selectuser.orgs) == false) {
                    $scope.selectuser.persons.push(obj);
                }
                // $scope.alluser.push(obj);
                if (obj.phone != null && obj.phone != "") {
                    if (sms_receiver == "") {
                        sms_receiver += obj.phone;
                    }
                    else {
                        sms_receiver += ";";
                        sms_receiver += obj.phone;
                    }
                    $scope.sms_receiver_count++;
                }

                if (obj.email != null && obj.email != "") {
                    if (email_receiver == "") {
                        email_receiver += obj.email;
                    }
                    else {
                        email_receiver += ";";
                        email_receiver += obj.email;
                    }
                    $scope.email_receiver_count++;
                }
            }
        }
        $scope.formdata.receiver_name = constructReceiver($scope.selectuser);
        //if($scope.chk_sms==true)
        {
            $scope.formdata.sms_receiver = sms_receiver;
            $scope.email_receiver = email_receiver;
        }
        //if ($scope.info.description != '')
        {
            $scope.$apply();
        }

    };

    function constructReceiver(selectuser) {
        var content = "";
        for (var i = 0; i < selectuser.orgs.length; ++i) {
            if (content != "") {
                content += ";";
            }
            content += selectuser.orgs[i].text;
        }
        for (var i = 0; i < selectuser.persons.length; ++i) {
            if (content != "") {
                content += ";";
            }
            content += selectuser.persons[i].text;
        }
        return content;
    };

    function constructDataid(selectuser) {
        var obj = { orgs: [], groups: [], persons: [], email_receiver: "" };
        var content = "";
        for (var i = 0; i < selectuser.orgs.length; ++i) {
            obj.orgs.push(selectuser.orgs[i].id);
        }
        for (var i = 0; i < selectuser.groups.length; ++i) {
            obj.groups.push(selectuser.groups[i].id);
        }
        for (var i = 0; i < selectuser.persons.length; ++i) {
            obj.persons.push(selectuser.persons[i].id);
        }
        if ($scope.reply_id) {
            obj.persons.push($scope.reply_id);
        }
        obj.email_receiver = $scope.email_receiver;
        return angular.toJson(obj);
    };

    function isInGroup(per, groups) {
        var ret = false;
        for (var i = 0; i < groups.length; ++i) {
            if (per.parent == groups[i].id) {
                ret = true;
                break;
            }
        }
        return ret;
    };

    function getItemObj(id, datas) {
        for (var i = 0; i < datas.length; ++i) {
            if (datas[i].id == id) {
                return datas[i];
            }
        }
    }

    $scope.updateCheckArray = function () {
        $scope.checkArray = $scope.treeInstance.jstree(true).get_selected();
    }

    $scope.init();
});

curApp.controller('travelwarningCtrl', function ($scope, $http, $filter, $state, Travelwarning) {
    Travelwarning.get().then(function (data) {
        $scope.items = data;
    }, function (error) {

    })

    $scope.add = function () {
        $state.go('app.addtravelwarning');
    };
});

curApp.controller('addTravelwarningCtrl', function ($scope, $state, Travelwarning, SweetAlert) {
    $scope.vm = {
        username: '',
        phone: '',
        passport: '',
        flightnumber: '',
        address: '',
        starttime: moment().toDate(),
        endtime: moment().add(5, 'hours').toDate(),
        warningminute: 30,
        warnphone: '',
        warnmessage: ''
    };

    $scope.changemessage = function () {
        $scope.vm.warnmessage = $scope.vm.username + "(" + $scope.vm.phone + ")" + "乘坐" + $scope.vm.flightnumber + "自" + $scope.vm.address + ";于" + $scope.vm.starttime + "起飞，预计" + $scope.vm.endtime + "到达;" + "已超过" + $scope.vm.warningminute + "分钟未收到乘机人短信。";
    };

    $scope.validateInput = function (name, type) {
        var input = $scope.roleForm[name];
        return input.$invalid;
    };
    $scope.ok = function (evt) {
        if ($scope.roleForm.$invalid) return;
        var obj = angular.copy($scope.vm);
        obj.starttime = moment(obj.starttime).format('YYYY-MM-DD HH:mm:ss');
        obj.endtime = moment(obj.endtime).format('YYYY-MM-DD HH:mm:ss');
        Travelwarning.add(obj).then(function (data) {
            $scope.cancel();
        }, function (status) {
            SweetAlert.swal('错误', '添加出现错误', 'error');
        });
    };
    $scope.cancel = function () {
        $state.go('app.travelwarning');
    };
    $scope.changemessage();
});
