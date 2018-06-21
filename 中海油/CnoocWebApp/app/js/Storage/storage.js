/**
 * Created by Administrator on 2016/7/12.
 */
angular.module('app.storage', ['angular-storage'])
    .factory('Auth0Store', function (store) {
        return store.getNamespacedStore('auth0');
    })
    .factory('permissions', function($rootScope, Auth0Store) {
        return {
            setPermissions: function(user, permissions) {
                var u = angular.copy(user);
                u.passwd = null;
                Auth0Store.set('permissionList', permissions);
                Auth0Store.set('user', u);
            },
            getPermissions: function() {
                return localStorage.permissionList;
            },
            hasPermission: function (role, action) {
                var permissionList = Auth0Store.get('permissionList');
                var bRes = false;
                for (var i = 0; i < permissionList.length; i++) {
                    var item = permissionList[i];
                    if (item.operate_key == role){
                        bRes = !action ? true : (action == item.action);
                        break;
                    }
                };
                return bRes;
            },
            login: function () {
                var permissionList = Auth0Store.get('permissionList');
                var u = Auth0Store.get('user');
                return (permissionList && u && localStorage.userid);
            }
        };
    })
    ;
