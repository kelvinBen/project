
angular.module('app.systemmgr', ['cnooc_service', 'cnooc_service.Weather', 'pascalprecht.translate', 'cnooc_service.digitalmap', 'cnooc_service.PublicSentiment', 'cnooc_service.systemmgr', 'cnooc_service.organiztion_user', 'ics_service.event']);

var curApp = angular.module('app.systemmgr');

curApp.controller('userMgrControl', function ($scope, $http, $state, $filter, organiztion, operator, organiztion_user, ExSystemMgr, messageGroup, SweetAlert, toaster, ngDialog, FileUploader) {
    $scope.allUsers = null;
    $scope.loadUser = function () { //get all users
        operator.get().then(function (data) {
            $scope.allUsers = data;
        });
    };
    $scope.loadUser();
    $scope.changepasswd = function (id) {
        $scope.selId = id;
        ngDialog.open({
            template: 'modifyPwd.html',
            width: 400,
            showClose: false,
            closeByDocument: false,
            scope: $scope,
            controller: function ($scope, ngDialog) {
                $scope.newPwd = {
                    user_id: $scope.$parent.selId,
                    newPwd: ''
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.submitForm = function () {
                    if ($scope.changePwdForm.$invalid) return;
                    $scope.$parent.modifyPwd($scope.newPwd);
                };
                $scope.checkValue = function (name) {
                    var input = $scope.changePwdForm[name];
                    return input.$invalid;
                };
            }
        });
    };
    $scope.modifyPwd = function (obj) {
        ExSystemMgr.ChangePwd(obj.user_id, obj.newPwd).then(function (data) {
            ngDialog.closeAll();
            SweetAlert.swal('success', '修改密码成功.', 'success');
        }, function (status) {
            ngDialog.closeAll();
            SweetAlert.swal('error', '修改密码失败.', 'error')
        });
    };
    $scope.addUser = function () {
        $state.go("app.adduser");
    };
    $scope.editUser = function (data) {
        $state.go("app.adduser", { data: data });
    }

    $scope.deleteconfirm = function (id) {
        SweetAlert.swal({
            title: $filter('T')("确定删除吗?"),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')("确定"),
            cancelButtonText: $filter('T')("取消"),
            closeOnConfirm: true,
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.delete(id);
            }
        });
    };
    $scope.delete = function (id) {
        operator.delete(id).then(function (data) {
            SweetAlert.swal('success', 'delete user success.', 'success');
            angular.forEach($scope.allUsers, function (data, index) {
                if (data.user_id == id) {
                    $scope.allUsers.splice(index, 1);
                    return;
                }
            });
        }, function (error) {

        });
    };

    var uploader = $scope.uploader = new FileUploader({
        url: 'apis/api/Operator?type=1',
        queueLimit: 1, //文件个数
        autoUpload: true
        // removeAfterUpload: true //上传后删除文件
    });
    // uploader.onBeforeUploadItem = function(item) {
    //     $scope.updateStatus = false;
    //     var file = item.file.name;
    //     if (file == '' || file == null) {
    //         // layer.msg('请选择所要上传的文件！');
    //         SweetAlert.swal($filter('T')('error'), $filter('T')('noselfile'), 'error');
    //     } else {
    //         var index = file.lastIndexOf(".");
    //         if (index < 0) {
    //             // layer.msg("上传的文件格式不正确，请选择97-2003Excel文件(*.xls)！");
    //             SweetAlert.swal($filter('T')('error'), $filter('T')('filetypeerrorxls'), 'error');
    //         } else {
    //             var ext = file.substring(index + 1, file.length);
    //             if (ext != "xlsx") {
    //                 SweetAlert.swal($filter('T')('error'), $filter('T')('filetypeerrorxls'), 'error');
    //             } else {
    //                 return true;
    //             }
    //         }
    //     }
    //
    //     return false;
    // };
    uploader.onCompleteAll = function () {
        uploader.clearQueue();
    }
    uploader.onSuccessItem = function (item, response, status, headers) {
        if (response.eCode != 0)
            // layer.msg(response.msg);
            SweetAlert.swal($filter('T')('error'), $filter('T')('import') + $filter('T')('error'), 'error');
        else {
            $scope.loadUser();
            SweetAlert.swal($filter('T')('success'), $filter('T')('import') + $filter('T')('success'), 'success');
            // layer.msg('Import success!');
            // $http.get('@Url.Action("Users")').success(function(dt) {
            //     $scope.users = dt;
            // });
        }
    };
    $scope.UploadUsers = function () {
        $('#_f').click();
        $('#_f').val('');
    };
    $scope.exportUsers = function () {
        $http.post('@Url.Action("ExportUsers")').success(function (data) {
            if (data.errCode == 1) {
                try {
                    var elemIF = document.createElement("iframe");
                    elemIF.src = '../../Content/Upload/' + data.url;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                } catch (e) {

                }
            } else {
                layer.msg(data.msg);
            }
        });
    };
});

