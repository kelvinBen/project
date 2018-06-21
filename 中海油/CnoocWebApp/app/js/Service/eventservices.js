/**
 * Created by sea on 2016/7/19.
 */
'use strict';

var app = angular.module('ics_service.event', [], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.interceptors.push('httpInterceptor');

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

app.factory('httpInterceptor', ['$q', '$injector', '$filter', function ($q, $injector, $filter) {
    var httpInterceptor = {
        'responseError': function (response) {
            //......
            return $q.reject(response);
        },
        'response': function (response) {
            //......
            return response;
        },
        'request': function (config) {
            // ......
            var data = {};
            data.method = config.method;
            data.url = config.url;
            data.time = $filter('date')(new Date(), 'yyyyMMddHHmmss');
            data.userid = localStorage.userid;
            $.ajax({
                type: 'POST',
                url: '../../../icsapi/systemlog/',
                data: data,
                cache: false,
                xhrFields: {
                    withCredentials: true
                }
            })
            return config;
        },
        'requestError': function (config) {
            //......
            return $q.reject(config);
        }
    }
    return httpInterceptor;
}]);


app.service('eventservice', ['$q', '$http', '$location', function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/event/';
    // var memURL = 'icsapi/event/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventorganization', ['$q', '$http', '$location',  function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventorganization/';
    // var memURL = 'icsapi/eventorganization/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventorgusers', ['$q', '$http','$location', function ($q, $http,$location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventorgusers/';
    // var memURL = 'icsapi/eventorgusers/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventroles', ['$q', '$http','$location', function ($q, $http,$location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventroles/';
    // var memURL = 'icsapi/eventroles/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventmark', ['$q', '$http', '$location', function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventmark/';
    // var memURL = 'icsapi/eventmark/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventpublicinfo', ['$q', '$http', '$location',function ($q, $http,$location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventpublicinfo/';
    // var memURL = 'icsapi/eventpublicinfo/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventperiod', ['$q', '$http', '$location',function ($q, $http,$location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventperiod/';
    // var memURL = 'icsapi/eventperiod/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('eventtables', ['$q', '$http', '$location', function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '' + '/icsapi/eventtables/';
    // var memURL = 'icsapi/eventtables/';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getbyevent: function (eventid) {
            var deferred = $q.defer();
            var url = memURL + "?eventid=" + eventid;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getbytablename: function (eventid, tablename) {
            var deferred = $q.defer();
            var url = memURL + "?eventid=" + eventid + "&tablename=" + tablename;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getactivetable: function (eventid, tablename) {
            var deferred = $q.defer();
            var url = memURL + "?eventid=" + eventid + "&tablename=" + tablename + "&active=1";
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
        getactivetablewithid: function (eventid, tablename, roleid) {
            var deferred = $q.defer();
            var url = memURL + "?eventid=" + eventid + "&tablename=" + tablename + "&active=1&roleid=" + roleid;
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
    }
}]);

app.service('steptask', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/steptask.json';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getstepname: function (step) {
            if (step == '1')
                return "接警、报告和记录";
            else if (step == '2')
                return "初步形势判断";
            else if (step == '3')
                return "首次应急会议";
            else if (step == '4')
                return "形势判断";
            else if (step == '4')
                return "应急过程会议";
            else if (step == '4')
                return "形势判断";
            else if (step == '5')
                return "扩大应急响应";
            else if (step == '6')
                return "应急解除";
        }
    }
}]);

app.service('roletemp', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/roletemp.json';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('periodtask', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/periodtask.json';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('tablecontent', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/tablecontent.json';
    return {
        get: function (tablename) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                //deferred.resolve(data);
                var dt = [];
                for (var i = 0; i < data.length; ++i) {
                    var item = data[i];
                    if (item.tablename == tablename) {
                        dt.push(item);
                        break;
                    }
                }
                deferred.resolve(dt);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('roletask', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/roletask.json';
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

app.service('eventstatus', ['$q', '$http', function ($q, $http) {
    return {
        geteventid: function () {
            return localStorage.eventid;
        },
        seteventid: function (eventid) {
            localStorage.eventid = eventid;
            return;
        },
        getperiodid: function () {
            return localStorage.periodid;
        },
        setperiodid: function (periodid) {
            localStorage.periodid = periodid;
            return;
        },
        getstepname: function (step) {
            if (step == "1")
                return "接警、报告和记录";
            else if (step == '2')
                return "初步形势判断";
            else if (step == '3')
                return "首次应急会议";
            else if (step == '4')
                return "形势判断";
            else if (step == '5')
                return "应急过程会议";
            else if (step == '6')
                return "形势判断";
            else if (step == '7')
                return "扩大应急响应";
            else if (step == '8')
                return "应急解除";
        }
    }
}]);

app.service('icsuser', ['$q', '$http', function ($q, $http) {
    var memURL = 'server/users.json';
    return {
        get: function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (id) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                var user = null;
                angular.forEach(data, function (item, index) {
                    if (item.userid == id) {
                        user = item;
                    }
                });
                deferred.resolve(user);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('users', ['$q', '$http', '$location', function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '/apis/api/Operator/';
    return {
        users: function () {
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
            $http({
                method: 'GET',
                url: memURL + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('icsdb', ['$q', '$http', '$location',  function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '/icsapi/';
    // var memURL = 'icsapi/';
    return {
        get: function (tablename) {
            var deferred = $q.defer();
            var url = memURL + tablename + '/'
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getdetail: function (tablename, id) {
            var deferred = $q.defer();
            var url = memURL + tablename + '/' + id;
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        add: function (tablename, data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL + tablename + '/',
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (tablename, id) {
            var deferred = $q.defer();
            var url = memURL + tablename + '/' + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (tablename, id, data) {
            var deferred = $q.defer();
            var url = memURL + tablename + '/' + id;
            $http({
                method: 'PUT',
                url: url,
                data: data
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('pubsentiment', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/pubsentiment/';
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
            $http({
                method: 'GET',
                url: memURL + id
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        getWithTime: function (st, et) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: memURL + "?st=" + st + "&et=" + et
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
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
    }
}]);
