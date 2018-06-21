'use strict';

var app = angular.module('cnooc_service.SecuritySystem', [], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.transformRequest = [function (data) {
        //    /**
        //     * The workhorse; converts an object to x-www-form-urlencoded serialization.
        //     * @param {Object} obj
        //     * @return {String}
        //     */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
});

app.filter('dateFormatter', function () {
    return function (str) {
        if (str.length == 8) {
            var y = str.substr(0, 4);
            var m = str.substr(4, 2);
            var d = str.substr(6, 2);
            return y + '-' + m + '-' + d;
        }

        return str;
    };
});

app.service('SecuritySystem', ['$q', '$http', '$location', function ($q, $http, $location) {
    var baseURL = 'http://' + $location.host() + ':' + $location.port() + '/apis';
    return {
        GetWaring: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseURL + '/apiroot/SecuritySystem/GetWaring'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        CountryGrade: function (countryid, time) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseURL + '/apiroot/SecuritySystem/GetCountryGrade?country=' + countryid + '&time=' + time
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        CountryGrades: function (countryid, time) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseURL + '/apiroot/SecuritySystem/GetCountryGrades?country=' + countryid + '&time=' + time
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        CountryEmergencys: function (countryid, time) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseURL + '/apiroot/SecuritySystem/GetCountryEmergencys?country=' + countryid + '&time=' + time
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        SecurityChartData: function (st, et, country) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + '/apiroot/SecuritySystem/SecurityChartData?st=' + st + '&et=' + et + '&country=' + country
                //url: 'apis' + '/apiroot/SecuritySystem/SecurityChartData?st=' + st + '&et=' + et + '&country=' + country
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        Reports: function (userid, type, st, et) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                // url: 'apis/apiroot/SecuritySystem/GetReports?userId=' + userid + '&type=' + type + '&stime=' + st + '&etime=' + et
                url: baseURL + '/apiroot/SecuritySystem/GetReports?userId=' + userid + '&type=' + type + '&stime=' + st + '&etime=' + et
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        Events: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + '/apiroot/SecuritySystem/PostEvents',
                // url: 'http://localhost:59373'+'/apiroot/SecuritySystem/PostEvents',
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        PutEvent: function (id, data) {
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: baseURL + '/api/Events/' + id,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        DeleteEvent: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: baseURL + '/api/Events/' + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        DeleteReport: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: baseURL + '/api/Report/' + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        PostEvent: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + '/api/Events/',
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        CountryEvents: function (countryid, time) {
            var deferred = $q.defer();
            $http({
                method: 'Get',
                url: baseURL + '/api/Events/?country=' + countryid + '&time=' + time
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        report: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: baseURL + '/api/Report/' + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        eventModel: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + '/apiroot/SecuritySystem/EventModel?id=' + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        historyDWLI: function (st, et, country) {
            var deferred = $q.defer();
            //    baseURL = 'http://localhost:59373';
            var url = baseURL + '/apiroot/SecuritySystem/GetHistoryDWLI?st=' + st + '&et=' + et + '&country=' + country;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        warings: function (time) {
            var deferred = $q.defer();
            var url = baseURL + '/api/CountryRiskHistory?time=' + time;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        totalInfos: function () {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + '/apiroot/SecuritySystem/TotalInfos'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('DWLI', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/CountryRiskHistory/';
    //var memURL = 'http://localhost:59373' + '/api/CountryRiskHistory/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        default: function (country, time) {
            var deferred = $q.defer();
            var url = memURL + '?country=' + country + '&time=' + time;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        auditEntry: function (data) {//信息录入确定DWLI值
            var deferred = $q.defer();
            //var url = 'apisapi/CountryRiskHistory?time=' + data.time + '&country=' + data.country;
            var url = 'apis/api/CountryRiskHistory?time=' + data.time + '&country=' + data.country;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        relieve: function (data) {
            var deferred = $q.defer();
            var url = 'apis/api/CountryRiskHistory?time=' + data.time + '&country=' + data.country + '&grade=' + data.grade;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('RiskSetting', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/RiskSetting/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('CountryRiskSetting', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Countryrisksetting/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('FormulaWeight', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Formulaweight/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('Events', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Events/';
    //var memURL = 'http://localhost:59373' + '/api/Events/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getByPar: function (year, type, country) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'apis/api/Events?year=' + year + '&type=' + type + '&country=' + country
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        export: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL + '1?type=1'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getRangeTime: function (st, et, type) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'apis/api/Events?st=' + st + '&et=' + et + '&type=' + type
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getEventByType: function (st, et, country, type) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'apis/api/Events?st=' + st + '&et=' + et + '&country=' + country + '&type=' + type
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                //url: 'apisapi/Events/',
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('Advise', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Advice/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('AccessRecord', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/accessrecord/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('EventGrade', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/eventgrade/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);
app.service('Emergency', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/emergency/';
    //var memURL = 'http://localhost:59373' + '/api/emergency/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);
app.service('CountryAdvise', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/CountryAdvice';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getByCountryAndType: function (country, type) {
            var deferred = $q.defer();
            var url = memURL + '?country=' + country + '&type=' + type;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('Traincourse', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Traincourse';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('TraincourseUser', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/TraincourseUser';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            var url = memURL + "/" + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('TraincoursePerson', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/TraincoursePerson';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);
