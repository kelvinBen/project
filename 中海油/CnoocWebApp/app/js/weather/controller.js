angular.module('app.weather', ['cnooc_service', 'cnooc_service.Weather', 'pascalprecht.translate', 'cnooc_service.digitalmap', 'cnooc_service.PublicSentiment']);

var curApp = angular.module('app.weather');

curApp.controller('disasterimportCtrl', function ($scope, $http, $filter, $state, Citydisaster, countryrisk, countrycity, SweetAlert, toaster) {

    $scope.date = {
        startDate: moment("20160101", "YYYYMMDD"),
        endDate: moment().add(1, "days")
    };

    $scope.checkAll = false;
    $scope.itemsByPage = 16;//每一页显示数量

    $scope.types = ['旱灾', '洪涝', '台风', '风暴潮', '冻害', '雹灾', '海啸', '地震', '火山', '滑坡', '泥石流', '森林火灾', '农林病虫害', '宇宙辐射'];
    $scope.formdata = {type: '旱灾', severity: 'IV级'};

    $scope.curId = -1;
    $scope.select_all = false;
    $scope.disaster = [];
    $scope.alldisaster = [];

    $scope.getjsondata = function (jsondata) {
        return new Date(parseInt(jsondata.substr(6)));
    }

    $scope.search = function () {
        $scope.disaster = [];
        angular.forEach($scope.alldisaster, function (data) {
            if ($scope.city_select.city_id == 0) {
                if ($scope.country_select.country_id == 0 || (data.country_id == $scope.country_select.country_id)) {
                    var dt = new Date(data.time);
                    //var day = moment(data.time);
                    if (dt <= $scope.date.endDate && dt >= $scope.date.startDate) {
                        $scope.disaster.push(data);
                    }
                }

            }
            else if (data.city_id == $scope.city_select.city_id) {
                //var dt = $scope.getjsondata(data.time);
                var dt = new Date(data.time);
                if (dt <= $scope.date.endDate && dt >= $scope.date.startDate) {
                    $scope.disaster.push(data);
                }
            }
        })
    };

    $scope.postdisaster = function (id) {
        angular.forEach($scope.disaster, function (data) {
            if (data.id == id) {
                //window.location.href = '@Url.Action("PostWarning")' + '?id=' + id+'&type=disaster';
                $state.go('app.postwarning', {type: 'disaster', data: data});
            }
        });
    };

    $scope.getCityName = function (countryid, cityid) {
        var area = "";
        angular.forEach($scope.countries, function (data) {
            if (data.country_id == countryid) {
                area = data.name;
            }
        })
        if (cityid != 0) {
            angular.forEach($scope.allcities, function (data) {
                if (data.city_id == cityid) {
                    area = area + '(' + data.name + ')';
                }
            })
        }

        return area;
    };

    $scope.filtercities = function () {
        if (!$scope.country_select)
            return;
        var id = $scope.country_select.country_id;
        $scope.cities = [];
        $scope.cities.push({city_id: 0, name: " "});
        angular.forEach($scope.allcities, function (data) {
            if (data.country_id == id) {
                $scope.cities.push(data);
            }
        });

        if ($scope.cities.length > 0) {
            $scope.city_select = $scope.cities[0];
        }
    };

    $scope.addDisaster = function () {
        $state.go("app.adddisaster", {});
    };

    $scope.editDisaster = function (data) {
        $state.go("app.adddisaster", {data: data});
    };

    $scope.loadcountries = function () {
        countryrisk.get().then(function (data) {
            $scope.countries = data;
            $scope.countries.splice(0, 0, {country_id: 0, name: "全部"});

            if ($scope.countries.length > 0) {
                $scope.country_select = $scope.countries[0];
            }
            $scope.loadcities();
        }, function (error) {

        });
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

    $scope.SelectCountry = function (id) {
        angular.forEach($scope.countries, function (data, i) {
            if (data.country_id == id) {
                $scope.country_select = data;
                $scope.filtercities();
            }
        })
    }

    $scope.loadcities = function () {
        countrycity.get().then(function (data) {
            $scope.allcities = data;
            $scope.filtercities();
        }, function (error) {

        });
    };

    $scope.load = function () {
        Citydisaster.get().then(function (data) {
            $scope.alldisaster = data;
            $scope.search();
        }, function (error) {
        });
    };

    $scope.selectall = function () {
        angular.forEach($scope.disaster, function (data) {
            data.selected = $scope.select_all;
        });
    };
    $scope.pop = function (title) {
        toaster.pop("warning", title, title);
    };

    $scope.deletesome = function () {
        angular.forEach($scope.disaster, function (data) {
            if (data.selected) {
                $scope.delete(data.id);
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
            }else {
                SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
            }
        });
    };
    $scope.delete = function (id) {
        Citydisaster.delete(id).then(function (data) {
            $scope.pop($filter('T')("已删除"));
            angular.forEach($scope.disaster, function (data, index) {
                if (data.id == id) {
                    $scope.disaster.splice(index, 1);
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
            }else {
                SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
            }
        });
    };
    $scope.load();
    $scope.loadcountries();
    $scope.loadcities();
});

curApp.controller('weathermapCtrl', function ($scope, $http, $filter, $timeout, $location, position, organiztion, evacuationroute, weatherex) {

    $scope.treeDatas = [];
    $scope.group_tree = tree = {};
    $scope.countries = [];

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


    $scope.$on("layer-load", function (event, data) {

        $('#allmap').height(document.body.offsetHeight - 205);
        var divheight = angular.element("#mainDiv").outerHeight();
        var mapheight = angular.element("#allmap").outerHeight();
        angular.element('#allmap').css("height", divheight + 'px');
        //$scope.isEditRouting = false;
        //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
        $scope.weathers = [];

        weatherex.GetLatestWeathers().then(function (data) {
            $scope.weathers = data;
            $scope.$broadcast("creategraphicLayer", {alpha: 1, layername: 'weather', show: 'show'});
            $scope.$broadcast("CreateWeatherMarker", {data: $scope.weathers, layername: 'weather'});
        }, function (error) {
        });
    });

});

curApp.controller('weathersearchControl', function ($scope, $http, weatherex, organiztion, utility) {

    $scope.weathertypes = [
        {weather: "晴", icon: "wi-day-sunny"},
        {weather: "多云", icon: "wi-day-cloudy"},
        {weather: "阴", icon: "wi-day-cloudy"},
        {weather: "阵雨", icon: "wi-day-rain"},
        {weather: "雷阵雨", icon: "wi-day-rain"},
        {weather: "雷阵雨伴有冰雹", icon: "wi-day-rain"},
        {weather: "雨夹雪", icon: "wi-day-rain"},
        {weather: "小雨", icon: "wi-day-rain"},
        {weather: "中雨", icon: "wi-day-rain"},
        {weather: "大雨", icon: "wi-day-rain"},
        {weather: "暴雨", icon: "wi-day-rain"},
        {weather: "大暴雨", icon: "wi-day-rain"},
        {weather: "特大暴雨", icon: "wi-day-rain"},
        {weather: "阵雪", icon: "wi-day-snow"},
        {weather: "小雪", icon: "wi-day-snow"},
        {weather: "中雪", icon: "wi-day-snow"},
        {weather: "大雪", icon: "wi-day-snow"},
        {weather: "暴雪", icon: "wi-day-snow"},
        {weather: "雾", icon: "wi-day-fog"},
        {weather: "冻雨", icon: "wi-day-sunny"},
        {weather: "沙尘暴", icon: "wi-day-sunny"},
        {weather: "小雨-中雨", icon: "wi-day-rain"},
        {weather: "中雨-大雨", icon: "wi-day-rain"},
        {weather: "大雨-暴雨", icon: "wi-day-rain"},
        {weather: "暴雨-大暴雨", icon: "wi-day-rain"},
        {weather: "大暴雨-特大暴雨", icon: "wi-day-rain"},
        {weather: "小雪-中雪", icon: "wi-day-snow"},
        {weather: "中雪-大雪", icon: "wi-day-snow"},
        {weather: "大雪-暴雪", icon: "wi-day-snow"},
        {weather: "沙尘", icon: "wi-day-cloudy-windy"},
        {weather: "扬尘", icon: "wi-day-cloudy-windy"},
        {weather: "强沙尘暴", icon: "wi-day-cloudy-windy"},
        {weather: "霾", icon: "wi-day-haze"},
    ];

    $scope.getweathericon = function (weather) {
        if (!weather)
            return "wi-day-sunny";
        var index = weather.indexOf('~');
        if (index != -1) {
            weather = weather.substring(0, index);
        }
        index = weather.indexOf('转');
        if (index != -1) {
            weather = weather.substring(0, index);
        }
        var icon = "wi-day-sunny";
        angular.forEach($scope.weathertypes, function (item, i) {
            if (item.weather == weather) {
                icon = item.icon;
            }
        });
        return icon;
    };
    $scope.cur_weather = {};
    $scope.loadutility = function () {
        var id = $scope.company_select.organiztion_id;
        //$http.get('@Url.Action("GetUtilities")' + '/' + id).success(function (data) {
        //    $scope.utilities = data;
        //    if (data.length > 0) {
        //        $scope.select_utility = $scope.utilities[0];
        //        $scope.utilities[0].class = "select_row";
        //        $scope.GetWeather();
        //    }
        //});
        utility.get().then(function (data) {
            $scope.utilities = [];
            angular.forEach(data, function (item, index) {
                if (item.organiztion_id == id) {
                    $scope.utilities.push(item);
                }
            });
            // $scope.utilities = data;
            if (data.length > 0) {
                $scope.select_utility = $scope.utilities[0];
                //$scope.select_utility.class = "select_row";
                $scope.GetWeather();
            }
        }, function (error) {
        });
    };

    $scope.load = function () {
        //$http.get('@Url.Action("GetOrgnization")').success(function (data) {
        //    $scope.companys = data;
        //    if (data.length > 0) {
        //        $scope.company_select = data[0];
        //        $scope.loadutility();
        //    }
        //});
        organiztion.getorganiztion().then(function (data) {
            $scope.companys = [];
            angular.forEach(data, function (item, index) {
                if (item.parent_id == '2016011802') {
                    $scope.companys.push(item);
                }
            });
            //$scope.companys = data;
            if ($scope.companys.length > 0) {
                $scope.company_select = $scope.companys[0];
                $scope.loadutility();
            }
        }, function (error) {
        });
    };

    $scope.changecompany = function (x) {
        $scope.loadutility();
    };

    $scope.SelectUtility = function (index) {
        $scope.select_utility = $scope.utilities[index];
        // $scope.select_country = $scope.utilities[index].country;
        $scope.GetWeather();
        angular.forEach($scope.utilities, function (data) {
            data.class = "";
        });
        $scope.utilities[index].class = "select_row";
    };

    $scope.GetWeather = function () {
        var cityid = $scope.select_utility.city_id;
        weatherex.GetLatestWeather(cityid).then(function (data) {
            $scope.weathers = angular.fromJson(data.jsondata);
            if ($scope.weathers.days.length > 0) {
                $scope.cur_weather = $scope.weathers.days[0];
            }
            angular.forEach($scope.weathers.days, function (item, i) {
                item.icon = "qing01";
            });

        }, function (error) {
        });
    };

    //$scope.select_city = "";
    // $scope.select_country = "";


    $scope.load();


});

curApp.controller('warnmapCtrl', function ($scope, $http, $filter, $timeout, $location, position, organiztion, evacuationroute, CityWeatherWarn, countrycity) {


    $scope.treeDatas = [];
    $scope.group_tree = tree = {};
    $scope.countries = [];

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


    $scope.loadcities = function () {
        countrycity.get().then(function (data) {
            $scope.allcities = data;
        });
    };

    $scope.loadcities();

    $scope.getCityName = function (cityid) {
        var city = {city_id: 0};
        angular.forEach($scope.allcities, function (data) {
            var id = data.city_id.toString();
            var scityid = cityid.toString();
            if (id.length > scityid.length) {
                id = id.substring(0, scityid.length);
            }
            if (id == cityid) {
                // area = '(' + data.name + ')';
                //city= data;
                angular.copy(data, city);
            }
        })
        return city;
    };


    $scope.$on("layer-load", function (event, data) {

        $('#allmap').height(document.body.offsetHeight - 205);
        //$scope.isEditRouting = false;
        //$scope.$broadcast("DisplayRoute", { data: $scope.routes });
        $scope.$broadcast("ZoomTo", {lon: 105.77, lat: 38.07, level: 4});
        $scope.warns = [];

        CityWeatherWarn.get().then(function (data) {
            angular.forEach(data, function (item, i) {
                var city = $scope.getCityName(item.city_id);
                if (city.city_id != 0) {
                    var obj = {};
                    angular.copy(item, obj);
                    obj.lon = city.lon;
                    obj.lat = city.lat;

                    var type = item.data;
                    var index = type.indexOf('.');
                    var temp = type.substring(index - 4, index);
                    var lb = parseInt(temp.substring(0, 2));
                    obj.icon = "http://www.weather.com.cn/m/i/alarm_s/" + temp + ".gif";
                    if (lb > 90) {
                        obj.icon = "http://www.weather.com.cn/m/i/alarm_s/0000.gif";
                    }

                    $scope.warns.push(obj);
                }
            });
            //$scope.warns = data;
            $scope.$broadcast("creategraphicLayer", {alpha: 1, layername: 'warn', show: 'show'});
            $scope.$broadcast("CreateWarnMarker", {data: $scope.warns, layername: 'warn'});
        }, function (error) {
        });

    });

});

curApp.controller('postwarningCtrl', function ($scope, $cookies, $http, $filter, $location, $stateParams, $state, Citydisaster, organiztion, countryrisk, CityWeatherWarn) {

    $scope.warndata = {};
    $scope.formdata = {type: '0', content: ""};
    $scope.orgs = [];
    $scope.countries = [];

    $scope.warndata = $stateParams.data;
    $scope.type = $stateParams.type;

    $scope.getcountryname = function (id) {
        var name = '';
        angular.forEach($scope.countries, function (item, i) {
            if (item.country_id == id) {
                name = item.name;
            }
        });
        return name;
    };

    $scope.sendmsg = function () {
        var content = $scope.formdata.content;
        var reg = new RegExp("\n", "g");
        content = content.replace(reg, "<br/>");
        var obj = {
            content: escape(content),
            title: "国际公司安保预警",
            category_type: 2,
            type: 2,
            top: 0,
            is_return: 0,
        };
        obj.content = content;
        obj.sms_content = $scope.formdata.content;
        $state.go('app.writeMessage', {data: obj});
        //angular.copy($scope.formdata.content, obj.sms_content);
        // obj.sms_content = escape(content);
        //$cookies.put("websitemessage", obj);
        //$cookies.putObject("websitemessage", obj, { path: '/' });
        //$cookieStore.put("persion", {
        //     name: "my name",
        //    age: 18
        // });
        // window.location.href = '@Url.Action("Write","PublicSentiment")';
    };

    $scope.loadorg = function () {
        countryrisk.get().then(function (data) {
            $scope.countries = data;

            organiztion.getorganiztion().then(function (data) {
                $scope.orgs = [];
                angular.forEach(data, function (item, i) {
                    if (item.parent_id == '2016011802' && item.country_id == $scope.warndata.country_id) {
                        item.country_name = $scope.getcountryname(item.country_id);
                        $scope.orgs.push(item);
                    }
                });
                if ($scope.orgs.length > 0) {
                    $scope.org_select = $scope.orgs[0];
                }
                $scope.changetype();
            }, function (error) {
            });

        }, function (error) {
        });

    }

    $scope.load = function () {
        if ($scope.type == "disaster") {
            Citydisaster.getdetail($scope.warndata.id).then(function (data) {
                //$scope.warndata = data;
                $scope.loadorg();
            }, function (error) {
            });
        }
        else {
            CityWeatherWarn.getdetail($scope.warndata.warn_id).then(function (data) {
                $scope.warndata = data;
                $scope.loadorg();
            }, function (error) {
            });
        }


    };

    $scope.changetype = function () {
        if ($scope.formdata.type == '1') {
            if ("@type" == "disaster") {
                $scope.formdata.content = $scope.org_select.organiztion_name + ':\n' + $filter('date')($scope.warndata.time, 'yyyy年MM月dd日HH时') + '，您公司所在国家发生' + $scope.warndata.type + '灾害天气，' + $scope.org_select.country_name + '发布' + $scope.warndata.type + $scope.warndata.severity + '预警，请按照应急管理要求，组织应急处置工作。\n请知悉\n国际公司应急协调办公室\n' + $filter('date')(new Date(), 'yyyy年MM月dd日HH时');
            }
            else {
                $scope.formdata.content = $scope.org_select.organiztion_name + ':\n' + $filter('date')($scope.warndata.time, 'yyyy年MM月dd日HH时') + '，您公司所在国家发生' + $scope.warndata.type + '灾害天气，' + $scope.org_select.country_name + '发布' + $scope.warndata.type + $scope.warndata.severity + '预警，请按照应急管理要求，组织应急处置工作。\n请知悉\n国际公司应急协调办公室\n' + $filter('date')(new Date(), 'yyyy年MM月dd日HH时');
            }
        }
        else {
            var country_name = $scope.getcountryname($scope.warndata.country_id);
            var orgname = '';
            angular.forEach($scope.orgs, function (item, i) {
                if (orgname != '') {
                    orgname += ',';
                    orgname += item.organiztion_name;
                }
                else {
                    orgname += item.organiztion_name;
                }
            });
            $scope.formdata.content = '各应急管理委员会成员:\n' + $filter('date')($scope.warndata.time, 'yyyy年MM月dd日HH时') + orgname + '公司所在国家发生' + $scope.warndata.type + '灾害天气，' + country_name + '发布' + $scope.warndata.type + $scope.warndata.severity + '预警，国际公司应急协调办公室已通知相关单位按照应急管理要求，采取相应措施。\n请知悉\n国际公司应急协调办公室\n' + $filter('date')(new Date(), 'yyyy年MM月dd日HH时');
        }
    };

    $scope.load();
    $scope.types = ['旱灾', '洪涝', '台风', '风暴潮', '冻害', '雹灾', '海啸', '地震', '火山', '滑坡', '泥石流', '森林火灾', '农林病虫害', '宇宙辐射'];

    $scope.curId = -1;
    $scope.select_all = false;
    $scope.load();

});

curApp.controller('warnimportCtrl', function ($scope, $http, $filter, $state, CityWeatherWarn) {

    $scope.checkAll = false;
    $scope.itemsByPage = 12;//每一页显示数量

    $scope.types = ['台风', '暴雨', '暴雪', '寒潮', '大风', '沙尘暴', '高温', '干旱', '雷电', '冰雹', '霜冻', '大雾', '霾', '道路结冰', '雷雨大风', '森林火灾'];
    $scope.formdata = {type: '台风', level: '蓝色预警', status: '预警中'};

    $scope.curId = -1;
    $scope.select_all = false;

    $scope.getjsondata = function (jsondata) {
        return new Date(parseInt(jsondata.substr(6)));
    }

    $scope.postwarn = function (id) {
        angular.forEach($scope.warns, function (data) {
            if (data.warn_id == id) {
                //$scope.formdata = data;
                //$scope.curId = id;

                $state.go('app.postwarning', {type: 'warn', data: data});
                //window.location.href = '@Url.Action("PostWarning")' + '?id=' + id+'&type=warn';
            }
        });
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.getCityName = function (cityid) {
        var area = "";
        angular.forEach($scope.allcities, function (data) {
            var id = data.city_id.toString();
            var scityid = cityid.toString();
            if (id.length > scityid.length) {
                id = id.substring(0, scityid.length);
            }
            if (id == cityid) {
                area = '(' + data.name + ')';
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


    $scope.load = function () {
        //$http.get('@Url.Action("GetWeatherWarn")').success(function (data) {
        //    $scope.warns = data;
        //});
        CityWeatherWarn.get().then(function (data) {
            $scope.warns = data;
            angular.forEach($scope.warns, function (item, i) {
                var type = item.data;
                var index = type.indexOf('.');
                var temp = type.substring(index - 4, index);
                var lb = parseInt(temp.substring(0, 2));
                item.icon = "http://www.weather.com.cn/m2/i/alarm_n/" + temp + ".gif";
                if (lb > 90) {
                    item.icon = "http://www.weather.com.cn/m/i/alarm_s/0000.gif";
                }
            });
        }, function (error) {
        });
    };


    $scope.load();
});

curApp.controller('disastersearchCtrl', function ($scope, $http, Citydisaster) {
    //$scope.lang = '@lang';

    $scope.checkAll = false;
    $scope.itemsByPage = 15;//每一页显示数量

    $scope.filerdata = [];
    $scope.orgs = [];

    $scope.date = {
        startDate: moment().subtract(1, "days"),
        endDate: moment()
    };

    $scope.getjsondata = function (jsondata) {
        return new Date(parseInt(jsondata.substr(6)));
    }

    $scope.postdisaster = function (id) {
        angular.forEach($scope.disaster, function (data) {
            if (data.id == id) {
                //$scope.formdata = data;
                //$scope.curId = id;

                // window.location.href = '@Url.Action("PostWarning")' + '?id=' + id+'&type=disaster';
            }
        });
    };


    $scope.getCityName = function (countryid, cityid) {
        var area = "";
        angular.forEach($scope.countries, function (data) {
            if (data.country_id == countryid) {
                area = data.name;
            }
        })
        if (cityid != 0) {
            angular.forEach($scope.allcities, function (data) {
                if (data.city_id == cityid) {
                    area = area + '(' + data.name + ')';
                }
            })
        }

        return area;
    };

    $scope.search = function () {
        $scope.disaster = [];
        angular.forEach($scope.alldisaster, function (data) {
            if ($scope.city_select.city_id == 0) {
                if ($scope.country_select.country_id == 0 || (data.country_id == $scope.country_select.country_id)) {
                    var dt = new Date(data.time);
                    if (dt <= $scope.date.endDate && dt >= $scope.date.startDate) {
                        $scope.disaster.push(data);
                    }
                }

            }
            else if (data.city_id == $scope.city_select.city_id) {
                //var dt = $scope.getjsondata(data.time);
                var dt = new Date(data.time);
                if (dt <= $scope.date.endDate && dt >= $scope.date.startDate) {
                    $scope.disaster.push(data);
                }
            }
        })
    };

    $scope.filtercities = function () {
        var id = $scope.country_select.country_id;
        $scope.cities = [];
        $scope.cities.push({city_id: 0, name: " "});
        angular.forEach($scope.allcities, function (data) {
            if (data.country_id == id) {
                $scope.cities.push(data);
            }
        });
        if ($scope.cities.length > 0) {
            $scope.city_select = $scope.cities[0];
        }
    };

    $scope.loadcities = function () {
        // $http.get('@Url.Action("CityList", "DigitalMap")').success(function (data) {
        //     $scope.allcities = data;
        // });
        countrycity.get().then(function (data) {
            $scope.allcities = data;
            $scope.filtercity();
        }, function (error) {

        });
    };

    $scope.load = function () {
        Citydisaster.get().then(function (data) {
            $scope.alldisaster = data;
            $scope.disaster = [];
            angular.copy($scope.alldisaster, $scope.disaster);
        }, function (error) {
        });
    };

    $scope.loadcompany = function () {
        // $http.get('@Url.Action("GetInstitutional", "PublicSentiment")').success(function (data) {
        //     $scope.orgs = data;
        //     if (data.length > 0) {
        //         $scope.org_select = data[0];
        //     }
        // });
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

    $scope.load();
    $scope.loadcountries();
    $scope.loadcities();
});

curApp.controller('graphicanaysisCtrl', function ($scope, $http, $filter, $location, position, highchartsNG, organiztion, evacuationroute, PublicSentiment, Citydisaster, weatherex, countrycity, countryrisk) {

    $scope.date = {
        startDate: moment("20150101", "YYYYMMDD"),
        endDate: moment()
    };


    $scope.month_trend = true;
    $scope.month_distri = true;
    $scope.month_anay = true;
    $scope.weather_report = false;

    $scope.treeDatas = [];
    $scope.group_tree = tree = {};
    $scope.countries = [];
    $scope.cities = [];

    countryrisk.get().then(function (data) {
        angular.copy(data, $scope.countries);
        $scope.treeDatas = [];
        angular.forEach($scope.countries, function (item, i) {
            if (item.worker == 1) {
                $scope.treeDatas.push({
                    label: item.name,
                    country_id: item.country_id,
                    selected: false,
                    expanded: true,
                    children: [],
                    onSelect: $scope.changetreeselect
                });
            }
        });
        if ($scope.treeDatas.length > 0)
            $scope.group_tree.select_branch($scope.treeDatas[$scope.treeDatas.length - 1]);
    }, function (error) {
    });

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
    organiztion.getorganiztion().then(function (insDatas) {
        //$scope.$broadcast("CreateOrganiztionMarker", { data: insDatas, layername: 'country' });
        //angular.copy(insDatas, $scope.countries);
        // $scope.treeDatas = $scope.formatDatas(insDatas);
        //$scope.$broadcast("creategraphicLayer", { alpha: 1, layername: 'country', show: 'show' });
        //$scope.$broadcast("CreateOrganiztionMarker", { data: $scope.countries, layername: 'country', url: '@Url.Action("OrgInfoWindow", "DigitalMap")' });
        //$scope.$apply();
    }, function (status) {
    })

    countrycity.get().then(function (insDatas) {
        $scope.cities = insDatas;

    }, function (status) {
    })

    $scope.getCityName = function (city_id) {
        var cityname = "";
        angular.forEach($scope.cities, function (item, i) {
            if (item.city_id == city_id) {
                cityname = item.name;
            }
        });
        return cityname;
    }

    $scope.changetreeselect = function (branch) {
        //if (branch.data != undefined) {
        $scope.country_id = branch.country_id;
        $scope.loaddata();
        //$scope.$broadcast("ZoomTo", { lon: branch.data.lon, lat: branch.data.lat });
        //}
    }

    $scope.formatDatas = function (data) {
        var tree = [];
        angular.forEach(data, function (item, i) {
            if (item.organiztion_id == '2016011802') {
                tree.push({
                    label: item.organiztion_name,
                    id: item.organiztion_id,
                    country_id: item.country_id,
                    selected: false,
                    expanded: true,
                    children: []
                });
            }
        });
        if (tree.length > 0) {
            angular.forEach(data, function (item, i) {
                if (item.parent_id == tree[0].id) {
                    tree[0].children.push({
                        label: item.organiztion_name,
                        id: item.organiztion_id,
                        country_id: item.country_id,
                        children: [],
                        onSelect: $scope.changetreeselect,
                        data: item
                    });
                }
            });
            //$scope.group_tree.select_bran
            if (tree[0].children.length > 0) {
                //tree[0].children[0].selected = true;

            }
        }

        return tree;
    }


    $scope.chartConfig1 = {
        chart: {
            type: 'spline'
        },
        title: {
            text: "月度自然灾害发生趋势图"
        },
        subtitle: {
            text: "中海石油国际有限公司应急管理信息系统"
        },
        //xAxis: {
        //    categories: $scope.lbls
        // },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']//设置x轴的标题
        },
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
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
    };

    $scope.chartConfig2 = {
        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
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
            text: '各类自然灾害月份分布图'
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

    $scope.chartConfig3 = {
        options: {
            //This is the Main Highcharts chart config. Any Highchart options are valid here.
            //will be overriden by values specified below.
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
            text: '各类自然灾害月份分布图'
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
    };

    $scope.chartConfig4 = {
        chart: {
            type: 'spline'
        },
        title: {
            text: "月度气象信息汇总图"
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
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
    };

    $scope.country_id = 2;
    $scope.data_monthtrend = [];
    $scope.loaddata = function () {

        weatherex.GetWeatherStatics($scope.country_id).then(function (data) {
            $scope.data_monthtrend = [];
            var stime = $scope.date.startDate.format("YYYYMM");
            var etime = $scope.date.endDate.format("YYYYMM");
            angular.forEach(data, function (item, i) {
                if (item.date <= etime && item.date >= stime) {
                    $scope.data_monthtrend.push(item);

                }

            });
            //$scope.data_monthtrend = data;

            $scope.chartConfig1.series = [];
            $scope.chartConfig2.series = [];
            $scope.chartConfig3.series = [];

            var serial1 = {name: '灾害数', data: []};

            var serial2 = [];

            var serial3 = [];
            //var serial2 = { name: '灾害数', data: [] };

            $scope.chartConfig1.xAxis = {categories: []};
            $scope.chartConfig2.xAxis = {categories: []};
            $scope.chartConfig3.xAxis = {categories: []};

            angular.forEach($scope.data_monthtrend, function (item, i) {
                $scope.chartConfig1.xAxis.categories.push(item.date);
                $scope.chartConfig2.xAxis.categories.push(item.date);
                $scope.chartConfig3.xAxis.categories.push(item.date);

                serial1.data.push(item.total);

                for (var i = 0; i < item.types.length; ++i) {
                    var bfound = false;
                    for (var j = 0; j < serial2.length; ++j) {
                        if (serial2[j].name == item.types[i].type) {
                            bfound = true;
                            serial2[j].data.push(item.types[i].count);
                        }
                    }
                    if (!bfound) {
                        var temp_serial = {name: item.types[i].type, data: [item.types[i].count]};
                        serial2.push(temp_serial);
                    }
                }


                for (var i = 0; i < item.cities.length; ++i) {
                    var bfound = false;
                    for (var j = 0; j < serial3.length; ++j) {
                        if (serial3[j].name == item.cities[i].city) {
                            bfound = true;
                            serial3[j].data.push(item.cities[i].count);
                        }
                    }
                    if (!bfound) {
                        var temp_serial = {name: item.cities[i].city, data: [item.cities[i].count]};
                        serial3.push(temp_serial);
                    }
                }
            });

            $scope.chartConfig1.series.push(serial1);

            angular.forEach(serial2, function (sitem, i) {
                if (sitem.name == null) {
                    sitem.name = "其他";
                }
            });

            for (var i = 0; i < serial2.length; ++i) {
                $scope.chartConfig2.series.push(serial2[i]);
            }

            angular.forEach(serial3, function (sitem, i) {
                if (sitem.name == null) {
                    sitem.name = "其他地区";
                }
            });

            for (var i = 0; i < serial3.length; ++i) {
                if (serial3[i].name == 0) {
                    serial3[i].name = "其他地区";
                }
                else
                    serial3[i].name = $scope.getCityName(serial3[i].name);
                $scope.chartConfig3.series.push(serial3[i]);
            }

        }, function (error) {
        });
    };

    $scope.loaddata();


    highchartsNG.ready(function () {
        // init chart config, see lazyload example
    }, this);
});

curApp.controller('AdddisasterCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, organiztion, project, countryrisk, countrycity, transport, Citydisaster) {

    $scope.types = ['旱灾', '洪涝', '台风', '风暴潮', '冻害', '雹灾', '海啸', '地震', '火山', '滑坡', '泥石流', '森林火灾', '农林病虫害', '宇宙辐射'];

    $scope.vm = {type: '洪涝'};
    $scope.isedit = false;
    var param = $stateParams.data;
    if (param) {
        $scope.vm = param;
        $scope.isedit = true;
        $scope.vm.date = new Date($scope.vm.time);
        //$scope.imgsrc = "http://"+$location.host()+':'+$location.port()+  $scope.vm.pic;
    }
    else {
        $scope.vm.date = new Date();
    }


    $scope.countries = [];
    $scope.allcities = [];
    $scope.cities = [];

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
        if (!$scope.vm.country)
            return;
        $scope.cities = [];
        angular.forEach($scope.allcities, function (item, index) {
            if (item.country_id == $scope.vm.country.country_id) {
                $scope.cities.push(item);
            }
        });
        if ($scope.cities.length > 0) {
            $scope.vm.city = $scope.cities[0];
            //$scope.city_change();
        }
    };

    $scope.loadcities = function () {
        countrycity.get().then(function (data) {
            $scope.allcities = data;
            $scope.filtercity();
        }, function (error) {

        });
    };

    $scope.submitForm = function () {
        $scope.vm.time = $filter('date')($scope.vm.date, 'yyyy-MM-ddTHH:mm:ss');
        if ($scope.vm.country)
            $scope.vm.country_id = $scope.vm.country.country_id;
        if ($scope.vm.city)
            $scope.vm.city_id = $scope.vm.city.city_id;

        if ($scope.isedit) {
            Citydisaster.update($scope.vm.id, $scope.vm).then(function (data) {
                $state.go('app.dwinsertdisasterdata', {});
            }, function (error) {

            });
        }
        else {
            Citydisaster.add($scope.vm).then(function (data) {
                $state.go('app.dwinsertdisasterdata', {});
            }, function (error) {

            });
        }
    };

    $scope.cancel = function () {
        $state.go('app.dwinsertdisasterdata', {});
    };

    $scope.load = function () {
        $scope.loadcountries();
    };

    $scope.load();


});
