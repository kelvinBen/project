'use strict';

var app = angular.module('cnooc_service.webmessage', [], function ($httpProvider) {
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


app.service('website_message', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/WebsiteMessage/';
    //var memURL = 'apis' + '/api/WebsiteMessage/';
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

app.service('WebMessageEx', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/apiroot/WebMessageEx/';
    //var memURL = 'http://localhost:59373' + '/apiroot/WebMessageEx/';
    return {
        //GetMessageDataByMessageId: function (id) {
        //    var deferred = $q.defer();
        //    var url = memURL + 'GetMessageDataByMessageId?msg_id=' + id;
        //    $http({
        //        method: 'GET',
        //        url: url
        //    }).success(function (data, status, headers, config) {
        //        //console.log('getProvince===='+JSON.stringify(data));
        //        deferred.resolve(data);
        //    }).error(function (data, status, headers, config) {
        //        deferred.reject(status);
        //    });
        //    return deferred.promise;
        //},
        GetSendMessage: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetSendMessage?msg_id=' + id;
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
        GetInboxMsg: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetInboxMsg?receiver_id=' + id;
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
        GetOutboxMsg: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetOutboxMsg?sender_id=' + id;
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
        GetInboxMsgCount: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetInboxMsgCount?receiver_id=' + id;
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
        GetLatestExamMessage: function (num) {
            var deferred = $q.defer();
            var url = memURL + 'GetLatestExamMessage?num=' + num;
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
        GetExamMessages: function () {
            var deferred = $q.defer();
            var url = memURL + 'GetExamMessages';
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
        GetMessageBySender: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetMessageBySender?sender='+id;
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
        GetDetailMsg: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetDetailMsg?msg_id=' + id;
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
        GetPassMessage: function (id) {
            var deferred = $q.defer();
            var url = memURL + 'GetPassMessage?msg_id=' + id;
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
        GetUnPassMessage: function (id,reason) {
            var deferred = $q.defer();
            var url = memURL + 'GetUnPassMessage?msg_id=' + id+'&reason='+reason;
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

//app.service('website_message_data', ['$q', '$http', function ($q, $http) {
//    var memURL = 'apis' + '/api/WebsiteMessageData/';
//    //var memURL = 'http://localhost:59373' + '/api/WebsiteMessageData/';
//    return {
//        get: function () {
//            var deferred = $q.defer();
//            $http({
//                method: 'GET',
//                url: memURL
//            }).success(function (data, status, headers, config) {
//                //console.log('getProvince===='+JSON.stringify(data));
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        },
//        getdetail: function (id) {
//            var deferred = $q.defer();
//            var url = memURL + id;
//            $http({
//                method: 'GET',
//                url: url
//            }).success(function (data, status, headers, config) {
//                //console.log('getProvince===='+JSON.stringify(data));
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        },
//        add: function (data) {
//            var deferred = $q.defer();
//            $http({
//                method: 'POST',
//                url: memURL,
//                data: data,
//            }).success(function (data, status, headers, config) {
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        },
//        delete: function (id) {
//            var deferred = $q.defer();
//            var url = memURL + id;
//            $http({
//                method: 'DELETE',
//                url: url,
//            }).success(function (data, status, headers, config) {
//                //console.log('getProvince===='+JSON.stringify(data));
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        },
//        update: function (id, data) {
//            var deferred = $q.defer();
//            var url = memURL + id;
//            $http({
//                method: 'PUT',
//                url: url,
//                data: data
//            }).success(function (data, status, headers, config) {
//                //console.log('getProvince===='+JSON.stringify(data));
//                deferred.resolve(data);
//            }).error(function (data, status, headers, config) {
//                deferred.reject(status);
//            });
//            return deferred.promise;
//        }
//    }
//}]);

app.service('website_message_receiver', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/WebsiteMessageReceiver/';
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

app.service('SmsTemplate', ['$q', '$http', function ($q, $http) {
    var memURL = 'apis' + '/api/SmsTemplate/';
    //var memURL = 'apis' + '/api/SmsTemplate/';
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

app.service('smsreceive', ['$q', '$http', function ($q, $http) {
    var memURL = 'icsapi/smsreceive/';
    //var memURL = 'apis' + '/api/WebsiteMessage/';
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