curApp.controller('userauthorizationCtrl', function ($scope, Role, OperatorRole, operator, ngDialog) {
    $scope.selRole = 1;
    $scope.load = function () {
        Role.get().then(function (rs) {
            $scope.roleList = rs;
            $scope.selRole = $scope.roleList.length > 0 ? $scope.roleList[0].role_id : null;
            $scope.search();
        });
    };
    $scope.loadAllUsers = function () { //get all users
        operator.get().then(function (data) {
            $scope.allUsers = data;
            $scope.load();
        });
    };
    $scope.loadAllUsers();
    $scope.selUsers = [];
    $scope.search = function () {
        OperatorRole.get().then(function (rs) {
            var selUIds = [];
            for (var i = 0; i < rs.length; ++i) {
                if (rs[i].role_id == $scope.selRole) {
                    selUIds.push(rs[i].user_id)
                }
            }
            var us = [];
            for (var i = 0; i < selUIds.length; ++i) {
                for (var j = 0; j < $scope.allUsers.length; ++j) {
                    if (selUIds[i] == $scope.allUsers[j].user_id) {
                        us.push($scope.allUsers[j]);
                        break;
                    }
                }
            }
            $scope.selUsers = us;
        });
    };
    $scope.setRoleUserPost = function(us){
        OperatorRole.setUsers(us, $scope.selRole).then(function(s){
            $scope.search();
        });
    };
    $scope.setUsers = function () {
        ngDialog.open({
            template: "addUsers",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 800,
            controller: function ($scope, OperatorRole) {
                $scope.checkAll = false;
                $scope.allUsers = [];
                $.each($scope.$parent.allUsers, function (j, u) {
                    var a = angular.copy(u);
                    for (var i = 0; i < $scope.$parent.selUsers.length; ++i) {
                        if ($scope.$parent.selUsers[i].user_id == u.user_id) {
                            a.checked = true;
                            break;
                        }
                    }
                    $scope.allUsers.push(a);
                });

                $scope.selAllFun = function () {
                    $scope.checkAll = !$scope.checkAll;
                    angular.forEach($scope.allUsers, function (item) {
                        item.checked = $scope.checkAll;
                    });
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.set = function () {
                    var ids = [];
                    angular.forEach($scope.allUsers, function (item) {
                        if (item.checked == true) {
                            ids.push(item.user_id);
                        }
                    });
                    $scope.$parent.setRoleUserPost(ids);
                    ngDialog.closeAll();
                };
            }
        });
    }
});

curApp.controller('AddUserCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, operator, ExSystemMgr) {
    //$scope.userid = $stateParams.id;
    // $scope.title = !$scope.userid?'add':'edit';
    $scope.vm = {
        create_time: ""
    };
    $scope.validateInput = function (name) {
        var inpu = $scope.formValidate[name];
        return inpu.$invalid;
    };

    $scope.isedit = false;
    var param = $stateParams.data;
    if (param) {
        $scope.vm = param;
        $scope.isedit = true;
        $scope.title = 'edit';
    } else {
        $scope.vm.date = new Date();
        $scope.title = 'add';
    }


    $scope.submitForm = function () {
        // $scope.vm.update_time = $filter('date')($scope.vm.date,'yyyy-MM-ddTHH:mm:ss');

        if ($scope.isedit) {
            ExSystemMgr.Update($scope.vm).then(function (data) {
                $state.go('app.userManage', {});
            }, function (error) {

            });
        } else {
            $scope.vm.create_time = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
            operator.add($scope.vm).then(function (data) {
                $state.go('app.userManage', {});
            }, function (error) {

            });
        }
    };

    $scope.cancel = function () {
        $state.go('app.userManage');
    };
});

