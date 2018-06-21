'use strict';

var app = angular.module('cnooc_service', [], function ($httpProvider) {
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
                url: 'icsapi/systemlog/',
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

//app.factory('positionServer', ['$resource', '$location', function ($resource, $location) {
//    //return $resource('http://' + $location.host() + ':' + $location.port() + '/api/webcrawler/:id', {}, {
//    return $resource('apis' + '/api/webcrawler/:id', {}, {
//        update: { method: 'PUT' }
//    });
//}]);

app.service('webcrawler', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/webcrawler/';
    //if (app.development) memURL = "api/staff_deps.json";
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

app.service('pubsentiment', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/pubsentiment/';
    //if (app.development) memURL = "api/staff_deps.json";
    return {
        getpubsentiment: function () {
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

app.service('organiztion', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/organiztion/';
    //if (app.development) memURL = "api/staff_deps.json";
    return {
        getorganiztion: function () {
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
        getbyId: function (id) {
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
        add: function (data) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: memURL,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        update: function (id, data) {
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: memURL + id,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        delete: function (id, data) {
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: memURL + id,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },

    }
}]);

app.service('position', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/position/';
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

app.service('evacuationroute', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/evacuationroute/';
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

app.service('messageGroup', ['$q', '$http', function ($q, $http) {
    var baseURL = 'apis/';
    return {
        groups: function () {//获取短信组信息
            var deferred = $q.defer();
            $http({ method: 'GET', url: baseURL + 'api/MessageGroup' })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        addGroup: function (data) {//添加短信组
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + 'api/MessageGroup',
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        updateGroup: function (id, data) {//编辑短信组
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                url: baseURL + 'api/MessageGroup/' + id,
                data: data
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        deleteGroup: function (id) {//删除短信组
            var deferred = $q.defer();
            var url = baseURL + 'api/MessageGroup/' + id;
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
        groupUserIDs: function () {//获取该短信组下所有的用户ID列表
            var deferred = $q.defer();
            $http({ method: 'GET', url: baseURL + 'api/MessageGroupUser' })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    deferred.reject(status);
                });
            return deferred.promise;
        },
        addGroupUser: function () {//添加群用户
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: baseURL + 'api/MessageGroupUser',
                data: data,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        deteGroupUser: function (id) {//删除群用户
            var deferred = $q.defer();
            var url = baseURL + 'api/MessageGroupUser/' + id;
            $http({
                method: 'DELETE',
                url: url,
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        }
    }
}]);

app.service('emergencyresource', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/emergencyresource/';
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
                data: data
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

//用户接口
//app.service('operator', ['$q', '$http', function ($q, $http) {
//    var memURL = 'apis' + '/api/Operator/';
//    return {
//        users: function () {
//            var deferred = $q.defer();
//            $http({
//                method: 'GET',
//                url: memURL
//            }).success(function (data, status, headers, config) {
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        }
//    }
//}]);

//国家
app.service('countryrisk', ['$q', '$http', '$location', function ($q, $http, $location) {
    var host = $location.host();
    var port = $location.port();
    var memURL = 'http://' + host + ':' + port + '/apis' + '/api/Countryrisk/';
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

//预警级别行动
app.service('Warninglevel', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Warninglevel/';
    return {
        all: function () {
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
        get: function (id) {
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
    }
}]);

//通用安保建议
app.service('Advice', ['$q', '$http', function ($q, $http) {
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
        }
    }
}]);

app.service('Role', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Role/';
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
                data: data
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

app.service('OperatorRole', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/OperatorRole/';
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
                data: data
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
        setUsers: function (ids, roleid) {
            var deferred = $q.defer();
            var url = 'apis/apiroot/OperatorRole/SetRoleUsers';
            $http({
                method: 'Post',
                url: url,
                data: { ids: ids, roleid: roleid }
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

app.service('ActionRole', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/ActionRole/';
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

app.service('Action', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/Action/';
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
