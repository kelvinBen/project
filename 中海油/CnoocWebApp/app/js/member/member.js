angular.module('app.member', ['cnooc_service.organiztion_user'])
    .controller('memberCtl', function($scope, operator, SweetAlert, $filter) {

        $scope.init = function() {
            operator.getdetail(localStorage.userid).then(function(data) {
                $scope.vm = data;
            }, function(status) {

            });
        };
        $scope.init();
        $scope.submitForm = function() {
            if ($scope.formValidate.$valid == false) {
                SweetAlert.swal($filter('T')('error'), $filter('T')('forminputerror'), 'error');
                return;
            }
            operator.update($scope.vm.user_id, $scope.vm).then(function() {
                SweetAlert.swal($filter('T')('success'), $filter('T')('edit')+ $filter('T')('success'), 'success');
                $scope.init();
            }, function(status) {
                SweetAlert.swal($filter('T')('error'), $filter('T')('edit')+$filter('T')('error'), 'error');
                $scope.init();
            });
        };
        $scope.validateInput = function(name) {
            var inpu = $scope.formValidate[name];
            return inpu.$invalid;
        };
        $scope.reset = function() {
            $scope.init();
        };
    });