curApp.controller('organiztionController', function ($scope, $http, $location, $state, $filter, organiztion, organiztion_user, operator, SweetAlert, toaster, ExSystemMgr, ngDialog) {
    $scope.treeDatas = [];
    $scope.group_tree = {};

    $scope.load = function () {
        organiztion.getorganiztion().then(function (dt) {
            $scope.treeDatas = [];
            $.each(dt, function (i, item) {
                if (item.parent_id == -1) {
                    var obj = {
                        id: item.organiztion_id,
                        label: item.organiztion_name,
                        sort: item.sort,
                        expanded: true,
                        children: $scope.initChildrenData(dt, item.organiztion_id)
                    };
                    $scope.treeDatas.push(obj);
                }
            });
            //$scope.group_tree.expand_all();
        }, function (status) { });
    }

    $scope.load();

    $scope.pop = function (title) {
        toaster.pop("warning", title, title);
    };


    $scope.initChildrenData = function (array, parentid) {
        var ary = [];
        $.each(array, function (i, item) {
            if (item.parent_id == parentid)
                ary.push({
                    id: item.organiztion_id,
                    label: item.organiztion_name,
                    sort: item.sort,
                    expanded: true,
                    children: $scope.initChildrenData(array, item.organiztion_id)
                });
        });
        ary = ary.sort(function (a, b) {
            return a.sort - b.sort;
        });
        return ary;
    };

    $scope.getUser = function (userid) {
        var user = null;
        angular.forEach($scope.allusers, function (item, index) {
            if (item.user_id == userid) {
                user = item;
                return;
            }
        })
        return user;
    };

    $scope.users = [];
    $scope.insName = '国际公司';
    $scope.cur_organiztion = {};

    $scope.my_tree_handler = function (branch) {
        $scope.users = [];
        angular.forEach($scope.orgs, function (item, index) {
            if (item.organiztion_id == branch.id) {
                $scope.cur_organiztion = item;
                return;
            }
        });
        // angular.forEach($scope.org_users, function(item, index) {
        //     if (item.organiztion_id == branch.id) {
        //         var user = $scope.getUser(item.user_id);
        //         if (user) {
        //             user.org_sort = item.sort;
        //             $scope.users.push(user);
        //         }
        //         //$scope.userids.push(item);
        //     }
        // });
        $scope.loadOrgUser();

    };

    $scope.loadOrgUser = function () {
        ExSystemMgr.OrganiztionUsers($scope.cur_organiztion.organiztion_id).then(function (data) {
            $scope.users = data;
        });
    };

    $scope.organiztions = [];
    $scope.org_tree = {};
    $scope.selOrg = '';
    $scope.srcDatas = null;
    $scope.org_users = [];
    $scope.orgs = [];

    organiztion.getorganiztion().then(function (data) {
        $scope.orgs = data;
    }, function (error) { });


    $scope.getOrganiztion = function (user_id) {
        var name = "";
        for (var i = 0; i < $scope.org_users.length; ++i) {
            if ($scope.org_users[i].user_id == user_id) {
                for (var j = 0; j < $scope.orgs.length; ++j) {
                    if ($scope.orgs[j].organiztion_id == $scope.org_users[i].organiztion_id) {
                        name = $scope.orgs[j].organiztion_name;
                        break;
                    }
                }
                break;
            }
        }
        return name;
    };

    $scope.sort = function (id, sort) {//排序
        ExSystemMgr.SortOrgUser(id, $scope.cur_organiztion.organiztion_id, sort).then(function (data) {
            if (data == "1") {
                $scope.loadOrgUser();
            }
        }, function (status) {

        });
    };

    $scope.setUsers = function () {//设置机构用户
        if (!$scope.cur_organiztion.organiztion_id) {
            SweetAlert.swal('错误', '无选中的组织机构。', 'error');
            return;
        }
        ngDialog.open({
            template: "addUsers",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 800,
            controller: function ($scope, organiztion) {
                $scope.checkAll = false;
                $scope.allUsers = [];
                $scope.orgUser = $scope.$parent.users;
                operator.get().then(function (data) {
                    angular.forEach(data, function (item) {
                        var a = angular.copy(item);
                        a.checked = false;
                        $.each($scope.orgUser, function (i, u) {
                            if (a.user_id == u.user_id) {
                                a.checked = true;
                                return false;
                            }
                        });

                        $scope.allUsers.push(a);
                    });
                });
                $scope.selAllFun = function () {
                    $scope.checkAll = !$scope.checkAll;
                    angular.forEach($scope.allUsers, function (item) {
                        item.checked = $scope.checkAll;
                    });
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.set = function () {
                    var ids = [];
                    angular.forEach($scope.allUsers, function (item) {
                        if (item.checked == true) {
                            ids.push(item.user_id);
                        }
                    });
                    $scope.$parent.setOrgUserPost({ id: ids, gid: $scope.$parent.cur_organiztion.organiztion_id });
                    ngDialog.closeAll();
                };
            }
        });
    };

    $scope.setOrgUserPost = function (data) {
        ExSystemMgr.SetOrganiztionUser(data).then(function (d) {
            $scope.loadOrgUser();
        });
    };

    $scope.isExist = function (obj) {
        var b = false;
        $.each($scope.srcDatas, function (i, item) {
            if (item.organiztion_id == obj.id) {
                b = true;
                return false;
            }
        });

        return b;
    };

    $scope.addorganiztion = function () {
        $state.go("app.addorganiztion");
    };

    $scope.editorganiztion = function () {
        $state.go("app.addorganiztion", {
            data: $scope.cur_organiztion
        });
    };

    $scope.delete = function (id) {
        organiztion.delete(id).then(function (data) {
            $scope.pop($filter('T')("已删除"));
            $scope.load();
        }, function (error) {

        });
    };

    $scope.deleteconfirm = function (id) {
        SweetAlert.swal({
            title: $filter('T')("确定删除吗?"),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')("确定"),
            cancelButtonText: $filter('T')("取消"),
            closeOnConfirm: true,
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.delete($scope.cur_organiztion.organiztion_id);
            } else {
                SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
            }
        });
    };
});

