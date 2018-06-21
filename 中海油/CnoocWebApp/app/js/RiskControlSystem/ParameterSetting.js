/**
 * Created by hao on 2016-10-11.
 */
angular.module('app.ParameterSetting',[]);
var curApp = angular.module('app.ParameterSetting');
curApp.controller('ParameterSettingCtrl',function ($resource,$scope,$timeout,$state) {
    var vm = this;
    activate();
    function activate() {
        vm.my_tree_handler = function(branch) {
            if (branch.data && branch.data.href) {
                $state.go(branch.data.href);
            }
        };
        var treedata_avm = [
            {
                label:'国际公司'
            },
            {
                label: '海外公司',
                // data:'',
                children: [
                    {
                        label: '中国海洋石油东南亚有限公司'
                    },
                    {
                        label: '中海石油伊拉克有限公司'
                    },
                    {
                        label: '中海石油乌干达公司'
                    },
                    {
                        label: '中海油尼日利亚勘探开发有限公司'
                    },
                    {
                        label: '中海油澳大利亚西北大陆架有限公司'
                    },
                    {
                        label: '布里达斯合资公司'
                    },
                    {
                        label: '中海石油中东（卡塔尔）有限公司'
                    },
                    {
                        label: '中海石油刚果有限公司'
                    },
                    {
                        label: '中海石油非洲赤道几内亚分公司'
                    },
                    {
                        label: '国际公司柬埔寨分公司'
                    },
                    {
                        label: '中海石油阿尔及利亚有限公司'
                    }
                ]
            }

        ];
        vm.my_data = treedata_avm;
        vm.try_changing_the_tree_data = function() {
            if (vm.my_data === treedata_avm) {
                vm.my_data = treedata_geography;
            } else {
                vm.my_data = treedata_avm;
            }
            return vm.my_data;
        };
    }
});