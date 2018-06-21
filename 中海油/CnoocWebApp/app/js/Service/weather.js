'use strict';

var app = angular.module('cnooc_service.Weather', [], function ($httpProvider) {
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

app.service('weatherex', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/apiroot/ExWeather/';
    //var memURL = 'apisapiroot/ExWeather';
    return {
        GetWeatherStatics: function (id) {
            var deferred = $q.defer();
            var url = memURL + '/GetWeatherStatics?country_id=' + id;
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
                GetLatestWeathers: function () {
            var deferred = $q.defer();
            var url = memURL + '/GetLatestWeathers';
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
        GetLatestWeather: function (city_id) {
            var deferred = $q.defer();
            var url = memURL + '/GetLatestWeather?city_id='+city_id;
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
        }
    }
}]);

app.service('countrycity', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/countrycity/';
    //var memURL = 'apisapi/countrycity';
    return {
        get: function () {
            var deferred = $q.defer();
            //var url = memURL + '/GetWeatherStatics?country_id=' + id;
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

app.service('CityWeatherWarn', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/CityWeatherWarn/';
    //var memURL = 'apisapi/CityWeatherWarn';
    return {
        get: function () {
            var deferred = $q.defer();
            //var url = memURL + '/GetWeatherStatics?country_id=' + id;
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
            var url = memURL + '/' + id;
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
        }
    }
}]);