'use strict';

var app = angular.module('cnooc_service.systemmgr', [], function ($httpProvider) {
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


app.service('ExSystemMgr', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/apiroot/ExSystemMgr/';
    //var memURL = 'apisapiroot/ExSystemMgr/';
    return {
        GetUsers: function () {
            var deferred = $q.defer();
            var url = memURL + 'GetUsers';
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
        Update:function(user){
            var deferred = $q.defer();
            var url = memURL + 'PostAddUser';
            $http({
                method: 'POST',
                url: url,
                data:user
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        ChangePwd:function(id,pwd){
            var deferred = $q.defer();
            var url = memURL + 'PostChangePasswd';
            $http({
                method: 'POST',
                url: url,
                data:{user_id:id,newPwd:pwd}
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        SortOrgUser:function(id,gid,sort){
            var deferred = $q.defer();
            var url = memURL + 'SortOrganiztionUsers/'+id+'?gid='+gid+'&sort='+sort;
            $http({
                method: 'POST',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        OrganiztionUsers:function(id){
            var deferred = $q.defer();
            var url = memURL + 'OrganiztionUsers/'+id;
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
        MessageGroupUsers:function(id){
            var deferred = $q.defer();
            var url = memURL + 'MessageUsers/'+id;
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
        SortGroupUsers:function(id,gid,sort){
            var deferred = $q.defer();
            var url = memURL + 'SortGroupUsers/'+id+'?gid='+gid+'&sort='+sort;
            $http({
                method: 'POST',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        SetOrganiztionUser:function(data){
            var deferred = $q.defer();
            var url = memURL + 'SetOrganiztionUserPost';
            //var url = 'apisapiroot/ExSystemMgr/SetOrganiztionUserPost';
            $http({
                method: 'POST',
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
        SetGroupUserPost:function(data){
            var deferred = $q.defer();
            var url = memURL + 'SetGroupUserPost';
            //var url = 'apisapiroot/ExSystemMgr/SetGroupUserPost';
            $http({
                method: 'POST',
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
        GetRolePermissions:function(){
            var deferred = $q.defer();
            var url = memURL + 'GetRolePermissions';
            // var url = 'apisapiroot/ExSystemMgr/GetRolePermissions';
            $http({
                method: 'Get',
                url: url
            }).success(function (data, status, headers, config) {
                //console.log('getProvince===='+JSON.stringify(data));
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
            return deferred.promise;
        },
        SetRoleActionPost:function(data){
            var deferred = $q.defer();
            var url = memURL + 'SetRoleActionPost';
            //var url = 'apisapiroot/ExSystemMgr/SetRoleActionPost';
            $http({
                method: 'POST',
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