curApp.controller('messageGroupController', function ($scope, $filter, SweetAlert, messagegroup, messagegroup_user, organiztion_user, organiztion, operator, ExSystemMgr, ngDialog) {
    $scope.group_tree = {};
    $scope.treeDatas = [];
    $scope.loadGroups = function () {
        $scope.treeDatas = [];
        messagegroup.get().then(function (data) {
            $scope.groups = data;
            angular.forEach($scope.groups, function (item, i) {
                var obj = {
                    label: item.data_name,
                    data: item.data_id,
                    noLeaf: true,
                    expanded: true
                };
                $scope.treeDatas.push(obj);
            });
        });
    };
    $scope.loadGroups();
    $scope.getGroup = function (id) {
        var res = null;
        $.each($scope.groups, function (i, item) {
            if (item.data_id == id) {
                res = item;
                return false;
            }
        });
        return res;
    };
    $scope.loadGroupUsers = function () {
        $scope.users = [];
        ExSystemMgr.MessageGroupUsers($scope.selGroup.data).then(function (data) {
            $scope.users = data;
        });
    };
    $scope.my_tree_handler = function (branch) {
        $scope.selGroup = branch;
        $scope.loadGroupUsers();
    };
    $scope.sort = function (id, sort) {
        ExSystemMgr.SortGroupUsers(id, $scope.selGroup.data, sort).then(function (data) {
            if (data == "1") {
                $scope.loadGroupUsers();
            }
        });
    };
    $scope.groupNameIsExisted = function (id, value) {
        var flag = false;
        $.each($scope.groups, function (i, item) {
            if (item.data_id == id) return false;
            if (item.data_name == value) {
                flag = true;
                return false;
            }
        });
        return flag;
    };
    $scope.addGroup = function () {
        ngDialog.open({
            template: 'group.html',
            width: 400,
            showClose: false,
            closeByDocument: false,
            scope: $scope,
            controller: function ($scope, ngDialog) {
                $scope.title = 'add';
                $scope.groupName = '';
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.submitForm = function () {
                    if ($scope.groupForm.$invalid) return;
                    var obj = {
                        data_id: moment().format('YYYYMMDDHHmmSSSS'),
                        data_name: $scope.groupName,
                        data_name_en: '',
                        create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
                        parent_data_id: -1,
                        data_level: -1,
                        status: 0
                    };
                    messagegroup.add(obj).then(function (data) {
                        $scope.$parent.loadGroups();
                        $scope.close();
                    });
                };
                $scope.nameIsExisted = function () {
                    return $scope.$parent.groupNameIsExisted(null, $scope.groupName);
                };
                $scope.checkValue = function (name) {
                    var input = $scope.groupForm[name];
                    return input.$invalid;
                };
            }
        })
    };
    $scope.delGroup = function () {
        if ($scope.selGroup == null) {
            SweetAlert.swal('error', 'No selected Group', 'error');
            return;
        }
        SweetAlert.swal({
            title: $filter('T')("确定删除吗?"),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')("确定"),
            cancelButtonText: $filter('T')("取消"),
            closeOnConfirm: true,
        }, function (isConfirm) {
            if (isConfirm) {
                messagegroup.delete($scope.selGroup.data).then(function () {
                    $scope.selGroup = null;
                    SweetAlert.swal('success', 'Messagegroup is deleted.', 'success');
                    $scope.loadGroups();
                }, function (status) {
                    SweetAlert.swal('error', 'Delete failed.', 'error');
                });
            }
        });
    };
    $scope.editGroup = function () {
        if ($scope.selGroup == null) {
            SweetAlert.swal('error', 'No selected Group', 'error');
            return;
        }
        ngDialog.open({
            template: 'group.html',
            width: 400,
            showClose: false,
            closeByDocument: false,
            scope: $scope,
            controller: function ($scope, ngDialog) {
                $scope.title = 'edit';
                $scope.groupName = $scope.$parent.selGroup.label;
                $scope.groupid = $scope.$parent.selGroup.data;
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.submitForm = function () {
                    if ($scope.groupForm.$invalid) return;
                    var obj = $scope.$parent.getGroup($scope.groupid);
                    obj.data_name = $scope.groupName;
                    messagegroup.update($scope.groupid, obj).then(function (data) {
                        $scope.$parent.loadGroups();
                        $scope.close();
                    });
                };
                $scope.nameIsExisted = function () {
                    return $scope.$parent.groupNameIsExisted($scope.groupid, $scope.groupName);
                };
                $scope.checkValue = function (name) {
                    var input = $scope.groupForm[name];
                    return input.$invalid;
                };
            }
        })
    };
    $scope.setGroupUser = function () {
        if ($scope.selGroup == null) {
            SweetAlert.swal('error', 'No selected Group', 'error');
            return;
        }
        ngDialog.open({
            template: "addUsers",
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByDocument: false,
            showClose: false,
            width: 800,
            controller: function ($scope, messagegroup) {
                $scope.checkAll = false;
                $scope.allUsers = [];
                $scope.orgUser = $scope.$parent.users;
                operator.get().then(function (data) {
                    angular.forEach(data, function (item) {
                        var a = angular.copy(item);
                        a.checked = false;
                        $.each($scope.orgUser, function (i, u) {
                            if (a.user_id == u.user_id) {
                                a.checked = true;
                                return false;
                            }
                        });

                        $scope.allUsers.push(a);
                    });
                });
                $scope.selAllFun = function () {
                    $scope.checkAll = !$scope.checkAll;
                    angular.forEach($scope.allUsers, function (item) {
                        item.checked = $scope.checkAll;
                    });
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.set = function () {
                    var ids = [];
                    angular.forEach($scope.allUsers, function (item) {
                        if (item.checked == true) {
                            ids.push(item.user_id);
                        }
                    });
                    $scope.$parent.setGroupUserPost({ id: ids, gid: $scope.$parent.selGroup.data });
                    ngDialog.closeAll();
                };
            }
        });
    };
    $scope.setGroupUserPost = function (data) {
        ExSystemMgr.SetGroupUserPost(data).then(function (d) {
            $scope.loadGroupUsers();
        });
    };
});

curApp.controller('rolemgrControl', function ($scope, $filter, ExSystemMgr, ngDialog, Role, SweetAlert) {
    var load = function () {
        ExSystemMgr.GetRolePermissions().then(function (data) {
            $scope.roles = data;
        });
    };
    $scope.delete = function (id) {
        SweetAlert.swal({
            title: $filter('T')("确定删除吗?"),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')("确定"),
            cancelButtonText: $filter('T')("取消"),
            closeOnConfirm: true,
        }, function (isConfirm) {
            if (isConfirm) {
                Role.delete(id).then(function () {
                    SweetAlert.swal('success', 'Role is deleted.', 'success');
                    load();
                }, function (status) {
                    SweetAlert.swal('error', 'Delete failed.', 'error');
                });
            }
        });
    }
    $scope.add = function () {
        $scope.dlgTitle = 'add';
        ngDialog.open({
            template: 'roleTemp.html',
            width: 400,
            showClose: false,
            closeByDocument: false,
            scope: $scope,
            controller: function ($scope, ngDialog) {
                $scope.vm = {
                    role_id: 0,
                    role_name: '',
                    role_name_en: ''
                };
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.submitForm = function () {
                    if ($scope.groupForm.$invalid) return;
                    $scope.addPost($scope.vm);
                };
                $scope.checkValue = function (name) {
                    var input = $scope.groupForm[name];
                    return input.$invalid;
                };
            }
        });
    };
    $scope.addPost = function (obj) {
        Role.add(obj).then(function (data) {
            load();
        });
        ngDialog.closeAll();
    };
    $scope.edit = function (obj) {
        $scope.dlgTitle = 'edit';
        $scope.selRole = obj;
        ngDialog.open({
            template: 'roleTemp.html',
            width: 400,
            showClose: false,
            closeByDocument: false,
            scope: $scope,
            controller: function ($scope, ngDialog) {
                $scope.vm = $scope.$parent.selRole;
                $scope.close = function () {
                    ngDialog.closeAll();
                };
                $scope.submitForm = function () {
                    if ($scope.groupForm.$invalid) return;
                    $scope.editPost($scope.vm);
                };
                $scope.checkValue = function (name) {
                    var input = $scope.groupForm[name];
                    return input.$invalid;
                };
            }
        });
    };
    $scope.editPost = function (obj) {
        Role.update(obj.role_id, obj).then(function (data) {
            load();
        });
        ngDialog.closeAll();
    };
    load();
});

curApp.controller('permissionsCtrl', function ($scope, ExSystemMgr, Role, SweetAlert, ActionRole, Action) {
    $scope.selRole = null;
    $scope.actionList = [];
    $scope.loadAction = function () {
        Action.get().then(function (data) {
            $scope.actionList = [];
            var i = Math.floor(data.length / 3);
            for (var j = 0; j < i; ++j) {
                var ary = data.slice(j * 3, j * 3 + 3);
                $scope.actionList.push(ary);
            }
            var ary = data.slice(i * 3);
            $scope.actionList.push(ary);
            ActionRole.get().then(function (as) {
                $scope.roleActions = as;
                $scope.loadRoleAction();
            });
        });
    };
    $scope.load = function () {
        Role.get().then(function (rs) {
            $scope.roleList = rs;
            $scope.selRole = $scope.roleList.length > 0 ? $scope.roleList[0].role_id : null;
        });
        $scope.loadAction();
    };
    $scope.loadRoleAction = function () {
        angular.forEach($scope.actionList, function (ary) {
            angular.forEach(ary, function (a) {
                a.checked = false;
                $.each($scope.roleActions, function (i, ra) {
                    if (ra.role_id == $scope.selRole && ra.action_id == a.action_id) {
                        a.checked = true;
                        return false;
                    }
                });
            });
        });
    };

    $scope.load();

    $scope.save = function () {
        var ids = [];
        angular.forEach($scope.actionList, function (ary) {
            angular.forEach(ary, function (a) {
                if (a.checked == true) {
                    ids.push(a.action_id);
                }
            });
        });
        var obj = { id: ids, gid: $scope.selRole };
        ExSystemMgr.SetRoleActionPost(obj).then(function () {
            $scope.loadAction();
        });
    };
});

curApp.controller('webcrawlerCtrl', function ($scope, $http, $filter, webcrawler) {

    //$scope.webs = WebServer.query();
    webcrawler.get().then(function (data) {
        $scope.webs = data;
    }, function (status) { });


    $scope.formdata = {
        type: '旱灾',
        severity: 'IV级'
    };


    $scope.addDisaster = function () {
        $scope.curId = -1;
        var index = layer.open({
            type: 1,
            content: $('#addDisaster'),
            title: '@Html.GetLangbyKey("add")',
            area: ['500px', '500px'],
            maxmin: false
        });
        layer.full(index);
        //layer_show('@Html.GetLangbyKey("add")', $('#addDisaster'), 500, 500);
    };
    $scope.addDisasterPost = function () {
        //var obj = new WebServer($scope.formdata);
        // obj.$save(function () {
        //     $scope.webs.push(obj);
        // });
        webcrawler.add($scope.formdata).then(function (data) {
            $scope.webs.push(data);
        }, function (error) { });
        layer.closeAll();
    };
    $scope.editDisaster = function (id) {
        angular.forEach($scope.webs, function (data) {
            if (data.crawler == id) {
                $scope.formdata = data;
                $scope.curId = id;
            }
        });
        var index = layer.open({
            type: 1,
            content: $('#addDisaster'),
            title: '@Html.GetLangbyKey("edit")',
            area: ['500px', '500px'],
            maxmin: false
        });
        layer.full(index);
    };
    $scope.editDisasterPost = function () {
        //var obj = new WebServer($scope.formdata);
        //WebServer.update({ id: obj.id }, obj,
        //    function (response) {


        //}, function (response) {
        //});
        webcrawler.update($scope.formdata.crawler_id, $scope.formdata).then(function (data) {
            //$scope.webs.push(obj);
        }, function (error) { });
        //obj.update();
        //obj.time = $scope.dt;
        //obj.cityid = $scope.city_select.city_id;
        //$http.post('@Url.Action("EditDisaster")', obj).success(function (dt) {
        //    if (dt.errCode == 1) {
        //        $.each($scope.disaster, function (i, item) {
        //            if (dt.result.id == item.id) {
        //                $scope.disaster[i] = dt.result;
        //                return false;
        //            }
        //        });
        //    }
        //});
        layer.closeAll();
    };

    $scope.sumbit = function () {
        if ($scope.curId == -1)
            $scope.addDisasterPost();
        else
            $scope.editDisasterPost();
    };

    $scope.selectall = function () {
        angular.forEach($scope.disaster, function (data) {
            data.selected = $scope.select_all;
        });
    };
    $scope.deleteDisaster = function (id) {
        layer.confirm('@Html.GetLangbyKey("delsomes")？', function (index) {
            webcrawler.delete(id).then(function (data) {
                // 处理成功的删除响应
                layer.msg('@Html.GetLangbyKey("deleted")!', {
                    icon: 1,
                    time: 1000
                });
                angular.forEach($scope.webs, function (item, i) {
                    if (item.crawler_id == id) {
                        $scope.webs.splice(i, 1);
                    }
                })
            }, function (response) {
                // 处理非成功的删除响应
                //layer.msg('@Html.GetLangbyKey("deleted")!', { icon: 1, time: 1000 });
            });
        })
    };

});

curApp.controller('colInofCtrl', function ($scope, $filter, $q, SecuritySystem, countryrisk, Events, SweetAlert, DTOptionsBuilder) {

    $scope.itemsByPage = 10;
    $scope.eventStatus = -1;
    $scope.statusList = [{
        id: -1,
        label: '全部'
    }, {
        id: 0,
        label: '未发送'
    }, {
        id: 1,
        label: '已发送'
    }];
    $scope.date = {
        startDate: moment().add(-7, "days"),
        endDate: moment()
    };
    $scope.selCountry = -1;
    $scope.country = [{
        country_id: -1,
        name: 'ALL',
        name_en: 'ALL'
    }];
    countryrisk.get().then(function (data) {
        $scope.country = $scope.country.concat(data);
        $scope.search();
    });
    $scope.search = function () {
        var ary = [];
        var st = $scope.date.startDate.format('YYYYMMDD');
        var et = $scope.date.endDate.format('YYYYMMDD');
        var obj = {
            sTime: st,
            eTime: et,
            country: $scope.selCountry,
            user: -1
        };
        SecuritySystem.Events(obj).then(function (data) {
            angular.forEach(data, function (item, i) {
                if (item.type == 0 && ($scope.eventStatus == -1 || $scope.eventStatus == item.status)) { //爬虫类信息type == 0
                    item.checked = false;
                    item.country_name = $scope.countryNameByid(item.country_id);
                    ary.push(item);
                }
            });
            ary = ary.sort(function (a, b) {
                return b.event_date - a.event_date;
            });
            $scope.infos = ary;
        }, function (status) {
            $scope.infos = [];
        });
    };
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ordering', false)
        .withPaginationType('full_numbers');
    $scope.dtInstance = {};
    $scope.countryNameByid = function (id) {
        var s = "";
        $.each($scope.country, function (j, c) {
            if (id == c.country_id) {
                s = c.name;
                return false;
            }
        });
        return s;
    };
    $scope.checkAll = false;
    $scope.getSelctByCheck = function () {
        var ary = [];
        angular.forEach($scope.infos, function (item, i) {
            if (item.checked == true)
                ary.push(item);
        });
        return ary;
    };
    $scope.deletes = function () {
        var ary = $scope.getSelctByCheck();
        if (ary.length == 0) {
            // layer.msg("No selected items");
            return;
        }
        SweetAlert.swal({
            title: $filter('T')('determinedelete'),
            text: $filter('T')('deleteWarningInfo'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')('sure'),
            cancelButtonText: $filter('T')('cancel'),
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                angular.forEach(ary, function (item, i) {
                    Events.delete(item.event_id).then(function (dt) {
                        // $scope.removeInfoByInfoList(dt.event_id);

                    });
                });
                $scope.search();
                SweetAlert.swal($filter('T')('success'), $filter('T')('delsuccess'), 'success');
            } else {
                SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
            }
        });
    };
    $scope.removeInfoByInfoList = function (id) {
        var ary = [];
        angular.forEach($scope.infos, function (info, j) {
            if (info.event_id != id)
                ary.push(info);
        });
        $scope.infos = ary;
    };
    $scope.delete = function (id) {
        SweetAlert.swal({
            title: $filter('T')('determinedelete'),
            text: $filter('T')('deleteWarningInfo'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: $filter('T')('sure'),
            cancelButtonText: $filter('T')('cancel'),
            closeOnConfirm: false,
            closeOnCancel: false
        }, function (isConfirm) {
            if (isConfirm) {
                Events.delete(id).then(function (dt) {
                    $scope.removeInfoByInfoList(id);
                });
                SweetAlert.swal($filter('T')('success'), $filter('T')('delsuccess'), 'success');
            } else {
                SweetAlert.swal($filter('T')('cancelled'), $filter('T')('canceloper'), 'error');
            }
        });
    };
    $scope.checkAllSelected = function () {
        $scope.checkAll = !$scope.checkAll;
        angular.forEach($scope.infos, function (item, i) {
            item.checked = $scope.checkAll;
        });
    };
    $scope.reaudit = function (id) {
        $.each($scope.infos, function (i, item) {
            if (item.event_id == id) {
                item.status = 1;
                Events.update(item.event_id, item).then(function (dt) {
                    var obj = {};
                    angular.copy(item, obj);
                    obj.type = 1;
                    obj.status = 0;
                    obj.source_id = obj.event_id;
                    Events.add(obj);
                });
                return false;
            }
        });
    };
    $scope.batchsend = function () {
        var ary = $scope.getSelctByCheck();
        if (ary.length == 0) {
            return;
        }
        angular.forEach(ary, function (id, i) {
            $scope.reaudit(id.event_id);
        });
    };
});

curApp.controller('changepwdCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, ExSystemMgr) {

    $scope.vm = {
        create_time: ""
    };
    $scope.isedit = false;
    var param = $stateParams.data;
    if (param) {
        $scope.vm = param;
        $scope.isedit = true;
    } else {
        $scope.vm.date = new Date();
    }

    $scope.passwdError = false;

    $scope.submitForm = function () {
        // $scope.vm.update_time = $filter('date')($scope.vm.date,'yyyy-MM-ddTHH:mm:ss');
        if ($scope.vm.passwd != $scope.vm.confirmpasswd) {
            $scope.passwdError = true;
            return;
        }
        if ($scope.isedit) {
            ExSystemMgr.ChangePwd($scope.vm.user_id, $scope.vm.passwd).then(function (data) {
                $state.go('app.userManage', {});
            }, function (error) {

            });
        }
    };

    $scope.cancel = function () {
        $state.go('app.userManage', {});
    };
});

curApp.controller('AddOrganiztionCtrl', function ($scope, $http, $stateParams, $state, $filter, $location, organiztion, ExSystemMgr) {
    $scope.vm = {
        create_time: "",
        parent_id: '2016011802',
        organiztion_id: '',
        worker: "1"
    };
    $scope.isedit = false;
    var param = $stateParams.data;
    if (param) {
        $scope.vm = param;
        $scope.isedit = true;
        $scope.title = 'edit';
    } else {
        $scope.vm.date = new Date();
        $scope.title = 'add';
    }


    $scope.submitForm = function () {
        if ($scope.isedit) {
            organiztion.update($scope.vm.organiztion_id, $scope.vm).then(function (data) {
                $state.go('app.Organizationmanagement', {});
            }, function (error) {

            });
        } else {
            $scope.vm.organiztion_id = $filter('date')(new Date(), 'yyMMddHHmmss');
            $scope.vm.create_time = $filter('date')(new Date(), 'yyyy-MM-ddTHH:mm:ss');
            organiztion.add($scope.vm).then(function (data) {
                $state.go('app.Organizationmanagement', {});
            }, function (error) {

            });
        }
    };

    $scope.cancel = function () {
        $state.go('app.Organizationmanagement', {});
    };
});

curApp.controller('systemlogCtl', function ($scope, icsdb) {
    icsdb.get('systemlog').then(function (data) {
        $scope.logs = data;
    });
});

curApp.controller('refreshCtl', function ($scope, icsdb) {
    icsdb.get('systemconfig').then(function (data) {
        $scope.vm = data[0];
    });

    $scope.submitForm = function () {
        icsdb.update('systemconfig', $scope.vm.id, $scope.vm).then({});
    };
});