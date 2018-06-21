(function () {
    'use strict';

    angular
        .module('app.routes', [
            'app.lazyload'
        ])
        .provider('RouteHelpers', RouteHelpersProvider)
        .config(routesConfig);

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];

    function RouteHelpersProvider(APP_REQUIRES) {

        /* jshint validthis:true */
        return {
            // provider access level
            basepath: basepath,
            resolveFor: resolveFor,
            // controller access level
            $get: function () {
                return {
                    basepath: basepath,
                    resolveFor: resolveFor
                };
            }
        };

        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            var _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                    // Creates a promise chain for each argument
                    var promise = $q.when(1); // empty promise
                    for (var i = 0, len = _args.length; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;

                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg === 'function')
                            return promise.then(_arg);
                        else
                            return promise.then(function () {
                                // if is a module, pass the name. If not, pass the array
                                var whatToLoad = getRequired(_arg);
                                // simple error check
                                if (!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                                // finally, return a promise
                                return $ocLL.load(whatToLoad);
                            });
                    }

                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (APP_REQUIRES.modules)
                            for (var m in APP_REQUIRES.modules)
                                if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                                    return APP_REQUIRES.modules[m];
                        return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
                    }

                }]
            };
        } // resolveFor

    }

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                resolve: helper.resolveFor('modernizr', 'icons', 'whirl')
            })
            .state('app.securitysystem', {
                url: '/securitysystem',
                title: 'securitysystem',
                templateUrl: helper.basepath('SecuritySystem/index.html'),
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.informationinput', {
                url: '/informationinput',
                title: 'informationinput',
                templateUrl: helper.basepath('SecuritySystem/SecurityInfoMgr.html'),
                resolve: helper.resolveFor('datatables', 'ui.select', 'moment', 'daterangepicker', 'oitozero.ngSweetAlert')
            })
            .state('app.inputinfo', {
                url: '/inputinfo',
                params: { id: null, type: null },
                title: 'inputinfo',
                templateUrl: helper.basepath('SecuritySystem/InputEvent.html'),
                resolve: helper.resolveFor('datatables', 'ui.select', 'moment', 'toaster', 'ngDialog')
            })
            .state('app.parametermanagement', { //海外社会安保预警系统首页-参数设置
                url: '/parameter',
                title: 'parameter management',
                templateUrl: helper.basepath('SecuritySystem/Parameter.html'),
                resolve: helper.resolveFor('xeditable', 'toaster', 'oitozero.ngSweetAlert', 'ngDialog')
            })
            .state('app.sstotalwarns', { //海外社会安保预警系统首页-预警信息统计分析
                url: '/sstotalwarns',
                title: 'sstotalwarns',
                templateUrl: helper.basepath('SecuritySystem/Analysis.html'),
                resolve: helper.resolveFor('ngDialog')
            })
            .state('app.totalanalysis', { //海外社会安保预警系统首页-预警信息统计分析
                url: '/totalanalysis',
                title: 'totalanalysis',
                templateUrl: helper.basepath('SecuritySystem/Totalwarns.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'highchartng', 'highchartexport')
            })
            .state('app.countryanalysis', { //海外社会安保预警系统首页-预警信息统计分析
                url: '/countryanalysis/:id',
                title: 'countryanalysis',
                templateUrl: helper.basepath('SecuritySystem/CountryAnalysis.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'highchartng', 'highchartexport', 'ngDialog')
            })
            .state('app.securitylist', { //海外社会安保预警系统首页-预警信息列表
                url: '/securityList',
                title: 'securityList',
                params: { month: null, country: null },
                templateUrl: helper.basepath('SecuritySystem/SecurityList.html'),
                resolve: helper.resolveFor('datatables', 'moment')
            })
            .state('app.eventlist', { //海外社会安保预警系统首页-预警信息列表
                url: '/eventlist',
                title: 'eventlist',
                params: { month: null },
                templateUrl: helper.basepath('SecuritySystem/EventsList.html'),
                resolve: helper.resolveFor('datatables', 'moment')
            })
            .state('app.totalinfos', { //海外社会安保预警系统首页-预警信息列表
                url: '/totalinfos',
                title: 'totalinfos',
                templateUrl: helper.basepath('SecuritySystem/totoalInfo.html')
            })
            .state('app.instantMsg', { //海外社会安保预警系统首页-警讯与报告发布
                url: '/instantMsg',
                title: 'instantMsg',
                templateUrl: helper.basepath('SecuritySystem/Securitytrend.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'datatables')
            })
            .state('app.release', { //海外社会安保预警系统首页-发布警讯
                url: '/release',
                title: 'release',
                params: { id: null },
                templateUrl: helper.basepath('SecuritySystem/release.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'datatables', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.Relieve', { //海外社会安保预警系统首页-发布警讯
                url: '/Relieve',
                title: 'Relieve',
                params: { id: null },
                templateUrl: helper.basepath('SecuritySystem/Relieve.html'),
                resolve: helper.resolveFor('moment', 'oitozero.ngSweetAlert')
            })
            .state('app.dayReports', { //海外社会安保预警系统首页-日报
                url: '/dayReports',
                title: 'dayReports',
                templateUrl: helper.basepath('SecuritySystem/dayReports.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'datatables', 'oitozero.ngSweetAlert')
            })
            .state('app.pday', { //海外社会安保预警系统首页-日报
                url: '/pday',
                title: 'pday',
                params: { id: '' },
                templateUrl: helper.basepath('SecuritySystem/PublicDay.html'),
                resolve: helper.resolveFor('moment')
            })
            .state('app.uploaddayReports', { //海外社会安保预警系统首页-上传
                url: '/uploadDayReport',
                title: 'uploadDayReport',
                params: { id: '' },
                templateUrl: helper.basepath('SecuritySystem/uploadDayReport.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'angularFileUpload', 'filestyle', 'oitozero.ngSweetAlert')
            })
            .state('app.monthReports', { //海外社会安保预警系统首页-月报
                url: '/monthReports',
                title: 'monthReports',
                params: { id: '' },
                templateUrl: helper.basepath('SecuritySystem/monthReports.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'datatables', 'ngDialog', 'oitozero.ngSweetAlert')
            })
            .state('app.uploadmonthReports', { //海外社会安保预警系统首页-月报
                url: '/uploadmonthReports',
                title: 'uploadmonthReports',
                params: { id: '' },
                templateUrl: helper.basepath('SecuritySystem/uploadmonthReports.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'angularFileUpload', 'filestyle', 'oitozero.ngSweetAlert')
            })
            .state('app.smsecurityadvise', { //海外社会安保预警系统首页-通用安保建议
                url: '/smsecurityadvise',
                title: 'smsecurityadvise',
                templateUrl: helper.basepath('SecuritySystem/SecurityAdvise.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.highvisit', { //海外社会安保预警系统首页-高访查询
                url: '/highvisit',
                title: 'highvisit',
                templateUrl: helper.basepath('SecuritySystem/accessrecord.html'),
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            .state('app.contrastMgr', { //海外社会安保预警系统首页-高访查询
                url: '/contrastMgr',
                title: 'contrastMgr',
                templateUrl: helper.basepath('SecuritySystem/contrastMgr.html'),
                resolve: helper.resolveFor('moment', 'daterangepicker', 'datatables')
            })
            .state('app.residentintroduction', { //海外社会安保预警系统首页-驻地国安保建议
                url: '/residentintroduction',
                title: 'residentintroduction',
                templateUrl: helper.basepath('SecuritySystem/ResidentIntroduction.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree', 'datatables', 'ngDialog')
            })
            .state('app.smmedicaladvise', { //海外社会安保预警系统首页-驻地国安保建议
                url: '/smmedicaladvise',
                title: 'smmedicaladvise',
                templateUrl: helper.basepath('SecuritySystem/MedicalAdvice.html'),
                resolve: helper.resolveFor()
            })
            .state('app.smsecuritytrain', { //海外社会安保预警系统首页-安保培训要求
                url: '/smsecuritytrain',
                title: 'smsecuritytrain',
                templateUrl: helper.basepath('SecuritySystem/smsecuritytrain.html'),
                resolve: helper.resolveFor()
            })
            .state('app.smsecurityadvisemgr', { //海外社会安保预警系统首页-通用安保建议管理
                url: '/smsecurityadvisemgr',
                title: 'smsecurityadvisemgr',
                templateUrl: helper.basepath('SecuritySystem/smsecurityadvisemgr.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree', 'textAngular', 'oitozero.ngSweetAlert', 'ngDialog')
            })
            .state('app.residentintroductionmgr', { //海外社会安保预警系统首页-驻地国安保建议管理
                url: '/residentintroductionmgr',
                title: 'residentintroductionmgr',
                templateUrl: helper.basepath('SecuritySystem/residentintroductionmgr.html'),
                resolve: helper.resolveFor('angularFileUpload', 'filestyle', 'textAngular', 'oitozero.ngSweetAlert')
            })
            .state('app.accessrecordmgr', { //海外社会安保预警系统首页-驻地国安保建议管理
                url: '/accessrecordmgr',
                title: 'accessrecordmgr',
                templateUrl: helper.basepath('SecuritySystem/accessrecordmgr.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.addaccessrecord', { //海外社会安保预警系统首页-驻地国安保建议管理
                url: '/addaccessrecord',
                title: 'addaccessrecord',
                params: { record: null },
                templateUrl: helper.basepath('SecuritySystem/addaccessrecord.html'),
                resolve: helper.resolveFor('textAngular', 'moment', 'toaster')
            })
            .state('app.MedicalAdviseMgr', { //海外社会安保预警系统首页-医疗卫生建议管理
                url: '/MedicalAdviseMgr',
                title: 'MedicalAdviseMgr',
                templateUrl: helper.basepath('SecuritySystem/MedicalAdviseMgr.html'),
                resolve: helper.resolveFor('textAngular', 'oitozero.ngSweetAlert')
            })
            .state('app.SecurityDataMgr', { //海外社会安保预警系统首页-安保培训要求管理
                url: '/SecurityDataMgr',
                title: 'SecurityDataMgr',
                templateUrl: helper.basepath('SecuritySystem/SecurityDataMgr.html'),
                resolve: helper.resolveFor('datatables', 'oitozero.ngSweetAlert', 'ngDialog')
            })
            .state('app.mapsystem', {
                url: '/mapsystem',
                title: 'mapsystem',
                templateUrl: helper.basepath('submenu.html')
            })
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ['$rootScope', function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: 'Login',
                templateUrl: 'app/pages/login.html'
            })
            .state('app.frameroute', { //���ӵ�ͼ-�ۺ���Ϣ-����λ�ò�ѯ
                url: '/frameroute',
                title: 'frameroute',
                params: {
                    id: null,
                    url: null
                },
                templateUrl: 'app/views/digitalmap/frameroute.html',
                resolve: helper.resolveFor()
            })
            .state('app.mslocatesearch', { //���ӵ�ͼ-�ۺ���Ϣ-����λ�ò�ѯ
                url: '/mslocatesearch',
                title: 'mslocatesearch',
                //params: { id: null, type: null },
                templateUrl: 'app/views/digitalmap/LocateSearch.html',
                resolve: helper.resolveFor('esrimap', 'angularBootstrapNavTree')
                //params:{id:null,url:"app/views/digitalmap/frame/LocateSearch.html"},
                //templateUrl:  'app/views/digitalmap/frameroute.html',
            })
            .state('app.mscomsearch', { //���ӵ�ͼ-�ۺ���Ϣ-�ۺϲ�ѯ
                url: '/mscomsearch',
                title: 'mscomsearch',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/CompSearch.html',
                resolve: helper.resolveFor('esrimap')
            })
            .state('app.projectmanage', { //���ӵ�ͼ-�ۺ���Ϣ
                url: '/projectmanage',
                title: 'projectmanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/ProjectManage.html',
                resolve: helper.resolveFor('angularFileUpload', 'datatables')
            })
            .state('app.msshowproduct', {
                url: '/msshowproduct',
                title: 'msshowproduct',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/UtilityMap.html',
                resolve: helper.resolveFor('esrimap')
            })
            .state('app.EmergencyResourcesMgr',{
                url:'/EmergencyResourcesMgr',
                title: 'EmergencyResourcesMgr',
                templateUrl: 'app/views/digitalmap/emergencymgr.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.addEmergencyResources',{
                url:'/addEmergencyResources',
                title: 'addEmergencyResources',
                params: {
                    data:null
                },
                templateUrl: 'app/views/digitalmap/addEmergencyResources.html',
                resolve: helper.resolveFor()
            })
            .state('app.msshowcars', { //���ӵ�ͼ-������ʾͼ��-����������Ϣ��ѯ
                url: '/msshowcars',
                title: 'msshowcars',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/CarSearch.html',
                resolve: helper.resolveFor('esrimap')
            })
            .state('app.msprojectmanage', { //项目信息管理
                url: '/msprojectmanage',
                title: 'msprojectmanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/ProjectManage.html',
                resolve: helper.resolveFor('angularFileUpload', 'datatables', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.msaddproject', { //添加项目信息
                url: '/msaddproject',
                title: 'msaddproject',
                params: {
                    data: null
                },
                templateUrl: 'app/views/digitalmap/AddProject.html',
                resolve: helper.resolveFor('angularFileUpload')
            })
            .state('app.msmachinemanage', { //���ӵ�ͼ-��Ϣ����-��ʩ��Ϣ����
                url: '/msmachinemanage',
                title: 'msmachinemanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/UtilityManage.html',
                resolve: helper.resolveFor('datatables', 'angularFileUpload', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.msaddutility', { //添加设施信息
                url: '/msaddutility',
                title: 'msaddutility',
                params: {
                    data: null
                },
                templateUrl: 'app/views/digitalmap/AddUtility.html',
                resolve: helper.resolveFor('angularFileUpload')
            })
            .state('app.msdangermanage', { //���ӵ�ͼ-��Ϣ����-��ʩ��Ϣ����
                url: '/msdangermanage',
                title: 'msdangermanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/DangerManage.html',
                resolve: helper.resolveFor('datatables', 'angularFileUpload', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.msaddDanger', { //添加设施信息
                url: '/msaddDanger',
                title: 'msaddDanger',
                params: {
                    data: null
                },
                templateUrl: 'app/views/digitalmap/AddDanger.html',
                resolve: helper.resolveFor('angularFileUpload')
            })
            .state('app.mscarmanage', { //���ӵ�ͼ-��Ϣ����-������Ϣ����
                url: '/mscarmanage',
                title: 'mscarmanage',
                templateUrl: 'app/views/digitalmap/CarManage.html',
                resolve: helper.resolveFor('datatables', 'angularFileUpload', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.msaddtransport', { //添加车辆船舶信息
                url: '/msaddtransport',
                title: 'msaddtransport',
                params: {
                    data: null
                },
                templateUrl: 'app/views/digitalmap/AddTransport.html',
                resolve: helper.resolveFor('angularFileUpload')
            })
            .state('app.positionmanage', { //���ӵ�ͼ-��Ϣ����-λ����Ϣ����
                url: '/positionmanage',
                title: 'positionmanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/positionmanage.html',
                resolve: helper.resolveFor('datatables', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.msaddposition', { //添加位置信息
                url: '/msaddposition',
                title: 'msaddposition',
                params: {
                    data: null
                },
                templateUrl: 'app/views/digitalmap/addposition.html',
                resolve: helper.resolveFor('datatables', 'angularFileUpload')
            })
            .state('app.evacuationroutemanage', { //撤离路线管理
                url: '/evacuationroutemanage',
                title: 'evacuationroutemanage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/evacuationroutemanage.html',
                resolve: helper.resolveFor('esrimap', 'angularBootstrapNavTree')
            })
            .state('app.orginfowindow', { //���ӵ�ͼ-��Ϣ����-����·�߹���
                url: '/orginfowindow',
                title: 'orginfowindow',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/digitalmap/orginfowindow.html',
                resolve: helper.resolveFor()
            })
            .state('app.disasterWeather', { //�ֺ�����-��ҳ
                url: '/WeatherSearch',
                title: 'WeatherSearch',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/WeatherSearch.html',
                resolve: helper.resolveFor('weather-icons')
            })
            .state('app.dwweathersearch', { //�ֺ�����-������Ϣ��ѯ-������ѯ
                url: '/dwweathersearch',
                title: 'dwweathersearch',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/weathermap.html',
                resolve: helper.resolveFor('esrimap')
            })
            .state('app.warnmap', { //�ֺ�����-������Ϣ��ѯ-Ԥ����ѯ
                url: '/warnmap',
                title: 'warnmap',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/Warnmap.html',
                resolve: helper.resolveFor('esrimap')
            })
            .state('app.dwlocatesearch', { //�ֺ�����-������Ϣ��ѯ-����λ�ò�ѯ
                url: '/dwlocatesearch',
                title: 'dwlocatesearch',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/weathersearch.html',
                resolve: helper.resolveFor('weather-icons')
            })
            .state('app.dwinsertwarndata', { //�ֺ�����-������Ϣ����-Ԥ����Ϣ��ѯ
                url: '/dwinsertwarndata',
                title: 'dwinsertwarndata',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/warnimport.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.dwinsertdisasterdata', { //�ֺ�����-������Ϣ����-�ֺ���Ϣ¼��
                url: '/dwinsertdisasterdata',
                title: 'dwinsertdisasterdata',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/disasterimport.html',
                // resolve: {
                //     deps: helper.resolveFor('datatables','moment','daterangepicker','oitozero.ngSweetAlert','toaster').deps,
                //     disasterRes: ['Citydisaster', function (Citydisaster) {
                //         return Citydisaster.get().then(function (data) {
                //             return data;
                //         });
                //     }]
                // }
                resolve: helper.resolveFor('datatables', 'moment', 'daterangepicker', 'oitozero.ngSweetAlert', 'toaster')
            })
            .state('app.adddisaster', { //�ֺ�����-������Ϣ����-�ֺ���Ϣ¼��
                url: '/adddisaster',
                title: 'adddisaster',
                params: {
                    id: null,
                    data: null
                },
                templateUrl: 'app/views/weather/Adddisaster.html',
                resolve: helper.resolveFor()
            })
            .state('app.postwarning', { //
                url: '/postwarning',
                title: 'postwarning',
                params: {
                    id: null,
                    type: null,
                    data: null
                },
                templateUrl: 'app/views/weather/postwarning.html',
                resolve: helper.resolveFor()
            })
            .state('app.dwsearchdisasterdata', { //�ֺ�����-������Ϣ����-�ֺ���Ϣ��ѯ
                url: '/dwsearchdisasterdata',
                title: 'dwsearchdisasterdata',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/disastersearch.html',
                resolve: helper.resolveFor('datatables', 'moment', 'daterangepicker')
            })
            .state('app.dwgraphics', { //�ֺ�����-������Ϣ����-ͼ�����
                url: '/dwgraphics',
                title: 'dwgraphics',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/weather/Graphicanaysis.html',
                resolve: helper.resolveFor('angularBootstrapNavTree', 'moment', 'daterangepicker', 'highchartng', 'highchartexport')
            })
            .state('app.publicSentiment', { //舆情信息系统
                url: '/publicSentiment',
                title: 'publicSentiment',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/index.html',
                resolve: helper.resolveFor('highchartng')
            })
            .state('app.security', { //安保预警类
                url: '/security',
                title: 'security',
                params: {
                    id: null,
                    type: "0"
                },
                templateUrl: 'app/views/publicsentiment/PubType.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.disaster', { //
                url: '/disaster',
                title: 'disaster',
                params: {
                    id: null,
                    type: "1"
                },
                templateUrl: 'app/views/publicsentiment/PubType.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.emergency', { //
                url: '/emergency',
                title: 'emergency',
                params: {
                    id: null,
                    type: "2"
                },
                templateUrl: 'app/views/publicsentiment/PubType.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.institutional', { //组织机构
                url: '/institutional',
                title: 'institutional',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/institutional.html',
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.communication', { //
                url: '/communication',
                title: 'communication',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/communication.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.message', { //
                url: '/message',
                title: 'message',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/MessageGroup.html',
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.writeMessage', { //写邮件
                url: '/writeMessage',
                title: 'writeMessage',
                params: {
                    id: null,
                    type: null,
                    data: null
                },
                templateUrl: 'app/views/publicsentiment/write.html',
                resolve: helper.resolveFor('ngWig', 'ngjstree')
            })
            .state('app.writeroute', { //写邮件
                url: '/writeroute',
                title: 'writeroute',
                templateUrl: 'app/views/publicsentiment/WriteRoute.html',
            })
            .state('app.inbox', { //
                url: '/inbox',
                title: 'inbox',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/inbox.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.examMessage', { //信息审核
                url: '/examMessage',
                title: 'examMessage',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/examMessage.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.outbox', { //
                url: '/outbox',
                title: 'outbox',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/outbox.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.travelwarning', { //
                url: '/travelwarning',
                title: 'travelwarning',
                templateUrl: 'app/views/publicsentiment/TravelWarning.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.addtravelwarning', { //
                url: '/addtravelwarning',
                title: 'addtravelwarning',
                templateUrl: 'app/views/publicsentiment/addTravelWarning.html',
                resolve: helper.resolveFor('moment', 'oitozero.ngSweetAlert')
            })
            .state('app.viewmessagedetail', { //
                url: '/viewmessagedetail',
                title: 'viewmessagedetail',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/publicsentiment/viewmessagedetail.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.userManage', {
                url: '/userManage',
                title: 'userManage',
                params: {
                    data: null
                },
                templateUrl: 'app/views/SystemMgr/UserMgr.html',
                resolve: helper.resolveFor('datatables', 'oitozero.ngSweetAlert', 'toaster', 'ngDialog', 'angularFileUpload')
            })
            .state('app.Organizationmanagement', { //
                url: '/Organizationmanagement',
                title: 'Organizationmanagement',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/SystemMgr/Organiztion.html',
                resolve: helper.resolveFor('datatables', 'angularBootstrapNavTree', 'oitozero.ngSweetAlert', 'toaster', 'ngDialog')
            })
            .state('app.Messagegroupmgr', { //
                url: '/Messagegroupmgr',
                title: 'Messagegroupmgr',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/SystemMgr/MessageGroupMgr.html',
                resolve: helper.resolveFor('datatables', 'angularBootstrapNavTree', 'ngDialog', 'moment', 'oitozero.ngSweetAlert')
            })
            .state('app.rolemanagement', { //角色管理
                url: '/rolemanagement',
                title: 'rolemanagement',
                templateUrl: 'app/views/SystemMgr/RoleMgr.html',
                resolve: helper.resolveFor('ngDialog', 'oitozero.ngSweetAlert')
            })
            .state('app.roleofauthoritymanagement', { //
                url: '/roleofauthoritymanagement',
                title: 'roleofauthoritymanagement',
                templateUrl: 'app/views/SystemMgr/PermissionsMgr.html',
                resolve: helper.resolveFor('ngDialog', 'oitozero.ngSweetAlert')
            })
            .state('app.webcrawler', { //
                url: '/webcrawler',
                title: 'webcrawler',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/SystemMgr/webcrawler.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.collectioninfomgr', { //
                url: '/collectioninfomgr',
                title: 'collectioninfomgr',
                params: {
                    id: null,
                    type: null
                },
                templateUrl: 'app/views/SystemMgr/CollectionInfoMgr.html',
                resolve: helper.resolveFor('datatables', 'moment', 'daterangepicker', 'oitozero.ngSweetAlert')
            })
            .state('app.adduser', { //
                url: '/adduser',
                title: 'adduser',
                params: {
                    id: null,
                    data: null
                },
                templateUrl: 'app/views/SystemMgr/AddUser.html',
                resolve: helper.resolveFor()
            })
            .state('app.changepasswd', { //
                url: '/changepasswd',
                title: 'changepasswd',
                params: {
                    id: null,
                    data: null
                },
                templateUrl: 'app/views/SystemMgr/ChangePwd.html',
                resolve: helper.resolveFor()
            })
            .state('app.addorganiztion', { //
                url: '/addorganiztion',
                title: 'addorganiztion',
                params: {
                    id: null,
                    data: null
                },
                templateUrl: 'app/views/SystemMgr/AddOrganiztion.html',
                resolve: helper.resolveFor()
            })
            //ICS系统首页
            .state('app.ics_systemindex', {
                url: '/ics_systemindex',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemindex.html')
                //resolve: helper.resolveFor('sparklines.directives')
            })
            .state('app.ics_eventorganization', {
                url: '/ics_eventorganization',
                title: 'event organization',
                templateUrl: helper.basepath('ics/eventorganization.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree', 'oitozero.ngSweetAlert', 'ngDialog', 'xeditable', 'ui.select', 'datatables')
            })
            .state('app.ics_files', {
                url: '/ics_files',
                title: 'ics_files',
                templateUrl: helper.basepath('ics/icsfiles.html'),
                resolve: helper.resolveFor('oitozero.ngSweetAlert', 'datatables')

            })
            .state('app.addicsfile', {
                url: '/addicsfile',
                title: 'addicsfile',
                templateUrl: helper.basepath('ics/addicsfile.html'),
                resolve: helper.resolveFor('moment', 'textAngular', 'oitozero.ngSweetAlert', 'angularFileUpload', 'filestyle')
            })
            //系统指南
            .state('app.ics_systemguide', {
                url: '/ics_systemguide',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemguide.html'),
                resolve: helper.resolveFor('flatdoc')
            })
            .state('app.ics_systemguidemanage', {
                url: '/ics_systemguidemanage',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemguidemanage.html'),
            })
            .state('app.ics_eventindex', {//事件看板
                url: '/ics_eventindex',
                title: 'first meeting',
                params: { type : null },
                templateUrl: helper.basepath('ics/EventManagement/eventindex.html'),
                resolve: helper.resolveFor('layer', 'resizediv')
            })
            .state('app.ics_organiztion', {
                url: '/ics_organiztion',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/eventmanagement/organiztion.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ics_eventtablelist', {
                url: '/ics_eventtablelist',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/eventmanagement/eventtablelist.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.ics_eventhistory', {//历史事件
                url: '/ics_eventhistory',
                title: 'first meeting',
                params: { type: 1 },
                templateUrl: helper.basepath('ics/EventManagement/eventindex.html'),
                resolve: helper.resolveFor('layer', 'resizediv')
                // templateUrl: helper.basepath('ics/EventManagement/eventhistory.html')
            })
            .state('app.ics_personinfo', {
                url: '/ics_personinfo',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/eventmanagement/personinfo.html')
                // resolve: helper.resolveFor('sparklines.directives')
            })
            //系统角色管理
            .state('app.ics_systemrole', {
                url: '/ics_systemrole',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemmanagement/systemrole.html')
                // resolve: helper.resolveFor('sparklines.directives')
            })
            //系统角色管理添加
            .state('app.ics_systemroleadd', {
                url: '/ics_systemroleadd',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemmanagement/systemroleadd.html')
                // resolve: helper.resolveFor('sparklines.directives')
            })
            //ics角色管理
            .state('app.ics_role', {
                url: '/ics_role',
                title: 'ics_role',
                templateUrl: helper.basepath('ics/systemmanagement/icsrole.html'),
                resolve: helper.resolveFor('oitozero.ngSweetAlert')
            })
            .state('app.ics_roleedit', {
                url: '/ics_roleedit',
                title: 'ics_roleedit',
                params: { id: null },
                templateUrl: helper.basepath('ics/systemmanagement/icsroleedit.html'),
                resolve: helper.resolveFor('oitozero.ngSweetAlert', 'textAngular')
            })
            .state('app.ics_form', {
                url: '/ics_form',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/systemmanagement/icsform.html')
                // resolve: helper.resolveFor('sparklines.directives')
            })
            //信息源管理
            .state('app.ics_message', {
                url: '/ics_message',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/public/message.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_socialpublic', {
                url: '/ics_socialpublic',
                title: 'Form Validation',
                templateUrl: helper.basepath('ics/public/socialpublic.html'),
                resolve: helper.resolveFor('datatables', 'moment', 'daterangepicker')
            })
            //应急反应初报表
            .state('app.ics_primarytable', {
                url: '/ics_primarytable',
                title: 'Form Validation',
                params: { data: null, type: null, organiztionid: null, sourceid: null },
                templateUrl: helper.basepath('ics/eventmanagement/primarytable.html'),
                resolve: helper.resolveFor('moment')
            })
            //国际公司应急事件反应表
            .state('app.ics_reactiontable', {
                url: '/ics_reactiontable',
                title: 'Form Validation',
                params: { data: null },
                templateUrl: helper.basepath('ics/eventmanagement/reactiontable.html'),
                resolve: helper.resolveFor('moment')
            })
            .state('app.ics_addperiod', {
                url: '/ics_addperiod',
                title: 'Form Validation',
                params: { data: null },
                templateUrl: helper.basepath('ics/eventmanagement/addperiod.html'),
                resolve: helper.resolveFor('moment')
            })
            .state('app.ics_webmessage', {
                url: '/ics_webmessage',
                title: 'Form Validation',
                params: { data: null },
                templateUrl: helper.basepath('ics/eventmanagement/webmessage.html'),
                resolve: helper.resolveFor('moment')
            })
            .state('app.ics2011', {//ICS 201-1 事故图
                url: '/ics2011',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-1.html')
            })
            .state('app.ics2012', {//ICS 201-2
                url: '/ics2012',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/201-2.html'),
                resolve: helper.resolveFor('moment', 'xeditable','angularFileUpload', 'filestyle', 'oitozero.ngSweetAlert')
            })
            .state('app.ics2013', {//ICS 201-3
                url: '/ics2013',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-3.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics2014', {//ICS 201-4
                url: '/ics2014',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-4.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics2015', {//ICS 201-6
                url: '/ics2015',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-5.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics2016', {//ICS 201-6
                url: '/ics2016',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-6.html')
            })
            .state('app.ics2017', {//ICS 201-7 对外联络
                url: '/ics2017',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 201-7.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics202', {//ICS 响应目标
                url: '/ics202',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 202.html'),
                resolve: helper.resolveFor('xeditable', 'checklist')
            })
            .state('app.ics203', {//ICS 201-7 对外联络
                url: '/ics203',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 203.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics204', {//ICS 201-7 对外联络
                url: '/ics204',
                title: 'first meeting',
                params: { data: null, task: null },
                templateUrl: helper.basepath('ics/table/ICS 204.html'),
                resolve: helper.resolveFor('xeditable', 'ngWig')
            })
            .state('app.ics205', {//ICS 201-7 对外联络
                url: '/ics205',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 205.html'),
                resolve: helper.resolveFor('moment', 'xeditable')

            })
            .state('app.ics206', {//ICS 206
                url: '/ics206',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 206.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics208', {//ICS 208
                url: '/ics208',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 208.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics209', {//ICS 201-7 对外联络
                url: '/ics209',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS209.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics210', {//ICS 201-7 对外联络
                url: '/ics210',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS210.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics211', {//ICS 201-7 对外联络
                url: '/ics211',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS211.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics214A', {//ICS 201-7 对外联络
                url: '/ics214A',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS214A.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics214', {//ICS 201-7 对外联络
                url: '/ics214',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS214.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics215', {//ICS 201-7 对外联络
                url: '/ics215',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 215.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics220', {//ICS 201-7 对外联络
                url: '/ics220',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 220.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics221', {//ICS 201-7 对外联络
                url: '/ics221',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 221.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics230', {//ICS 201-7 对外联络
                url: '/ics230',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 230.html')
            })
            .state('app.ics231', {//ICS 201-7 对外联络
                url: '/ics231',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/231.html')
            })
            .state('app.ics232', {//ICS 201-7 对外联络
                url: '/ics232',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS 232.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics234', {//ICS 201-7 对外联络
                url: '/ics234',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/234.html'),
                resolve: helper.resolveFor('xeditable')
            })

            .state('app.publicinfos', {//公共信息
                url: '/publicinfos',
                title: 'publicinfos',
                params: { data: null },
                templateUrl: helper.basepath('ics/EventManagement/publicinfos.html'),
                resolve: helper.resolveFor('textAngular', 'oitozero.ngSweetAlert')
            })

            .state('app.ics_judgment', {//ICS  形势判断
                url: '/ics_judgment',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/EventManagement/judgment.html'),
                resolve: helper.resolveFor('xeditable', 'moment')
            })
            .state('app.ics_prejudgment', {//ICS 是否满足启动国际公司应急条件
                url: '/ics_prejudgment',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/EventManagement/prejudgment.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_firstmeeting', {//召开首次应急会议
                url: '/ics_firstmeeting',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/EventManagement/firstmeeting.html'),
                resolve: helper.resolveFor('xeditable', 'moment')
            })
            .state('app.ics_tableview', {//ICS 系统指南表格
                url: '/ics_tableview',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/tableview.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_eventtypeselect', { //   应急事件初报表
                url: '/ics_eventtypeselect',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/eventtypeselect.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_unprimarytable', { //ICS 非常规事件初报表
                url: '/ics_unprimarytable',
                title: 'first meeting',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/unprimarytable.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_grouplog', {//ICS 214 小组日志
                url: '/ics_grouplog',
                title: 'Group Log',
                params: { data: null },
                templateUrl: helper.basepath('ics/table/ICS214.html'),
                resolve: helper.resolveFor('xeditable', 'moment')
            })
            // .state('app.ics_personallog',{//ICS 214A 个人日志
            //     url: '/ics_personallog',
            //     title: 'Personal log',
            //     params: {data: null},
            //     templateUrl: helper.basepath('ics/table/ICS214A.html'),
            //     resolve: helper.resolveFor('xeditable')
            // })

            .state('app.ics_communication', {//ICS 205 通讯计划
                url: '/ics_communication',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 205.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_safe', {//ICS 208 安全计划
                url: '/ics_safe',
                title: 'Safe',
                templateUrl: helper.basepath('ics/table/ICS 208.html'),
                resolve: helper.resolveFor('xeditable', 'moment')
            })
            .state('app.ics_medical', {//ICS 206 医疗计划
                url: '/ics_medical',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 206.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_resourcechange', {//ICS 210  资源状态变化
                url: '/ics_resourcechange',
                title: 'Resourcechange',
                templateUrl: helper.basepath('ics/table/ICS210.html'),
                resolve: helper.resolveFor('xeditable', 'moment')
            })
            .state('app.ics_eventinlist', {//ICS 211  事故入场清单
                url: '/ics_eventinlist',
                title: 'Eventinlist',
                templateUrl: helper.basepath('ics/table/ICS211.html'),
                resolve: helper.resolveFor('moment', 'xeditable')
            })
            .state('app.ics_flight', {//ICS 220 飞行作业总结工作表
                url: '/ics_flight',
                title: 'Flight',
                templateUrl: helper.basepath('ics/table/ICS 220.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_retire', {//ICS 221 复原退场
                url: '/ics_retire',
                title: 'Retire',
                templateUrl: helper.basepath('ics/table/ICS 221.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_daymeetlist', {//ICS 230 日常例会
                url: '/ics_daymeetlist',
                title: 'Daymeetlist',
                templateUrl: helper.basepath('ics/table/ICS 230.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_dangerresource', {//ICS 232 处于风险的周边区域状况
                url: '/ics_dangerresource',
                title: 'Dangerresource',
                templateUrl: helper.basepath('ics/table/ICS 232.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_emergencyorgan', {//ICS 201-3 应急组织架构图
                url: '/ics_emergencyorgan',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 201-3.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_sumresource', {//ICS 201-4 资源状况总结
                url: '/ics_sumresource',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 201-4.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_peoplecondition', {//ICS 201-5 人员状况
                url: '/ics_peoplecondition',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 201-5.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_contact', {//ICS 201-7 对外联络
                url: '/ics_contact',
                title: 'Communication',
                templateUrl: helper.basepath('ics/table/ICS 201-7.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_sumincident', {//ICS 209事故状态总结
                url: '/ics_sumincident',
                title: 'Sumincident',
                templateUrl: helper.basepath('ics/table/ICS209.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_plan', {//ICS 215 作业计划表
                url: '/ics_plan',
                title: 'Sumincident',
                templateUrl: helper.basepath('ics/table/ICS 215.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.authority', {    //权限
                url: '/authority',
                title: 'Authority',
                templateUrl: helper.basepath('ics/EventManagement/authority.html'),
                resolve: helper.resolveFor('xeditable', 'oitozero.ngSweetAlert')
            })
            .state('app.Iraq_equiplist', {    //应急通讯设备清单
                url: '/Iraq_equiplist',
                title: 'Iraq equiplist',
                templateUrl: helper.basepath('ics/table/Iraq_equiplist.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_emergencybag', {    //应急包配备标准
                url: '/Iraq_emergencybag',
                title: 'Iraq emergencybag',
                templateUrl: helper.basepath('ics/table/Iraq_emergencybag.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_budgetlist', {    //应急资金预算清单
                url: '/Iraq_budgetlist',
                title: 'Iraq budgetlist',
                templateUrl: helper.basepath('ics/table/Iraq_budgetlist.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_foodlist', {    // 应急食品储备清单
                url: '/Iraq_foodlist',
                title: 'Iraq foodlist',
                templateUrl: helper.basepath('ics/table/Iraq_foodlist.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_carlist', {    //应急车辆检查清单
                url: '/Iraq_carlist',
                title: 'Iraq carlist',
                templateUrl: helper.basepath('ics/table/Iraq_carlist.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_evacuation', {    //撤离人员个人检查表
                url: '/Iraq_evacuation',
                title: 'Iraq evacuation',
                templateUrl: helper.basepath('ics/table/Iraq_evacuation.html')
                // resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_carinformation', {    //应急车辆信息表
                url: '/Iraq_carinformation',
                title: 'Iraq carinformation',
                templateUrl: helper.basepath('ics/table/Iraq_carinformation.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_evacuateinfo', {    //撤离人员信息表
                url: '/Iraq_evacuateinfo',
                title: 'Iraq evacuateinfo',
                templateUrl: helper.basepath('ics/table/Iraq_evacuateinfo.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.Iraq_emergencyreport', {    //突发事件报告表
                url: '/Iraq_emergencyreport',
                title: 'Iraq emergencyreport',
                templateUrl: helper.basepath('ics/table/Iraq_emergencyreport.html')
                // resolve: helper.resolveFor('xeditable')
            })

            .state('app.Iraq_Iraqinfo', {    //中国海油伊拉克有限公司突发事件记录薄
                url: '/Iraq_Iraqinfo',
                title: 'Iraq_Iraqinfo',
                templateUrl: helper.basepath('ics/table/Iraq_Iraqinfo.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.iraqtouchcondition', {//伊拉克预警触发条件
                url: '/iraqtouchcondition',
                title: 'Sumincident',
                templateUrl: helper.basepath('ics/table/iraqtouchcondition.html')
            })
            .state('app.iraqresponse', {//伊拉克应急保障措施
                url: '/iraqresponse',
                title: 'Sumincident',
                templateUrl: helper.basepath('ics/table/iraqresponse.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.ics_actionguidemgr', {//伊拉克应急保障措施
                url: '/actionguidemgr',
                title: 'actionguidemgr',
                templateUrl: helper.basepath('ics/actionguidemgr.html'),
                resolve: helper.resolveFor('angularFileUpload', 'filestyle', 'oitozero.ngSweetAlert')
            })
            .state('app.ics_actionduty', {//伊拉克应急保障措施
                url: '/actionduty',
                title: 'actionduty',
                templateUrl: helper.basepath('ics/eventactionduty.html')
            })
            .state('app.ics_sendOrgUsers', {
                url: '/sendOrgUsers',
                title: 'sendOrgUsers',
                controller: function ($scope, $state) {

                }
            })
            .state('app.ics_managemarker', { //添加位置信息
                url: '/managemarker',
                title: 'managemarker',
                params: {
                    data: null
                },
                templateUrl: 'app/views/ics/MapMarkerManage.html',
                resolve: helper.resolveFor('datatables', 'angularFileUpload')
            })
            .state('app.member', {//个人中心
                url: '/member',
                title: 'member',
                templateUrl: 'app/views/member.html',
                resolve: helper.resolveFor('oitozero.ngSweetAlert')
            })
            .state('app.systemlog', {//系统日志
                url: '/systemlog',
                title: 'systemlog',
                templateUrl: 'app/views/systemlog.html',
                resolve: helper.resolveFor('datatables')
            })
            .state('app.ics_messageboard', {//ICS留言板
                url: '/messageboard',
                title: 'messageboard',
                templateUrl: helper.basepath('ics/messageboard.html'),
                resolve: helper.resolveFor('datatables', 'moment', 'oitozero.ngSweetAlert')
            })
            .state('app.ics_otherfileupload', {//ICS留言板
                url: '/otherfileupload',
                title: 'otherfileupload',
                templateUrl: helper.basepath('ics/otherfileupload.html'),
                resolve: helper.resolveFor('datatables', 'moment', 'oitozero.ngSweetAlert', 'angularFileUpload', 'filestyle')
            })
            .state('app.allinformation', {   //全球应急资源系统/综合信息模块
                url: '/allinformation',
                title: 'All information',
                templateUrl: helper.basepath('globalressystem/allinformation.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyplan', {   //全球应急资源系统/应急资源/应急预案
                url: '/emergencyplan',
                title: 'Emergency Plan',
                templateUrl: helper.basepath('globalressystem/emergencyplan.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyorganization', {   //全球应急资源系统/应急资源/应急机构
                url: '/emergencyorganization',
                title: 'Emergency Organization',
                templateUrl: helper.basepath('globalressystem/emergencyorganization.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyspecialist', {   //全球应急资源系统/应急资源/应急专家
                url: '/emergencyspecialist',
                title: 'Emergency Specialist',
                templateUrl: helper.basepath('globalressystem/emergencyspecialist.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyteam', {   //全球应急资源系统/应急资源/应急队伍
                url: '/emergencyteam',
                title: 'Emergency Team',
                templateUrl: helper.basepath('globalressystem/emergencyteam.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyequipment', {   //全球应急资源系统/应急资源/应急装备
                url: '/emergencyequipment',
                title: 'Emergency Equipment',
                templateUrl: helper.basepath('globalressystem/emergencyequipment.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencymaterials', {   //全球应急资源系统/应急资源/应急物资
                url: '/emergencymaterials',
                title: 'Emergency Materials',
                templateUrl: helper.basepath('globalressystem/emergencymaterials.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.outemergency', {   //全球应急资源系统/应急资源/外部
                url: '/outemergency',
                title: 'Out Emergency',
                templateUrl: helper.basepath('globalressystem/outemergency.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.emergencyrecord', {   //全球应急资源系统/应急记录
                url: '/emergencyrecord',
                title: 'Emergency Record',
                templateUrl: helper.basepath('globalressystem/emergencyrecord.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.statisticsquery', {   //全球应急资源系统/应急记录
                url: '/statisticsquery',
                title: 'Statistics Query',
                templateUrl: helper.basepath('globalressystem/statisticsquery.html')
            })
            .state('app.companyperson', {   //人员动态跟踪系统/公司人员管理
                url: '/companyperson',
                title: 'Company Person',
                templateUrl: helper.basepath('person/companyperson.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.contractorperson', {   //人员动态跟踪系统/承包商
                url: '/contractorperson',
                title: 'Contractor Person',
                templateUrl: helper.basepath('person/contractorperson.html')
            })
            .state('app.importperson', {   //人员动态跟踪系统/重要人员
                url: '/importperson',
                title: 'Import Person',
                templateUrl: helper.basepath('person/importperson.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.areaperson', {   //人员动态跟踪系统/区域
                url: '/areaperson',
                title: 'Area Person',
                templateUrl: helper.basepath('person/areaperson.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.queryinformation', {   //人员动态跟踪系统/动态查询信息
                url: '/queryinformation',
                title: 'Query Information',
                templateUrl: helper.basepath('person/queryinformation.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.unitproject', {   //人员动态跟踪系统/单位与项目
                url: '/unitproject',
                title: 'Unit Project',
                templateUrl: helper.basepath('person/unitproject.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.staffmanagement', {   //人员动态跟踪系统/员工管理
                url: '/staffmanagement',
                title: 'Staff Management',
                templateUrl: helper.basepath('person/staffmanagement.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.fastfill', {   //人员动态跟踪系统/员工快速填报
                url: '/fastfill',
                title: 'fastfill',
                templateUrl: helper.basepath('person/fastfill.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })

            .state('app.SummaryInfo', {//重大风险源及风险隐患管控系统/综合信息
                url: '/SummaryInfo',
                title: 'SummaryInfo',
                templateUrl: helper.basepath('RiskControlSystem/SummaryInfo.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.HiddenGov', {//重大风险源及风险隐患管控系统/隐患排查治理
                url: '/HiddenGov',
                title: 'HiddenGov',
                templateUrl: helper.basepath('RiskControlSystem/HiddenGov.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.HiddenEntry', {//重大风险源及风险隐患管控系统/隐患录入
                url: '/HiddenEntry',
                title: 'HiddenEntry',
                templateUrl: helper.basepath('RiskControlSystem/HiddenEntry.html'),
                resolve: helper.resolveFor('datatables')
            })
            .state('app.InfoReport', {//重大风险源及风险隐患管控系统/信息报告
                url: '/InfoReport',
                title: 'InfoReport',
                templateUrl: helper.basepath('RiskControlSystem/InfoReport.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.ParameterSetting', {//重大风险源及风险隐患管控系统/参数设置
                url: '/ParameterSetting',
                title: 'ParameterSetting',
                templateUrl: helper.basepath('RiskControlSystem/ParameterSetting.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.InternationalMgr', {//重大风险源及风险隐患管控系统/国际公司及所属单位风险管控
                url: '/InternationalMgr',
                title: 'InternationalMgr',
                templateUrl: helper.basepath('RiskControlSystem/InternationalMgr.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.CheckTrack', {//重大风险源及风险隐患管控系统/检查问题跟踪
                url: '/CheckTrack',
                title: 'CheckTrack',
                templateUrl: helper.basepath('RiskControlSystem/CheckTrack.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.DangerResourceMgr', {//重大风险源及风险隐患管控系统/危险源管理
                url: '/DangerResourceMgr',
                title: 'DangerResourceMgr',
                templateUrl: helper.basepath('RiskControlSystem/DangerResourceMgr.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.SysPost', {//重大风险源及风险隐患管控系统/相关制度及发文
                url: '/SysPost',
                title: 'SysPost',
                templateUrl: helper.basepath('RiskControlSystem/SysPost.html'),
                resolve: helper.resolveFor('angularBootstrapNavTree')
            })
            .state('app.StatisticAnalysis', {//重大风险源及风险隐患管控系统/统计分析
                url: '/StatisticAnalysis',
                title: 'StatisticAnalysis',
                templateUrl: helper.basepath('RiskControlSystem/StatisticAnalysis.html')
            })
            .state('app.ecsRefresh', {
                url: '/ecsRefresh',
                title: 'ecsRefresh',
                templateUrl: helper.basepath('SystemMgr/ecsRefresh.html')
            })
            .state('app.userauthorization', {
                url: '/userauthorization',
                title: 'userauthorization',
                templateUrl: helper.basepath('SystemMgr/userauthorization.html'),
                resolve: helper.resolveFor('datatables', 'ngDialog')
            })
            ;
    } // routesConfig
})();
