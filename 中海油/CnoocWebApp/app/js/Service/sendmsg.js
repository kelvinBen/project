'use strict';

var app = angular.module('cnooc_service.sendmsg', [], function ($httpProvider) {
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


app.service('sendmsg', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/SendMsg/';
    //var memURL='http://localhost:59373'+'/api/SendMsg';
    return {
        send: function (mobile,content) {
            var deferred = $q.defer();
            var url = memURL+'?mobile='+mobile+'&content='+content;
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