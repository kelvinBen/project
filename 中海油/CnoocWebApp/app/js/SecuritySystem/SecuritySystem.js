/**
 * Created by Administrator on 2016/7/12.
 */
angular.module('app.securitySystem', ['cnooc_service.SecuritySystem', 'cnooc_service',
    'cnooc_service.exevent', 'cnooc_service.export'])
    .filter('countryFormatter', function () {
        return function (input) {
            if (input == null || input == "")
                return "国际公司"
            else
                return input;
        };
    })
    .directive('filestyle', function () {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element) {
            var options = element.data();

            // old usage support
            options.classInput = element.data('classinput') || options.classInput;

            element.filestyle(options);
        }
    })
    .directive('stringHtml', function () {
        return function (scope, el, attr) {
            if (attr.stringHtml) {
                scope.$watch(attr.stringHtml, function (html) {
                    el.html(html || ''); //更新html内容
                });
            }
        };
    })
    .controller('parameterController', function ($rootScope, $scope, $filter, ngDialog, SweetAlert,
        CountryRiskSetting, RiskSetting, countryrisk, FormulaWeight, editableOptions, editableThemes,
        toaster, CountryRiskSetting) {
        editableOptions.theme = 'bs3';
        $scope.parTypes = [];
        $scope.selParType = {};
        $scope.parameters = null;
        $scope.countryPars = null;
        $scope.tableSource = [];
        $scope.securityList = []; //安全风险
        $scope.politicsList = []; //政治风险
        $scope.levelList = []; //海外公司等级
        $scope.selCountry = 1; //current selection country
        $scope.formulas = []; //权重数组
        $scope.updateLevel = function () {
            $scope.levelList;
            angular.forEach($scope.levelList, function (value, key) {
                RiskSetting.update(value.index_id, value).then(function (data) {
                    toaster.pop('success', "Update Parameter", "Success");
                }, function (status) { //更新失败获取新的数据
                    RiskSetting.getdetail(id).then(function (data) {
                        $scope.levelList[key] = data;
                    });
                    toaster.pop('error', "Update Parameter", "Failed");
                });
            });
        };
        countryrisk.get().then(function (cs) { //获取国家
            $scope.countryRisks = [];
            angular.forEach(cs, function (item) {
                if (item.security_id && item.politics_id && item.population) $scope.countryRisks.push(item);
            });
            $scope.init();
        });
        $scope.init = function () { //初始化默认参数
            RiskSetting.get().then(function (data) { //init default parameter datas
                $scope.parameters = data;
                angular.forEach(data, function (value, key) {
                    var type_index = value.type_index;
                    var bAdd = true;
                    for (var i = 0; i < $scope.parTypes.length; ++i) {
                        if ($scope.parTypes[i].type_index == type_index) {
                            bAdd = false;
                            break;
                        }
                    }
                    if (bAdd)
                        $scope.parTypes.push({
                            type_index: type_index,
                            type: value.type,
                            type_en: value.type_en
                        });
                });
                if ($scope.parTypes.length > 0) {
                    $scope.selParType = $scope.parTypes[0].type_index;
                    $scope.queryCountryPar(); //参数类型7，8，9
                }
                //每个国家设置的事件参数
                CountryRiskSetting.get().then(function (cdatas) {
                    $scope.countryPars = cdatas;
                    //获取权重
                    FormulaWeight.get().then(function (fs) {
                        $scope.formulas = fs;
                        $scope.queryCountry();
                    });
                });
            });
        }
        //国家计算权重
        $scope.countryFormula = null;
        $scope.queryFormula = function () {
            $scope.countryFormula = null;
            var defaultFormula = null;
            var countryFormula = null;
            angular.forEach($scope.formulas, function (value, key) {
                if (!value.country_id) {
                    defaultFormula = value;
                } else if (value.country_id == $scope.selCountry) {
                    countryFormula = value;
                }
            });
            if (!countryFormula) { //不存在，调用默认参数设置
                $scope.countryFormula = angular.copy(defaultFormula);
                $scope.countryFormula.flag = false;
                $scope.countryFormula.country_id = $scope.selCountry;
            } else { //已经存在
                $scope.countryFormula = angular.copy(countryFormula);
                $scope.countryFormula.flag = true;
            }
        };
        //更新权重
        $scope.updateFormula = function () {
            if ($scope.countryFormula.flag) { //编辑
                FormulaWeight.update($scope.countryFormula.weight_id, $scope.countryFormula)
                    .then(function (dt) {
                        toaster.pop('success', "Update Parameter", "Success"); //获取最新的数据并刷新
                        FormulaWeight.get().then(function (fs) {
                            $scope.formulas = fs;
                            $scope.queryFormula();
                        });
                    });
            } else { //添加
                FormulaWeight.add($scope.countryFormula)
                    .then(function (dt) {
                        toaster.pop('success', "Update Parameter", "Success"); //获取最新的数据并刷新
                        FormulaWeight.get().then(function (fs) {
                            $scope.formulas = fs;
                            $scope.queryFormula();
                        });
                    });
            }

        };
        //整体参数
        $scope.queryCountryPar = function () {
            angular.forEach($scope.parameters, function (value, key) {
                if (value.type_index == 8)
                    $scope.securityList.push(value);
                else if (value.type_index == 9)
                    $scope.politicsList.push(value);
                else if (value.type_index == 7)
                    $scope.levelList.push(value);
            });
        };
        //获取当前显示的参数列表
        $scope.queryParameters = function () {
            $scope.tableSource = [];
            angular.forEach($scope.parameters, function (value, key) { //default data
                if (value.type_index == $scope.selParType) { //获取该国家设置的参数
                    var bFlag = false;
                    var obj = angular.copy(value);
                    for (var i = 0; i < $scope.countryPars.length; ++i) {
                        if ($scope.countryPars[i].country_id == $scope.selCountry &&
                            value.index_id == $scope.countryPars[i].index_id) { //该国家已经从新定义该数值
                            bFlag = true;
                            obj.value = $scope.countryPars[i].value;
                            obj.id = $scope.countryPars[i].id;
                        }
                    }
                    obj.flag = bFlag;
                    $scope.tableSource.push(obj);
                }
            });
        };
        $scope.checkName = function (data, id) { //表格编辑提示
            if (data == null)
                return $filter('T')('required');
            var bExisted = false;
            for (var i = 0; i < $scope.tableSource.length; ++i) {
                if ($scope.parameters[i].name == data && $scope.parameters[i].index_id != id) {
                    bExisted = true;
                    break;
                }
            }
            if (bExisted)
                return $filter('T')('nameexisted');
        };
        $scope.checkValue = function (data) {
            if (data == null)
                return $filter('T')('required');
            var r = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
            if (!r.test(data))
                return $filter('T')('requirednum');
        };
        $scope.showSecurity = function (id) {
            var name = id;
            for (var i = 0; i < $scope.securityList.length; ++i) {
                if ($scope.securityList[i].index_id == id) {
                    name = $scope.securityList[i].name;
                    break;
                }
            }

            return name;
        };
        $scope.showPolitics = function (id) {
            var name = id;
            for (var i = 0; i < $scope.politicsList.length; ++i) {
                if ($scope.politicsList[i].index_id == id) {
                    name = $scope.politicsList[i].name;
                    break;
                }
            }

            return name;
        };
        $scope.updatePar = function (id) { //更新参数
            var obj = null;
            for (var i = 0; i < $scope.tableSource.length; ++i) {
                if ($scope.tableSource[i].index_id == id) {
                    obj = $scope.tableSource[i];
                    break;
                }
            }
            //修改模板库的名称不修改值。
            $.each($scope.parameters, function (i, item) {
                if (item.index_id == id) {
                    item.name = obj.name;
                    RiskSetting.update(id, item);
                }
            });
            var p = {
                id: 0,
                country_id: $scope.selCountry,
                index_id: id,
                value: obj.value
            };
            if (obj.flag == false) { //不存在，添加
                CountryRiskSetting.add(p).then(function (data) {
                    obj.flag = true;
                    obj.id = data.id;
                    $scope.countryPars.push(obj);
                    toaster.pop('success', "Update Parameter", "Success");
                }, function (status) {
                    toaster.pop('error', "Update Parameter", "Failed");
                });
            } else { //编辑
                p.id = obj.id;
                CountryRiskSetting.update(p.id, p).then(function (data) {
                    toaster.pop('success', "Update Parameter", "Success");
                }, function (status) {
                    toaster.pop('error', "Update Parameter", "Failed");
                });
            }
        };
        $scope.addParameter = function () { //添加参数
            ngDialog.open({
                template: 'typeDiaglogId',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, ngDialog) {
                    $scope.addType = $scope.$parent.selParType;
                    $scope.add = function () {
                        if ($scope.addForm.$invalid) return;
                        $scope.$parent.addParameterEx($scope.addType, $scope.addName, $scope.addValue);
                        $scope.close();
                    };
                    $scope.validateInput = function (name) {
                        var input = $scope.addForm[name];
                        return input.$invalid;
                    };
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                }
            });
        };
        $scope.addParameterEx = function (type, name, val) {
            var obj = null;
            for (var i = 0; i < $scope.parTypes.length; ++i) {
                if ($scope.parTypes[i].type_index == type) {
                    obj = $scope.parTypes[i];
                    break;
                }
            }
            var par = {
                index_id: 0,
                type: obj.type,
                type_index: type,
                type_en: obj.type_en,
                name: name,
                name_en: '',
                value: val
            };
            RiskSetting.add(par).then(function (data) {
                $scope.parameters.push(data);
                $scope.selParType = data.type_index;
                data.flag = false;
                $scope.queryParameters();
                toaster.pop('success', "添加参数", "成功");
            }, function (status) {
                toaster.pop('error', "添加参数", "失败");
            });
        };
        $scope.deleteParamer = function (id) { //删除参数
            SweetAlert.swal({
                title: '确定删除？',
                text: '是否确实删除该参数，该操作不可恢复!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    RiskSetting.delete(id).then(function () { //删除默认
                        angular.forEach($scope.countryPars, function (item) {
                            if (item.index_id == id) {
                                CountryRiskSetting.delete(item.id);
                            }
                        })
                        var ary = [];
                        angular.forEach($scope.parameters, function (item) {
                            if (item.index_id != id) ary.push(item);
                        });
                        $scope.parameters = ary;
                        $scope.queryParameters();
                        SweetAlert.swal('删除!', '参数删除成功.', 'success');
                    }, function () {
                        SweetAlert.swal('删除!', '参数删除失败.', 'error');
                    });
                } else {
                    SweetAlert.swal('已取消', '删除操作已取消.', 'error');
                }
            });
        };
        $scope.countryRisks = [];
        $scope.queryCountry = function () { //当前选择的国家
            for (var i = 0; i < $scope.countryRisks.length; ++i) {
                if ($scope.countryRisks[i].country_id == $scope.selCountry) {
                    $scope.selCountryModel = $scope.countryRisks[i];
                    $scope.queryParameters();
                    $scope.queryFormula();
                    break;
                }
            }
        };
        $scope.updateCountryPar = function () { //更新国家整体参数
            //修改对象
            countryrisk.update($scope.selCountry, $scope.selCountryModel).then(function (data) {
                toaster.pop('success', "Update Parameter", "Success");
            }, function () {
                countryrisk.getdetail($scope.selCountry).then(function (dt) {
                    $scope.selCountryModel = dt;
                });
                toaster.pop('error', "Update Parameter", "Failed");
            })
        };
    })
    .controller('infoController', function ($rootScope, $scope, $location, $state, $filter, SecuritySystem, countryrisk, DWLI, SweetAlert, Events, DTOptionsBuilder) {
        var lang = $rootScope.language.selected;
        $scope.checkAll = false;
        $scope.checkAllSelected = function () {
            $scope.checkAll = !$scope.checkAll;
            angular.forEach($scope.events, function (item) {
                item.checked = $scope.checkAll;
            });
        };
        $scope.getSelctByCheck = function () {
            var ary = [];
            angular.forEach($scope.events, function (item, i) {
                if (item.checked == true)
                    ary.push(item.event_id);
            });
            return ary;
        };
        $scope.eventStatus = 3; //Number('@type');
        $scope.statusList = [{
            id: 3,
            label: $filter('T')('all')
        }, {
            id: 1,
            label: $filter('T')('noentry')
        }, {
            id: 2,
            label: $filter('T')('readyinput')
        }];
        $scope.showUrl = function (url) {
            if (url == undefined || url == null) return true;
            url = url.replace(/(^s*)|(s*$)/g, "");
            return url.length == 0;
        };
        $scope.selCountry = -1;
        $scope.country = [{
            country_id: -1,
            name: $filter('T')('all')
        }];
        $scope.date = {
            startDate: moment().subtract(60, "days"),
            endDate: moment()
        };
        $scope.search = function () {
            //$scope.events = [];
            var countryID = $scope.selCountry;
            var st = $scope.date.startDate.format('YYYYMMDD');
            var et = $scope.date.endDate.format('YYYYMMDD');
            var obj = {
                sTime: st,
                eTime: et,
                country: countryID,
                type: $scope.eventStatus,
                user: -1
            };
            SecuritySystem.Events(obj).then(function (data) {
                var ary = [];
                $.each(data, function (i, item) {
                    item.country_name = $scope.countryNameByid(item.country_id);
                    item.content = item.content.replace(/[\r\n]/g, ""); //去掉回车换行
                    item.content = item.content.replace(/\ +/g, ""); //去掉空格
                    ary.push(item);
                });
                if ($scope.eventStatus == 3) { //如果为ALL，则需要将已经录入的信息源过滤掉
                    var ary1 = [];
                    angular.forEach(ary, function (item, i) {
                        if (item.type == 2) {
                            ary1.push(item);
                        } else if (item.type == 1) {
                            var bFlag = true;
                            for (var j = 0; j < ary.length; ++j) {
                                if (ary[j].source_id == item.event_id) {
                                    bFlag = false;
                                    break;
                                }
                            }
                            if (bFlag)
                                ary1.push(item);
                        }
                    });
                    $scope.events = ary1.sort(function (a, b) { return b.event_date - a.event_date; });
                } else {
                    $scope.events = ary.sort(function (a, b) { return b.event_date - a.event_date; });
                }
            }, function (status) {
                $scope.events = [];
            });
        };
        countryrisk.get().then(function (data) {
            $scope.country = $scope.country.concat(data);
            $scope.search();
        });
        $scope.countryNameByid = function (id) {
            var s = "";
            $.each($scope.country, function (j, c) {
                if (id == c.country_id) {
                    s = c.name;
                    return false;
                }
            });
            return s;
        };
        $scope.add = function () {
            $state.go('app.inputinfo');
        };
        $scope.edit = function (id) {
            $state.go('app.inputinfo', {
                id: id,
                type: null
            });
        };
        $scope.reaudit = function (id) {
            $state.go('app.inputinfo', {
                id: id,
                type: 1
            });
        };
        $scope.reaudits = function () {
            var ary = [];
            angular.forEach($scope.events, function (item, i) {
                if (item.checked == true)
                    ary.push(item);
            });
            if (ary.length == 0) return;
            $state.go('app.inputinfo', {
                id: ary,
                type: 2
            });
        };
        $scope.delete = function (id) {
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: $filter('T')('deleteWarningInfo'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')('sure'),
                cancelButtonText: $filter('T')('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    Events.delete(id).then(function () {
                        $scope.search();
                        SweetAlert.swal($filter('T')('success'), $filter('T')('delsuccess'), 'success');
                    }, function () {
                        SweetAlert.swal($filter('T')('failed'), $filter('T')('delfailed'), 'error');
                    })
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        };
        $scope.showExpiryTime = function (id) {
            var s = '';
            $.each($scope.events, function (i, item) {
                if (item.event_id == id) {
                    s = item.expirytime ? item.expirytime : item.event_date;
                    return false;
                }
            });
            return s;
        };
        $scope.export = function(){
            Events.export().then(function(data){
                var f = 'apis/'+data;
                var a = document.createElement('a'); 
                a.href = f; 
                a.target = '_blank'; 
                document.body.appendChild(a);
                a.click();
            });
        };
    })
    .controller('addInfoController', function ($rootScope, $scope, $state, ngDialog,
        $stateParams, $http, SecuritySystem, countryrisk, RiskSetting, Events,
        DWLI, toaster) { //新添加，编辑，录入
        var lang = $rootScope.language.selected;
        $scope.id = $stateParams.id;
        $scope.type = $stateParams.type;
        $scope.event = null;
        $scope.existID = null;
        $scope.initEventData = function () {
            if ($scope.type && $scope.type == 2) {
                SecuritySystem.eventModel(null).then(function (data) {
                    $scope.event = data.evt;
                    $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                    $scope.event.expirytime = angular.copy($scope.event.event_date);
                    $scope.showExpiryTime = false;
                    angular.forEach($scope.id, function (item, i) {
                        if (i == 0) $scope.event.content = item.content;
                        else {
                            $scope.event.content += '\n' + item.content;
                        }
                    });
                });
            } else {
                SecuritySystem.eventModel($scope.id).then(function (data) {
                    $scope.event = data.evt;
                    $scope.existID = data.ext;
                    $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                    if ($scope.event.expirytime) {
                        $scope.event.expirytime = moment($scope.event.expirytime, "YYYYMMDD").toDate();
                        $scope.showExpiryTime = true;
                    } else {
                        $scope.event.expirytime = angular.copy($scope.event.event_date);
                        $scope.showExpiryTime = false;
                    }
                });
            }
        };
        $scope.initEventData();
        countryrisk.get().then(function (data) {
            $scope.country = data;
        }); //国家
        //事件参数
        $scope.eventType = []; //事件性质
        $scope.scopeType = []; //影响范围
        $scope.conseType = []; //后果严重程度
        $scope.pertinenceType = []; //针对性
        $scope.localType = []; //地方政府预警
        $scope.chineseType = []; //中国政府预警
        $scope.thirdType = []; //第三方预警
        $scope.officialType = [{
            id: '',
            value: 'NONE'
        }]; //官方预警
        $scope.secondType = [];
        RiskSetting.get().then(function (data) {
            angular.forEach(data, function (item, i) {
                if (item.type_index == 0) //事件性质
                    $scope.eventType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                if (item.type_index == 1) //影响范围
                    $scope.scopeType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                if (item.type_index == 2) //后果严重程度
                    $scope.conseType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                if (item.type_index == 3) //针对性
                    $scope.pertinenceType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                if (item.type_index == 4) { //地方政府预警{
                    $scope.localType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                    initOfficialType(item);
                }
                if (item.type_index == 5) { //中国政府预警
                    $scope.chineseType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                    initOfficialType(item);
                }
                if (item.type_index == 6) { //第三方预警
                    $scope.thirdType.push({
                        id: item.index_id.toString(),
                        value: item.name
                    });
                    initOfficialType(item);
                }
            });
            $scope.officialTypeChange();
        });
        var initOfficialType = function (item) {
            if ($scope.officialType.length == 0)
                $scope.officialType.push({
                    id: item.type_index.toString(),
                    value: item.type
                });
            else {
                var bAdd = true;
                $.each($scope.officialType, function (j, obj) {
                    if (obj.id == item.type_index) {
                        bAdd = false;
                        return false;
                    }
                });
                if (bAdd)
                    $scope.officialType.push({
                        id: item.type_index.toString(),
                        value: item.type
                    });
            }
        };
        $scope.officialTypeChange = function () {
            $scope.secondType = [{
                id: '',
                value: 'NONE'
            }];
            if ($scope.event) {
                var id = $scope.event.firstlevel;
                if (id == 4)
                    $scope.secondType = $scope.secondType.concat($scope.localType);
                else if (id == 5)
                    $scope.secondType = $scope.secondType.concat($scope.chineseType);
                else if (id == 6)
                    $scope.secondType = $scope.secondType.concat($scope.thirdType);
            }
        };
        //输入验证
        $scope.submitted = false;
        $scope.validateInput = function (name, type) {
            var input = $scope.eventForm[name];
            return (input.$dirty || $scope.submitted) && input.$error[type];
        };
        $scope.showLoading = function () {
            ngDialog.open({
                template: 'loading.html',
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByEscape: false,
                closeByNavigation: true,
                closeByDocument: false
            });
        };
        $scope.closeLoading = function () {
            ngDialog.closeAll();
        };
        $scope.formSumbit = function (eventDetails) {//提交
            $scope.submitted = true;
            if ($scope.eventForm.$valid == false) return;
            if ($scope.event.event_date > $scope.event.expirytime) {
                $scope.event.event_date = moment($scope.event.event_date).format('YYYYMMDD');
                $scope.event.expirytime = $scope.event.event_date;
            } else {
                $scope.event.event_date = moment($scope.event.event_date).format('YYYYMMDD');
                $scope.event.expirytime = moment($scope.event.expirytime).format('YYYYMMDD');
            }
            $scope.showLoading();
            if ($scope.id == null) { //新加入信息
                Events.add($scope.event).then(function (data) {
                    toaster.pop('success', "添加事件及预警", "Success");
                    $scope.close();
                }, function (status) {
                    $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                    $scope.event.expirytime = moment($scope.event.expirytime, "YYYYMMDD").toDate();
                    $scope.closeLoading();
                    toaster.pop('error', "添加事件及预警", "Failed");
                });
            } else if ($scope.id && !$scope.type) { //修改信息
                Events.update($scope.id, $scope.event).then(function (data) {
                    toaster.pop('success', "Edit Information", "Success");
                    $scope.close();
                }, function (status) {
                    $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                    $scope.event.expirytime = moment($scope.event.expirytime, "YYYYMMDD").toDate();
                    $scope.closeLoading();
                    toaster.pop('error', "Edit Information", "Failed");
                });
            } else if ($scope.id && $scope.type) { //录入信息
                if ($scope.existID) { //已经录入，覆盖
                    var obj = angular.copy($scope.event);
                    obj.source_id = obj.event_id;
                    obj.event_id = $scope.existID;
                    obj.type = 2;
                    Events.update(obj.event_id, obj).then(function (data) {
                        toaster.pop('success', "Input Information", "Success");
                        $scope.close();
                    }, function (status) {
                        $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                        $scope.event.expirytime = moment($scope.event.expirytime, "YYYYMMDD").toDate();
                        $scope.closeLoading();
                        toaster.pop('error', "Input Information", "Failed");
                    });
                } else { //新加type=2
                    $scope.event.type = 2;
                    $scope.event.source_id = $scope.event.event_id;
                    Events.add($scope.event).then(function (data) {
                        toaster.pop('success', "Input Information", "Success");
                        $scope.close();
                    }, function (status) {
                        $scope.event.event_date = moment($scope.event.event_date, "YYYYMMDD").toDate();
                        $scope.event.expirytime = moment($scope.event.expirytime, "YYYYMMDD").toDate();
                        $scope.closeLoading();
                        toaster.pop('error', "Input Information", "Failed");
                    });
                }
            }
        };
        $scope.close = function () {
            $state.go('app.informationinput')
        };
        //有效期选择控制
        //$scope.showExpiryTime = false; //是否设置有效期
        //事件日期改变
        $scope.eventDateChange = function () {
            var input = $scope.eventForm['eventDate'];
            if (input.$valid)
                $scope.event.expirytime = angular.copy($scope.event.event_date);
        };
    })
    .controller('analysisController', function ($scope, ngDialog) {
        $scope.open = function () {
            ngDialog.open({
                template: 'typeDiaglogId',
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: 'analysisTypeController'
            });
        };
        $scope.open();
    })
    .controller('analysisTypeController', function ($scope, $location, countryrisk, ngDialog) {
        $scope.typeList = [{
            id: 1,
            label: '海外项目属地国安保信息汇总'
        }, {
            id: 2,
            label: '各个属地国信息'
        }]; //分析类别
        $scope.type = 1;
        $scope.continent = null;
        $scope.showCountry = [];
        $scope.selCountry = 1;
        $scope.continents = [];
        $scope.country = null;
        $scope.showCountry = [];
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.country = data;
            angular.forEach(data, function (item) {
                var bAdd = true;
                for (var i = 0; i < $scope.continents.length; ++i) {
                    if ($scope.continents[i].label_en == item.continent_en) {
                        bAdd = false;
                        break;
                    }
                }
                if (bAdd)
                    $scope.continents.push({
                        id: $scope.continents.length + 1,
                        label: item.continent,
                        label_en: item.continent_en
                    });
            });
            if ($scope.continents.length > 0)
                $scope.continent = $scope.continents[0].id;
        }); //获取国家
        $scope.$watch('continent', function (newValue, oldValue, scope) {
            $scope.showCountry = [];
            var obj = null;
            for (var i = 0; i < $scope.continents.length; ++i) {
                if ($scope.continents[i].id == $scope.continent) {
                    obj = $scope.continents[i];
                    break;
                }
            }
            angular.forEach($scope.country, function (item) {
                if (item.continent_en == obj.label_en) {
                    $scope.showCountry.push(item);
                }
            });
            if ($scope.showCountry.length > 0)
                $scope.selCountry = $scope.showCountry[0].country_id;
        });
        $scope.$watch('type', function (newValue, oldValue, scope) {
            if (!$scope.$$phase)
                $scope.$apply();
        });
        $scope.formSubmit = function () {
            ngDialog.closeAll();
            if ($scope.type == 1)
                $location.path('app/totalanalysis');
            else
                $location.path('app/countryanalysis/' + $scope.selCountry)
        };
    })
    .controller('totalAnalysisController', function ($scope, $state, $filter, Events, countryrisk, highchartsNG) {
        var year = moment().format('YYYY');
        $scope.Events = null;
        $scope.countryList = null;
        $scope.series = [];
        $scope.chartConfig = {
            options: {
                lang: {
                    printChart: $filter('T')('printchart'),
                    downloadJPEG: $filter('T')('downloadJPEG'),
                    downloadPDF: $filter('T')('downloadPDF'),
                    downloadPNG: $filter('T')('downloadPNG'),
                    downloadSVG: $filter('T')('downloadSVG'),
                    exportButtonTitle: $filter('T')('exportButtonTitle')
                },
                chart: {
                    type: 'pie'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: '国家信息统计'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.y}'
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            subtitle: {
                text: '中海石油国际有限公司应急管理信息系统'
            },
            exporting: {
                enabled: true,
                filename: '国家信息统计饼图'
            }
        };
        $scope.dateRange = {
            startDate: moment('20160101', 'YYYYMMDD'),//moment().subtract(30, "days"),
            endDate: moment()
        };
        $scope.search = function () {
            $scope.series = [];
            var st = $scope.dateRange.startDate.format('YYYYMMDD');
            var et = $scope.dateRange.endDate.format('YYYYMMDD');
            Events.getRangeTime(st, et, 2).then(function (data) { //当前时间内所有事件
                angular.forEach(data, function (item) {
                    var bFlag = false;
                    for (var i = 0; i < $scope.series.length; ++i) {
                        if (item.country_id == $scope.series[i].id) {
                            $scope.series[i].y += 1;
                            bFlag = true;
                        }
                    }
                    if (!bFlag)
                        $scope.series.push({
                            id: item.country_id,
                            name: $scope.getCountryName(item.country_id),
                            y: 1
                        });
                });
                $scope.chartConfig.series = [{
                    type: 'pie',
                    name: '国家信息统计',
                    data: $scope.series
                }];
            });
        };
        Events.getByPar(year, 2, null).then(function (data) { //获取所有的事件
            $scope.Events = data;
        });
        $scope.MonthCount = function (month) {
            var i = 0;
            var s = year + month;
            angular.forEach($scope.Events, function (item) {
                if (item.event_date.indexOf(s) == 0) i++;
            });
            return i;
        };
        countryrisk.get().then(function (data) {
            $scope.countryList = data;
            $scope.search();
        });
        $scope.getCountryName = function (id) {
            var item = null;
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) {
                    item = $scope.countryList[i];
                    break;
                }
            }
            return item != null ? item.name : "";
        };
        $scope.showSecurityList = function (month) { //查看当前预警信息列表
            $state.go('app.eventlist', {
                month: month
            });
        };
        $scope.showtotalList = function (month) { //查看当前预警信息列表
            $state.go('app.totalinfos');
        };
    })
    .controller('countryAnalysisController', function ($scope, $state, $stateParams, $filter, countryrisk, Events, SecuritySystem, ngDialog) {
        $scope.id = $stateParams.id;
        $scope.Events = null;
        countryrisk.get().then(function (data) {
            for (var i = 0; i < data.length; ++i) {
                if (data[i].country_id == $scope.id) {
                    $scope.country = data[i];
                    break;
                }
            }
        });
        var year = moment().format('YYYY');
        $scope.dateRange = {
            startDate: moment('20160101', 'YYYYMMDD'),//moment().subtract(60, "days"),
            endDate: moment('20160601', 'YYYYMMDD')
        };
        $scope.selType = 0;
        $scope.chartDateRange = {
            startDate: moment('20160601', 'YYYYMMDD'),//moment().subtract(60, 'days'),
            endDate: moment('20160701', 'YYYYMMDD')//moment()
        };
        $scope.chartConfig = {
            options: {
                lang: {
                    printChart: $filter('T')('printchart'),
                    downloadJPEG: $filter('T')('downloadJPEG'),
                    downloadPDF: $filter('T')('downloadPDF'),
                    downloadPNG: $filter('T')('downloadPNG'),
                    downloadSVG: $filter('T')('downloadSVG'),
                    exportButtonTitle: $filter('T')('exportButtonTitle')
                },
                chart: {
                    type: 'pie'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: '国家信息统计'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        format: '<b>{point.name}</b>: {point.y}'
                    }
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            subtitle: {
                text: '中海石油国际有限公司应急管理信息系统'
            },
            exporting: {
                enabled: true,
                filename: '国家信息统计饼图'
            }
        };
        $scope.securityConfig = {
            options: {
                lang: {
                    printChart: $filter('T')('printchart'),
                    downloadJPEG: $filter('T')('downloadJPEG'),
                    downloadPDF: $filter('T')('downloadPDF'),
                    downloadPNG: $filter('T')('downloadPNG'),
                    downloadSVG: $filter('T')('downloadSVG'),
                    exportButtonTitle: $filter('T')('exportButtonTitle')
                },
                chart: {
                    type: 'pie'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (evt) {
                                    //location.href = this.options.url;
                                    var a = this.options.url;
                                    if (a) $state.go(a);
                                }
                            }
                        }
                    }
                },
                legend: {
                    align: 'left',
                    layout: 'vertical',
                    verticalAlign: 'top',
                    floating: true,
                    backgroundColor: '#ffffff',
                    x: 40,
                    y: -18,
                    symbolWidth: 30
                }
            },
            credits: {
                enabled: false
            },
            title: {
                align: 'right',
                floating: false,
                style: {
                    colro: '#5a98de',
                    fontWeight: 'bold',
                    fontSize: '24px'
                },
                text: '社会安全形势分析图',
                x: -30
            },
            subtitle: {
                align: 'right',
                floating: true,
                useHTML: true,
                style: {
                    fontSize: '16px'
                },
                y: 50,
                x: -30,
                text: '当日预警等级指数（DWLI）经对官方预警、事件性质、事件范围、事件后果、事件<br/>针对性、地区人口、连续期间事件频次和国家总体风险水平等因素综合评估后形成'
            },
            yAxis: [{ //
                //tickInterval: 5,
                gridLineWidth: 0,
                tickPositions: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4],
                title: {
                    text: null
                },
                labels: {
                    style: {
                        color: '#89A54E'
                    }
                }
            }, { // Secondary yAxis
                gridLineWidth: 0,
                tickPositions: [0.3, 0.8, 1.3, 1.8, 2.3, 2.8, 3.3],
                title: {
                    text: null,
                    style: {
                        color: '#4572A7'
                    }
                },
                labels: {
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: true
            }]
        };
        $scope.typeList = [{
            id: 0,
            name: '事件性质'
        }, {
            id: 1,
            name: '影响范围'
        }, {
            id: 2,
            name: '后果严重程度'
        }, {
            id: 3,
            name: '针对性'
        }];
        Events.getByPar(year, 2, $scope.id).then(function (data) {
            $scope.Events = data;
        });
        $scope.MonthCount = function (month) {
            var i = 0;
            var s = year + month;
            angular.forEach($scope.Events, function (item) {
                if (item.event_date.indexOf(s) == 0) i++;
            });
            return i;
        };
        $scope.search = function () {
            var st = $scope.dateRange.startDate.format('YYYYMMDD');
            var et = $scope.dateRange.endDate.format('YYYYMMDD');
            Events.getEventByType(st, et, $scope.id, $scope.selType).then(function (data) {
                $scope.chartConfig.series = [{
                    type: 'pie',
                    name: '国家信息统计',
                    data: data
                }];
            });
        };
        $scope.search();
        $scope.createStandLevel = function (count, value) {
            var ary = [];
            for (var i = 0; i < count; ++i) {
                ary.push(value);
            }
            return ary;
        };
        $scope.getGoToData = function (ary) {
            var res = [];
            angular.forEach(ary, function (item, i) {
                res.push({
                    y: item,
                    url: 'app.instantMsg'
                });
            });
            return res;
        };
        $scope.chartSearch = function () {
            var st = $scope.chartDateRange.startDate.format('YYYYMMDD');
            var et = $scope.chartDateRange.endDate.format('YYYYMMDD');
            SecuritySystem.SecurityChartData(st, et, $scope.id).then(function (data) {
                $scope.securityConfig.xAxis = {
                    categories: data.xaixs,
                    tickInterval: Math.ceil(data.xaixs.length / 17)
                };
                $scope.securityConfig.series = [{
                    yAxis: 1,
                    type: 'column',
                    name: '当日事件指数',
                    color: '#4A452A',
                    data: $scope.getGoToData(data.eventI)
                }, {
                    type: 'line',
                    name: '当日预警等级指数(DWLI)',
                    color: '#bb1717',
                    data: data.dwli
                }, {
                    type: 'line',
                    name: '红色预警线',
                    color: '#ff0000',
                    data: $scope.createStandLevel(data.dwli.length, 1)
                }, {
                    type: 'line',
                    name: '橙色预警线',
                    color: '#FFA500',
                    data: $scope.createStandLevel(data.dwli.length, 0.7)
                }, {
                    type: 'line',
                    name: '黄色预警线',
                    color: '#ffff00',
                    data: $scope.createStandLevel(data.dwli.length, 0.5)
                }, {
                    type: 'line',
                    name: '蓝色预警线',
                    color: '#0000ff',
                    data: $scope.createStandLevel(data.dwli.length, 0.3)
                }, {
                    type: 'line',
                    name: '事件指数30日移动平均值',
                    color: '#56a221',
                    data: data.third
                }];
            });
        };
        $scope.chartSearch();
        $scope.showTrendChart = function () { //趋势图
            $scope.trendChartConfig.series = [{
                name: $scope.country.name,
                data: [$scope.MonthCount('01'), $scope.MonthCount('02'), $scope.MonthCount('03'),
                $scope.MonthCount('04'), $scope.MonthCount('05'), $scope.MonthCount('06'),
                $scope.MonthCount('07'), $scope.MonthCount('08'), $scope.MonthCount('09'),
                $scope.MonthCount('10'), $scope.MonthCount('11'), $scope.MonthCount('12')
                ]
            }];
            ngDialog.open({
                template: 'trendChart.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: true,
                width: 630,
                height: 300
            });
        };
        $scope.showSecurityList = function (month) { //查看当前预警信息列表
            $state.go('app.securitylist', {
                month: month,
                country: $scope.id
            });
        };
        $scope.trendChartConfig = {
            options: {
                lang: {
                    printChart: $filter('T')('printchart'),
                    downloadJPEG: $filter('T')('downloadJPEG'),
                    downloadPDF: $filter('T')('downloadPDF'),
                    downloadPNG: $filter('T')('downloadPNG'),
                    downloadSVG: $filter('T')('downloadSVG'),
                    exportButtonTitle: $filter('T')('exportButtonTitle')
                },
                chart: {
                    type: 'line'
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            title: {
                text: '趋势图',
                x: -20 //center
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },
            yAxis: {
                title: {
                    text: '总计：'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }
        };
    })
    .controller('SecurityListController', function ($scope, $stateParams, exevent) {
        $scope.month = $stateParams.month;
        $scope.country = !$stateParams.country ? -1 : $stateParams.country;
        $scope.events = [];
        $scope.maxdayevents = 1;
        $scope.cols = ['-1'];
        $scope.init = function (st, et) {
            exevent.GetCountryEvent({
                sTime: st,
                eTime: et,
                country: $scope.country,
                user: -1
            }).then(function (insDatas) {
                angular.copy(insDatas, $scope.events);
                if (insDatas.length > 0) {
                    $scope.maxdayevents = insDatas[0].events.length;
                }
                for (var i = 1; i < $scope.maxdayevents; ++i) {
                    $scope.cols.push('-' + (i + 1));
                }
            });
        };
        if ($scope.month == -1) { //当年全年
            var st = moment().format('YYYY') + '0101';
            var et = moment(st, 'YYYYMMDD').add(1, 'years').add(-1, 'days').format('YYYYMMDD');
            $scope.init(st, et);
        } else { //当月
            var m = $scope.month < 10 ? '0' + $scope.month : $scope.month;
            var st = moment().format('YYYY') + m + '01';
            var et = moment(st, 'YYYYMMDD').add(1, 'months').add(-1, 'days').format('YYYYMMDD');
            $scope.init(st, et);
        }

    })
    .factory('InstantServer', function () {
        var country = 1;
        var eventRange = {
            startDate: moment().subtract(60, 'days'),
            endDate: moment()
        };
        //var
        return {
            selCountry: country,
            eventRange: eventRange
        }
    })
    .controller('InstantController', function ($scope, $filter, $state, InstantServer, countryrisk, SecuritySystem) {
        $scope.countryServer = InstantServer;
        $scope.waringLevel = [{
            level: 5,
            international: '',
            overseas: '',
            employee: ''
        }];
        SecuritySystem.GetWaring().then(function (data) {
            $scope.warningList = data;
        });
        $scope.showUrl = function (url) {
            if (url == undefined || url == null) return true;
            url = url.replace(/(^s*)|(s*$)/g, "");
            return url.length == 0;
        };
        $scope.getGrade = function (grade) {
            if (grade == 1) return "I";
            else if (grade == 2) return "II";
            else if (grade == 3) return "III";
            else if (grade == 4) return "IV";
            else if (grade == 5) return "V";
            else return "V";
        };
        $scope.getdwli = function (item) {
            if (item) {
                return item.toFixed(2);
            } else
                return "-";
        };
        $scope.getgradebkcolor = function (grade) {
            if (grade == 1)
                return "#FF0000";
            else if (grade == 2)
                return "#FF9933";
            else if (grade == 3)
                return "#FFFF66";
            else if (grade == 4)
                return "#00CC99";
            else if (grade == 5)
                return "#00B050";
            else
                return "#00B050";
        };
        $scope.queryCountryLevel = function () { //获取单个国家预警级别
            SecuritySystem.CountryGrade($scope.countryServer.selCountry, moment().format("YYYYMMDD"))
                .then(function (data) { //当前预警级别
                    if (!data) {
                        $scope.waringLevel[0].level = 5;
                        $scope.waringLevel[0].international = '无';
                        $scope.waringLevel[0].overseas = '无';
                        $scope.waringLevel[0].employee = '无';
                    } else {
                        $scope.waringLevel[0].level = data.grade;
                        $scope.waringLevel[0].international = data.international;
                        $scope.waringLevel[0].overseas = data.overseas;
                        $scope.waringLevel[0].employee = data.employee;
                    }
                });
            $scope.waringPrompt = [];
            SecuritySystem.CountryGrades($scope.countryServer.selCountry, moment().format("YYYYMMDD"))
                .then(function (data) { //当前预警级别
                    if (data.length == 0)
                        $scope.waringPrompt.push('当日未发布预警(' + moment().format('YYYY-MM-DD') + ')');
                    else {
                        var showGrade = null;
                        angular.forEach(data, function (item) {
                            if (showGrade == null) showGrade = item;
                            else {
                                if (showGrade.grade < item.grade) {
                                    showGrade = item;
                                }
                            }
                        });
                        var s = moment(showGrade.time, 'YYYYMMDD').format('YYYY-MM-DD') + '发布' + showGrade.grade + '级预警';
                        s += ',预警有效截至日期：' + moment(showGrade.grade_validity, 'YYYYMMDD').format('YYYY-MM-DD');
                        $scope.waringPrompt.push(s);
                    }
                });
        };
        $scope.coungryChange = function () { //国家选择更改事件函数
            $scope.selCountry = $scope.countryServer.selCountry;
            $scope.queryCountryLevel();
            $scope.queryCurEventPrompt();
            $scope.searchEvents();
            $scope.searchHLevel();
        };
        $scope.queryCurEventPrompt = function () {//当日事件提醒。
            var st = moment().format('YYYYMMDD');
            var obj = {
                sTime: st,
                eTime: st,
                type: 2,
                country: $scope.countryServer.selCountry,
                user: -1
            };
            SecuritySystem.Events(obj).then(function (data) {
                var lastTime = '';
                $.each(data, function (i, item) {
                    item.cname = $scope.getCountryName(item.country_id);
                    lastTime = lastTime < item.expirytime ? item.expirytime : lastTime;
                });
                if (lastTime == '') {
                    $scope.showEventPrompt = '当日无预警事件。'
                } else {
                    $scope.showEventPrompt = '当日包含' + data.length + '条预警事件,最晚事件截至有效期为:' +
                        moment(lastTime, 'YYYYMMDD').format('YYYY-MM-DD');
                }
            });
        }
        $scope.searchHLevel = function () { //查询预警信息历史对比数据
            var st = $scope.dateRange.startDate.format('YYYYMMDD');
            var et = $scope.dateRange.endDate.format('YYYYMMDD');
            SecuritySystem.historyDWLI(st, et, $scope.selCountry).then(function (data) {
                $scope.histroy = data;
                angular.forEach($scope.histroy, function (item) {
                    item.pGrade = !item.grade ? '未发布' : item.grade;
                    item.rGrade = 5;
                    if (item.dwli > 1)
                        item.rGrade = 1;
                    else if (item.dwli > 0.7)
                        item.rGrade = 2;
                    else if (item.dwli > 0.5)
                        item.rGrade = 3;
                    else if (item.dwli > 0.3)
                        item.rGrade = 4;
                });
            });
        };
        $scope.showEventPrompt = '当日无预警事件。';
        $scope.searchEvents = function () { //预警事件列表
            //$scope.eventRange = $scope.country
            var st = $scope.countryServer.eventRange.startDate.format('YYYYMMDD');
            var et = $scope.countryServer.eventRange.endDate.format('YYYYMMDD');
            var obj = {
                sTime: st,
                eTime: et,
                type: 2,
                country: $scope.countryServer.selCountry,
                user: -1
            };

            SecuritySystem.Events(obj).then(function (data) {
                var ary = [];
                // var lastTime = '';
                $.each(data, function (i, item) {
                    item.cname = $scope.getCountryName(item.country_id);
                    ary.push(item);
                    // lastTime = i==0?lastTime:(lastTime<item.expirytime?item.expirytime:lastTime);
                    // lastTime = lastTime<item.expirytime?item.expirytime:lastTime;
                });
                $scope.eventList = ary;
                // if (lastTime==''){
                //     $scope.showEventPrompt = '当日无预警事件。'
                // }else {
                //     $scope.showEventPrompt = '当日包含' + data.length + '条预警事件,最晚事件截至有效期为:' +
                //         moment(lastTime, 'YYYYMMDD').format('YYYY-MM-DD');
                // }
            });

        };

        $scope.releaseFun = function () { //发布警讯
            $state.go('app.release', { id: $scope.countryServer.selCountry });
        };
        $scope.relieveFun = function () { //解除警讯
            $state.go('app.Relieve', { id: $scope.countryServer.selCountry });
        };
        $scope.dateRange = {
            startDate: moment().subtract(10, 'days'),
            endDate: moment().subtract(1, 'days')
        };
        // $scope.eventRange = {
        //     startDate: moment().subtract(90, 'days'),
        //     endDate: moment().subtract(1, 'days')
        // };
        $scope.getCountryName = function (id) {
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) return $scope.countryList[i].name;
            }
        };
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            //$scope.selCountry = $scope.countryList[0].country_id;
            $scope.queryCountryLevel();
            $scope.queryCurEventPrompt();
            $scope.searchEvents();
            $scope.searchHLevel();
        });
        $scope.send = function () {
            $state.go('app.ics_primarytable');
        };
        $scope.sendEx = function (evt) {
            var content = "";
            if (evt.title != null || evt.title != undefined) content += evt.title+ "<br />" ;
            content += evt.content;
            var obj = {
                content: content,
                title: $filter('T')("security"),
                category_type: "1",
                type: "1",
                top: 0,
                is_return: 0,
                sms_content: content
            };
            $state.go('app.writeMessage', { data: obj });
        }
    })
    .controller('contrastMgrController', function ($scope, SecuritySystem, countryrisk) {
        $scope.dateRange = {
            startDate: moment().subtract(10, 'days'),
            endDate: moment().subtract(1, 'days')
        };

        $scope.searchHLevel = function () { //查询预警信息历史对比数据
            var st = $scope.dateRange.startDate.format('YYYYMMDD');
            var et = $scope.dateRange.endDate.format('YYYYMMDD');
            SecuritySystem.historyDWLI(st, et, $scope.selCountry).then(function (data) {
                $scope.histroy = data;
                angular.forEach($scope.histroy, function (item) {
                    item.pGrade = !item.grade ? '未发布' : item.grade;
                    item.rGrade = 5;
                    if (item.dwli > 1)
                        item.rGrade = 1;
                    else if (item.dwli > 0.7)
                        item.rGrade = 2;
                    else if (item.dwli > 0.5)
                        item.rGrade = 3;
                    else if (item.dwli > 0.3)
                        item.rGrade = 4;
                });
            });
        };
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.searchHLevel();
        });
    })
    .controller('releaseController', function ($scope, $state, $stateParams, DWLI, Warninglevel, countryrisk,
        organiztion, EventGrade, SecuritySystem, SweetAlert, Emergency, toaster) {
        $scope.gradeCheck = true;//发布预警
        $scope.emergencyCheck = true;//发布应急状态
        $scope.$watchGroup(['gradeCheck', 'emergencyCheck'], function (newVal, oldVal) {
            if (newVal[0] == false && newVal[1] == false) {
                SweetAlert.swal("发布类型错误", "发布预警或者发布应急状态必须至少选择一项.", "error");
                $scope.gradeCheck = true;
            }
        });
        $scope.gradeModel = {//预警模型
            grade_id: 0,
            time: '',//预警时间
            country_id: 1,
            grade: 4,
            grade_validity: '',//预警有效期
            grade_note: '',
            international: '',
            overseas: '',
            employee: '',
            type: 0//默认是发布状态
        };
        $scope.emergencyModel = {//应急模型
            emergency_id: 0,
            time: '',
            country_id: 1,
            emergency: 4,
            emergency_validity: '',//有效期
            emergency_action: '',
            emergency_note: '',
            type: 0//默认是发布状态
        };
        $scope.orgs = [];
        $scope.org_select = '';
        $scope.selCountry = 1;
        $scope.countryList = [];
        $scope.setTime = {//时间模型类
            time: moment().toDate(),
            gradeValidity: moment().toDate(),
            emergencyValidity: moment().toDate()
        };
        $scope.statusList = [{//预警级别
            id: 1,
            name: 'Ⅰ级'
        }, {
            id: 2,
            name: 'Ⅱ级'
        }, {
            id: 3,
            name: 'Ⅲ级'
        }, {
            id: 4,
            name: 'Ⅳ级'
        }, {
            id: 5,
            name: 'Ⅴ级'
        }];
        $scope.emergencyList = [{//应急状态级别
            id: 1,
            name: 'Ⅰ级'
        }, {
            id: 2,
            name: 'Ⅱ级'
        }, {
            id: 3,
            name: 'Ⅲ级'
        }, {
            id: 4,
            name: 'Ⅳ级'
        }];
        countryrisk.get().then(function (data) { //国家列表
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $stateParams.id == null ? $scope.countryList[0].country_id : $stateParams.id;
            organiztion.getorganiztion().then(function (data) { //获取组织机构
                $scope.allOrg = data;
                $scope.queryOrganiztion();
                $scope.queryEvents();
            });
        });
        $scope.queryOrganiztion = function () { //根据当前选择的国家确定组织机构
            $scope.orgs = [];
            angular.forEach($scope.allOrg, function (item, i) {
                if (item.parent_id == '2016011802') {
                    item.country_name = $scope.countryName(item.country_id);
                    $scope.orgs.push(item);
                }
            });
            if ($scope.orgs.length > 0) {
                $scope.org_select = $scope.orgs[0];
            }
        }
        $scope.events = [];
        $scope.dwli = 0;//默认DWLI值
        $scope.queryDwli = function () {
            $scope.dwli = 0;
            var t = moment($scope.setTime.time).format('YYYYMMDD');
            DWLI.default($scope.selCountry, t).then(function (data) {
                $scope.dwli = !data.dwli ? 0 : data.dwli.toFixed(2);
            });
        };
        $scope.queryEvents = function () { //获取当日所有事件
            $scope.events = [];
            var t = moment($scope.setTime.time).format('YYYYMMDD');
            SecuritySystem.Events({ sTime: t, eTime: t, type: 2, country: $scope.selCountry, user: -1 })
                .then(function (data) {
                    $scope.events = data;
                });
            $scope.changetype();
        };
        $scope.changetype = function () {
            $scope.queryOrganiztion();
            $scope.changeCompanySel();
        };
        $scope.changeCompanySel = function () {
            var s = '', st = moment($scope.setTime.time).format('YYYY年MM月DD日');
            if ($scope.formdata.type == '1') {
                s = $scope.org_select.organiztion_name + ':\n' + st;
                angular.forEach($scope.events, function (item, i) {
                    s += item.title + ',';
                });
                s += '请按照应急管理要求，组织应急处置工作\n国际公司应急协调办公室\n';
                s += moment().format("YYYY年MM月DD日HH时");
            } else {
                s = '各应急管理委员会成员：\n' + st;
                angular.forEach($scope.cEventList, function (item, i) {
                    s += item.title + ',';
                });
                s += '国际公司应急协调办公室已通知相关单位按照应急管理要求，采取应对措施。\n请知悉。\n国际公司应急协调办公室\n';
                s += moment().format("YYYY年MM月DD日HH时");
            }
            $scope.formdata.content = s;
        };
        $scope.gradeLevel = function (dwli) { //根据DWLI值获取推荐等级
            if (dwli > 1) return 'Ⅰ级';
            else if (dwli > 0.7) return 'Ⅱ级';
            else if (dwli > 0.5) return 'Ⅲ级';
            else if (dwli > 0.3) return 'Ⅳ级';
            return 'Ⅴ级';
        };
        $scope.formdata = { //发送数据
            type: '0',
            content: ""
        };
        $scope.validateInput = function (name, type) { //判断输入是否合法
            var input = $scope.eventForm[name];
            //return (input.$dirty || $scope.submitted) && input.$error[type];
            return input.$invalid;
        };
        $scope.validateInputEx = function (name, type) {
            var input = $scope.emergencyForm[name];
            //return (input.$dirty || $scope.submitted) && input.$error[type];
            return input.$invalid;
        }
        $scope.dateChange = function () { //日期更改事件
            $scope.setTime.gradeValidity = angular.copy($scope.setTime.time);
            $scope.setTime.emergencyValidity = angular.copy($scope.setTime.time);
            $scope.queryEvents();
            $scope.queryDwli();
        };
        $scope.emergencyComboxChange = function () { //预警获取默认设置的行动
            Warninglevel.get($scope.emergencyModel.emergency).then(function (data) {
                $scope.emergencyModel.emergency_action = '国家公司\n' + data.International.replace(/<br\s*\/>/g, '\n')
                    + '\n海外机构\n' + data.overseas.replace(/<br\s*\/>/g, '\n')
                    + '\n员工\n' + data.employee.replace(/<br\s*\/>/g, '\n');
            });
        };
        $scope.emergencyComboxChange();
        $scope.gradeComboxChange = function () { //应急获取默认设置的行动
            Warninglevel.get($scope.gradeModel.grade).then(function (data) {
                $scope.gradeModel.international = data.International.replace(/<br\s*\/>/g, '\n');
                $scope.gradeModel.overseas = data.overseas.replace(/<br\s*\/>/g, '\n');
                $scope.gradeModel.employee = data.employee.replace(/<br\s*\/>/g, '\n');
            });
        };
        $scope.gradeComboxChange();
        $scope.countryName = function (id) { //获取国家名称
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if (id == $scope.countryList[i].country_id) {
                    return $scope.countryList[i].name;
                }
            }
        }
        $scope.countryChange = function () {//国家修改
            $scope.queryOrganiztion();
            $scope.queryEvents();
            $scope.queryDwli();
        };
        $scope.countryChange();
        $scope.cancel = function () { //取消发布
            $state.go('app.instantMsg');
        };
        $scope.okBtnType = true;
        $scope.gradeFlag = false;
        $scope.emergencyFlag = false;
        $scope.$watchGroup(['gradeFlag', 'emergencyFlag'], function (newVal, oldVal) {
            if (newVal[0] && newVal[1]) {//全部返回成功
                if ($scope.okBtnType) {
                    var content = $scope.formdata.content;
                    var sms = content;
                    var reg = new RegExp("\n", "g");
                    content = content.replace(reg, "<br/>");
                    var title = moment().format("YYYY年MM月DD日") + '发布安保预警';
                    var obj = {
                        content: content,
                        sms_content: sms,
                        title: title,
                        category_type: 1,
                        type: 2,
                        top: 0,
                        is_return: 0,
                    };
                    $state.go('app.writeMessage', {
                        data: obj
                    });
                } else {//发布并发送
                    $state.go('app.instantMsg');
                }
            }
        });
        $scope.ok = function () { //发布
            if ($scope.check() == false) return;
            if ($scope.gradeCheck) {//发布预警
                $scope.gradeModel.time = moment($scope.setTime.time).format('YYYYMMDD');
                $scope.gradeModel.country_id = $scope.selCountry;
                $scope.gradeModel.grade_validity = moment($scope.setTime.gradeValidity).format('YYYYMMDD');
                $scope.gradeModel.international = $scope.gradeModel.international.replace(/\n/g, '<br />');
                $scope.gradeModel.overseas = $scope.gradeModel.overseas.replace(/\n/g, '<br />');
                $scope.gradeModel.employee = $scope.gradeModel.employee.replace(/\n/g, '<br />');
                $scope.gradeModel.grade_note = $scope.gradeModel.grade_note.replace(/\n/g, '<br />');
                EventGrade.add($scope.gradeModel).then(function () {
                    toaster.pop('success', "发布预警成功", "成功");
                    $scope.gradeFlag = true;
                }, function () {
                    toaster.pop('error', "发布预警失败", "错误");
                    $scope.gradeFlag = false;
                })
            } else {
                $scope.gradeFlag = true;
            }

            if ($scope.emergencyCheck) {
                $scope.emergencyModel.time = moment($scope.setTime.time).format('YYYYMMDD');
                $scope.emergencyModel.emergency_validity = moment($scope.setTime.emergencyValidity).format('YYYYMMDD');
                $scope.emergencyModel.country_id = $scope.selCountry;
                $scope.emergencyModel.emergency_action = $scope.emergencyModel.emergency_action.replace(/\n/g, '<br />');
                $scope.emergencyModel.emergency_note = $scope.emergencyModel.emergency_note.replace(/\n/g, '<br />');
                Emergency.add($scope.emergencyModel).then(function () {
                    toaster.pop('success', "发布应急状成功", "错误");
                    $scope.emergencyFlag = true;
                }, function () {
                    toaster.pop('error', "发布应急状态失败", "错误");
                    $scope.emergencyFlag = false;
                })
            } else {
                $scope.emergencyFlag = true;
            }
        };
        $scope.okEx = function(){
            
        };
        $scope.check = function () {
            if ($scope.gradeCheck) {
                if ($scope.eventForm.$invalid) {
                    SweetAlert.swal("表单错误", "发布预警表单输入错误.", "error");
                    return false;
                }
            }
            if ($scope.emergencyCheck) {
                if ($scope.emergencyForm.$invalid) {
                    SweetAlert.swal("表单错误", "发布应急状态表单输入错误.", "error");
                    return false;
                }
            }
            return true;
        };
    })
    .controller('relieveController', function ($scope, $state, SweetAlert, $stateParams,
        countryrisk, SecuritySystem, EventGrade, Emergency) {
        $scope.type = 0;
        $scope.date = {
            time: moment().toDate()
        };
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $stateParams.id == null ? $scope.countryList[0].country_id : $stateParams.id;
            $scope.parameterChange();
        });
        $scope.parameterChange = function () {
            if ($scope.type == 0) $scope.searchGrades();
            else $scope.searchEmergency();
        };
        $scope.cancel = function () {
            $state.go('app.instantMsg');
        };
        $scope.success = 0;
        $scope.failed = 0;
        $scope.sum = -1;
        $scope.ok = function () {
            var ary = [];
            if ($scope.type == 0) {
                angular.forEach($scope.grades, function (item) {
                    if (item.select == true) {
                        ary.push(angular.copy(item));
                    }
                });
                if (ary.length == 0) {
                    SweetAlert.swal('错误', '至少选择一个预警', 'error');
                    return;
                }
                $scope.success = 0;
                $scope.failed = 0;
                $scope.sum = ary.length;
                angular.forEach(ary, function (item) {
                    item.type = 1;
                    item.grade_validity = moment().format('YYYYMMDD');
                    EventGrade.update(item.grade_id, item).then(function () {
                        $scope.success += 1;
                    }, function () {
                        $scope.failed += 1;
                    })
                });
            } else {
                angular.forEach($scope.emergencies, function (item) {
                    if (item.select == true) {
                        ary.push(angular.copy(item));
                    }
                });
                if (ary.length == 0) {
                    SweetAlert.swal('错误', '至少选择一个应急状态', 'error');
                    return;
                }
                $scope.success = 0;
                $scope.failed = 0;
                $scope.sum = ary.length;
                angular.forEach(ary, function (item) {
                    item.type = 1;
                    item.emergency_validity = moment().format('YYYYMMDD');
                    Emergency.update(item.emergency_id, item).then(function () {
                        $scope.success += 1;
                    }, function () {
                        $scope.failed += 1;
                    })
                });
            }
        };
        $scope.$watchGroup(['success', 'failed'], function (newVal, oldVal) {
            if ($scope.sum == newVal[0] + newVal[1]) {
                if (newVal[1] == 0) $scope.cancel();
                else {
                    $scope.parameterChange();
                    var s = '成功：' + newVal[0] + '，失败：' + newVal[1];
                    SweetAlert.swal('错误', s, 'error');
                }
            }
        });
        $scope.searchGrades = function () {
            $scope.grades = [];
            var t = moment($scope.date.time).format('YYYYMMDD');
            SecuritySystem.CountryGrades($scope.selCountry, t).then(function (data) {
                angular.forEach(data, function (item) {
                    item.select = false;
                    $scope.grades.push(item);
                });
            });
        };
        $scope.searchEmergency = function () {
            $scope.emergencies = [];
            var t = moment($scope.date.time).format('YYYYMMDD');
            SecuritySystem.CountryEmergencys($scope.selCountry, t).then(function (data) {
                angular.forEach(data, function (item) {
                    item.select = false;
                    $scope.emergencies.push(item);
                });
            });
        };
    })
    .controller('dayReportController', function ($scope, $state, countryrisk, SecuritySystem, $filter, SweetAlert, organiztion) {
        $scope.searchDate = {
            startDate: moment().subtract(60, 'days'),
            endDate: moment()
        };
        $scope.reports = [];
        $scope.organiztion_id = '';
        $scope.userid = localStorage.userid;
        $scope.searchReports = function () {
            var st = $scope.searchDate.startDate.format("YYYYMMDD");
            var et = $scope.searchDate.endDate.format("YYYYMMDD");
            SecuritySystem.Reports($scope.userid, 0, st, et).then(function (data) {
                var dts = data.reports;
                $scope.organiztion_id = data.organizion_user;
                $scope.disabledCountry = $scope.organiztion_id != "";
                if ($scope.disabledCountry == true) {
                    organiztion.getbyId($scope.organiztion_id).then(function (data) {
                        $scope.selCountry = data.country_id;
                    });
                }
                $scope.reports = [];
                angular.forEach(dts, function (item, i) {
                    if ($scope.selCountry == -1) $scope.reports.push(item);
                    else {
                        if (item.country_id == $scope.selCountry) $scope.reports.push(item);
                    }
                    for (var j = 0; j < $scope.countryList.length; ++j) {
                        if (item.country_id == $scope.countryList[j].country_id) {
                            item.country = $scope.countryList[j].name;
                            break;
                        }
                    }
                });
            })
        };
        countryrisk.get().then(function (data) {
            $scope.countryList = [{ country_id: -1, name: 'ALL', name_en: 'ALL' }];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            $scope.searchReports();
        });
        $scope.delete = function (id) {
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter("T")('singledelete'),
                cancelButtonText: $filter("T")('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    SecuritySystem.DeleteReport(id).then(function (data) {
                        var ary = [];
                        $.each($scope.reports, function (i, item) {
                            if (item.report_id != id)
                                ary.push(item);
                        });
                        $scope.reports = ary;
                        SweetAlert.swal($filter('T')('success'), $filter('T')('delsuccess'), 'success');
                    }, function (error) {
                        SweetAlert.swal($filter('T')('failed'), $filter('T')('delfailed'), 'error');
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        };

        $scope.upload = function () { //上传日报
            $state.go('app.uploaddayReports', { id: $scope.organiztion_id });
        };
        $scope.public = function () { //发布日报
            $state.go('app.pday', { id: $scope.organiztion_id });
        };
        $scope.view = function (u) {
            window.open('http://10.78.173.167/upload/Report/' + u.file + '.pdf');
        };
    })
    .controller('uploadDayController', function ($scope, $state, $stateParams, FileUploader, SweetAlert, organiztion, countryrisk, SecuritySystem) {
        $scope.date = moment();
        $scope.gid = $stateParams.id;
        $scope.uploaderCtl = new FileUploader({
            queueLimit: 1,
            autoUpload: false,
            //url: 'apis/api/CountryAdvice?country=' + $scope.selCountry,
            url: 'apis/api/Report?type=0&time=' + $scope.date.format('YYYYMMDD') + '&orgid=' + $scope.gid + '&user=' + localStorage.userid,
            filters: [{
                name: 'xlsefilter',
                // A user-defined filter
                fn: function (item) {
                    var ext = item.name.substr(item.name.lastIndexOf(".")).toLowerCase();//获得文件后缀名
                    if (ext == '.xlsx' || ext == '.pdf') return true;
                    return false;
                }
            }]
        });
        $scope.uploaderCtl.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.eCode == 0) {
                SweetAlert.swal($filter('T')('success'), $filter('T')('uploadfilesuccess'), 'success');
                $state.go('app.dayReports', { id: $scope.gid });
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
        $scope.uploaderCtl.onAfterAddingFile = function () {
            $scope.errorFlag = false;
        };
        $scope.cancel = function () {
            $state.go('app.dayReports');
        };
        $scope.upload = function () {
            angular.forEach($scope.uploaderCtl.queue, function (file) {
                var f = file.upload();
            });
            $scope.cancel();
        };
    })
    .controller('addDayController', function ($scope, $state, $stateParams, SvgConvert, countryrisk, organiztion, SecuritySystem) {
        $scope.id = $stateParams.id;
        $scope.reportModels = {
            time: new Date(), //时间
            country: [] //对应有{country:id,level:1,events:[{title:'',type:''},...],influence:'',measures:''}
        };
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
        countryrisk.get().then(function (data) {
            $scope.country = data;
        });
        $scope.loadEvents = function () {
            $scope.reportModels.country = [];
            var t = moment($scope.reportModels.time).format('YYYYMMDD');
            SecuritySystem.CountryEvents($scope.countryid, t)
                .then(function (ets) {
                    $scope.all_events = [];
                    angular.forEach(ets, function (item) {
                        if (item.type == 2) $scope.all_events.push(item);
                    });
                    angular.forEach($scope.all_events, function (item, i) {
                        var bAdd = true;
                        for (var j = 0; j < $scope.reportModels.country.length; ++j) {
                            if ($scope.reportModels.country[j].country == item.country_id) {
                                $scope.reportModels.country[j].events.push({
                                    title: item.content,
                                    type: ''
                                });
                                bAdd = false;
                                break;
                            }
                        }
                        if (bAdd) {
                            $scope.reportModels.country.push({
                                country: item.country_id,
                                level: 2,
                                events: [{
                                    title: item.content,
                                    type: ''
                                }],
                                influence: '',
                                measures: ''
                            });
                        }
                    });
                    $scope.countryChange();
                });
        };
        $scope.initFun = function () {
            if ($scope.id == "") {
                $scope.org_country = true; //国际公司
                $scope.countryid = 1;
            } else {
                organiztion.getbyId($scope.id).then(function (data) {
                    $scope.org_country = data.country_id == 'null';
                    $scope.countryid = $scope.org_country ? 1 : data.country_id;
                });
            }
            $scope.loadEvents();
        };
        $scope.initFun();
        $scope.select = {};
        $scope.countryChange = function () {
            var bExisted = false;
            angular.forEach($scope.reportModels.country, function (item, i) {
                if (item.country == $scope.countryid) {
                    $scope.select = item;
                    bExisted = true;
                }
            });
            if (bExisted == false) {
                $scope.select = {
                    country: $scope.countryid,
                    level: 1,
                    events: [],
                    influence: '',
                    measures: ''
                };
                $scope.reportModels.country.push($scope.select);
            }
        };
        $scope.eventType = [{
            id: '预警信息',
            value: '预警信息'
        }, {
            id: '军事冲突',
            value: '军事冲突'
        }, {
            id: '恐怖袭击',
            value: '恐怖袭击'
        }, {
            id: '公共卫生',
            value: '公共卫生'
        }, {
            id: '其他',
            value: '其他'
        }];
        $scope.levelType = [{
            id: 1,
            level: '红'
        }, {
            id: 2,
            level: '橙'
        }, {
            id: 3,
            level: '黄'
        }, {
            id: 4,
            level: '蓝'
        }];
        $scope.$watch('reportModels.time', function (newValue, oldValue) {
            $scope.loadEvents();
        });
        $scope.addEvent = function () {
            $scope.select.events.push({
                title: '',
                type: ''
            });
        };
        $scope.removeEvent = function (index) {
            $scope.select.events.splice(index, 1);
        };
        $scope.close = function () {
            $state.go('day');
        };
        $scope.ok = function () {
            $scope.exportFun(0);
        };
        $scope.exportFun = function () {
            var obj = {
                time: moment($scope.reportModels.time).format('YYYY-MM-DD'),
                org: $scope.id,
                user: 1,
                country: $scope.reportModels.country
            };
            SvgConvert.PostExport(obj).then(function (data) {
                if (data.errCode != 0) {
                    layer.msg(data.msg);
                    return;
                } else {
                    $state.go('app.dayReports');
                }
            }, function (error) {
                alert(0);
                //layer.msg('failed');
            });
        };
    })
    .controller('monthReportController', function ($scope, $state, $stateParams, countryrisk, SecuritySystem, ngDialog, organiztion, SweetAlert, $filter) {
        $scope.dateRange = {
            startDate: moment().subtract(60, 'days'),
            endDate: moment()
        };
        $scope.report = [];
        $scope.organiztion_id = '';
        $scope.userid = localStorage.userid;
        $scope.searchReports = function () {
            var st = $scope.dateRange.startDate.format('YYYYMMDD');
            var et = $scope.dateRange.endDate.format('YYYYMMDD');
            SecuritySystem.Reports($scope.userid, 1, st, et).then(function (data) {
                var dts = data.reports;
                $scope.organiztion_id = data.organizion_user;
                $scope.disabledCountry = $scope.organiztion_id != "";
                if ($scope.disabledCountry == true) {
                    organiztion.getbyId($scope.organiztion_id).then(function (data) {
                        $scope.selCountry = data.country_id;
                    });
                }
                $scope.reports = [];
                angular.forEach(dts, function (item, i) {
                    if ($scope.selCountry == -1) $scope.reports.push(item);
                    else {
                        if (item.country_id == $scope.selCountry) $scope.reports.push(item);
                    }
                    for (var j = 0; j < $scope.countryList.length; ++j) {
                        if (item.country_id == $scope.countryList[j].country_id) {
                            item.country = $scope.countryList[j].name;
                            break;
                        }
                    }
                });
            })
        };
        countryrisk.get().then(function (data) {
            $scope.countryList = [{ country_id: -1, name: 'ALL', name_en: 'ALL' }];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            $scope.searchReports();
        });
        $scope.upload = function () {
            $state.go('app.uploadmonthReports', { id: $scope.organiztion_id });
        };
        $scope.view = function (u) {
            window.open('http://10.78.173.167/upload/Report/' + u.file + '.pdf');
        };
        $scope.delete = function (id) {
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter("T")('singledelete'),
                cancelButtonText: $filter("T")('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    SecuritySystem.DeleteReport(id).then(function (data) {
                        var ary = [];
                        $.each($scope.reports, function (i, item) {
                            if (item.report_id != id)
                                ary.push(item);
                        });
                        $scope.reports = ary;
                        SweetAlert.swal($filter('T')('success'), $filter('T')('delsuccess'), 'success');
                    }, function (error) {
                        SweetAlert.swal($filter('T')('failed'), $filter('T')('delfailed'), 'error');
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        };
    })
    .controller('uploadMonthController', function ($scope, $state, $stateParams, FileUploader, SweetAlert, organiztion, countryrisk, SecuritySystem) {
        $scope.date = moment();
        $scope.gid = $stateParams.id;
        $scope.uploaderCtl = new FileUploader({
            queueLimit: 1,
            autoUpload: false,
            //url: 'apis/api/CountryAdvice?country=' + $scope.selCountry,
            url: 'apis/api/Report?type=1&time=' + $scope.date.format('YYYYMMDD') + '&orgid=' + $scope.gid + '&user=1',
            filters: [{
                name: 'xlsefilter',
                // A user-defined filter
                fn: function (item) {
                    var ext = item.name.substr(item.name.lastIndexOf(".")).toLowerCase();//获得文件后缀名
                    if (ext == '.docx' || ext == '.pdf') return true;
                    return false;
                }
            }]
        });
        $scope.uploaderCtl.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.eCode == 0) {
                SweetAlert.swal($filter('T')('success'), $filter('T')('uploadfilesuccess'), 'success');
                $state.go('app.monthReports', { id: $scope.gid });
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
        $scope.uploaderCtl.onAfterAddingFile = function () {
            $scope.errorFlag = false;
        };
        $scope.upload = function () {
            angular.forEach($scope.uploaderCtl.queue, function (file) {
                var f = file.upload();
            });
            $scope.cancel();
        };
        $scope.cancel = function () {
            $state.go('app.monthReports');
        };
    })
    .controller('adviceController', function ($timeout, $scope, Advise) {
        //解码函数
        $scope.advises = null;
        $scope.adviseTree = [];
        $scope.treeCtl = {};
        Advise.get().then(function (data) {
            $scope.advises = data;
            $scope.adviseTree = QueryChildren(null, data);
            $scope.treeCtl.expand_all();
            $scope.treeCtl.select_first_branch();
        });
        $scope.treeClick = function (branch) {
            $scope.content = branch.content;
        };

        function QueryChildren(pId, datas) {
            var ary = [];
            angular.forEach(datas, function (item) {
                if (item.parent_id == pId) {
                    ary.push({
                        id: item.advice_id,
                        label: item.advice_name,
                        sort: item.advice_sort,
                        content: item.advice_content,
                        children: QueryChildren(item.advice_id, datas)
                    });
                }
            });
            ary = ary.sort(function (a, b) {
                return a.sort - b.sort;
            });
            return ary;
        };
    })
    .controller('adviceMgrController', function ($scope, $filter, Advise, SweetAlert, ngDialog) {
        $scope.advises = null;
        $scope.adviseTree = [];
        $scope.treeCtl = {};
        $scope.content = { content: '' };
        $scope.load = function () {
            Advise.get().then(function (data) {
                $scope.advises = data;
                $scope.adviseTree = QueryChildren(null, data);
                $scope.treeCtl.expand_all();
                $scope.treeCtl.select_first_branch();
            });
        };
        $scope.load();

        $scope.treeClick = function (branch) {
            $scope.content.content = branch.content;
        };

        function QueryChildren(pId, datas) {
            var ary = [];
            angular.forEach(datas, function (item) {
                if (item.parent_id == pId) {
                    ary.push({
                        id: item.advice_id,
                        label: item.advice_name,
                        sort: item.advice_sort,
                        content: item.advice_content,
                        children: QueryChildren(item.advice_id, datas)
                    });
                }
            });
            ary = ary.sort(function (a, b) {
                return a.sort - b.sort;
            });
            return ary;
        };
        $scope.addNode = function () { //添加章节
            ngDialog.open({
                template: 'addDlg',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, $filter, ngDialog, SweetAlert, Advise) {
                    $scope.parent = [{ advice_id: -1, advice_name: 'None' }];
                    $scope.parent = $scope.parent.concat($scope.$parent.advises);
                    $scope.selParent = $scope.parent[0];
                    $scope.addName = "";
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                    $scope.addNode = function () {
                        if (!$scope.addName) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('sectionnameempty'), 'error');
                            return;
                        }
                        var sort = 0;
                        var ary = [];
                        var parentID = $scope.selParent.advice_id == -1 ? null : $scope.selParent.advice_id
                        for (var i = 0; i < $scope.$parent.advises.length; i++) {
                            var item = $scope.$parent.advises[i];
                            if ($scope.selParent.advice_id == -1) {
                                if (!item.parent_id) {
                                    ary.push(item);
                                }
                            } else {
                                if (item.parent_id == parentID) {
                                    ary.push(item);
                                }
                            }
                        }
                        ary = ary.sort(function (a, b) {
                            return b.advice_sort - a.advice_sort;
                        });
                        sort = ary.length > 0 ? (ary[0].advice_sort + 1) : 0;
                        var node = {
                            advice_id: 0,
                            advice_name: $scope.addName,
                            advice_name_en: '',
                            parent_id: $scope.selParent.advice_id == -1 ? null : $scope.selParent.advice_id,
                            advice_sort: sort,
                            advice_content: '',
                            advice_content_en: ''
                        };
                        Advise.add(node).then(function (data) {
                            $scope.$parent.load();
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('success'), $filter('T')('add') + $filter('T')('success'), 'success');
                        }, function () {
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('error'), $filter('T')('add') + $filter('T')('error'), 'error');
                        });
                    };
                }
            });
        };
        $scope.editNode = function () { //edit node
            var node = $scope.treeCtl.get_selected_branch();
            if (!node) {
                SweetAlert.swal($filter('T')('error'), $filter('T')('noselecteditem'), 'error');
                return;
            }
            SweetAlert.swal({
                title: $filter('T')('edit'),
                text: $filter('T')('inputsectionname'),
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputValue: node.label,
                confirmButtonText: $filter('T')('sure'),
                cancelButtonText: $filter('T')('cancel')
            }, function (inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError($filter('T')('sectionnameempty'));
                    return false;
                }
                for (var i = 0; i < $scope.advises.length; ++i) {
                    var item = $scope.advises[i];
                    if (item.advice_id == node.id) {
                        var updateItem = angular.copy(item);
                        updateItem.advice_name = inputValue;
                        Advise.update(updateItem.advice_id, updateItem).then(function (data) {
                            $scope.advises[i] = updateItem;
                            node.label = inputValue;
                            SweetAlert.swal($filter('T')('success'), $filter('T')('editsuccess'), 'success');
                        }, function () {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('editfailed'), 'error');
                        })
                        break;
                    }
                }
            });
        }
        $scope.deleteNode = function () { //delete node
            var node = $scope.treeCtl.get_selected_branch();
            if (!node) {
                SweetAlert.swal('错误', '未选择章节', 'error');
                return;
            }
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: $filter('T')('deleteNode'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')('sure'),
                cancelButtonText: $filter('T')('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    Advise.delete(node.id).then(function () {
                        $scope.load();
                        SweetAlert.swal($filter('T')('singledelete'), $filter('T')('singledelete') + $filter('T')('success'), 'success');
                    }, function () {
                        SweetAlert.swal($filter('T')('singledelete'), $filter('T')('singledelete') + $filter('T')('error'), 'error');
                    })
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        }
        $scope.saveContent = function () { //保存正文
            var node = $scope.treeCtl.get_selected_branch();
            if (!node) {
                SweetAlert.swal('错误', '未选择章节', 'error');
                return;
            }
            for (var i = 0; i < $scope.advises.length; ++i) {
                var item = $scope.advises[i];
                if (item.advice_id == node.id) {
                    var updateItem = angular.copy(item);
                    updateItem.advice_content = $scope.content.content;
                    Advise.update(updateItem.advice_id, updateItem).then(function (data) {
                        $scope.load();
                        SweetAlert.swal('成功', '编辑更新成功！', 'success');
                    }, function () {
                        SweetAlert.swal('错误', '编辑更新失败！', 'error');
                    })
                    break;
                }
            }
        };
    })
    .controller('countryAdviceMgrController', function ($scope, countryrisk, CountryAdvise, FileUploader, SweetAlert) {
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            $scope.coungryChange();
        });
        $scope.model = {};
        $scope.coungryChange = function () {
            CountryAdvise.getByCountryAndType($scope.selCountry, $scope.typeSel).then(function (data) {
                $scope.model = data;
            });
        };
        $scope.saveType1 = function () { //驻地国安保管理更新
            if ($scope.model.advice_id == 0) { //add
                CountryAdvise.add($scope.model).then(function () {
                    SweetAlert.swal('成功', '保存成功', 'success');
                }, function (status) {
                    SweetAlert.swal('错误', '保存失败', 'error');
                });
            } else { //edit
                CountryAdvise.update($scope.model.advice_id, $scope.model).then(function () {
                    SweetAlert.swal('成功', '保存成功', 'success');
                }, function (status) {
                    SweetAlert.swal('错误', '保存失败', 'error');
                });
            }
        };
        $scope.typeSel = 0;
        $scope.typeList = [{
            id: 0,
            name: '海外国家基本情况'
        }, {
            id: 1,
            name: '海外项目出行指南'
        }, {
            id: 2,
            name: '项目安保资源'
        }, {
            id: 4,
            name: '高层访问安保管理'
        }];
        $scope.uploaderCtl = new FileUploader({
            queueLimit: 1,
            autoUpload: false,
            url: 'apis/api/CountryAdvice?country=' + $scope.selCountry
        });
        $scope.upload = function () {
            angular.forEach($scope.uploaderCtl.queue, function (file) {
                var f = file.upload();
            })
        };
        $scope.uploaderCtl.onSuccessItem = function (fileItem, response, status, headers) {
            if (response.eCode == 0) {
                SweetAlert.swal('成功', '上传文件成功！', 'success');
                $scope.model.advice_file = response.file;
            } else {
                SweetAlert.swal('错误', response.msg, 'error');
            }
        };
        $scope.uploaderCtl.onErrorItem = function (fileItem, response, status, headers) {
            SweetAlert.swal('错误', '上传文件失败！', 'error');
        };
    })
    .controller('countryAdviceController', function ($scope, countryrisk, AccessRecord,
        ngDialog, CountryAdvise) {
        var ele = angular.element('#mapFrame')[0];
        ele.onload = ele.onreadystatechange = function () {
            ele.height = document.body.offsetHeight - 220;
        };
        $scope.selCountry = 1;
        $scope.mapUrl = 'app/views/SecuritySystem/residentMap.html?id=' + $scope.selCountry;
        $scope.countryChange = function () {
            $scope.mapUrl = 'app/views/SecuritySystem/residentMap.html?id=' + $scope.selCountry;
            $scope.text = '';
            CountryAdvise.getByCountryAndType($scope.selCountry, $scope.typeSel).then(function (d) {
                $scope.text = d.advice_content;
                $scope.downFile = d.advice_file;
            });
        };
        $scope.changeType = function (t) {
            $scope.typeSel = t;
            $scope.text = '';
            CountryAdvise.getByCountryAndType($scope.selCountry, t).then(function (d) {
                $scope.text = d.advice_content;
                $scope.downFile = d.advice_file;
            })

        };
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            AccessRecord.get().then(function (data) {
                $scope.records = data;
            });
        });
        $scope.getCountryName = function (id) {
            var item = null;
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) {
                    item = $scope.countryList[i];
                    break;
                }
            }
            return item != null ? item.name : "";
        };
        $scope.typeSel = -1;
        $scope.typeList = [{
            id: -1,
            label: '驻地国所在位置'
        }, {
            id: 0,
            label: '海外国家基本情况'
        }, {
            id: 1,
            label: '海外项目出行指南'
        }, {
            id: 2,
            label: '项目安保资源'
        }, {
            id: 4,
            label: '高层访问安保管理'
        }];
        $scope.treeCtl = {};
        $scope.treeClick = function (branch) {
            $scope.changeType(branch.id);
        };
    })
    .controller('accessRecordController', function ($scope, $state, AccessRecord, countryrisk, ngDialog) {
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            AccessRecord.get().then(function (data) {
                $scope.records = data;
            });
        });
        $scope.getCountryName = function (id) {
            var item = null;
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) {
                    item = $scope.countryList[i];
                    break;
                }
            }
            return item != null ? item.name : "";
        };
        $scope.viewrecord = function (obj) {
            $scope.record = obj;
            ngDialog.open({
                template: 'details.html',
                scope: $scope,
                width: '800px'
            });
        };
    })
    .controller('accessRecordMgrController', function ($scope, $state, AccessRecord, countryrisk) { //高层出访记录管理
        countryrisk.get().then(function (d) {
            $scope.countryList = d;
            AccessRecord.get().then(function (data) {
                $scope.records = data;
            });
        });
        $scope.add = function () {
            $state.go('app.addaccessrecord');
        };
        $scope.getCountryName = function (id) {
            var item = null;
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) {
                    item = $scope.countryList[i];
                    break;
                }
            }
            return item != null ? item.name : "";
        };
        $scope.edit = function (record) {
            $state.go('app.addaccessrecord', {
                record: record
            });
        };
    })
    .controller('addAccessRecordsController', function ($scope, $state, $stateParams, toaster, countryrisk, AccessRecord) {
        $scope.countryList = [];
        $scope.record = $stateParams.record;
        $scope.bAdd = !$scope.record;
        if ($scope.bAdd) {
            $scope.record = {
                record_id: 0,
                record_time: moment().toDate(),
                end_time: moment().toDate(),
                record_content: '',
                country_id: 1
            }
        } else {
            $scope.record.record_time = moment($scope.record.record_time, 'YYYYMMDD').toDate();
            $scope.record.end_time = moment($scope.record.end_time, 'YYYYMMDD').toDate();
        }
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
        });
        $scope.validateInput = function (name) {
            var input = $scope.addForm[name];
            return input.$invalid;
        };
        $scope.formSumbit = function () { //提交表单
            if ($scope.addForm.$valid == false) return;
            $scope.record.record_time = moment($scope.record.record_time).format('YYYYMMDD');
            $scope.record.end_time = moment($scope.record.end_time).format('YYYYMMDD');
            if ($scope.bAdd) { //add
                AccessRecord.add($scope.record).then(function (data) {
                    $state.go('app.accessrecordmgr');
                }, function (status) {
                    $scope.record.record_time = moment($scope.record.record_time, 'YYYYMMDD').toDate();
                    $scope.record.end_time = moment($scope.record.end_time, 'YYYYMMDD').toDate();
                    toaster.pop('error', "新添加高层出访记录", "Failed");
                });
            } else {
                AccessRecord.update($scope.record.record_id, $scope.record).then(function (d) {
                    $state.go('app.accessrecordmgr');
                }, function (status) {
                    $scope.record.record_time = moment($scope.record.record_time, 'YYYYMMDD').toDate();
                    $scope.record.end_time = moment($scope.record.end_time, 'YYYYMMDD').toDate();
                    toaster.pop('error', "编辑高层出访记录", "Failed");
                })
            }
        };
        $scope.cancel = function () {
            $state.go('app.accessrecordmgr');
        };
    })
    .controller('medicalAdviceController', function ($scope, countryrisk, CountryAdvise) {
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            $scope.load();
        });
        $scope.load = function () {
            CountryAdvise.getByCountryAndType($scope.selCountry, $scope.typeSel).then(function (data) {
                $scope.model = data;
            });
        };
        $scope.typeSel = 5;
        $scope.typeList = [{
            id: 5,
            name: '流行病介绍'
        }, {
            id: 6,
            name: '疫苗推荐'
        }];
    })
    .controller('medicalAdviceMgrController', function ($scope, countryrisk, CountryAdvise, SweetAlert) {
        $scope.selCountry = 1;
        countryrisk.get().then(function (data) {
            $scope.countryList = [];
            angular.forEach(data, function (item) {
                if (item.security_id && item.politics_id)
                    $scope.countryList.push(item);
            });
            $scope.selCountry = $scope.countryList[0].country_id;
            $scope.load();
        });
        $scope.load = function () {
            CountryAdvise.getByCountryAndType($scope.selCountry, $scope.typeSel).then(function (data) {
                $scope.model = data;
            });
        };
        $scope.save = function () {
            if ($scope.model.advice_id == 0) { //add
                CountryAdvise.add($scope.model).then(function () {
                    SweetAlert.swal('成功', '保存成功', 'success');
                }, function (status) {
                    SweetAlert.swal('错误', '保存失败', 'error');
                });
            } else { //edit
                CountryAdvise.update($scope.model.advice_id, $scope.model).then(function () {
                    SweetAlert.swal('成功', '保存成功', 'success');
                }, function (status) {
                    SweetAlert.swal('错误', '保存失败', 'error');
                });
            }
        };
        $scope.typeSel = 5;
        $scope.typeList = [{
            id: 5,
            name: '流行病介绍'
        }, {
            id: 6,
            name: '疫苗推荐'
        }];
        $scope.content = '';
    })
    .controller('curseMgrController', function ($scope, $filter, Traincourse, ngDialog, TraincoursePerson, TraincourseUser, SweetAlert) {
        $scope.curses = null;
        $scope.persons = null;
        $scope.userCurses = null;
        $scope.selUserCurses = null;
        $scope.person = null;
        $scope.$watch('person', function (newVal, oldVal) {
            $scope.selUserCurses = [];
            angular.forEach($scope.userCurses, function (item) {
                if (item.user_id == newVal) {
                    $scope.selUserCurses.push(item);
                }
            });
        });
        $scope.loadPerson = function () {
            TraincourseUser.get().then(function (dt) {
                $scope.userCurses = dt;
                TraincoursePerson.get().then(function (data) {
                    $scope.persons = data;
                    $scope.person = data[0].person_id;
                });
            });
        };
        $scope.curseName = function (id) {
            for (var i = 0; i < $scope.curses.length; ++i) {
                if ($scope.curses[i].course_id == id) {
                    return $scope.curses[i].name;
                }
            }
        };
        $scope.loadCurses = function () {
            Traincourse.get().then(function (data) {
                $scope.curses = data;
                $scope.loadPerson();
            });
        };
        $scope.loadCurses();
        $scope.updateCurse = function (id) {
            for (var i = 0; i < $scope.curses.length; ++i) {
                if ($scope.curses[i].course_id == id) {
                    Traincourse.update(id, $scope.curses[i]).then(function (dt) {
                        SweetAlert.swal('成功', '编辑成功', 'success');
                    }, function () {
                        SweetAlert.swal('错误', '编辑失败', 'error');
                        $scope.loadCurses();
                    });
                    break;
                }
            }
        };
        $scope.addCurse = function () {
            ngDialog.open({
                template: 'addDlg',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, $filter, ngDialog, SweetAlert, Traincourse) {
                    $scope.vm = {
                        course_id: 0,
                        name: '',
                        name_en: '',
                        note: '',
                        note_en: ''
                    };
                    $scope.ok = function () {
                        if (!$scope.vm.name) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('classname') + $filter('T')('error'), "error");
                            return;
                        }
                        Traincourse.add($scope.vm).then(function (data) {
                            $scope.$parent.curses.push(data);
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('success'), $filter('T')('addclass') + $filter('T')('success'), "success");
                        }, function (status) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('addclass') + $filter('T')('error'), "error");
                        });
                    };
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                }
            });
        };
        $scope.editCurse = function (u) {
            $scope.selCurse = u;
            ngDialog.open({
                template: 'addDlg',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, $filter, ngDialog, SweetAlert, Traincourse) {
                    $scope.vm = angular.copy($scope.$parent.selCurse);
                    $scope.ok = function () {
                        if (!$scope.vm.name) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('classname') + $filter('T')('error'), "error");
                            return;
                        }
                        Traincourse.update($scope.vm.course_id, $scope.vm).then(function (data) {
                            var ary = [];
                            $.each($scope.$parent.curses, function (i, item) {
                                if (item.course_id == $scope.vm.course_id) {
                                    ary.push($scope.vm);
                                } else {
                                    ary.push(item);
                                }
                            });
                            $scope.$parent.curses = ary;
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('success'), $filter('T')('edit') + $filter('T')('success'), "success");
                        }, function (status) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('edit') + $filter('T')('error'), "error");
                        });
                    };
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                }
            });
        };
        $scope.delCurse = function (id) {
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter("T")('singledelete'),
                cancelButtonText: $filter("T")('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    Traincourse.delete(id).then(function (data) {
                        var ary = [];
                        angular.forEach($scope.curses, function (item) {
                            if (item.course_id != id) {
                                ary.push(item);
                            }
                        });
                        $scope.curses = ary;
                        SweetAlert.swal($filter('T')('success'), $filter('T')('singledelete') + $filter('T')('success'), "success");
                    }, function (status) {
                        SweetAlert.swal($filter('T')('error'), $filter('T')('singledelete') + $filter('T')('error'), "error");
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        };
        $scope.curseDesign = function () {
            ngDialog.open({
                template: 'addDlg1',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, $filter, ngDialog, SweetAlert, TraincourseUser) {
                    $scope.curses = $scope.$parent.curses;
                    $scope.person = $scope.$parent.person;
                    $scope.selUserCurses = $scope.$parent.selUserCurses;
                    $scope.courseList = [];
                    $scope.vm = {
                        id: 0,
                        user_id: $scope.$parent.person,
                        course_id: 0,
                        select_type: 0
                    };
                    $scope.statusList = [{ id: 0, label: $filter('T')('Elective') }, { id: 1, label: $filter('T')('Require') }];
                    angular.forEach($scope.curses, function (item) {
                        var flag = false;
                        $.each($scope.selUserCurses, function (i, selCur) {
                            if (item.course_id == selCur.course_id) {
                                flag = true;
                                return false;
                            }
                        });
                        if (flag == false) $scope.courseList.push(item);
                    });
                    if ($scope.courseList.length > 0) $scope.vm.course_id = $scope.courseList[0].course_id;
                    $scope.ok = function () {
                        TraincourseUser.add($scope.vm).then(function (data) {
                            $scope.$parent.selUserCurses.push(data);
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('success'), $filter('T')('classdesign') + $filter('T')('success'), "success");
                        }, function (status) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('classdesign') + $filter('T')('error'), "error");
                        });
                    };
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                }
            });
        };
        $scope.editCurseDesign = function (u) {
            $scope.selCurse = u;
            ngDialog.open({
                template: 'editDlg',
                scope: $scope,
                className: 'ngdialog-theme-default',
                showClose: false,
                closeByDocument: false,
                controller: function ($scope, $filter, ngDialog, SweetAlert, TraincourseUser) {
                    $scope.vm = angular.copy($scope.$parent.selCurse);
                    $scope.statusList = [{ id: 0, label: $filter('T')('Elective') }, { id: 1, label: $filter('T')('Require') }];
                    $scope.courName = function (id) {
                        return $scope.$parent.curseName(id);
                    };
                    $scope.ok = function () {
                        TraincourseUser.update($scope.vm.id, $scope.vm).then(function (data) {
                            var ary = [];
                            angular.forEach($scope.$parent.selUserCurses, function (item) {
                                if (item.id == $scope.vm.id) ary.push($scope.vm);
                                else ary.push(item);
                            });
                            $scope.$parent.selUserCurses = ary;
                            ngDialog.closeAll();
                            SweetAlert.swal($filter('T')('success'), $filter('T')('edit') + $filter('T')('classdesign') + $filter('T')('success'), "success");
                        }, function (status) {
                            SweetAlert.swal($filter('T')('error'), $filter('T')('edit') + $filter('T')('classdesign') + $filter('T')('error'), "error");
                        });
                    };
                    $scope.close = function () {
                        ngDialog.closeAll();
                    };
                }
            });
        };
        $scope.delDesignCurse = function (id) {
            SweetAlert.swal({
                title: $filter('T')('determinedelete'),
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter("T")('singledelete'),
                cancelButtonText: $filter("T")('cancel'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    TraincourseUser.delete(id).then(function (data) {
                        var ary = [];
                        angular.forEach($scope.selUserCurses, function (item) {
                            if (item.id != id) ary.push(item);
                        });
                        $scope.selUserCurses = ary;
                        SweetAlert.swal($filter('T')('success'), $filter('T')('singledelete') + $filter('T')('success'), "success");
                    }, function (status) {
                        SweetAlert.swal($filter('T')('error'), $filter('T')('singledelete') + $filter('T')('error'), "error");
                    });
                } else {
                    SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
                }
            });
        };
    })
    .controller('curseControll', function ($scope, Traincourse, TraincoursePerson, TraincourseUser) {
        $scope.curses = null;
        $scope.persons = null;
        $scope.userCurses = null;
        $scope.selUserCurses = null;
        $scope.person = null;
        $scope.$watch('person', function (newVal, oldVal) {
            $scope.selUserCurses = [];
            angular.forEach($scope.userCurses, function (item) {
                if (item.user_id == newVal) {
                    $scope.selUserCurses.push(item);
                }
            });
        });
        $scope.loadPerson = function () {
            TraincourseUser.get().then(function (dt) {
                $scope.userCurses = dt;
                TraincoursePerson.get().then(function (data) {
                    $scope.persons = data;
                    $scope.person = data[0].person_id;
                });
            });
        };
        $scope.curseName = function (id) {
            for (var i = 0; i < $scope.curses.length; ++i) {
                if ($scope.curses[i].course_id == id) {
                    return $scope.curses[i].name;
                }
            }
        };
        $scope.loadCurses = function () {
            Traincourse.get().then(function (data) {
                $scope.curses = data;
                $scope.loadPerson();
            });
        };
        $scope.loadCurses();
    })
    .controller('indexController', function ($scope, ngDialog) {
        var ele = angular.element('#mapFrame')[0];
        ele.onload = ele.onreadystatechange = function () {
            ele.height = document.body.offsetHeight - 255;
        };
    })
    .controller('riskTableController', function ($scope, SecuritySystem) {
        SecuritySystem.GetWaring().then(function (data) {
            $scope.warningList = data;
        });
        $scope.getGrade = function (grade) {
            if (grade == 1) return "I级";
            else if (grade == 2) return "II级";
            else if (grade == 3) return "III级";
            else if (grade == 4) return "IV级";
            else if (grade == 5) return "V级";
            else return "V级";
        };
        $scope.getdwli = function (item) {
            if (item.dwli) {
                return item.dwli.toFixed(2);
            } else
                return "-";
        };
        $scope.getbkcolor = function (risk) {
            if (risk > 0.9) {
                return "#990000";
            } else if (risk > 0.8) {
                return "#B43D23";
            } else if (risk > 0.7) {
                return "#B43D23";
            } else if (risk > 0.6) {
                return "#DB9856";
            } else if (risk > 0.5) {
                return "#EDE680";
            } else if (risk > 0.4) {
                return "#C9DE79";
            } else if (risk > 0.3) {
                return "#A6D671";
            } else if (risk > 0.2) {
                return "#76CB68";
            } else if (risk > 0.1) {
                return "#00B050";
            } else
                return "#00B050";
            return "#FF0000";
        };
        $scope.getgradebkcolor = function (grade) {
            if (grade == 1)
                return "#FF0000";
            else if (grade == 2)
                return "#FF9933";
            else if (grade == 3)
                return "#FFFF66";
            else if (grade == 4)
                return "#00CC99";
            else if (grade == 5)
                return "#00B050";
            else
                return "#00B050";
        };
    })
    .controller('eventListController', function ($scope, $stateParams, SecuritySystem, countryrisk) {
        $scope.month = $stateParams.month;
        $scope.events = [];
        $scope.getCountryName = function (id) {
            var item = null;
            for (var i = 0; i < $scope.countryList.length; ++i) {
                if ($scope.countryList[i].country_id == id) {
                    item = $scope.countryList[i];
                    break;
                }
            }
            return item != null ? item.name : "";
        };
        countryrisk.get().then(function (data) {
            $scope.countryList = data;
            var m = $scope.month < 10 ? '0' + $scope.month : $scope.month;
            var st = moment().format('YYYY') + m + '01';
            var et = moment(st, 'YYYYMMDD').add(1, 'months').add(-1, 'days').format('YYYYMMDD');
            var obj = {
                sTime: st,
                eTime: et,
                country: -1,
                type: 2,
                user: -1
            };
            SecuritySystem.Events(obj).then(function (dt) {
                angular.forEach(dt, function (item) {
                    item.country_name = $scope.getCountryName(item.country_id);
                    item.content = item.content.replace(/[\r\n]/g, ""); //去掉回车换行
                    item.content = item.content.replace(/\ +/g, ""); //去掉空格
                    $scope.events.push(item);
                });
            });
        });


    })
    .controller('totalinfoController', function ($scope, $state, countryrisk, SecuritySystem) {
        $scope.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月',
            '八月', '九月', '十月', '十一月', '十二月'
        ];
        $scope.go = function (m, id) {
            $state.go('app.securitylist', {
                month: m,
                country: id
            });
        };
        SecuritySystem.totalInfos().then(function (data) {
            $scope.countryInfos = data;
            var arr1 = [];
            $scope.arr2 = [];
            for (var i = 0; i < data.length; i++) {
                arr1.push(data[i]);
                if (arr1.length == 12 || i == data.length - 1) {
                    $scope.arr2.push(arr1);
                    arr1 = [];
                }
            }
        });
    });
