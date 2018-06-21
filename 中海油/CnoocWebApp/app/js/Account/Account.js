/**
 * Created by ymelec on 2016/7/11.
 */

angular.module('app.account',['app.storage'])
    .config(httpProviderConfig)
    .factory('AuthService', AuthService)
    .controller('loginController', loginController)
    .run(accountRun)
    ;

httpProviderConfig.$inject = ['$httpProvider'];
function httpProviderConfig($httpProvider) {
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
}

AuthService.$inject = ['$q', '$http'];
function AuthService($q, $http) {
    var authService = {};
    authService.login = function (credentials) {
        var deferred = $q.defer();
        var url = 'apis/apiroot/Account/Login';
        // var url = 'apisapiroot/Account/Login';
        $http({
            method: 'POST',
            url: url,
            data: credentials
        }).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (data, status, headers, config) {
            deferred.reject(status);
        });
        return deferred.promise;
    };
    authService.user = function (uid) {
        var deferred = $q.defer();
        var url = 'apis/api/Operator/'+uid;
        $http({
            method: 'GET',
            url: url
        }).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (data, status, headers, config) {
            deferred.reject(status);
        });
        return deferred.promise;
    };
    authService.userRoles = function (credentials) {
        var deferred = $q.defer();
        var url = 'apis/apiroot/Account/UserActions';
        //var url = 'apisapiroot/Account/UserActions';
        $http({
            method: 'POST',
            url: url,
            data: credentials
        }).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (data, status, headers, config) {
            deferred.reject(status);
        });
        return deferred.promise;
    }

    return authService;
}

loginController.$inject = ['$rootScope', 'permissions', '$scope','$location','AuthService'];
function loginController($rootScope, permissions, $scope, $location, AuthService) {
    $scope.loginModel = {
        name:"",
        pwd:""
    };
    $scope.userLogin = function (eventDetails) {
        AuthService.login($scope.loginModel).then(function (user) {//user login
            if (!user) return;
            localStorage.userid = user.user_id;
            AuthService.userRoles(user).then(function (rs) {//get user roles
                permissions.setPermissions(user, rs);
                $location.path('/app/securitysystem');
            });
        });
    };
}

accountRun.$inject = ['AuthService','permissions','$location','$rootScope','$state'];
function accountRun(AuthService, permissions, $location, $rootScope, $state) {
    $rootScope.$on('$stateChangeStart',function (evt, toState, toParams, fromState, fromParams) {
        if (toState.name != 'page.login') {
            var bCheckIn = false;
            if (permissions.login()){
                bCheckIn = true;
            }
            
            if (!bCheckIn) {
                // evt.preventDefault();
                $location.path('/page/login');
            }
        }
    });
}
