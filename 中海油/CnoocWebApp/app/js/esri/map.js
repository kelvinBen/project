
// create the esriMap module
var esriMap = angular.module('map', []);

// create an object to wrap the ESRI Map OPbject
var mapObjectWrapper = function () {
    this.map = undefined;
    this.extent = undefined;
}

// create an AngularJS Factory that can provide the map object to AngularJS controllers
esriMap.factory('esriMapService', function () {
    return mapObjectWrapper;
})

// the DOJO-ish code which loads the map object; saves it to the mapObjectWrapper
require(['esri/map',
    'esri/geometry/Extent',
    'esri/SpatialReference',
    'esri/layers/GraphicsLayer',
    'esri/symbols/SimpleMarkerSymbol',
    "esri/symbols/PictureMarkerSymbol",
    'esri/graphic',
    'esri/geometry/Point',
    'esri/Color',
    'esri/InfoTemplate',
    'esri/layers/MapImage',
    'esri/layers/MapImageLayer',
    'esri/symbols/Font',
    'esri/symbols/TextSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/geometry/Polygon',
    'esri/geometry/Polyline',
    'esri/tasks/GeometryService',
    'esri/tasks/ProjectParameters',
    'esri/toolbars/draw', 'esri/dijit/Measurement', 'dojo/dom'],
    function (Map,
        Extent,
        SpatialReference,
        GraphicsLayer,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
        graphic,
        Point,
        Color,
        InfoTemplate, MapImage, MapImageLayer,
        Font, TextSymbol, SimpleFillSymbol, SimpleLineSymbol, Polygon, Polyline, GeometryService, ProjectParameters, Draw, Measurement, dom) {
        mapObjectWrapper.map = Map;
        mapObjectWrapper.extent = Extent;
        mapObjectWrapper.spatialReference = SpatialReference;
        mapObjectWrapper.graphicsLayer = GraphicsLayer;
        mapObjectWrapper.SimpleMarkerSymbol = SimpleMarkerSymbol;
        mapObjectWrapper.graphic = graphic;
        mapObjectWrapper.Point = Point;
        mapObjectWrapper.Color = Color;
        mapObjectWrapper.InfoTemplate = InfoTemplate;
        mapObjectWrapper.Font = Font;
        mapObjectWrapper.TextSymbol = TextSymbol;
        mapObjectWrapper.MapImage = MapImage;
        mapObjectWrapper.MapImageLayer = MapImageLayer;
        mapObjectWrapper.SimpleFillSymbol = SimpleFillSymbol;
        mapObjectWrapper.SimpleLineSymbol = SimpleLineSymbol;
        mapObjectWrapper.Polygon = Polygon;
        mapObjectWrapper.Polyline = Polyline;
        mapObjectWrapper.GeometryService = GeometryService;
        mapObjectWrapper.ProjectParameters = ProjectParameters;
        mapObjectWrapper.Draw = Draw;
        mapObjectWrapper.PictureMarkerSymbol = PictureMarkerSymbol;
        mapObjectWrapper.Measurement = Measurement;
        mapObjectWrapper.dom = dom;
        // kludgy attempt using a callback to force the map creation once we have the DOJO Map Object loaded
        // I couldn't get AngularJS watches to work
        mapObjectWrapper.scope.recreateMap();
    });


// create the map directive
esriMap.directive('esriMap', function () {
    return {
        restrict: 'EA',
        // the directive's actual code code is in the MapController set up below this
        controller: 'MapController',
        // the link just calls the init method in the controller
        link: function (scope, element, attrs, ctrl) {
            ctrl.init(element);
        }
    };
});

