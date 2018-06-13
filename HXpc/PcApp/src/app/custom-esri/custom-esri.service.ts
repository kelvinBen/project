import { Injectable, ElementRef } from '@angular/core';
import { Station } from '../models/stations';
import { MinuteData } from '../models/minute';
import * as esriLoad from 'esri-loader';
import * as moment from 'moment';
@Injectable()
export class CustomEsriService {
  map: __esri.Map;
  mapView: __esri.MapView;
  constructor() {
    esriLoad.loadScript({ url: 'http://120.26.44.171:5557/init.js' });
  }
  loadMap(mapProperties: __esri.MapProperties, mapViewProperties: __esri.MapViewProperties, mapEl: ElementRef) {
    return esriLoad.loadModules([
      'esri/config', 'esri/Map', 'esri/views/MapView', 'esri/request', 'esri/layers/BaseTileLayer',
      'esri/layers/WMSLayer', 'esri/geometry/SpatialReference', 'esri/layers/support/TileInfo',
      'esri/widgets/BasemapToggle', 'esri/layers/support/WMSSublayer', 'esri/layers/WMTSLayer'
    ]).then(([
      Config, Map, MapView, esriRequest, BaseTileLayer, WMSLayer, SpatialReference, TileInfo, BasemapToggle, WMSSublayer, WMTSLayer
    ]: [__esri.config, __esri.MapConstructor, __esri.MapViewConstructor, __esri.request,
        __esri.BaseTileLayerConstructor, __esri.WMSLayerConstructor, __esri.SpatialReferenceConstructor,
        __esri.TileInfoConstructor, __esri.BasemapToggleConstructor, __esri.WMSSublayerConstructor, __esri.WMTSLayerConstructor]) => {
      Config.request.corsEnabledServers.push('120.26.44.171:9872');
      Config.request.corsEnabledServers.push('120.26.44.171:5557');
      Config.request.corsEnabledServers.push('t0.tianditu.com');
      const spatialReference = new SpatialReference({ wkid: 4326 });
      const tileInfo = new TileInfo({
        size: [256, 256],
        origin: {
          x: -180,
          y: 90
        },
        lods: [
          { level: 0, resolution: 0.703125, scale: 295497593.05875003 },
          { level: 2, resolution: 0.3515625, scale: 147748796.52937502 },
          { level: 3, resolution: 0.17578125, scale: 73874398.264687508 },
          { level: 4, resolution: 0.087890625, scale: 36937199.132343754 },
          { level: 5, resolution: 0.0439453125, scale: 18468599.566171877 },
          { level: 6, resolution: 0.02197265625, scale: 9234299.7830859385 },
          { level: 7, resolution: 0.010986328125, scale: 4617149.8915429693 },
          { level: 8, resolution: 0.0054931640625, scale: 2308574.9457714846 },
          { level: 9, resolution: 0.00274658203125, scale: 1154287.4728857423 },
          { level: 10, resolution: 0.001373291015625, scale: 577143.73644287116 },
          { level: 11, resolution: 0.0006866455078125, scale: 288571.86822143558 },
          { level: 12, resolution: 0.00034332275390625, scale: 144285.93411071779 },
          { level: 13, resolution: 0.000171661376953125, scale: 72142.967055358895 },
          { level: 14, resolution: 8.58306884765625e-005, scale: 36071.483527679447 },
          { level: 15, resolution: 4.291534423828125e-005, scale: 18035.741763839724 },
          { level: 16, resolution: 2.1457672119140625e-005, scale: 9017.8708819198619 },
          { level: 17, resolution: 1.0728836059570313e-005, scale: 4508.9354409599309 },
          { level: 18, resolution: 5.3644180297851563e-006, scale: 2254.4677204799655 }
        ],
        spatialReference: spatialReference
      });
      class VectorLayer extends BaseTileLayer {
        getTileUrl(level: number, row: number, col: number) {
          let url = 'http://t0.tianditu.com/vec_c/wmts';
          url += '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=';
          url += level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';
          return url;
        }
      }
      class TerrainLayer extends BaseTileLayer {
        getTileUrl(level: number, row: number, col: number) {
          let url = 'http://t0.tianditu.com/img_w/wmts';
          url += '?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=';
          url += level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';
          return url;
        }
      }
      class LabelLayer extends BaseTileLayer {
        getTileUrl(level: number, row: number, col: number) {
          let url = 'http://t0.tianditu.com/cva_c/wmts?';
          url += 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=';
          url += level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';
          return url;
        }
      }
      const vectorTileLayer = new VectorLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 0.2
      });
      const terrainLayer = new TerrainLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 0.4
      });
      const labelLayer = new LabelLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 0.4
      });
      const hxLayer = new WMSLayer({
        url: 'http://120.26.44.171:9872/geoserver/hx/wms',
        sublayers: [new WMSSublayer({ name: 'hx:hx' })],
        opacity: 0.9
      });
      mapProperties.basemap = {
        baseLayers: [labelLayer, vectorTileLayer, hxLayer],
        id: 'vectorlayer',
        thumbnailUrl: '../../assets/Images/vector.png',
        title: '地图'
      };
      const map = new Map(mapProperties); // create map
      if (!mapViewProperties.container) {
        mapViewProperties.container = mapEl.nativeElement.id;
      }
      if (!mapViewProperties.map) {
        mapViewProperties.map = map;
      }
      const mapView = new MapView(mapViewProperties); // create the MapView
      const basemapToggle = new BasemapToggle({
        titleVisible: true,
        view: mapView,
        nextBasemap: {
          baseLayers: [labelLayer, hxLayer, terrainLayer],
          id: 'terrainlayer',
          thumbnailUrl: '../../assets/Images/terrain.png',
          title: '卫星图像'
        }
      });
      // mapView.ui.add(basemapToggle, 'top-right');
      this.map = map;
      this.mapView = mapView;
      return {
        map: map,
        mapView: mapView
      };
    });
  }
  createGraphicsLayer(layerProperties: __esri.GraphicsLayerProperties) {
    return esriLoad.loadModules(['esri/layers/GraphicsLayer'])
      .then(([GraphicsLayer]: [__esri.GraphicsLayerConstructor]) => {
        const ly = new GraphicsLayer(layerProperties);
        this.map.add(ly);
        return this.map;
      });
  }
  setStationLayerDatas(layerid: string, time: string, ary: Station[], data: MinuteData[]) {
    esriLoad.loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/Graphic', 'esri/symbols/TextSymbol'])
      .then(([Point, PictureMarkerSymbol, Graphic, TextSymbol
      ]: [__esri.PointConstructor, __esri.PictureMarkerSymbolConstructor, __esri.GraphicConstructor, __esri.TextSymbolConstructor]) => {
        const ly = this.map.findLayerById(layerid) as __esri.GraphicsLayer;
        if (!ly) { return; }
        ly.removeAll();
        const t = moment(time, 'YYYYMMDDHHmm');
        ary.forEach(ele => {
          const pt = new Point({ latitude: ele.Lat.valueOf(), longitude: ele.Lon.valueOf() });
          if (ele.Station_Id_C === '57132') {
            pt.longitude = 108.5841;
            pt.latitude = 34.1354;
          }
          if (ele.Station_Id_C === 'V8281') {
            pt.longitude = 108.733634344;
            pt.latitude = 34.0134989066666;
          }
          // station mark
          const picSymbol = new PictureMarkerSymbol({ url: '../../assets/Images/station.png', width: 10, height: 10 });
          const picGraphic = new Graphic();
          picGraphic.geometry = pt;
          picGraphic.symbol = picSymbol;
          ly.add(picGraphic);
          // station name
          const stnNameGraphic = new Graphic();
          stnNameGraphic.symbol = new TextSymbol({
            font: { size: 6 },
            text: ele.Station_Name.valueOf(),
            yoffset: 7
          });
          stnNameGraphic.geometry = pt;
          ly.add(stnNameGraphic);
          const dt = data.find(s => s.Station_Id_C === ele.Station_Id_C);
          if (dt) {
            if (dt.TEM && dt.TEM !== '') { // 气温
              const tempGraphic = new Graphic();
              tempGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.TEM.valueOf() + '℃',
                color: '0066FF',
                xoffset: -2,
                yoffset: -10,
                horizontalAlignment: 'right'
              });
              tempGraphic.geometry = pt;
              ly.add(tempGraphic);
            }
            if (dt.PRE && dt.PRE < '999') {  // 降水
              const rainGraphic = new Graphic();
              rainGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.PRE.valueOf() + 'mm',
                color: '6633FF',
                xoffset: -2,
                yoffset: -20,
                horizontalAlignment: 'right'
              });
              rainGraphic.geometry = pt;
              ly.add(rainGraphic);
            }
            if (dt.RHU && dt.RHU < '999') { // 相对湿度
              const rhuGraphic = new Graphic();
              rhuGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.RHU.valueOf() + '%',
                color: '6633FF',
                xoffset: -2,
                yoffset: -30,
                horizontalAlignment: 'right'
              });
              rhuGraphic.geometry = pt;
              ly.add(rhuGraphic);
            }
            if (dt.PRS && dt.PRS < '999') { // 气压
              const pressGraphic = new Graphic();
              pressGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.PRS.valueOf() + 'hpa',
                color: '6633FF',
                xoffset: 2,
                yoffset: -10,
                horizontalAlignment: 'left'
              });
              pressGraphic.geometry = pt;
              ly.add(pressGraphic);
            }
            if (dt.WIN_S_Inst_Max && dt.WIN_S_Inst_Max < '999') {
              const wsGraphic = new Graphic();
              wsGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.WIN_S_Inst_Max.valueOf() + 'm/s',
                color: '6633FF',
                xoffset: 2,
                yoffset: -20,
                horizontalAlignment: 'left'
              });
              wsGraphic.geometry = pt;
              ly.add(wsGraphic);
            }
            if (dt.WIN_D_INST_Max && dt.WIN_D_INST_Max < '999') {
              const wdGraphic = new Graphic();
              wdGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: dt.WIN_D_INST_Max.valueOf() + '°',
                color: '6633FF',
                xoffset: 2,
                yoffset: -30,
                horizontalAlignment: 'left'
              });
              wdGraphic.geometry = pt;
              ly.add(wdGraphic);
            }
          }
        });
      });
  }
  initStationLayer(layerid: String, stations: Station[]) {
    esriLoad.loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/Graphic', 'esri/PopupTemplate'])
      .then(([Point, PictureMarkerSymbol, Graphic, PopupTemplate
      ]: [__esri.PointConstructor, __esri.PictureMarkerSymbolConstructor, __esri.GraphicConstructor, __esri.PopupTemplateConstructor]) => {
        const ly = this.map.findLayerById(layerid.valueOf()) as __esri.GraphicsLayer;
        if (!ly) { return; }
        ly.removeAll();
        const symbol = new PictureMarkerSymbol({ url: '../../assets/Images/station.png', width: 10, height: 10 });
        stations.forEach(ele => {
          const graphic = new Graphic();
          if (ele.Station_Id_C === '57132') {
            graphic.geometry = new Point({ latitude: 34.1354, longitude: 108.5841 });
          } else {
            graphic.geometry = new Point({ latitude: ele.Lat.valueOf(), longitude: ele.Lon.valueOf() });
          }
          graphic.symbol = symbol;
          const attribute = ele;
          graphic.attributes = attribute;
          graphic.popupTemplate = new PopupTemplate({
            title: function (gra) {
              const att = gra.graphic.attributes as Station;
              if (att) {
                return att.Station_Name;
              }
              return '';
            },
            content: function (gra) {
              const att = gra.graphic.attributes as Station;
              if (att) {
                let cont = '<b>区站号:' + att.Station_Id_C + '</b>';
                cont += '</br><b>经度:' + att.Lon + '</b>';
                cont += '</br><b>维度:' + att.Lat + '</b>';
                return cont;
              }
              return '';
            }
          });
          ly.add(graphic);
        });
      });
  }
  createGrid(layerid: string, xmin: Number, xmax: Number, ymin: Number, ymax: Number) {
    esriLoad.loadModules(['esri/geometry/Polyline', 'esri/symbols/SimpleLineSymbol', 'esri/Graphic', 'esri/Color'])
      .then(([Polyline, SimpleLineSymbol, Graphic, Color
      ]: [__esri.PolylineConstructor, __esri.SimpleLineSymbolConstructor, __esri.GraphicConstructor, __esri.ColorConstructor]) => {
        const ly = this.map.findLayerById(layerid) as __esri.GraphicsLayer;
        if (!ly) { return; }
        ly.removeAll();
        const symbol = new SimpleLineSymbol({
          color: new Color('#FFFFFF'),
          width: 1,
          style: 'solid'
        });
        for (let x = xmin; x <= xmax; x = x.valueOf() + 0.025) {
          const paths = [
            [x.valueOf(), ymin.valueOf()],
            [x.valueOf(), ymax.valueOf()]
          ];
          const line = new Polyline();
          line.addPath(paths);
          ly.add(new Graphic({ symbol: symbol, geometry: line }));
        }
        for (let y = ymin; y <= ymax; y = y.valueOf() + 0.025) {
          const line = new Polyline();
          line.addPath([[xmin.valueOf(), y.valueOf()], [xmax.valueOf(), y.valueOf()]]);
          ly.add(new Graphic({ symbol: symbol, geometry: line }));
        }
      });
  }
  createMark(layerid: string, latitude: number, longitude: number) {
    esriLoad.loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/Graphic'])
      .then(([Point, PictureMarkerSymbol, Graphic
      ]: [__esri.PointConstructor, __esri.PictureMarkerSymbolConstructor, __esri.GraphicConstructor]) => {
        const ly = this.map.findLayerById(layerid) as __esri.GraphicsLayer;
        if (!ly) { return; }
        ly.removeAll();
        const symbol = new PictureMarkerSymbol({
          url: '../../assets/Images/station.png',
          width: 16,
          height: 16
        });
        const pt = new Point({ latitude: latitude, longitude: longitude });
        ly.add(new Graphic({ symbol: symbol, geometry: pt }));
        return {
          latitude: latitude,
          longitude: longitude
        };
      });
  }
}
