angular.module('app.digitalmap', ['cnooc_service', 'cnooc_service.Weather', 'pascalprecht.translate', 'cnooc_service.digitalmap', 'ics_service.event'])
    // .config(['$translateProvider', function ($translateProvider) {
    //
    //     var lang = window.localStorage.lang || 'zh-cn';
    //     $translateProvider.preferredLanguage(lang);
    //     $translateProvider.useStaticFilesLoader({
    //         prefix: 'app/i18n/',
    //         suffix: '.json'
    //     });
    // }])
    // .filter("T", ['$translate', function ($translate) {
    //     return function (key) {
    //         if (key) {
    //             return $translate.instant(key);
    //         }
    //         else
    //             return key;
    //     };
    // }])
    .controller('locateCtrl', function ($scope, $http, $filter, $timeout, $location, position, organiztion, evacuationroute) {
        $scope.treeDatas = [];
        $scope.group_tree = tree = {};
        $scope.countries = [];

        $scope.changemap = function (type) {
            $scope.$broadcast("ChangeBaseMap", type);
        };

        var by = function (name) {
            return function (o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }
                else {
                    throw ("error");
                }
            }
        }


        $scope.changetreeselect = function (branch) {
            if (branch.data != undefined) {


                //$timeout($scope.$broadcast("ShowInfoWindow", { data: branch.data }), 3000);
                $scope.$broadcast("ShowInfoWindow", { data: branch.data });
                $scope.$broadcast("ZoomTo", { lon: branch.data.lon, lat: branch.data.lat });

            }
        }

        $scope.$on("layer-load", function (event, data) {
            //$scope.isEditRouting = false;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
            $('#allmap').height(document.body.offsetHeight - 205);
            var divheight = angular.element("#mainDiv").outerHeight();
            var mapheight = angular.element("#allmap").outerHeight();
            angular.element('#allmap').css("height", divheight + 'px');
            angular.element('#worker_legend').css("padding-top", (divheight - 120) + 'px');

            organiztion.getorganiztion().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.countries);
                $scope.treeDatas = $scope.formatDatas(insDatas);
                $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'country', show: 'show' });
                $scope.$broadcast("CreateOrganiztionMarker", { data: $scope.countries, layername: 'country', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();
            }, function (status) {
            })
        });

        $scope.formatDatas = function (data) {
            var tree = [];
            angular.forEach(data, function (item, i) {
                if (item.organiztion_id == '2016011802') {
                    tree.push({
                        label: item.organiztion_name, id: item.organiztion_id, selected: false, expanded: true, children: []
                    });
                }
            });
            if (tree.length > 0) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == tree[0].id) {
                        tree[0].children.push({
                            label: item.organiztion_name, id: item.organiztion_id, children: [], onSelect: $scope.changetreeselect, data: item
                        });
                    }
                });
                //$scope.group_tree.select_bran
                if (tree[0].children.length > 0) {
                    //tree[0].children[0].selected = true;
                    $scope.group_tree.select_branch(tree[0].children[0]);
                }
            }

            return tree;
        }

    })
    .controller('compCtrl', function ($scope, $http, $filter, $location, position, organiztion, emergencyresource, evacuationroute, utility, transport) {

        $scope.changemap = function (type) {
            $scope.$broadcast("ChangeBaseMap", type);
        };

        $scope.$on("layer-load", function (event, data) {
            $('#allmap').height(document.body.offsetHeight - 205);
        });
        //$scope.treeDatas = [];
        //$scope.group_tree = tree = {};
        $scope.countries = [];
        $scope.utilities = [];
        $scope.transports = [];
        $scope.positions = [];
        $scope.emergencies = [];

        var by = function (name) {
            return function (o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }
                else {
                    throw ("error");
                }
            }
        }

        $scope.changelayer = function (e, msg) {
            if (e.target.checked == true) {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "show" });
            }
            else {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "hide" });
            }
        };

        $scope.country_change = function () {
            //if (branch.data != undefined) {
            $scope.$broadcast("ZoomTo", { lon: $scope.country_select.lon, lat: $scope.country_select.lat, level: 12 });
            //}
        };


        $scope.changetreeselect = function (branch) {
            if (branch.data != undefined) {
                $scope.$broadcast("ZoomTo", { lon: branch.data.lon, lat: branch.data.lat });
            }
        }

        $scope.$on("layer-load", function (event, data) {
            //$scope.isEditRouting = false;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });

            organiztion.getorganiztion().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.countries);
                angular.forEach($scope.countries, function (item, i) {
                    if (item.parent_id == 2016011802) {
                        $scope.country_select = item;
                        return;
                    }
                });
                //$scope.treeDatas = $scope.formatDatas(insDatas);
                //$scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'country', show: 'show' });
                //$scope.$broadcast("CreateOrganiztionMarker", { data: $scope.countries, layername: 'country', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();
            }, function (status) {
            });

            emergencyresource.get().then(function (rs) {
                angular.copy(rs, $scope.emergencies);
                $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'emergency', show: 'show' });
                position.get().then(function (insDatas) {
                    //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                    angular.copy(insDatas, $scope.positions);
                    //$scope.treeDatas = $scope.formatDatas(insDatas);
                    $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'position', show: 'show' });
                    $scope.$broadcast("createpositionMarker", { data: $scope.positions, resource: rs, layername: 'position', url: 'app.orginfowindow' });
                    $scope.$broadcast("createemergencyMarker", { data: $scope.positions, resource: rs, layername: 'emergency', url: 'app.orginfowindow' });
                    //$scope.$apply();
                }, function (status) {
                });
            });


            utility.get().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.utilities);
                //$scope.treeDatas = $scope.formatDatas(insDatas);
                $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'utility', show: 'show' });
                $scope.$broadcast("createutilityMarker", { data: $scope.utilities, layername: 'utility', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();
            }, function (status) {
            });

            transport.get().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.transports);

                //$scope.treeDatas = $scope.formatDatas(insDatas);
                $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'transport', show: 'show' });
                $scope.$broadcast("createtransportMarker", { data: $scope.transports, layername: 'transport', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();
            }, function (status) {
            });


        });

    })
    .controller('UtilityMapCtrl', function ($scope, $http, $filter, $location, position, project, evacuationroute, utility, transport) {

        $scope.changemap = function (type) {
            $scope.$broadcast("ChangeBaseMap", type);
        };

        $scope.$on("layer-load", function (event, data) {
            $('#allmap').height(document.body.offsetHeight - 205);
            var divheight = angular.element("#mainDiv").outerHeight();
            var mapheight = angular.element("#allmap").outerHeight();
            angular.element('#allmap').css("height", divheight + 'px');
            angular.element('#worker_legend').css("padding-top", (divheight - 120) + 'px');
        });
        //$scope.treeDatas = [];
        //$scope.group_tree = tree = {};
        $scope.projects = [];
        $scope.utilities = [];
        //$scope.transports = [];
        //$scope.positions = [];

        var by = function (name) {
            return function (o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }
                else {
                    throw ("error");
                }
            }
        }

        $scope.changelayer = function (e, msg) {
            if (e.target.checked == true) {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "show" });
            }
            else {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "hide" });
            }
        };

        $scope.$on("layer-load", function (event, data) {
            //$scope.isEditRouting = false;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });

            $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'project', show: 'show' });

            project.get().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.projects);
                $scope.$broadcast("SetLayerMaxScale", { layername: 'project', maxscale: '40000000' });
                $scope.$broadcast("CreateProjectMarker", { data: $scope.projects, layername: 'project', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
            }, function (status) {
            });

            $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'utility', show: 'show' });

            utility.get().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.utilities);
                //$scope.treeDatas = $scope.formatDatas(insDatas);

                $scope.$broadcast("SetLayerMinScale", { layername: 'utility', maxscale: '40000000' });
                $scope.$broadcast("createutilityMarker", { data: $scope.utilities, layername: 'utility', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();
            }, function (status) {
            });
        });
    })
    .controller('CarSearchMapCtrl', function ($scope, $http, $filter, $location, position, organiztion, evacuationroute, utility, transport) {

        $scope.changemap = function (type) {
            $scope.$broadcast("ChangeBaseMap", type);
        };

        $scope.$on("layer-load", function (event, data) {
            $('#allmap').height(document.body.offsetHeight - 205);
            var divheight = angular.element("#mainDiv").outerHeight();
            var mapheight = angular.element("#allmap").outerHeight();
            angular.element('#allmap').css("height", divheight + 'px');
            angular.element('#worker_legend').css("padding-top", (divheight - 120) + 'px');
        });
        //$scope.treeDatas = [];
        //$scope.group_tree = tree = {};
        $scope.organiztions = [];
        //$scope.utilities = [];
        $scope.transports = [];
        //$scope.positions = [];

        var by = function (name) {
            return function (o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }
                else {
                    throw ("error");
                }
            }
        }

        $scope.changelayer = function (e, msg) {
            if (e.target.checked == true) {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "show" });
            }
            else {
                $scope.$broadcast("DisplayLayer", { layername: msg, status: "hide" });
            }
        };

        var loadcontrycars = function () {
            $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'organiztion', show: 'show' });

            organiztion.getorganiztion().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.organiztions);
                angular.forEach($scope.organiztions, function (item, i) {
                    item.carnum = 0;
                    item.shipnum = 0;
                });
                angular.forEach($scope.transports, function (item, i) {
                    angular.forEach($scope.organiztions, function (org, ii) {
                        if (item.organiztion_id == org.organiztion_id) {
                            if (item.type == '车辆') {
                                org.carnum++;
                            }
                            else
                                org.shipnum++;
                            return;
                        }
                    });
                });
                $scope.$broadcast("SetLayerMaxScale", { layername: 'organiztion', maxscale: '40000000' });
                $scope.$broadcast("CreateTransportOrganiztionMarker", { data: $scope.organiztions, layername: 'organiztion', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
            }, function (status) {
            });
        };

        $scope.$on("layer-load", function (event, data) {
            //$scope.isEditRouting = false;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });

            $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'transport', show: 'show' });


            transport.get().then(function (insDatas) {
                //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
                angular.copy(insDatas, $scope.transports);

                //$scope.treeDatas = $scope.formatDatas(insDatas);
                //$scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'transport', show: 'show' });
                $scope.$broadcast("SetLayerMinScale", { layername: 'transport', maxscale: '40000000' });
                $scope.$broadcast("createtransportMarker", { data: $scope.transports, layername: 'transport', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
                //$scope.$apply();

                loadcontrycars();
            }, function (status) {
            });


        });

    })
    .controller('ProjectManageCtrl', function ($scope, $http, $filter, $location, $state, project, organiztion, SweetAlert, toaster) {

        $scope.curId = -1;
        $scope.select_all = false;

        $scope.getjsondata = function (jsondata) {
            if (jsondata != null)
                return new Date(parseInt(jsondata.substr(6)));
            else
                return new Date();
        }

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.getCityName = function (cityid) {
            var area = "";
            angular.forEach($scope.allcities, function (data) {
                if (data.city_id == cityid) {
                    area = data.name;
                }
            })
            return area;
        };

        $scope.getProjectName = function (id) {
            var area = "";
            angular.forEach($scope.allprojects, function (data) {
                if (data.project_id == id) {
                    area = data.name;
                }
            })
            return area;
        };

        $scope.getCompanyName = function (id) {
            var area = "";
            angular.forEach($scope.companies, function (data) {
                if (data.organiztion_id == id) {
                    area = data.organiztion_name;
                }
            })
            return area;
        };


        $scope.load = function () {
            //$http.get('@Url.Action("GetProjects")').success(function (data) {
            //    $scope.disaster = data;
            //});
            project.get().then(function (data) {
                $scope.projects = data;
            }, function (error) {
            });

            organiztion.getorganiztion().then(function (data) {
                $scope.companies = [];
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == "2016011802") {
                        $scope.companies.push(item);//data;
                    }
                });

            }, function (error) {
            });
        };
        $scope.addproject = function () {
            $state.go('app.msaddproject', {});
        };
        this.select_all = false;

        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.projects, function (data) {
                data.selected = $scope.select_all;
            });
        };

        $scope.deletesome = function () {
            angular.forEach($scope.projects, function (data) {
                if (data.selected) {
                    $scope.delete(data.project_id);
                }
            });
        };

        $scope.deletesomeconfirm = function () {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.deletesome();
                }
            });
        };

        $scope.pop = function (title) {
            toaster.pop("warning", title, title);
        };

        $scope.edit = function (item) {
            $state.go('app.msaddproject', { data: item });
        };

        $scope.delete = function (id) {
            project.delete(id).then(function (data) {
                $scope.pop($filter('T')("已删除"));
                angular.forEach($scope.projects, function (data, index) {
                    if (data.project_id == id) {
                        $scope.projects.splice(index, 1);
                        return;
                    }
                });
            }, function (error) {

            });
        };

        $scope.deleteconfirm = function (id) {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.delete(id);
                }
            });
        };
        $scope.load();
    })
    .controller('AddProjectCtrl', function ($scope, $http, $filter, $stateParams, $location, $state, project, organiztion) {
        $scope.vm = { stage: '勘探' };
        $scope.vm.date = new Date();
        $scope.isedit = false;
        $scope.organiztions = [];
        var param = $stateParams.data;
        if (param) {
            $scope.vm = param;
            $scope.isedit = true;
            $scope.vm.date = new Date($scope.vm.create_time);
        }

        $scope.cancel = function () {
            $state.go("app.msprojectmanage");
        };

        organiztion.getorganiztion().then(function (data) {
            angular.forEach(data, function (item, i) {
                if (item.parent_id == '2016011802') {
                    $scope.organiztions.push(item);
                }
            });
            if ($scope.organiztions.length > 0) {
                $scope.vm.organiztion = $scope.organiztions[0];
                $scope.vm.lon = $scope.vm.organiztion.lon;
                $scope.vm.lat = $scope.vm.organiztion.lat;
                $scope.vm.organiztion_id = $scope.vm.organiztion.organiztion_id;
            }
            //$scope.organiztions = data;
        }, function (error) {

        });

        $scope.organiztion_change = function (e) {
            $scope.vm.lon = $scope.vm.organiztion.lon;
            $scope.vm.lat = $scope.vm.organiztion.lat;
            $scope.vm.organiztion_id = $scope.vm.organiztion.organiztion_id;
        };


        $scope.submitForm = function () {
            $scope.vm.create_time = $filter('date')($scope.vm.date, 'yyyy-MM-ddTHH:mm:ss');
            if ($scope.isedit) {
                project.update($scope.vm.project_id, $scope.vm).then(function (data) {
                    $state.go('app.msprojectmanage', {});
                }, function (error) {

                });
            }
            else {
                project.add($scope.vm).then(function (data) {
                    $state.go('app.msprojectmanage', {});
                }, function (error) {

                });
            }


        }
    })
    .controller('utilityManageCtrl', function ($scope, $http, $state, $filter, $location, organiztion, project, utility, SweetAlert, toaster) {

        $scope.types = ['旱灾', '洪涝', '台风', '风暴潮', '冻害', '雹灾', '海啸', '地震', '火山', '滑坡', '泥石流', '森林火灾', '农林病虫害', '宇宙辐射'];
        $scope.formdata = { type: '油田' };

        $scope.curId = -1;
        $scope.select_all = false;

        $scope.pop = function (title) {
            toaster.pop("warning", title, title);
        };

        $scope.getjsondata = function (jsondata) {
            if (jsondata != null)
                return new Date(parseInt(jsondata.substr(6)));
            else
                return new Date();
        }

        $scope.getCityName = function (city_id) {
            var area = "";
            angular.forEach($scope.allcities, function (data) {
                if (data.city_id == city_id) {
                    area = data.name;
                }
            })
            return area;
        };

        $scope.getProjectName = function (id) {
            var area = "";
            angular.forEach($scope.allprojects, function (data) {
                if (data.project_id == id) {
                    area = data.name;
                }
            })
            return area;
        };

        $scope.filtercities = function () {
            var id = $scope.country_select.country_id;
            $scope.cities = [];
            angular.forEach($scope.allcities, function (data) {
                if (data.country_id == id) {
                    $scope.cities.push(data);
                }
            });
            if ($scope.cities.length > 0) {
                $scope.city_select = $scope.cities[0];
            }
        };

        $scope.loadcountries = function () {
            // $http.get('@Url.Action("ContryList", "DigitalMap")').success(function (data) {
            //     $scope.countries = data;
            //     if (data.length > 0) {
            //         $scope.country_select = $scope.countries[0];
            //         $scope.filtercities();
            //     }
            // });
        };

        $scope.SelectCity = function (id) {
            angular.forEach($scope.allcities, function (data) {
                if (data.city_id == id) {
                    angular.forEach($scope.countries, function (item) {
                        if (item.country_id == data.country_id) {
                            $scope.country_select = item;
                            $scope.filtercities();
                            //break;
                        }
                    })
                    $scope.city_select = data;
                }
            })
        }

        $scope.SelectProject = function (id) {
            angular.forEach($scope.allprojects, function (data) {
                if (data.project_id == id) {
                    angular.forEach($scope.companies, function (item) {
                        if (item.organiztion_id == data.company) {
                            $scope.company_select = item;
                            $scope.filtercompany();
                            //$scope.project_select = data;
                            //break;
                        }
                    })
                    $scope.project_select = data;
                    $scope.filterproject();
                }
            })
        };

        $scope.loadcities = function () {
            // $http.get('@Url.Action("CityList", "DigitalMap")').success(function (data) {
            //     $scope.allcities = data;
            // });
        };

        $scope.filtercompany = function () {
            $scope.projects = [];
            angular.forEach($scope.allprojects, function (data) {
                if (data.organiztion_id == $scope.company_select.organiztion_id) {
                    $scope.projects.push(data);
                }
            });
            if ($scope.projects.length > 0) {
                $scope.project_select = $scope.projects[0];
                $scope.filterproject();
            }
        };


        $scope.filterproject = function () {
            $scope.formdata.lon = $scope.project_select.lon;
            $scope.formdata.lat = $scope.project_select.lat;
        };


        $scope.load = function () {
            organiztion.getorganiztion().then(function (data) {
                $scope.companies = [];
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == "2016011802") {
                        $scope.companies.push(item);//data;
                    }
                });
                $scope.loadproject();


            }, function (error) {
            });
        };

        $scope.loadproject = function () {
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.loadutilities();
            }, function (error) {

            });
        };

        $scope.loadutilities = function () {
            utility.get().then(function (data) {
                $scope.utilities = data;
            }, function (error) {

            });
        };

        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.utilities, function (data) {
                data.selected = $scope.select_all;
            });
        };
        // $scope.deletesome = function () {
        //     layer.confirm('@Html.GetLangbyKey("delsomes")？', function (index) {
        //         angular.forEach($scope.disaster, function (data) {
        //             if (data.selected) {
        //                 var id = data.utility_id;
        //                 $http.post('@Url.Action("DeleteUtility")', { id: id }).success(function (dt) {
        //                     if (dt.errCode == 1) {
        //                         var ary = [];
        //                         angular.forEach($scope.disaster, function (data) { if (data.utility_id != id) ary.push(data); });
        //                         $scope.disaster = ary;
        //
        //                         //layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //                     } else {
        //                         //layer.msg(data.msg);
        //                     }
        //                 });
        //             }
        //             layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //         });
        //     })
        // };

        $scope.deletesome = function () {
            angular.forEach($scope.utilities, function (data) {
                if (data.selected) {
                    $scope.delete(data.utility_id);
                }
            });
        };

        $scope.deletesomeconfirm = function () {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.deletesome();
                }
            });
        };

        $scope.load();
        $scope.loadcountries();
        $scope.loadcities();

        $scope.addutility = function () {
            $state.go('app.msaddutility', {});
        };

        $scope.edit = function (data) {
            $state.go('app.msaddutility', { data: data });
        }

        $scope.delete = function (id) {
            utility.delete(id).then(function (data) {
                //$state.go('app.msprojectmanage', {});
                $scope.pop($filter('T')("已删除"));
                angular.forEach($scope.utilities, function (data, index) {
                    if (data.utility_id == id) {
                        $scope.utilities.splice(index, 1);
                        return;
                    }
                });
                //$scope.disaster.remove(data);
            }, function (error) {

            });
        };

        $scope.deleteconfirm = function (id) {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.delete(id);
                }
            });
        };
    })

    .controller('AddUtilityCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, organiztion, project, countryrisk, countrycity, utility, FileUploader) {

        $scope.vm = { pic: '', type: '油田' };
        $scope.isedit = false;
        var param = $stateParams.data;
        if (param) {
            $scope.vm = param;
            $scope.isedit = true;
            $scope.vm.date = new Date($scope.vm.create_time);
            $scope.imgsrc = "http://" + $location.host() + ':' + $location.port() + $scope.vm.pic;
        }
        else {
            $scope.vm.date = new Date();
        }

        $scope.organiztions = [];
        $scope.allprojects = [];
        $scope.projects = [];
        $scope.countries = [];
        $scope.allcities = [];
        $scope.cities = [];
        organiztion.getorganiztion().then(function (data) {
            angular.forEach(data, function (item, i) {
                if (item.parent_id == '2016011802') {
                    $scope.organiztions.push(item);
                }
            });
            if ($scope.isedit) {
                for (var i = 0; i < $scope.organiztions.length; ++i) {
                    if ($scope.organiztions[i].organiztion_id == $scope.vm.organiztion_id) {
                        $scope.vm.organiztion = $scope.organiztions[i];
                        break;
                    }
                }
            } else {
                if ($scope.organiztions.length > 0) {
                    $scope.vm.organiztion = $scope.organiztions[0];
                }
            }
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.projects = [];
                angular.forEach($scope.allprojects, function (item, index) {
                    if (item.organiztion_id == $scope.vm.organiztion.organiztion_id) {
                        $scope.projects.push(item);
                    }
                });
                if ($scope.isedit) {
                    for (var i = 0; i < $scope.projects.length; ++i) {
                        if ($scope.projects[i].project_id == $scope.vm.project_id) {
                            $scope.vm.project = $scope.projects[i];
                            break;
                        }
                    }
                } else {
                    if ($scope.projects.length > 0) {
                        $scope.vm.project = $scope.projects[0];
                    }
                }
                countryrisk.get().then(function (data) {
                    $scope.countries = data;
                    angular.forEach($scope.countries, function (item, index) {
                        if ($scope.vm.organiztion.country_id == item.country_id) {
                            $scope.vm.select_country = item;
                        }
                    });
                    countrycity.get().then(function (data) {
                        $scope.allcities = data; $scope.cities = [];
                        angular.forEach($scope.allcities, function (item, index) {
                            if (item.country_id == $scope.vm.select_country.country_id) {
                                $scope.cities.push(item);
                            }
                        });
                        if ($scope.isedit) {
                            for (var i = 0; i < $scope.cities.length; ++i) {
                                if ($scope.cities[i].city_id == $scope.vm.city_id) {
                                    $scope.vm.select_city = $scope.cities[i];
                                    break;
                                }
                            }
                        } else {
                            if ($scope.cities.length > 0) {
                                $scope.vm.select_city = $scope.cities[0];
                            }
                        }
                        $scope.changeOrg();
                    });
                });
            });
        });

        $scope.changeOrg = function () {
            $scope.projects = [];
            angular.forEach($scope.allprojects, function (item, index) {
                if (item.organiztion_id == $scope.vm.organiztion.organiztion_id) {
                    $scope.projects.push(item);
                }
            });
            if ($scope.projects.length > 0) {
                $scope.vm.project = $scope.projects[0];
            }
            angular.forEach($scope.countries, function (item, index) {
                if ($scope.vm.organiztion.country_id == item.country_id) {
                    $scope.vm.select_country = item;
                    $scope.changeCounty();
                }
            });
        }

        $scope.changeCounty = function () {
            $scope.cities = [];
            angular.forEach($scope.allcities, function (item, index) {
                if (item.country_id == $scope.vm.select_country.country_id) {
                    $scope.cities.push(item);
                }
            });
            if ($scope.cities.length > 0) {
                $scope.vm.select_city = $scope.cities[0];
            }
        }

        $scope.loadorganiztion = function () {
            organiztion.getorganiztion().then(function (data) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == '2016011802') {
                        $scope.organiztions.push(item);
                    }
                });
                if (param) {
                    for (var i = 0; i < $scope.organiztions.length; ++i) {
                        if ($scope.organiztions[i].organiztion_id == $scope.vm.organiztion_id) {
                            $scope.vm.organiztion = $scope.organiztions[i];
                            break;
                        }
                    }
                } else {
                    if ($scope.organiztions.length > 0) {
                        $scope.vm.organiztion = $scope.organiztions[0];
                    }
                }
                $scope.loadprojects();
            }, function (error) {

            });
        };

        $scope.loadprojects = function () {
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.filterproject();
            }, function (error) {

            });
        };

        $scope.loadcountries = function () {
            countryrisk.get().then(function (data) {
                $scope.countries = data;
                if ($scope.countries.length > 0) {
                    $scope.vm.select_country = $scope.countries[0];
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

        $scope.filterproject = function () {

            // $scope.vm.lon = $scope.vm.organiztion.lon;
            // $scope.vm.lat = $scope.vm.organiztion.lat;

            angular.forEach($scope.countries, function (item, index) {
                if ($scope.vm.organiztion.country_id == item.country_id) {
                    $scope.vm.select_country = item;
                }
            });

            $scope.projects = [];
            angular.forEach($scope.allprojects, function (item, index) {
                if (item.organiztion_id == $scope.vm.organiztion.organiztion_id) {
                    $scope.projects.push(item);
                }
            });

            if (param) {
                for (var i = 0; i < $scope.projects.length; ++i) {
                    if ($scope.projects[i].project_id == $scope.vm.project_id) {
                        $scope.vm.project = $scope.projects[i];
                        break;
                    }
                }
            } else {
                if (!param && $scope.projects.length > 0) {
                    $scope.vm.project = $scope.projects[0];
                }
            }
        };





        $scope.filtercity = function () {
            $scope.cities = [];
            angular.forEach($scope.allcities, function (item, index) {
                if (item.country_id == $scope.vm.select_country.country_id) {
                    $scope.cities.push(item);
                }
            });
            if (param) {
                for (var i = 0; i < $scope.cities.length; ++i) {
                    if ($scope.cities[i].city_id == $scope.vm.city_id) {
                        $scope.vm.select_city = $scope.cities[i];
                        break;
                    }
                }
            } else {
                if ($scope.cities.length > 0) {
                    $scope.vm.select_city = $scope.cities[0];
                    $scope.city_change();
                }
            }
        };



        $scope.city_change = function () {
            if ($scope.vm.select_city.lon && $scope.vm.select_city.lat) {
                $scope.vm.lon = $scope.vm.select_city.lon;
                $scope.vm.lat = $scope.vm.select_city.lat;
            }
        };

        $scope.cancel = function () {
            $state.go('app.msmachinemanage', {});
        };


        var uploader = $scope.uploader = new FileUploader({
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
            $scope.vm.pic = "upload/" + response.path;
            // $scope.imgsrc = "http://"+$location.host()+':'+$location.port()+ response.path;
            $scope.imgsrc = "http://10.78.173.167/upload/" + response.path;
        };

        $scope.submitForm = function () {
            $scope.vm.create_time = $filter('date')($scope.vm.date, 'yyyy-MM-ddTHH:mm:ss');
            $scope.vm.project_id = $scope.vm.project.project_id;
            $scope.vm.city_id = $scope.vm.select_city.city_id;
            $scope.vm.country = $scope.vm.select_city.name;
            $scope.vm.city = $scope.vm.select_country.name;
            $scope.vm.organiztion_id = $scope.vm.organiztion.organiztion_id;

            if ($scope.isedit) {
                utility.update($scope.vm.utility_id, $scope.vm).then(function (data) {
                    console.log(data);
                    $state.go('app.msmachinemanage', {});
                }, function (error) {
                    console.log('edit error');
                });
            }
            else {
                utility.add($scope.vm).then(function (data) {
                    $state.go('app.msmachinemanage', {});
                }, function (error) {

                });
            }
        };

        // $scope.load();
    })

    .controller('DangerManageCtrl', function ($scope, $http, $state, $filter, $location, organiztion, project, utility, SweetAlert, toaster, icsdb) {

        $scope.types = ['旱灾', '洪涝', '台风', '风暴潮', '冻害', '雹灾', '海啸', '地震', '火山', '滑坡', '泥石流', '森林火灾', '农林病虫害', '宇宙辐射'];
        $scope.formdata = { type: '油田' };

        $scope.curId = -1;
        $scope.select_all = false;

        $scope.dangers = [];

        $scope.pop = function (title) {
            toaster.pop("warning", title, title);
        };

        $scope.getProjectName = function (id) {
            var area = "";
            angular.forEach($scope.allprojects, function (data) {
                if (data.project_id == id) {
                    area = data.name;
                }
            })
            return area;
        };


        $scope.load = function () {
            organiztion.getorganiztion().then(function (data) {
                $scope.companies = [];
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == "2016011802") {
                        $scope.companies.push(item);//data;
                    }
                });
                $scope.loadproject();


            }, function (error) {
            });
        };

        $scope.loadproject = function () {
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.loadutilities();
            }, function (error) {

            });
        };

        $scope.loadutilities = function () {
            icsdb.get("cnoocdanger").then(function (data) {
                $scope.dangers = data;
            });
        };

        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.utilities, function (data) {
                data.selected = $scope.select_all;
            });
        };

        $scope.deletesome = function () {
            angular.forEach($scope.utilities, function (data) {
                if (data.selected) {
                    $scope.delete(data.utility_id);
                }
            });
        };

        $scope.deletesomeconfirm = function () {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.deletesome();
                }
            });
        };

        $scope.load();

        $scope.addutility = function () {
            $state.go('app.msaddDanger', {});
        };

        $scope.edit = function (data) {
            $state.go('app.msaddDanger', { data: data });
        }

        $scope.delete = function (id) {
            icsdb.delete("cnoocdanger", id).then(function (data) {
                //$state.go('app.msprojectmanage', {});
                $scope.pop($filter('T')("已删除"));
                angular.forEach($scope.dangers, function (data, index) {
                    if (data.id == id) {
                        $scope.dangers.splice(index, 1);
                        return;
                    }
                });
                //$scope.disaster.remove(data);
            }, function (error) {

            });
        };

        $scope.deleteconfirm = function (id) {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.delete(id);
                }
            });
        };
    })

    .controller('AddDangerCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, organiztion, project, icsdb) {

        $scope.vm = {};
        $scope.isedit = false;
        var param = $stateParams.data;
        if (param) {
            $scope.vm = param;
            $scope.isedit = true;
            $scope.dt1 = new Date($scope.vm.createtime);
            $scope.dt2 = new Date($scope.vm.finishtime);
            // $scope.imgsrc = "http://"+$location.host()+':'+$location.port()+  $scope.vm.pic;
        }
        else {
            $scope.dt1 = new Date();
            $scope.dt2 = new Date();
        }

        $scope.organiztions = [];
        $scope.allprojects = [];
        $scope.projects = [];
        // $scope.countries=[];
        // $scope.allcities = [];
        //  $scope.cities = [];

        $scope.loadorganiztion = function () {
            organiztion.getorganiztion().then(function (data) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == '2016011802') {
                        $scope.organiztions.push(item);
                    }
                });
                if ($scope.organiztions.length > 0) {
                    $scope.vm.organiztion = $scope.organiztions[0];
                }
                $scope.loadprojects();
            }, function (error) {

            });
        };


        $scope.filterproject = function () {

            $scope.vm.lon = $scope.vm.organiztion.lon;
            $scope.vm.lat = $scope.vm.organiztion.lat;

            angular.forEach($scope.countries, function (item, index) {
                if ($scope.vm.organiztion.country_id == item.country_id) {
                    $scope.vm.select_country = item;
                }
            });

            $scope.projects = [];
            angular.forEach($scope.allprojects, function (item, index) {
                if (item.organiztion_id == $scope.vm.organiztion.organiztion_id) {
                    $scope.projects.push(item);
                }
            });
            if ($scope.projects.length > 0) {
                $scope.vm.project = $scope.projects[0];
            }
        };

        $scope.loadprojects = function () {
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.filterproject();
            }, function (error) {

            });
        };

        $scope.cancel = function () {
            $state.go('app.msmachinemanage', {});
        };

        $scope.submitForm = function () {
            $scope.vm.createtime = $filter('date')($scope.dt1, 'yyyy-MM-ddTHH:mm:ss');
            $scope.vm.finishtime = $filter('date')($scope.dt2, 'yyyy-MM-ddTHH:mm:ss');
            $scope.vm.projectid = $scope.vm.project.project_id;
            $scope.vm.organiztionid = $scope.vm.organiztion.organiztion_id;

            if ($scope.isedit) {
                icsdb.update("cnoocdanger", $scope.vm.id, $scope.vm).then(function (data) {
                    $state.go('app.msdangermanage', {});
                }, function (error) {

                });
            }
            else {
                icsdb.add("cnoocdanger", $scope.vm).then(function (data) {
                    $state.go('app.msdangermanage', {});
                }, function (error) {

                });
            }
        };

        $scope.load = function () {
            $scope.loadorganiztion();
        };

        $scope.load();


    })

    .controller('carmanageCtrl', function ($scope, $http, $filter, $state, organiztion, project, countryrisk, countrycity, transport, SweetAlert, toaster) {

        $scope.curId = -1;
        $scope.select_all = false;


        $scope.GetCompanyName = function (id) {
            var area = "";
            angular.forEach($scope.companies, function (data) {
                if (data.organiztion_id == id) {
                    area = data.organiztion_name;
                }
            })
            return area;
        }

        $scope.transports = [];

        $scope.load = function () {
            organiztion.getorganiztion().then(function (data) {
                $scope.companies = data;
                transport.get().then(function (data) {
                    $scope.transports = data;
                }, function (error) {

                });
            }, function (error) {

            });
        };

        $scope.addtransport = function () {
            $state.go('app.msaddtransport', {});
        };

        $scope.edit = function (data) {
            $state.go('app.msaddtransport', { data: data });
        }

        $scope.delete = function (id) {
            transport.delete(id).then(function (data) {
                angular.forEach($scope.transports, function (data, index) {
                    if (data.transport_id == id) {
                        $scope.transports.splice(index, 1);
                        return;
                    }
                });
                //$scope.disaster.remove(data);
            }, function (error) {

            });
        };

        $scope.deleteconfirm = function (id) {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.delete(id);
                }
            });
        };

        $scope.pop = function (title) {
            toaster.pop("warning", title, title);
        };

        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.transports, function (data) {
                data.selected = $scope.select_all;
            });
        };
        // $scope.deletesome = function () {
        //     layer.confirm('@Html.GetLangbyKey("delsomes")？', function (index) {
        //         angular.forEach($scope.disaster, function (data) {
        //             if (data.selected) {
        //                 var id = data.car_id;
        //                 $http.post('@Url.Action("DeleteTransport")', { id: id }).success(function (dt) {
        //                     if (dt.errCode == 1) {
        //                         var ary = [];
        //                         angular.forEach($scope.disaster, function (data) { if (data.car_id != id) ary.push(data); });
        //                         $scope.disaster = ary;
        //
        //                         //layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //                     } else {
        //                         //layer.msg(data.msg);
        //                     }
        //                 });
        //             }
        //             layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //         });
        //     })
        // };

        $scope.deletesome = function () {
            angular.forEach($scope.transports, function (data) {
                if (data.selected) {
                    $scope.delete(data.transport_id);
                }
            });
        };

        $scope.deletesomeconfirm = function () {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.deletesome();
                }
            });
        };
        $scope.load();
    })

    .controller('AddTransportCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, FileUploader, organiztion, project, countryrisk, countrycity, transport) {

        $scope.vm = { type: '车辆', status: '正常' };
        $scope.isedit = false;
        var param = $stateParams.data;
        if (param) {
            $scope.vm = param;
            $scope.isedit = true;
            $scope.vm.date = new Date($scope.vm.update_time);
            $scope.imgsrc = "http://" + $location.host() + ':' + $location.port() + $scope.vm.pic;
        }
        else {
            $scope.vm.date = new Date();
        }

        $scope.organiztions = [];
        $scope.allprojects = [];
        $scope.projects = [];
        $scope.countries = [];
        $scope.allcities = [];
        $scope.cities = [];

        $scope.loadorganiztion = function () {
            organiztion.getorganiztion().then(function (data) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == '2016011802') {
                        $scope.organiztions.push(item);
                    }
                });
                if ($scope.organiztions.length > 0) {
                    $scope.vm.organiztion = $scope.organiztions[0];
                }
                $scope.loadprojects();
            }, function (error) {

            });
        };


        $scope.filterproject = function () {

            $scope.vm.lon = $scope.vm.organiztion.lon;
            $scope.vm.lat = $scope.vm.organiztion.lat;

            angular.forEach($scope.countries, function (item, index) {
                if ($scope.vm.organiztion.country_id == item.country_id) {
                    $scope.vm.select_country = item;
                }
            });

            $scope.projects = [];
            angular.forEach($scope.allprojects, function (item, index) {
                if (item.organiztion_id == $scope.vm.organiztion.organiztion_id) {
                    $scope.projects.push(item);
                }
            });
            if ($scope.projects.length > 0) {
                $scope.vm.project = $scope.projects[0];
            }
        };

        $scope.loadprojects = function () {
            project.get().then(function (data) {
                $scope.allprojects = data;
                $scope.filterproject();
            }, function (error) {

            });
        };

        $scope.loadcountries = function () {
            countryrisk.get().then(function (data) {
                $scope.countries = data;
                if ($scope.countries.length > 0) {
                    $scope.vm.select_country = $scope.countries[0];
                }
                $scope.loadcities();
            }, function (error) {

            });
        };

        $scope.filtercity = function () {
            $scope.cities = [];
            angular.forEach($scope.allcities, function (item, index) {
                if (item.country_id == $scope.vm.select_country.country_id) {
                    $scope.cities.push(item);
                }
            });
            if ($scope.cities.length > 0) {
                $scope.vm.select_city = $scope.cities[0];
                $scope.city_change();
            }
        };

        $scope.loadcities = function () {
            countrycity.get().then(function (data) {
                $scope.allcities = data;
                $scope.filtercity();
            }, function (error) {

            });
        };

        $scope.city_change = function () {
            if ($scope.vm.select_city.lon && $scope.vm.select_city.lat) {
                $scope.vm.lon = $scope.vm.select_city.lon;
                $scope.vm.lat = $scope.vm.select_city.lat;
            }
        };


        var uploader = $scope.uploader = new FileUploader({
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
            $scope.vm.pic = response.path;
            // $scope.imgsrc = "http://"+$location.host()+':'+$location.port()+ response.path;
            $scope.imgsrc = "http://10.78.173.167/upload/" + response.path;
        };

        $scope.submitForm = function () {
            $scope.vm.update_time = $filter('date')($scope.vm.date, 'yyyy-MM-ddTHH:mm:ss');
            //$scope.vm.project_id = $scope.vm.project.project_id;
            //$scope.vm.city_id = $scope.vm.select_city.city_id;
            //$scope.vm.country = $scope.vm.select_city.name;
            //$scope.vm.city = $scope.vm.select_country.name;
            $scope.vm.organiztion_id = $scope.vm.organiztion.organiztion_id;

            if ($scope.isedit) {
                transport.update($scope.vm.transport_id, $scope.vm).then(function (data) {
                    $state.go('app.mscarmanage', {});
                }, function (error) {

                });
            }
            else {
                transport.add($scope.vm).then(function (data) {
                    $state.go('app.mscarmanage', {});
                }, function (error) {

                });
            }
        };

        $scope.cancel = function () {
            $state.go('app.mscarmanage', {});
        };

        $scope.load = function () {
            $scope.loadorganiztion();
            $scope.loadcountries();
        };

        $scope.load();


    })

    .controller('positionmanageCtrl', function ($scope, $http, $filter, $state, position, organiztion, SweetAlert, toaster) {

        $scope.curId = -1;
        $scope.select_all = false;


        $scope.GetCompanyName = function (id) {
            var area = "";
            angular.forEach($scope.companies, function (data) {
                if (data.organiztion_id == id) {
                    area = data.organiztion_name;
                }
            })
            return area;
        }

        $scope.load = function () {
            organiztion.getorganiztion().then(function (data) {
                $scope.companies = data;
                position.get().then(function (data) {
                    $scope.positions = data;
                }, function (error) {

                });
            }, function (error) {

            });
        };

        $scope.addposition = function () {
            $state.go('app.msaddposition', {});
        };

        $scope.edit = function (data) {
            $state.go('app.msaddposition', { data: data });
        }

        $scope.pop = function (title) {
            toaster.pop("warning", title, title);
        };

        $scope.delete = function (id) {
            position.delete(id).then(function (data) {
                //$state.go('app.msprojectmanage', {});
                $scope.pop($filter('T')("已删除"));
                angular.forEach($scope.positions, function (data, index) {
                    if (data.position_id == id) {
                        $scope.positions.splice(index, 1);
                        return;
                    }
                });
                //$scope.disaster.remove(data);
            }, function (error) {

            });
        };

        $scope.deleteconfirm = function (id) {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.delete(id);
                }
            });
        };

        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.positions, function (data) {
                data.selected = $scope.select_all;
            });
        };
        // $scope.deletesome = function () {
        //     layer.confirm('@Html.GetLangbyKey("delsomes")？', function (index) {
        //         angular.forEach($scope.disaster, function (data) {
        //             if (data.selected) {
        //                 var id = data.car_id;
        //                 $http.post('@Url.Action("DeleteTransport")', { id: id }).success(function (dt) {
        //                     if (dt.errCode == 1) {
        //                         var ary = [];
        //                         angular.forEach($scope.disaster, function (data) { if (data.car_id != id) ary.push(data); });
        //                         $scope.disaster = ary;
        //
        //                         //layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //                     } else {
        //                         //layer.msg(data.msg);
        //                     }
        //                 });
        //             }
        //             layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
        //         });
        //     })
        // };
        organiztion.getorganiztion().then(function (data) {
            $scope.organiztions = data;
        }, function (error) {
        });
        $scope.getorganiztionname = function (id) {
            var name = "";
            angular.forEach($scope.organiztions, function (item, i) {
                if (item.organiztion_id == id) {
                    name = item.organiztion_name;
                }
            })
            return name;
        };

        $scope.deletesome = function () {
            angular.forEach($scope.positions, function (data) {
                if (data.selected) {
                    $scope.delete(data.position_id);
                }
            });
        };

        $scope.deletesomeconfirm = function () {
            SweetAlert.swal({
                title: $filter('T')("确定删除吗?"),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: $filter('T')("确定"),
                cancelButtonText: $filter('T')("取消"),
                closeOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.deletesome();
                }
            });
        };
        $scope.load();
    })

    .controller('AddPositionCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, FileUploader, organiztion, project, position) {

        $scope.vm = { type: '大使馆' };
        $scope.isedit = false;
        var param = $stateParams.data;
        if (param) {
            $scope.vm = param;
            $scope.isedit = true;
            // $scope.vm.date = new Date($scope.vm.create_time);
            $scope.imgsrc = "http://" + $location.host() + ':' + $location.port() + $scope.vm.pic;
        }
        else {
            $scope.vm.date = new Date();
        }

        $scope.organiztions = [];

        $scope.loadorganiztion = function () {
            organiztion.getorganiztion().then(function (data) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == '2016011802') {
                        $scope.organiztions.push(item);
                    }
                });
                if ($scope.organiztions.length > 0) {
                    $scope.vm.organiztion = $scope.organiztions[0];
                }
            }, function (error) {

            });
        };


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
            $scope.vm.pic = "upload/" + response.path;
            $scope.imgsrc = "http://10.78.173.167/upload/" + response.path;
            //$scope.imgsrc = "http://"+$location.host()+':'+$location.port()+ response.path;
        };

        $scope.submitForm = function () {
            //$scope.vm.create_time = $filter('date')($scope.vm.date,'yyyy-MM-ddTHH:mm:ss');
            //$scope.vm.project_id = $scope.vm.project.project_id;
            //$scope.vm.city_id = $scope.vm.select_city.city_id;
            //$scope.vm.country = $scope.vm.select_city.name;
            //$scope.vm.city = $scope.vm.select_country.name;
            $scope.vm.organiztion_id = $scope.vm.organiztion.organiztion_id;

            if ($scope.isedit) {
                position.update($scope.vm.position_id, $scope.vm).then(function (data) {
                    $state.go('app.positionmanage', {});
                }, function (error) {

                });
            }
            else {
                position.add($scope.vm).then(function (data) {
                    $state.go('app.positionmanage', {});
                }, function (error) {

                });
            }
        };

        $scope.cancel = function () {
            $state.go('app.positionmanage', {});
        }

        $scope.load = function () {
            $scope.loadorganiztion();
            // $scope.loadcountries();
        };

        $scope.load();


    })

    .controller('evacuationrouteCtrl', function ($scope, $http, $filter, $location, position, organiztion, evacuationroute) {

        $scope.treeDatas = [];
        $scope.group_tree = tree = {};
        $scope.countries = [];
        //$scope.treechange = function () {
        //  tree.select_first_branch();
        //   tree.expand_branch();
        //};
        $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'country', show: 'show' });

        //$scope.$watch('treeDatas', $scope.treechange, true);

        organiztion.getorganiztion().then(function (insDatas) {
            //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
            angular.copy(insDatas, $scope.countries);
            $scope.treeDatas = $scope.formatDatas(insDatas);
            //$scope.$apply();
        }, function (status) {
        })


        var by = function (name) {
            return function (o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0;
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }
                else {
                    throw ("error");
                }
            }
        }


        $scope.routes = [];
        evacuationroute.get().then(function (insDatas) {
            $scope.routes = insDatas;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
            //$scope.$apply();
        }, function (status) {
        })

        $scope.ismapload = false;

        $scope.changetreeselect = function (branch) {
            if (branch.data != undefined && $scope.ismapload) {
                $scope.$broadcast("ZoomTo", { lon: branch.data.lon, lat: branch.data.lat, level: 10 });
            }
        }

        $scope.$on("layer-load", function (event, data) {
            $('#allmap').height(document.body.offsetHeight - 205);
            var divheight = angular.element("#mainDiv").outerHeight();
            var mapheight = angular.element("#allmap").outerHeight();
            angular.element('#allmap').css("height", divheight + 'px');
            $scope.ismapload = true;
            //angular.element('#worker_legend').css("padding-top", (divheight - 120) + 'px');
            //$scope.isEditRouting = false;
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
            evacuationroute.get().then(function (insDatas) {
                $scope.routes = insDatas;
                $scope.routes.sort(by('sort'));
                $scope.$broadcast("DisplayRoute", { data: $scope.routes });
                $scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'country', show: 'show' });
                $scope.$broadcast("CreateOrganiztionMarker", { data: $scope.countries, layername: 'country', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
            }, function (status) {
            })
        });

        $scope.$on("routechange", function (event, msg) {
            var id = msg.name;
            var data = msg.data;
            angular.forEach($scope.routes, function (item, i) {
                if (item.organiztion_id == id) {
                    evacuationroute.delete(item.route_id);
                }
            });
            var i = 0;
            angular.forEach(data, function (item, i) {
                var obj = { sort: i, organiztion_id: id };
                obj.lon = item.x;
                obj.lat = item.y;
                evacuationroute.add(obj);
            })
        });

        $scope.starteditroute = function () {
            var obj = tree.get_selected_branch();
            //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
            $scope.$broadcast("StartRoute", { name: obj.data.organiztion_id });
        }

        $scope.endeditroute = function () {
            $scope.$broadcast("EndRoute", null);
        }

        $scope.formatDatas = function (data) {
            var tree = [];
            angular.forEach(data, function (item, i) {
                if (item.organiztion_id == '2016011802') {
                    tree.push({
                        label: item.organiztion_name, id: item.organiztion_id, selected: false, expanded: true, children: []
                    });
                }
            });
            if (tree.length > 0) {
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == tree[0].id) {
                        tree[0].children.push({
                            label: item.organiztion_name, id: item.organiztion_id, children: [], onSelect: $scope.changetreeselect, data: item
                        });
                    }
                });
                //$scope.group_tree.select_bran
                if (tree[0].children.length > 0) {
                    //tree[0].children[0].selected = true;
                    $scope.group_tree.select_branch(tree[0].children[0]);
                }
            }

            return tree;
        }

        organiztion.getorganiztion().then(function (data) {
            $scope.organiztions = data;
        }, function (error) {
        });

        $scope.getorganiztionname = function (id) {
            var name = "";
            angular.forEach($scope.organiztions, function (item, i) {
                if (item.organiztion_id == id) {
                    name = item.organiztion_name;
                }
            })
            return name;
        };


        $scope.formdata = { type: '大使馆' };

    })

    .controller('orginfoCtrl', function ($scope, $http, $filter, $location, $stateParams, position, organiztion, evacuationroute) {
        var param = $stateParams.data;

        $scope.lon = '10';
        $scope.lat = '10';
        $scope.pic = "20";
    })

    .controller('framerouteCtrl', function ($scope, $stateParams) {
        $('#mainframe').height(document.body.offsetHeight - 205);
        $('#mainframe').width(document.body.offsetWidth);
        //var divheight = angular.element("#mainDiv").outerHeight();
        //var mapheight = angular.element("#allmap").outerHeight();
        //angular.element('#mainframe').css("height", divheight + 'px');
        //angular.element('#worker_legend').css("padding-top", (divheight - 120) + 'px');


        $scope.detailFrame = $stateParams.url;
    })

    .controller('EmergencyResourcesCtl', function ($scope, $stateParams, $state, emergencyresource, position, organiztion) {
        $scope.sources = [];
        $scope.organiztions = [];
        $scope.positions = [];
        $scope.select_all = false;
        $scope.selectall = function () {
            $scope.select_all = this.select_all;
            angular.forEach($scope.sources, function (item) {
                item.selected = $scope.select_all;
            });
        };
        $scope.load = function () {
            position.get().then(function (ps) {
                $scope.positions = ps;
                organiztion.getorganiztion().then(function (orgs) {
                    $scope.organiztions = orgs;
                    emergencyresource.get().then(function (data) {
                        angular.forEach(data, function (item) {
                            var p = $scope.positionName(item.fid);
                            item.positionName = p.name;
                            item.org = $scope.orgName(p.organiztion_id);
                            item.selected = false;
                        });
                        $scope.sources = data;
                    });
                });
            });
        };
        $scope.load();
        $scope.positionName = function (id) {
            for (var i = 0; i < $scope.positions.length; ++i) {
                var item = $scope.positions[i];
                if (item.position_id == id) {
                    return item
                }
            }
        };
        $scope.orgName = function (id) {
            for (var i = 0; i < $scope.organiztions.length; ++i) {
                var item = $scope.organiztions[i];
                if (item.organiztion_id == id) {
                    return item.organiztion_name;
                }
            }
        };
        $scope.add = function () {
            $state.go('app.addEmergencyResources', null);
        };
        $scope.edit = function (obj) {
            $state.go('app.addEmergencyResources', { data: obj });
        }
        $scope.delete = function (id) {
            emergencyresource.delete(id).then(function () {
                emergencyresource.get().then(function (data) {
                    angular.forEach(data, function (item) {
                        var p = $scope.positionName(item.fid);
                        item.positionName = p.name;
                        item.org = $scope.orgName(p.organiztion_id);
                        item.selected = false;
                    });
                    $scope.sources = data;
                });
            });
        }
    })

    .controller('addEmergencyResourcesCtrl', function ($scope, $filter, $stateParams, $state, organiztion, position, emergencyresource) {
        $scope.isEdit = false;
        $scope.title = 'add';
        $scope.vm = {};
        if ($stateParams.data) {
            $scope.isEdit = true;
            $scope.title = 'edit';
            $scope.vm = $stateParams.data;
            $scope.vm.time = new Date($scope.vm.time);
        } else {
            $scope.vm.time = new Date();
        }
        $scope.org = null;
        $scope.organiztions = [];
        $scope.positions = null;
        $scope.flist = [];
        $scope.load = function () {
            position.get().then(function (data) {
                $scope.positions = data;
                organiztion.getorganiztion().then(function (data) {
                    angular.forEach(data, function (item, i) {
                        if (item.parent_id == '2016011802') {
                            $scope.organiztions.push(item);
                        }
                    });
                    if ($scope.organiztions.length > 0) {
                        $scope.org = $scope.organiztions[0];
                        $scope.orgChange();
                    }
                }, function (error) {

                });
            }, function (error) {

            });
        };
        $scope.load();
        $scope.orgChange = function () {
            $scope.flist = [];
            angular.forEach($scope.positions, function (item) {
                if (item.organiztion_id == $scope.org.organiztion_id) {
                    $scope.flist.push(item);
                }
            });
            if ($scope.flist.length > 0) $scope.vm.fid = $scope.flist[0].position_id;
        };

        $scope.submitForm = function () {
            if ($scope.isEdit == false) {
                $scope.vm.time = $filter('date')($scope.vm.time, 'yyyy-MM-ddThh:mm:ss');
                emergencyresource.add($scope.vm).then(function () {
                    $state.go('app.EmergencyResourcesMgr');
                }, function (err) {
                    alert(err);
                })
            } else {
                $scope.vm.time = $filter('date')($scope.vm.time, 'yyyy-MM-ddThh:mm:ss');
                emergencyresource.update($scope.vm.id, $scope.vm).then(function () {
                    $state.go('app.EmergencyResourcesMgr');
                }, function (err) {
                    alert(err);
                })
            }
        };
        $scope.cancel = function () {
            $state.go('app.EmergencyResourcesMgr');
        };
    })