esriMap.controller('MapController', ['$rootScope', '$scope', '$attrs', 'esriMapService', '$filter', function ($rootScope, $scope, $attrs, esriMapService, $filter) {

    var mapDiv, layers = [];
    $scope.$element;

    // copy the esriMapService to a local variable
    $scope.mapService = esriMapService;
    // put the scope variable in the MapService so that when the DOJO AMD finally loads the map; it can trigger the code in the controller
    $scope.mapService.scope = $scope;

    $scope.recreateMap = function () {
        $scope.createDiv();
        $scope.createMap();
    }

    // the init method
    $scope.projectToLatLong = function (pt) {
        var outSR = new esriMapService.spatialReference(4326);
        var params = new esriMapService.ProjectParameters();
        params.geometries = [pt.normalize()];
        params.outSR = outSR;

        $scope.gsvc.project(params, function (projectedPoints) {
            return projectedPoints[0];
        });
    }


    var getcolor = function (layername) {
        if (layername == 'stationname')
            return new $scope.mapService.Color([0, 0, 0]);
        else if (layername == 'Temp')
            return new $scope.mapService.Color([255, 0, 0]);
        else if (layername == 'Press')
            return new $scope.mapService.Color([0, 255, 0]);
        else if (layername == 'Wind')
            return new $scope.mapService.Color([255, 0, 0]);
        else if (layername == 'RR')
            return new $scope.mapService.Color([0, 0, 255]);
        else if (layername == 'RL')
            return new $scope.mapService.Color([238, 15, 183]);
        else
            return new $scope.mapService.Color([0, 0, 0]);
    };

    function showReal(point, layername, value, offsetx, offsety) {
        var gdLayer = $scope.map.getLayer(layername);
        if (gdLayer != null) {
            var font = new $scope.mapService.Font("12px", $scope.mapService.Font.STYLE_NORMAL, $scope.mapService.Font.VARIANT_NORMAL, $scope.mapService.Font.WEIGHT_BOLDER);
            var sTxt = value;
            var color = getcolor(layername);
            var textSymbol = new $scope.mapService.TextSymbol(sTxt, font, color);
            textSymbol.setAlign($scope.mapService.TextSymbol.ALIGN_START);
            textSymbol.setOffset(offsetx, offsety);
            var labelPointGraphic = new $scope.mapService.graphic(point, textSymbol);
            gdLayer.add(labelPointGraphic);
        }
    };

    function showWind(point, layername, wd, wv, offsetx, offsety) {

    };

    function clearlayer(layername) {
        var gdLayer = $scope.map.getLayer(layername);
        if (gdLayer != null) {
            gdLayer.clear();
        }
    };

    var getRadarExtent = function () {
        var minx = 106.7890;
        var miny = 32.6360;
        var maxx = 111.1450;
        var maxy = 36.2296;
        var scalex = 0.0054519;
        var scaley = 0.0044975;

        var extent = new $scope.mapService.extent(minx, miny, maxx, maxy, new $scope.mapService.spatialReference({ wkid: 4326 }));
        return extent;
    };

    $scope.createDiv = function () {
        if (mapDiv) {
            return;
        }
        mapDiv = document.createElement('div');
        mapDiv.setAttribute('id', $attrs.id);
        $scope.$element.removeAttr('id');
        $scope.$element.append(mapDiv);
    };

    var creategraphicLayer = function (layername, alp, show) {
        var layer = new $scope.mapService.graphicsLayer({ id: layername, opacity: alp });
        $scope.map.addLayer(layer);
        if (show == "hide") {
            layer.hide();
        }
    };

    var createImageLayer = function (layername, alp) {
        var layer = new $scope.mapService.MapImageLayer({ id: layername, opacity: alp });
        $scope.map.addLayer(layer);
    };

    $scope.addLayer = function (layer) {
        if ($scope.map) {
            $scope.map.addLayer(layer);
        } else {
            layers.push(layer);
        }
    };


    function addGraphic(evt) {
        //deactivate the toolbar and clear existing graphics
        $scope.tb.deactivate();
        $scope.map.enableMapNavigation();

        // figure out which symbol to use
        var lineSymbol = new $scope.mapService.SimpleLineSymbol($scope.mapService.SimpleLineSymbol.STYLE_SOLID, new $scope.mapService.Color([255, 0, 0, 1]), 1.5);

        var gdLayer = $scope.map.getLayer("route");
        if (gdLayer != null) {
            var polylineGraphic = new $scope.mapService.graphic(evt.geometry, lineSymbol);
            polylineGraphic.attributes = $scope.routename;
            gdLayer.add(polylineGraphic);
        }

        var pts = [];
        for (var i = 0; i < evt.geometry.paths[0].length; ++i) {
            var pt = new $scope.mapService.Point(evt.geometry.paths[0][i][0], evt.geometry.paths[0][i][1], new $scope.mapService.spatialReference({ wkid: 102100 }));
            pts.push(pt);
        }
        var outSR = new $scope.mapService.spatialReference(4326);

        $scope.gsvc.project(pts, outSR, function (projectedPoints) {
            $scope.curRoute = projectedPoints;
            $rootScope.$broadcast('routechange', { name: $scope.routename, data: $scope.curRoute });
        });
    }

    $scope.createMap = function () {

        $scope.gsvc = new esriMapService.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

        if (!$scope.mapService.map) {
            return;
        }
        if (!mapDiv) {
            return;
        }

        //var startExtent3 = new $scope.mapService.extent(-22065718,-9693547 , 23214354, 19853950, new $scope.mapService.spatialReference({ wkid: 102100 }));
        //var startExtent3 = new $scope.mapService.extent(-15970323, -7903085, 15005629, 7751217, new $scope.mapService.spatialReference({ wkid: 102100 }));
        var startExtent3 = new $scope.mapService.extent(0, 0, 180, 90, new $scope.mapService.spatialReference({ wkid: 4326 }));
        var center = startExtent3.getCenter();

        // really should do something to load different options instead of introspecting tag attributes
        var options = {
            extent: startExtent3,
            minZoom: 3,
            logo: false
        };

        //var options = {
        //    //basemap: "topo",
        //    center: [-105.255, 40.022],
        //    zoom: 13
        //};

        //$scope.map.setExtent(startExtent2);

        // create the map
        $scope.map = new $scope.mapService.map($attrs.id, $scope.options);
        //$scope.map.spatialReference = new $scope.mapService.spatialReference(4326);

        $scope.map.on('load', function () {
            $rootScope.$broadcast('map-load');

            $scope.tb = new $scope.mapService.Draw($scope.map);
            $scope.tb.on("draw-end", addGraphic);
        });

        //InitGoogleMap();
        InitGoogleLayer();
        //InitTDTVecLayer();

        var measurement = new $scope.mapService.Measurement({
            map: $scope.map
        }, $scope.mapService.dom.byId("measurementDiv"));
        measurement.startup();

        var pt = new $scope.mapService.Point(18, 13);
        $scope.map.centerAndZoom(pt, 3);
        //$scope.map.setExtent(startExtent3);
        // $scope.map.setExtent(startExtent3);

        $scope.mapLayerImage = new my.PortlandTiledMapServiceLayer();
        $scope.mapLayerTerrain = new my.PortlandTiledMapServiceLayer();
        $scope.mapLayerTerrain.MapStyle = "Terrain";
        $scope.mapLayerImage.MapStyle = "Image";
        $scope.mapLayerImage.hide();
        $scope.map.addLayer($scope.mapLayerImage);
        $scope.map.addLayer($scope.mapLayerTerrain);

        // $scope.mapLayerTD = new TDTVecMapServiceLayer();
        //$scope.map.addLayer($scope.mapLayerTD);

        //creategraphicLayer("County",0.75);
        //$scope.map.setExtent(startExtent2);
        $scope.sl = new $scope.mapService.graphicsLayer({ id: "station" });
        $scope.map.addLayer($scope.sl);

        creategraphicLayer("route", 1, "show");
        creategraphicLayer("countryrisk", 1, "show");


        $rootScope.$broadcast('layer-load');
        //$scope.map.zoom =10;
        // add some event listeners on the map
        // these will probably become important later
        // in theory should probably be documented as part of the directive
        // instead of dispatching on the route

        $scope.map.on('click', function (e) {
            $rootScope.$broadcast('map-click', e);

            if ($scope.isEditRouting) {
                var point = e.mapPoint;
                var outSR = new $scope.mapService.spatialReference(4326);

                $scope.gsvc.project([point], outSR, function (projectedPoints) {
                    var pt = projectedPoints[0];
                    $scope.curRoute.push(pt);
                    $scope.UpdateRoute();
                });
            }
        });

        $scope.map.on('zoom', function (e) {
            var scale = $scope.map.getScale();
        });

        //$scope.map.on('pan-end', function (e) {
        //    var pt = $scope.map.extent.getCenter();

        //    var outSR = new $scope.mapService.spatialReference(4326);

        //    $scope.gsvc.project(pt, outSR, function (projectedPoints) {
        //        //$scope.curRoute = projectedPoints;
        //        //$rootScope.$broadcast('routechange', { name: $scope.routename, data: $scope.curRoute });
        //        console.log(projectedPoints);
        //    });

        //   // console.log(pt);
        //})

        //$scope.map.on('')

        // This layer thing comes fromt he blog I sourced this from; but not anything
        // I've investigated personally yet
        // commenting out for now
        /*        if (layers.length > 0) {
         $scope.map.addLayers(layers);
         layers = [];
         }*/
    };



    // a helper function to create the map
    this.init = function (element) {

        if (!$attrs.id) {
            throw new Error('\'id\' is required for a map.');
        }
        $scope.$element = element;

        // if the map isn't loaded yet; return to stop processing
        //$scope.recreateMap();
        // the recreateMap function will be triggered when the map does load
        if (!$scope.mapService.map) {
            return;
        }

        $scope.recreateMap();
    };

    // In theory we only want to create the div once..
    // so we should add code in here to make sure the div is not created if it is already created
    // either that or delete the existeing div and -recreate it


    // method for creating the map
    // this method won't do anything if the mapService is not loaded
    // nor if the mapDiv is not created


    /* comment out the addLayer method temporarily*/
    //messages
    $scope.$on("ChangeBaseMap", function (event, msg) {
        // $scope.map.addLayer($scope.mapLayerImage);
        // $scope.map.addLayer($scope.mapLayerTerrain);
        if (msg == 0) {
            $scope.mapLayerImage.hide();
            $scope.mapLayerTerrain.show();
        }
        else {
            $scope.mapLayerTerrain.hide();
            $scope.mapLayerImage.show();
        }
    });

    $scope.$on("ZoomTo", function (event, msg) {
        var pt = new $scope.mapService.Point(parseFloat(msg.lon), parseFloat(msg.lat));
        $scope.map.centerAndZoom(pt, msg.level);
    });

    $scope.$on("ShowInfoWindow", function (event, msg) {
        $scope.map.infoWindow.hide();
        //$scope.map.centerAndZoom(pt, msg.level);
        var zm = $scope.map.getZoom();
        // if (mouseEvent.graphic != null) {
        var item = msg.data;
        var pt = new $scope.mapService.Point(parseFloat(item.lon), parseFloat(item.lat));
        //var url = '/zh-CN/DigitalMap/OrgInfoWindow';
        //    url += "/";
        //    url += item.organiztion_id;
        //var content = "<iframe  src=\"{0}\" frameborder=\"0\" width=\"420\" height=\"170\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
        //var content = "<iframe  src=\"{0}\" frameborder=\"0\"  marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
        //var content = "<div ng-include=\"'app/views/digitalmap/OrgInfoWindow.html'\">";
        //content = String.format(content, url);
        var content = "位置:<br/>经度:" + item.lon + ",纬度:" + item.lat;

        $scope.map.infoWindow.setContent(content);
        $scope.map.infoWindow.setTitle(item.organiztion_name);
        //$scope.map.infoWindow.resize(460, 200);
        //map.infoWindow.show(pt);
        $scope.map.infoWindow.show(pt);
        //}
    });

    $scope.$on("DisplayLayer", function (event, msg) {
        var gdLayer = $scope.map.getLayer(msg.layername);
        if (gdLayer != null) {
            if (msg.status == "show") {
                gdLayer.show();
            }
            else {
                gdLayer.hide();
            }
        }
    });

    $scope.$on("ShowBoundary", function (event, data) {
        var symbol = new $scope.mapService.SimpleFillSymbol(
            $scope.mapService.SimpleFillSymbol.STYLE_SOLID,
            new $scope.mapService.SimpleLineSymbol(
                $scope.mapService.SimpleLineSymbol.STYLE_SOLID,
                new $scope.mapService.Color([0, 255, 255, 1]), 1.5
            ),
            new $scope.mapService.Color([224, 224, 224, 0.5])
        );
        var gdLayer = $scope.map.getLayer("County");
        if (gdLayer != null) {
            //gl.clear();
            var ext = null;
            for (var i = 0; i < data.length; ++i) {
                var polygon = data[i];
                var pts = new Array(polygon.Points.length);
                var pts = [];
                for (var j = 0; j < polygon.Points.length; ++j)
                    pts[j] = new $scope.mapService.Point(polygon.Points[j].X, polygon.Points[j].Y);
                var ply = new $scope.mapService.Polygon();
                ply.addRing(pts);
                if (ext == null)
                    ext = ply.getExtent();
                else
                    ext = ext.union(ply.getExtent());
                var graphic = new $scope.mapService.graphic(ply, symbol);
                gdLayer.add(graphic);
            }
            if (ext != null) {
                $scope.map.setExtent(ext);
            }
        }
    });

    $scope.routename = "";
    $scope.curRoute = [];

    $scope.$on("StartRoute", function (event, data) {
        $scope.map.disableMapNavigation();
        $scope.tb.activate("polyline");
        //$scope.isEditRouting = true;
        $scope.routename = data.name;
        var gdLayer = $scope.map.getLayer("route");
        if (gdLayer != null) {
            for (var i = 0; i < gdLayer.graphics.length; ++i) {
                if (gdLayer.graphics[i].attributes == $scope.routename) {
                    gdLayer.remove(gdLayer.graphics[i]);
                }
            }
        }
    });


    $scope.$on("EndRoute", function (event, data) {
        $scope.tb.deactivate();
        $scope.map.enableMapNavigation();
    });

    $scope.$on("creategraphicLayer", function (event, data) {
        creategraphicLayer(data.layername, data.alpha, data.show);
    });

    $scope.$on("SetLayerMaxScale", function (event, data) {
        // creategraphicLayer(data.layername, data.alpha, data.show);
        var gdLayer = $scope.map.getLayer(data.layername);
        if (gdLayer != null) {
            gdLayer.setMaxScale(data.maxscale);
        }
    });

    $scope.$on("SetLayerMinScale", function (event, data) {
        // creategraphicLayer(data.layername, data.alpha, data.show);
        var gdLayer = $scope.map.getLayer(data.layername);
        if (gdLayer != null) {
            gdLayer.setMinScale(data.maxscale);
        }
    });

    $scope.$on("DisplayRoute", function (event, data) {
        clearlayer("route");
        var gdLayer = $scope.map.getLayer("route");
        if (gdLayer != null) {
            //var polyline = new $scope.mapService.Polyline({ paths: [] });

            //var polyline = new $scope.mapService.Polyline();
            var paths = [];
            var ids = [];
            //while (data.data.length > 0)
            for (var j = 0; j < data.data.length; ++j) {
                var item = data.data[j];
                var bFound = false;
                for (var i = 0; i < ids.length; ++i) {
                    if (item.organiztion_id == ids[i]) {
                        paths[i].push([item.lon, item.lat]);
                        bFound = true;
                    }
                }
                if (!bFound) {
                    ids.push(item.organiztion_id);
                    paths.push([[item.lon, item.lat]]);
                }
                //data.data.splice(0, 1);
            }

            for (var j = 0; j < paths.length; ++j) {
                var polyline = new $scope.mapService.Polyline();
                polyline.addPath(paths[j]);

                var lineSymbol = new $scope.mapService.SimpleLineSymbol($scope.mapService.SimpleLineSymbol.STYLE_SOLID, new $scope.mapService.Color([255, 0, 0, 1]), 1.5);
                var polylineGraphic = new $scope.mapService.graphic(polyline, lineSymbol);
                polylineGraphic.attributes = ids[j];
                gdLayer.add(polylineGraphic);
            }

        }
    });

    $scope.$on("UpdateRadarLayer", function (event, msg) {
        var gdLayer = $scope.map.getLayer(msg.layer);
        if (gdLayer != null) {
            var images = gdLayer.getImages();
            var extent = getRadarExtent();
            var mi = new $scope.mapService.MapImage({
                'extent': extent,
                'href': msg.url,
                'width': 800,
                'height': 600
            });
            gdLayer.addImage(mi);
            if (images != null) {
                for (var i = 0; i < images.length; ++i) {
                    gdLayer.removeImage(images[i]);
                }
            }

        }
    });

    $scope.$on("InitStations", function (event, stations) {
        if ($scope.sl == null)
            return;
        $scope.sl.clear();
        var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
        marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
        marksymbol.setSize(7);
        marksymbol.setOutline(null);
        marksymbol.setColor(new $scope.mapService.Color([0, 0, 255, 0.5]));

        for (var i = 0; i < stations.length; ++i) {
            var item = stations[i];
            var content = "城市:" + item.City + "<br/>区县:" + item.County + "<br/>站号:" + item.StationID + " <br/>站名: " + item.StationName;
            var infoTemplate = new $scope.mapService.InfoTemplate("站点信息：", content);
            //添加站点mark
            var sPt = new $scope.mapService.Point(item.Longitude, item.Latitude);
            var gr = new $scope.mapService.graphic(sPt, marksymbol, item, infoTemplate);
            $scope.sl.add(gr);
            showReal(sPt, "stationname", item.StationName, 5, 3);
        }
    });

    $scope.$on("UpdateStationLayer", function (event, datas) {
        clearlayer("Temp");
        clearlayer("Press");
        clearlayer("RR");
        clearlayer("RL");
        clearlayer("Wind");
        for (var i = 0; i < datas.length; ++i) {
            var item = datas[i];
            var sPt = new $scope.mapService.Point(item.S.Longitude, item.S.Latitude);
            showReal(sPt, "Temp", item.T, 2, -6);
            showReal(sPt, "Press", item.P, 2, -16);
            showReal(sPt, "RR", item.R, -25, -6);
            showReal(sPt, "RL", item.H, -16, -16);
            showWind(sPt, "Wind", item.WD, item.WV, 2, -6);
        }
    });

    String.format = function () {
        if (arguments.length == 0)
            return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };

    $scope.$on("CreateProjectMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                var linesymbol = new $scope.mapService.SimpleLineSymbol();
                // linesymbol.styl
                linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                marksymbol.setSize(15);
                marksymbol.setOutline(linesymbol);
                if (data.worker == 1) {
                    marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                }
                else
                    marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var content = "成立时间:" + $filter('date')(data.create_time, 'yyyy-MM-dd') + "</br>" +
                    "办公室位置:" + data.locate + "</br>" +
                    "项目所处阶段:" + data.stage + "</br>" +
                    "设施状况:" + data.status + "</br>" +
                    "设施数量:平台 " + data.plate_num + " 陆地设施: " + data.utility_num + "</br>" +
                    "应急设备配置:" + data.emerg_utility + "</br>" +
                    "所属公司:" + data.company;

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name, content);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var data = mouseEvent.graphic.attributes;
                // var url = datas.url;
                // url+="/";
                //url += item.organiztion_id;
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\" width=\"420\" height=\"170\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\"  marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //content = String.format(content, url);
                var content = "成立时间:" + $filter('date')(data.create_time, 'yyyy-MM-dd') + "</br>" +
                    "办公室位置:" + data.locate + "</br>" +
                    "项目所处阶段:" + data.stage + "</br>" +
                    "设施状况:" + data.status + "</br>" +
                    "设施数量:平台 " + data.plate_num + " 陆地设施: " + data.utility_num + "</br>" +
                    "应急设备配置:" + data.emerg_utility + "</br>" +
                    "所属公司:" + data.company;

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle("项目名称:" + data.name);
                //$scope.map.infoWindow.resize(460, 200);
                //map.infoWindow.show(pt);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("CreateOrganiztionMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                var linesymbol = new $scope.mapService.SimpleLineSymbol();
                // linesymbol.styl
                linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                marksymbol.setSize(15);
                marksymbol.setOutline(linesymbol);
                if (data.worker == 1) {
                    marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                }
                else
                    marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name,
                    "北纬" + data.lon + " <br/>东经:" + data.lat);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                // var url = datas.url;
                // url+="/";
                // url += item.organiztion_id;
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\" width=\"420\" height=\"170\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\"  marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //var content = "<div ng-include=\"'app/views/digitalmap/OrgInfoWindow.html'\">";
                //content = String.format(content, url);

                var content = "位置:<br/>经度:" + item.lon + ",纬度:" + item.lat;

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle(item.organiztion_name);

                //$scope.map.infoWindow.setContent(content);
                //$scope.map.infoWindow.resize(460, 200);
                //map.infoWindow.show(pt);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("CreateTransportOrganiztionMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                var linesymbol = new $scope.mapService.SimpleLineSymbol();
                // linesymbol.styl
                linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                marksymbol.setSize(15);
                marksymbol.setOutline(linesymbol);
                if (data.worker == 1) {
                    marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                }
                else
                    marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name,
                    "北纬" + data.lon + " <br/>东经:" + data.lat);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                //var url = datas.url;
                //url+="/";
                //url += item.organiztion_id;
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\" width=\"420\" height=\"170\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\"  marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //content = String.format(content, url);
                var content = "车辆:       " + item.carnum + "辆</br>" +
                    "船舶:       " + item.shipnum + "辆</br>";

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle("项目名称:" + item.organiztion_name);
                //$scope.map.infoWindow.resize(460, 200);
                //map.infoWindow.show(pt);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("createtransportMarker", function (event, datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, item) {
            if (item.lon != null) {
                //var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                //marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                //marksymbol.setSize(15);
                //marksymbol.setOutline(null);
                //marksymbol.setColor(new $scope.mapService.Color([0, 255, 0, 1]));
                var url = "app/img/Marker/ship.png";
                var marksymbol;
                if (item.type == "车辆") {
                    url = "app/img/Marker/car.png";
                }

                marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": url,
                    "height": 30,
                    "width": 30,
                    "type": "esriPMS",
                    "angle": 0,
                });


                var infoTemplate = new $scope.mapService.InfoTemplate(
                    item.name,
                    "建立时间:" + item.create_time + "</br>" +
                    "油井数量:" + item.locate + "</br>" +
                    "类型:" + item.stage + "</br>" +
                    "日产量:" + item.status + "</br>" +
                    "平面布置图" + item.plate_num + "陆地设施:" + item.utility_num);

                // var sPt = new Point(data.lon, data.Latitude);
                var pt = new $scope.mapService.Point(parseFloat(item.lon), parseFloat(item.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, item, null);
                gdLayer.add(gr);
            }
            // map.centerAt(pt);
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                if (item.type == "车辆") {
                    var content =
                        "当前位置:</br>" + "北纬:" + item.lon + "</br>" +
                        "东经:" + item.lat + "</br>" + "状态:" + item.status + "</br><img width=\"100\" height=\"100\" alt=\"\" src=\"app/img/Marker/car.jpg\" />";


                    $scope.map.infoWindow.setContent(content);
                }
                else {
                    var content =
                        "当前位置:</br>" + "北纬:" + item.lon + "</br>" +
                        "东经:" + item.lat + "</br>" + "状态:" + item.status + "</br><img width=\"100\" height=\"100\" alt=\"\" src=\"app/img/Marker/ship.jpg\" />";

                    $scope.map.infoWindow.setContent(content);
                }
                $scope.map.infoWindow.setTitle(item.name);

                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("createutilityMarker", function (event, datas) {
        //function createutilityMarker(data, layer) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, item) {
            if (item.lon != null) {
                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": "app/img/Marker/oilpump.png",
                    "height": 30,
                    "width": 30,
                    "type": "esriPMS",
                    "angle": 0,
                });
                //var marksymbol = new SimpleMarkerSymbol();
                //marksymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
                //marksymbol.setSize(15);
                //marksymbol.setOutline(null);
                //marksymbol.setColor(new Color([0, 255, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(
                    item.name,
                    "建立时间:" + item.create_time + "</br>" +
                    "油井数量:" + item.locate + "</br>" +
                    "类型:" + item.stage + "</br>" +
                    "日产量:" + item.status + "</br>" +
                    "平面布置图" + item.plate_num + "陆地设施:" + item.utility_num);

                // var sPt = new Point(data.lon, data.Latitude);
                var pt = new $scope.mapService.Point(parseFloat(item.lon), parseFloat(item.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, item, null);
                gdLayer.add(gr);
            }
            // map.centerAt(pt);
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            if (mouseEvent.graphic != null) {
                var scale = $scope.map.getScale();
                var item = mouseEvent.graphic.attributes;
                var content = "建立时间:" + $filter('date')(item.create_time, 'yyyy-MM-dd') + "</br>" +
                    "油井数量:" + item.oilwell_num + "</br>" +
                    "类型:" + item.type + "</br>" +
                    "日产量:" + item.dailyoutput + "</br>" +
                    "平面布置图" + item.floorplan;

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle(item.name);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("createemergencyMarker", function (event, datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        var rs = datas.resource;
        $.each(datas.data, function (i, item) {
            if (item.lon != null) {
                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": "app/img/Marker/fire_extinguisher.png",
                    "height": 15,
                    "width": 15,
                    "type": "esriPMS",
                    "angle": 0,
                });
                var pt = new $scope.mapService.Point(parseFloat(item.lon), parseFloat(item.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, item, null);
                gdLayer.add(gr);
            }
        });
        gdLayer.on("click", function (mouseEvent) {
            if (mouseEvent.graphic != null) {
                var scale = $scope.map.getScale();
                var item = mouseEvent.graphic.attributes;
                var content = "";
                var rr = [];
                $.each(rs, function (i, r) {
                    if (r.fid == item.position_id) {
                        var badd = true;
                        $.each(rr, function (j, q) {
                            if (r.category == q.category) {
                                q.num++;
                                badd = false;
                                return false;
                            }
                        });
                        if (badd) {
                            rr.push({ category: r.category, num: 1, fid: r.fid });
                        }
                    }
                });
                if (item.pic != null) {
                    content = "<h4>" + item.name + "</h4></br>" +
                        "类型:" + item.type + "</br>" +
                        '<img width=\"150\" height=\"150\" alt=\"\" src=\"' + item.pic + '" /></br>';

                }
                else {
                    content = "<h4>" + item.name + "</h4></br>" +
                        "类型:" + item.type + "</br>";
                }
                if (rr.length > 0) content += '应急资源统计：</br>';
                $.each(rr, function (i, r) {
                    content += r.category + '应急资源,数量:' + r.num + '</br>';
                });


                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle(item.name);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });
    });

    $scope.$on("createpositionMarker", function (event, datas) {
        //function createutilityMarker(data, layer) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        var rs = datas.resource;
        $.each(datas.data, function (i, item) {
            if (item.lon != null) {
                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": "app/img/Marker/position.png",
                    "height": 15,
                    "width": 15,
                    "type": "esriPMS",
                    "angle": 0,
                });
                //var linesymbol = new $scope.mapService.SimpleLineSymbol();
                // linesymbol.styl
                //linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                //var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                //marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                //marksymbol.setSize(10);
                //marksymbol.setOutline(linesymbol);
                //marksymbol.setColor(new $scope.mapService.Color([0, 255, 0, 1]));

                //var infoTemplate = new $scope.mapService.InfoTemplate(
                //    item.name,
                //     "建立时间:" + item.create_time + "</br>" +
                //     "油井数量:" + item.locate + "</br>" +
                //     "类型:" + item.stage + "</br>" +
                //     "日产量:" + item.status + "</br>" +
                //     "平面布置图" + item.plate_num + "陆地设施:" + item.utility_num);

                // var sPt = new Point(data.lon, data.Latitude);
                var pt = new $scope.mapService.Point(parseFloat(item.lon), parseFloat(item.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, item, null);
                gdLayer.add(gr);
            }
            // map.centerAt(pt);
        });

        gdLayer.on("click", function (mouseEvent) {
            if (mouseEvent.graphic != null) {
                var scale = $scope.map.getScale();
                var item = mouseEvent.graphic.attributes;
                var content = "";
                var rr = [];
                $.each(rs, function (i, r) {
                    if (r.fid == item.position_id) {
                        var badd = true;
                        $.each(rr, function (j, q) {
                            if (r.category == q.category) {
                                q.num++;
                                badd = false;
                                return false;
                            }
                        });
                        if (badd) {
                            rr.push({ category: r.category, num: 1, fid: r.fid });
                        }
                    }
                });
                if (item.pic != null) {
                    content = "<h4>" + item.name + "</h4></br>" +
                        "类型:" + item.type + "</br>" +
                        '<img width=\"150\" height=\"150\" alt=\"\" src=\"' + item.pic + '" /></br>';

                }
                else {
                    content = "<h4>" + item.name + "</h4></br>" +
                        "类型:" + item.type + "</br>";
                }
                if (rr.length > 0) content += '应急资源统计：</br>';
                $.each(rr, function (i, r) {
                    content += r.category + '应急资源,数量:' + r.num + '</br>';
                });


                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle(item.name);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        // gdLayer.on("mouse-out", function (mouseEvent) {
        //     $scope.map.infoWindow.hide();
        // });
    });

    $scope.getGradeColor = function (grade) {
        if (grade == 1)
            return $scope.mapService.Color([255, 0, 0, 1]);
        else if (grade == 2)
            return $scope.mapService.Color([255, 153, 51, 1]);
        else if (grade == 3)
            return $scope.mapService.Color([255, 255, 102, 1]);
        else if (grade == 4)
            return $scope.mapService.Color([0, 204, 153, 1]);
        else if (grade == 5)
            return $scope.mapService.Color([0, 102, 0, 1]);
        else
            return $scope.mapService.Color([0, 102, 0, 1]);
    };

    $scope.getGradeText = function (grade) {
        if (grade == 1)
            return "I级";
        else if (grade == 2)
            return "II级";
        else if (grade == 3)
            return "III级";
        else if (grade == 4)
            return "IV级";
        else if (grade == 5)
            return "V级";
        else
            return "V级";
    };

    $scope.$on("CreateContryRiskMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                var linesymbol = new $scope.mapService.SimpleLineSymbol();
                // linesymbol.styl
                linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                marksymbol.setSize(15);
                marksymbol.setOutline(linesymbol);
                marksymbol.setColor($scope.getGradeColor(data.grade));
                //if (data.worker == 1) {
                //     marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                //}
                // else
                //     marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name,
                    "北纬" + data.lon + " <br/>东经:" + data.lat);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                var content = item.name + "风险等级:" + $scope.getGradeText(item.grade) + "</br></br>";

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.weathertypes = [
        { weather: "晴", icon: "d00.gif" },
        { weather: "多云", icon: "d01.gif" },
        { weather: "阴", icon: "d02.gif" },
        { weather: "阵雨", icon: "d03.gif" },
        { weather: "雷阵雨", icon: "d04.gif" },
        { weather: "雷阵雨伴有冰雹", icon: "d05.gif" },
        { weather: "雨夹雪", icon: "d06.gif" },
        { weather: "小雨", icon: "d07.gif" },
        { weather: "中雨", icon: "d08.gif" },
        { weather: "大雨", icon: "d09.gif" },
        { weather: "暴雨", icon: "d10.gif" },
        { weather: "大暴雨", icon: "d11.gif" },
        { weather: "特大暴雨", icon: "d12.gif" },
        { weather: "阵雪", icon: "d13.gif" },
        { weather: "小雪", icon: "d14.gif" },
        { weather: "中雪", icon: "d15.gif" },
        { weather: "大雪", icon: "d16.gif" },
        { weather: "暴雪", icon: "d17.gif" },
        { weather: "雾", icon: "d18.gif" },
        { weather: "冻雨", icon: "d19.gif" },
        { weather: "沙尘暴", icon: "d20.gif" },
        { weather: "小雨-中雨", icon: "d21.gif" },
        { weather: "中雨-大雨", icon: "d22.gif" },
        { weather: "大雨-暴雨", icon: "d23.gif" },
        { weather: "暴雨-大暴雨", icon: "d24.gif" },
        { weather: "大暴雨-特大暴雨", icon: "d25.gif" },
        { weather: "小雪-中雪", icon: "d26.gif" },
        { weather: "中雪-大雪", icon: "d27.gif" },
        { weather: "大雪-暴雪", icon: "d28.gif" },
        { weather: "沙尘", icon: "d29.gif" },
        { weather: "扬尘", icon: "d30.gif" },
        { weather: "强沙尘暴", icon: "d31.gif" },
        { weather: "霾", icon: "d53.gif" },
    ];

    $scope.getweatherurl = function (weather) {
        var url = "app/img/weather/d00.gif";
        var index = weather.indexOf("~");
        if (index != -1) {
            weather = weather.substring(0, index);
        }
        angular.forEach($scope.weathertypes, function (item, i) {
            if (weather == item.weather) {
                url = "app/img/weather/" + item.icon;
            }
        });
        return url;
    };

    $scope.$on("CreateWeatherMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                //var linesymbol = new $scope.mapService.SimpleLineSymbol();
                //// linesymbol.styl
                //linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                //var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                //marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                //marksymbol.setSize(15);
                //marksymbol.setOutline(linesymbol);
                //marksymbol.setColor($scope.getGradeColor(data.grade));

                var obj = angular.fromJson(data.jsondata);
                var url = $scope.getweatherurl(obj.days[0].dayweather);

                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": url,
                    "height": 21,
                    "width": 15,
                    "type": "esriPMS",
                    "angle": 0,
                });
                //if (data.worker == 1) {
                //     marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                //}
                // else
                //     marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name,
                    "北纬" + data.lon + " <br/>东经:" + data.lat);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                var obj = angular.fromJson(item.jsondata);

                $scope.map.infoWindow.setTitle(obj.cityname);

                var content = "<strong><font size='6px'>" + obj.cityname + "</font></strong></br>" + "更新时间:" + obj.time + "</br>" + obj.days[0].dayweather + "</br>" + obj.days[0].maxtemp + "~" + obj.days[0].mintemp + "</br>" + obj.days[0].wind;

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });

    $scope.$on("CreateWarnMarker", function (event, datas) {
        //function createprojectMarker(datas) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, data) {
            if (data.lon != null && data.lat != null && data.lon != 0) {
                //var linesymbol = new $scope.mapService.SimpleLineSymbol();
                //// linesymbol.styl
                //linesymbol.setColor(new $scope.mapService.Color([255, 255, 255, 1]));

                //var marksymbol = new $scope.mapService.SimpleMarkerSymbol();
                //marksymbol.setStyle($scope.mapService.SimpleMarkerSymbol.STYLE_CIRCLE);
                //marksymbol.setSize(15);
                //marksymbol.setOutline(linesymbol);
                //marksymbol.setColor($scope.getGradeColor(data.grade));

                //var obj = angular.fromJson(data.jsondata);
                var url = data.icon;

                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": url,
                    "height": 21,
                    "width": 15,
                    "type": "esriPMS",
                    "angle": 0,
                });
                //if (data.worker == 1) {
                //     marksymbol.setColor(new $scope.mapService.Color([153, 0, 0, 1]));
                //}
                // else
                //     marksymbol.setColor(new $scope.mapService.Color([255, 192, 0, 1]));

                var infoTemplate = new $scope.mapService.InfoTemplate(data.organiztion_name,
                    "北纬" + data.lon + " <br/>东经:" + data.lat);

                var pt = new $scope.mapService.Point(parseFloat(data.lon), parseFloat(data.lat));
                var gr = new $scope.mapService.graphic(pt, marksymbol, data, infoTemplate);
                gdLayer.add(gr);
            }
        });

        gdLayer.on("mouse-over", function (mouseEvent) {
            var zm = $scope.map.getZoom();
            if (mouseEvent.graphic != null) {
                var item = mouseEvent.graphic.attributes;
                //var obj = angular.fromJson(item.jsondata);

                $scope.map.infoWindow.setTitle(item.city);

                var content = "<strong><font size='6px'>" + item.city + "</font></strong></br>" + "发布时间:" + item.time + "</br>" + item.type + item.level + "预警</br>";

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
    });
}]);
