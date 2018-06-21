angular.module('app.ics')

    .controller('ics2013Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state,$stateParams) {          //ICS 201-3 应急组织架构图
        $scope.vm = {step: '1', tablename: 'ics2013', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //
        $scope.vm.data.roles = [];

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;

            icsdb.getdetail("eventroles", "?organizationid=" + $scope.event.organiztion).then(function (data) {
                if (data.length > 0) {
                    $scope.vm.data.roles = data;
                    angular.forEach($scope.vm.data.roles,function(item){
                        item.duty = item.duty.replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/<br\/>/g, '');
                    });
                }
            });
        });

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.addUser = function () {
            var obj = {
                rolename: '',
                duty: '',
                form: '',
                people: ''
            };
            $scope.vm.data.roles.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.roles.splice(index, 1);
        }
        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }

        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics2014Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 201-4 资源状况总结
        $scope.vm = {step: '1', tablename: 'ics2014', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //
        $scope.vm.data.roles = [];

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.addUser = function () {
            var obj = {
                resource: '',
                offer: '',
                applytime: '',
                arrivetime: '',
                arrive: '',
                position: '',
                task: '',
                condition: ''
            };
            $scope.vm.data.resources.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics2015Ctl', function ($scope, tablecontent, $filter , eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 201-5 人员状况
        $scope.vm = {step: '1', tablename: 'ics2015', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.persons = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }


        $scope.addUser = function () {
            var obj = {
                name: '',
                company: '',
                country: '',
                info: '',
                address: '',
                condition: '',
                others: ''
            };
            $scope.vm.data.persons.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.persons.splice(index, 1);
        }
        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    // .controller('ics2016Ctl',function ($scope, tablecontent,$filter, $http, $q) {                                                             //个人日志
    //     $scope.model = {
    //         eventName:'事件1',
    //         eventNum:'',
    //         startTime:"",
    //         endTime:"",
    //         weather:{
    //             weatherwind:"",
    //             weathertemperature:"",
    //             weatherwave:"",
    //             weathersea:"",
    //             weatherwater:"123",
    //             weatherothers:"",
    //         },
    //         pre:{
    //             pretemperature:"",
    //             prewave:"",
    //             presea:"",
    //             prewater:"",
    //             currlook:"",
    //             prelook:""
    //         },
    //         today:{
    //             todayhigh:"",
    //             todaylow:"",
    //             todayrise:"",
    //             todaydown:""
    //         },
    //         tommorrow:{
    //             tomorrowhigh:"",
    //             tomorrowlow:"",
    //             tomorrowrise:"",
    //             tomorrowdown:""
    //         },
    //         esName:"",
    //         esPost:"",
    //         esDate:""
    //     }
    // })

    .controller('ics2017Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams) {         //ICS 201-7 对外联络
        $scope.vm = {step: '1', tablename: 'ics2017', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.persons = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.addUser = function () {
            var obj = {
                emergencydepart: '',
                emergrncyorgan: '',
                time: new Date(),
                abstract: '',
                note: ''
            };
            $scope.vm.data.persons.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.persons.splice(index, 1);
        }
        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics214Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams) {      //小组日志
        $scope.vm = {step: '1', tablename: 'ics214', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
        
        $scope.addUser = function () {
            var obj = {
                name: '',
                post: '',
                department: ''
            };
            $scope.vm.data.resources.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }

        // $scope.datajson = $scope.model;
        // console.log("aaaaaaaaaaaaaaa"+$scope.alltable);
    })

    .controller('ics214ACtl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams) {      //个人日志
        $scope.vm = {step: '1', tablename: 'ics214A', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }

        $scope.addUser = function () {
            var obj = {
                time: '',
                node: ''
            };
            $scope.vm.data.resources.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }

    })

    .controller('ics203Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams,users) {
        $scope.vm = {step: '1', tablename: 'ics203', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        $scope.vm.data.persons = [];
        //$scope.vm.userid = localStorage.roleid;

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.groups=[];
        icsdb.getdetail("eventstatus","?eventid="+$scope.vm.eventid).then(function(data){
            if(data.length>0){
               var persons = angular.fromJson(data[0].org);
                if(persons.length>0){
                    //$scope.vm.data.persons = persons[0];
                    angular.forEach(persons[0].children,function(group,index){
                        var obj = {};
                        obj.name = group.organization;
                        obj.users = [];
                        angular.forEach(group.users,function(item2,index2){
                            var user = {};
                            user.rolename = item2.role.rolename;
                            user.userid = item2.userid;
                            obj.users.push(user);
                        });
                        $scope.vm.data.groups.push(obj);
                    });

                    angular.forEach($scope.vm.data.groups,function(group,index){
                       angular.forEach(group.users,function(item2,index2){
                           users.getdetail(item2.userid).then(function(data){
                               item2.name = data.real_name;
                               //obj.users.push(user);
                           })
                       });
                    });
                }
            }
        });

        $scope.getusername=function(id){
          var name="";
            users.getdetail(id).then(function(data){
               name = data.real_name;
            });
        };

        //$scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics205Ctl', function ($scope, tablecontent, $filter , eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 205通讯计划
        $scope.vm = {step: '1', tablename: 'ics205', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.phones = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }
        $scope.addUser = function () {
            var obj = {
                name: '',
                post: '',
                mainphone: '',
                fax: '',
                secondphone: '',
                thirdphone: '',
                talk: ''
            };
            $scope.vm.data.phones.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.phones.splice(index, 1);
        }

        $scope.vm.data.talk = [];
        $scope.addtalk = function () {
            var obj = {
                system: '',
                channel: '',
                function: '',
                frequency: '',
                task: '',
                note: ''
            };
            $scope.vm.data.talk.push(obj);
        };
        $scope.removetalk= function (index) {
            $scope.vm.data.talk.splice(index, 1);
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics206Ctl', function ($scope, tablecontent, $filter , eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 206 医疗计划
        $scope.vm = {step: '1', tablename: 'ics206', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.medical = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }
        $scope.addUser = function () {
            var obj = {
                name: '',
                address: '',
                telephone: '',
                doctor: ''
            };
            $scope.vm.data.medical.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.medical.splice(index, 1);
        }

        //transport
        $scope.vm.data.transport = [];
        $scope.addtransport = function () {
            var obj = {
                aidname: '',
                aidaddress: '',
                aidtelephone: '',
                trans: ''
            };
            $scope.vm.data.transport.push(obj);
        };
        // $scope.removetranspost= function (index) {
        //     $scope.vm.data.transport.splice(index, 1);
        // }

        // // hospital
        $scope.vm.data.hospital = [];
        $scope.addhospital = function () {
            var obj = {
                honame: '',
                hoaddress: '',
                hotelephone: '',
                hoplane:'',
                hoload:"",
                levelcheck:'',
                level:"",
                burn:'',
                heilpad:''
            };
            $scope.vm.data.hospital.push(obj);
        };
        // $scope.removehospital= function (index) {
        //     $scope.vm.data.hospital.splice(index, 1);
        // }


        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics208Ctl', function ($scope, tablecontent, $filter , eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 208
        $scope.vm = {step: '1', tablename: 'ics208', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};

        $scope.vm.data.groups = [];
        //$scope.vm.userid = localStorage.roleid;
        //

        tablecontent.get("ics208").then(function (data) {
            if (data.length > 0) {
                //$scope.tableCotent = data[0].content;
                $scope.vm.data.groups = data[0].content[0].data;
            }
        }, function (error) {

        });

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.org = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }
        $scope.addUser = function () {
            var obj = {
                institution: '',
                name: '',
                post: '',
                phone: ''
            };
            $scope.vm.data.org.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.org.splice(index, 1);
        }


        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics209Ctl', function ($scope, tablecontent, $filter , eventservice, icsdb, eventtables, $state, $stateParams) {      //ICS 209
        $scope.vm = {step: '1', tablename: 'ics209', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};

        $scope.vm.data.groups = [];
        //$scope.vm.userid = localStorage.roleid;
        //

        tablecontent.get("ics209").then(function (data) {
            if (data.length > 0) {
                //$scope.tableCotent = data[0].content;
                $scope.vm.data.groups = data[0].content[0].data;
            }
        }, function (error) {

        });

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resource = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }
        $scope.addUser = function () {
            var obj = {
                institution: '',
                type: '',
                count: '',
                number: '',
                extrastaff:'',
                allstaff:''
            };
            $scope.vm.data.resource.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resource.splice(index, 1);
        }


        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
    })

    .controller('ics210Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state,$stateParams) {      //ICS210
        $scope.vm = {step: '1', tablename: 'ics210', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //
        $scope.vm.data.tableCotent = [];

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }

        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }

        $scope.addUser = function () {
            var obj = {
                name: '',
                status: '',
                from: '',
                go: '',
                date: '',
                time: ''
            };
            $scope.vm.data.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }
    })





    .controller('ics211Ctl', function ($scope, tablecontent, $filter,eventservice, icsdb, eventtables, $state, $stateParams) {
        $scope.vm = {step: '1', tablename: 'ics211', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.entstarttime = new Date();
        $scope.entendtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.endtime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.entstarttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.entendtime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }


        $scope.addUser = function () {
            var obj = {
                institution: "",
                classes: "",
                type: "",
                model: "",
                resourcename: "",
                team: "",
                application: "",
                inputdate: "",
                inputtime: "",
                leadername: "",
                totalpeople: "",
                information: "",
                organization: "",
                place: "",
                travel: "",
                task: "",
                others: "",
                data: ""
            };
            $scope.vm.data.resources.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }
    })

    .controller('ics220Ctl', function ($scope, tablecontent, $filter,eventservice, icsdb, eventtables, $state, $stateParams) {      //220
        $scope.vm = {step: '1', tablename: 'ics220', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.entstarttime = new Date();
        $scope.entendtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources1 = [];
        $scope.vm.data.resources2 = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.endtime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.entstarttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.entendtime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }
        // $scope.add = function (id, obj) {          //复用添加
        //     $.each($scope.tableCotent, function (i, item) {
        //         if (item.id == id){
        //             item.data.push(obj);
        //             return false;
        //         }
        //     });
        // };
        $scope.addUser = function () {
            var obj = {
                company: '',
                position: '',
                name: '',
                airtoair: '',
                airtoload: '',
                telephone: ''
            };
            $scope.vm.data.resources1.push(obj);
        };

        $scope.addUser1 = function () {
            var obj = {
                aircraft: '',
                base: '',
                aircraftcompany: '',
                passenger: '',
                aim: '',
                predictstart: '',
                predictend: '',
            };
            $scope.vm.data.resources2.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.vm.data.resources1.splice(index, 1);
        }
        $scope.removeUser1 = function (index) {
            $scope.vm.data.resources2.splice(index, 1);
        }
    })

    .controller('ics221Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state,$stateParams) {
        $scope.vm = {step: '1', tablename: 'ics221', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }

        $scope.addUser = function () {
            var obj = {
                resourcemodel: '',
                description: '',
                supplier: '',
                count: '',
                size: '',
                department: ''
            };
            $scope.vm.data.resources.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }
    })

    // .controller('ics230Ctl',function ($scope, tablecontent, $filter, $http, $q) {
    //     $scope.model = {
    //         eventName:'事件1',
    //         eventNum:'',
    //         startTime:"",
    //         endTime:"",
    //         meetInfo:[],
    //         esName:"",
    //         esPost:"",
    //         esDate:""
    //     }
    //     $scope.tableCotent = [];
    //     tablecontent.get("ics230").then(function(data){
    //         if (data.length > 0){
    //             $scope.meetInfo = data[0].content;
    //         }
    //     },function(error){
    //
    //     });
    //
    //     $scope.addUser = function() {
    //         var obj = {
    //             resourcemodel: '',
    //             description: '',
    //             supplier: '',
    //             count: '',
    //             size: '',
    //             department: ''
    //         };
    //         $scope.tableCotent.push(obj);
    //     };
    //     $scope.removeUser = function(index){
    //         $scope.tableCotent.splice(index, 1);
    //     }
    //     // $scope.saves=function(){
    //     //     $scope.tableCotent;
    //     //     var aaa = 1;
    //     // }
    // })

    .controller('ics232Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state,$stateParams) {      //232
        $scope.vm = {step: '1', tablename: 'ics232', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;
        //
        $scope.vm.data.problem1 = [];
        $scope.vm.data.problem2 = [];

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.starttime = $filter('date')($scope.starttime, 'yyyy-MM-dd HH:mm');
            $scope.vm.endtime = $filter('date')($scope.endtime, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }

        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }

        $scope.addUser = function () {
            var obj = {
                name: '',
                post: '',
                mainphone: '',
                fax: '',
                secondphone: '',
                thirdphone: '',
                talk: ''
            };
            $scope.vm.data.problem1.push(obj);
        };

        $scope.addUser1 = function () {
            var obj = {
                system: '',
                channel: '',
                function: '',
                frequency: '',
                task: '',
                note: '',
            };
            $scope.vm.data.problem2.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.vm.data.problem1.splice(index, 1);
        }
        $scope.removeUser1 = function (index) {
            $scope.vm.data.problem2.data.splice(index, 1);
        }
    })
    
    .controller('ics215Ctl', function ($scope, tablecontent, $filter, eventservice, icsdb, eventtables, $state, $stateParams) {
        $scope.vm = {step: '1', tablename: 'ics215', active: "1", datajson: ''};
        $scope.vm.data = {actions: []};
        $scope.vm.data.content = {};
        $scope.dt = new Date();
        var today = new moment();
        var endtime = (new moment()).add(1, 'days');
        $scope.starttime = new Date();
        $scope.endtime = new Date();
        $scope.vm.time = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        $scope.vm.eventid = localStorage.eventid;
        $scope.vm.periodid = localStorage.periodid;
        $scope.vm.userid = localStorage.userid;
        $scope.event = {};
        //$scope.vm.userid = localStorage.roleid;

        eventservice.getdetail(localStorage.eventid).then(function (data) {
            $scope.event = data;
            $scope.vm.eventid = data.id;
            $scope.vm.step = data.step;
        });

        $scope.vm.data.resources = [];

        var pdata = $stateParams.data;
        if (pdata) {
            $scope.isedit = true;
            if (pdata.id) {
                eventtables.getdetail(pdata.id).then(function (data) {
                    $scope.vm = data;
                    $scope.vm.id = "";
                    $scope.dt = new Date();
                    $scope.vm.data = angular.fromJson($scope.vm.datajson);
                    eventservice.getdetail(data.eventid).then(function (data2) {
                        $scope.vm.name = data2.name;
                    });
                });
            }
        }

        $scope.submit = function () {
            $scope.vm.time = $filter('date')($scope.dt, 'yyyy-MM-dd HH:mm');
            $scope.vm.datajson = angular.toJson($scope.vm.data);
            eventtables.add($scope.vm).then(function (data) {
                $state.go('app.ics_eventindex');
            })
        }
        $scope.cancel=function(){
            $state.go('app.ics_eventindex');
        }

        $scope.addUser = function () {
            var obj = {
                department: '',
                team: '',
                task: '',
                type: '',
                count: '',
                number: '',
                management: '',
                specialequip: '',
                address: '',
                time: ''
            };
            $scope.vm.data.resources.push(obj);
        };
        $scope.removeUser = function (index) {
            $scope.vm.data.resources.splice(index, 1);
        }
    })  // ICS 215 作业计划表

    .controller('IraqequiplistCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急通讯设备清单
        $scope.model = {
            commtool: "",
            standard: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_euuiplist").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                commtool: '',
                standard: ''
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })

    .controller('IraqemergencybagCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急包配备标准
        $scope.model = {
            goods: "",
            standard: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_emergencybag").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                goods: '',
                standard: ''
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })

    .controller('IraqbudgetlistCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急资金预算清单
        $scope.model = {
            project: "",
            cost: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_budgetlist").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                project: '',
                cost: ''
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })

    .controller('IraqfoodlistCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急食品储备清单
        $scope.model = {
            name: "",
            day: "",
            unit: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_foodlist").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                name: "",
                day: "",
                unit: ""
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })
    .controller('IraqcarlistCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急车辆检查清单
        $scope.model = {
            project: "",
            standard: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_carlist").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                project: "",
                standard: ""
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })
    .controller('IraqcarinfoCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急车辆检查清单
        $scope.model = {
            num: "",
            carnum: "",
            type: "",
            fuel: "",
            specification: "",
            seat: "",
            Iraqdriver: "",
            driver: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_carinfo").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                num: "",
                carnum: "",
                type: "",
                fuel: "",
                specification: "",
                seat: "",
                Iraqdriver: "",
                driver: ""
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })
    .controller('IraqevacuateinfoCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //应急车辆检查清单
        $scope.model = {
            num: "",
            fullname: "",
            gender: "",
            nation: "",
            passportnum: "",
            phone: "",
            department: "",
            vehicle: "",
            driver: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_carinfo").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                num: "",
                fullname: "",
                gender: "",
                nation: "",
                passportnum: "",
                phone: "",
                department: "",
                vehicle: "",
                driver: ""
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })
    .controller('IraqinfoCtrl', function ($scope, tablecontent, $filter, $http, $q) {      //中国海油伊拉克有限公司突发事件记录薄
        $scope.model = {
            time: "",
            note: ""
        }
        $scope.tableCotent = [];
        tablecontent.get("Iraq_info").then(function (data) {
            if (data.length > 0) {
                $scope.tableCotent = data[0].content;
            }
        }, function (error) {

        });
        $scope.addUser = function () {
            var obj = {
                time: "",
                note: ""
            };
            $scope.tableCotent.push(obj);
        };

        $scope.removeUser = function (index) {
            $scope.tableCotent.splice(index, 1);
        }

    })