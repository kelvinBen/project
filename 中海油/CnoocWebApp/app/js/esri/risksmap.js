
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
'esri/toolbars/draw'],
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
    Font, TextSymbol, SimpleFillSymbol, SimpleLineSymbol, Polygon, Polyline, GeometryService, ProjectParameters, Draw) {
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

esriMap.controller('MapController', ['$rootScope', '$scope', '$attrs', 'esriMapService', function ($rootScope, $scope, $attrs, esriMapService) {

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

        var startExtent3 = new $scope.mapService.extent(-15970323, -7903085, 15005629, 7751217, new $scope.mapService.spatialReference({ wkid: 102100 }));

        // really should do something to load different options instead of introspecting tag attributes
        var options = {
            extent: startExtent3,
            minZoom: 3,
            logo: false
        };

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
       //InitGoogleLayer();

       // $scope.map.setExtent(startExtent3);

       // $scope.mapLayer = new my.PortlandTiledMapServiceLayer();
       // $scope.mapLayer1 = new my.PortlandTiledMapServiceLayer();
       // $scope.mapLayer1.MapStyle = "Terrain";
       // $scope.mapLayer.hide();
       // $scope.map.addLayer($scope.mapLayer1);
       // $scope.map.addLayer($scope.mapLayer);

        //creategraphicLayer("County",0.75);
        //$scope.map.setExtent(startExtent2);
        //$scope.sl = new $scope.mapService.graphicsLayer({ id: "station" });
        //$scope.map.addLayer($scope.sl);

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
        if (msg == 0) {
            $scope.mapLayer.hide();
            $scope.mapLayer1.show();
        }
        else {
            $scope.mapLayer1.hide();
            $scope.mapLayer.show();
        }
    });

    $scope.$on("ZoomTo", function (event, msg) {
        var pt = new $scope.mapService.Point(parseFloat(msg.lon), parseFloat(msg.lat));
        $scope.map.centerAndZoom(pt, msg.level);

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

    $scope.$on("showWorld", function (event, data) {
        var symbol = new $scope.mapService.SimpleFillSymbol(
                $scope.mapService.SimpleFillSymbol.STYLE_SOLID,
                new $scope.mapService.SimpleLineSymbol(
                $scope.mapService.SimpleLineSymbol.STYLE_SOLID,
                new $scope.mapService.Color([255, 255, 255, 1]),
                1
                ),
                new $scope.mapService.Color([148, 138, 84, 0.5])
        );
        var gdLayer = $scope.map.getLayer("world");
        if (gdLayer != null) {
            var ext = null;
            for (var i = 0; i < data.length; ++i) {
                var child = data[i].properties.childNum;
                for (var j = 0; j < child; ++j) {
                    var ply = new $scope.mapService.Polyline(data[i].geometry.coordinates[j]);
                    var ext1 = ply.getExtent();
                    ext = ext == null ? ext1 : ext.union(ext1);
                    var graphic = new $scope.mapService.graphic(ply, symbol);
                    gdLayer.add(graphic);
                    //showReal(ext1.getCenter(), 'world', data[i].properties.name, 0, 0);
                }
            }
            if (ext != null) 
                $scope.map.setExtent(ext);
        }
    });

    $scope.$on("createCountryRisks", function (event, data) {
        var col = null;
        if (data.value < 0.1)
            col = new $scope.mapService.Color([240, 255, 255, 1]);
        else if (data.value >= 0.1 && data.value < 0.4)
            col = new $scope.mapService.Color([0, 0, 255, 1]);
        else if (data.value >= 0.4 && data.value < 0.7)
            col = new $scope.mapService.Color([255, 165, 0, 1]);
        else if (data.value >= 1)
            col = new $scope.mapService.Color([255, 0, 0, 1]);
        var symbol = new $scope.mapService.SimpleFillSymbol($scope.mapService.SimpleFillSymbol.STYLE_SOLID, null, col);
        var gdLayer = $scope.map.getLayer("risk");
        if (gdLayer != null) {
            var child = data.geo.properties.childNum;
            for (var j = 0; j < child; ++j) {
                var ply = new $scope.mapService.Polyline(data.geo.geometry.coordinates[j]);
                var graphic = new $scope.mapService.graphic(ply, symbol);
                gdLayer.add(graphic);
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
                var url = datas.url;
                url += "/";
                url += item.organiztion_id;
                var content = "<iframe  src=\"{0}\" frameborder=\"0\" width=\"420\" height=\"170\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                //var content = "<iframe  src=\"{0}\" frameborder=\"0\"  marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>";
                content = String.format(content, url);

                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.resize(460, 200);
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
                var url = "../../Content/h-ui/images/Marker/ship.png";
                var marksymbol;
                if (item.type == "车辆") {
                    url = "../../Content/h-ui/images/Marker/car.png";
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
                    "东经:" + item.lat + "</br>" + "状态:" + item.status + "</br><img width=\"100\" height=\"100\" alt=\"\" src=\"../../Content/h-ui/images/car.jpg\" />";


                    $scope.map.infoWindow.setContent(content);
                }
                else {
                    var content =
                    "当前位置:</br>" + "北纬:" + item.lon + "</br>" +
                    "东经:" + item.lat + "</br>" + "状态:" + item.status + "</br><img width=\"100\" height=\"100\" alt=\"\" src=\"../../Content/h-ui/images/ship.jpg\" />";

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
                    "url": "../../Content/h-ui/images/Marker/oilpump.png",
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
                var content = "建立时间:" + item.create_time + "</br>" +
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

    $scope.$on("createpositionMarker", function (event, datas) {
        //function createutilityMarker(data, layer) {
        var gdLayer = $scope.map.getLayer(datas.layername);
        if (gdLayer == null)
            return;
        $.each(datas.data, function (i, item) {
            if (item.lon != null) {
                var marksymbol = new $scope.mapService.PictureMarkerSymbol({
                    "url": "../../Content/h-ui/images/Marker/position.png",
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

        gdLayer.on("mouse-over", function (mouseEvent) {
            if (mouseEvent.graphic != null) {
                var scale = $scope.map.getScale();
                var item = mouseEvent.graphic.attributes;
                var content = "";
                if (item.pic != null) {
                    content = "<h4>" + item.name + "</h4></br>" +
                    "类型:" + item.type + "</br>" +
                    '<img width=\"150\" height=\"150\" alt=\"\" src=\"' + item.pic + '" />';
                }
                else {
                    content = "<h4>" + item.name + "</h4></br>" +
                    "类型:" + item.type + "</br>";
                }



                $scope.map.infoWindow.setContent(content);
                $scope.map.infoWindow.setTitle(item.name);
                $scope.map.infoWindow.show(mouseEvent.graphic.geometry);
            }
        });

        gdLayer.on("mouse-out", function (mouseEvent) {
            $scope.map.infoWindow.hide();
        });
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
}]);
