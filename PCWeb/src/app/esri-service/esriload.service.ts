import { Injectable, ElementRef } from '@angular/core';
import { Station } from '../models/stations';
import * as esriLoad from 'esri-loader';
import { MinuteData } from '../models/minute';
import * as moment from 'moment';
@Injectable()
export class EsriloadService {
  map: __esri.Map;
  mapView: __esri.MapView;
  constructor() {
    esriLoad.loadScript({ url: 'http://120.26.44.171:5557/init.js' });
  }
  loadMap(mapProperties: __esri.MapProperties, mapViewProperties: __esri.MapViewProperties, mapEl: ElementRef) {
    return esriLoad.loadModules([
      'esri/config', 'esri/Map', 'esri/views/MapView', 'esri/request', 'esri/layers/BaseTileLayer',
      'esri/layers/WMSLayer', 'esri/geometry/SpatialReference', 'esri/layers/support/TileInfo',
      'esri/widgets/BasemapToggle', 'esri/layers/support/WMSSublayer'
    ]).then(([
      Config, Map, MapView, esriRequest, BaseTileLayer, WMSLayer, SpatialReference, TileInfo, BasemapToggle, WMSSublayer
    ]: [__esri.config, __esri.MapConstructor, __esri.MapViewConstructor, __esri.request,
        __esri.BaseTileLayerConstructor, __esri.WMSLayerConstructor, __esri.SpatialReferenceConstructor,
        __esri.TileInfoConstructor, __esri.BasemapToggleConstructor, __esri.WMSSublayerConstructor]) => {
      Config.request.corsEnabledServers.push('120.26.44.171:9872');
      Config.request.corsEnabledServers.push('120.26.44.171:5557');
      const spatialReference = new SpatialReference({ wkid: 102113 });
      const tileInfo = new TileInfo({
        dpi: 96,
        format: 'JPEG',
        origin: {
          x: -20037508.342787,
          y: 20037508.342787
        },
        lods: [
          { level: 0, resolution: 156543.033928, scale: 591657527.591555 },
          { level: 1, resolution: 78271.5169639999, scale: 295828763.795777 },
          { level: 2, resolution: 39135.7584820001, scale: 147914381.897889 },
          { level: 3, resolution: 19567.8792409999, scale: 73957190.948944 },
          { level: 4, resolution: 9783.93962049996, scale: 36978595.474472 },
          { level: 5, resolution: 4891.96981024998, scale: 18489297.737236 },
          { level: 6, resolution: 2445.98490512499, scale: 9244648.868618 },
          { level: 7, resolution: 1222.99245256249, scale: 4622324.434309 },
          { level: 8, resolution: 611.49622628138, scale: 2311162.217155 },
          { level: 9, resolution: 305.748113140558, scale: 1155581.108577 },
          { level: 10, resolution: 152.874056570411, scale: 577790.554289 },
          { level: 11, resolution: 76.4370282850732, scale: 288895.277144 },
          { level: 12, resolution: 38.2185141425366, scale: 144447.638572 },
          { level: 13, resolution: 19.1092570712683, scale: 72223.819286 },
          { level: 14, resolution: 9.55462853563415, scale: 36111.909643 },
          { level: 15, resolution: 4.77731426794937, scale: 18055.954822 },
          { level: 16, resolution: 2.38865713397468, scale: 9027.977411 },
          { level: 17, resolution: 1.19432856685505, scale: 4513.988705 },
          { level: 18, resolution: 0.597164283559817, scale: 2256.994353 },
          { level: 19, resolution: 0.298582141647617, scale: 1128.497176 }
        ],
        size: [256, 256],
        spatialReference: spatialReference
      });
      class VectorLayer extends BaseTileLayer {
        getTileUrl(level: number, row: number, col: number) {
          const url = 'http://mt' + (col % 4) + '.google.cn/vt/v=w2.114&hl=zh-CN&gl=cn&' +
            'x=' + col + '&' +
            'y=' + row + '&' +
            'z=' + level + '&s=';
          return url;
        }
      }
      class TerrainLayer extends BaseTileLayer {
        getTileUrl(level: number, row: number, col: number) {
          const s = 'Galileo'.substring(0, ((3 * col + row) % 8));
          const url = 'http://mt' + (col % 4) + '.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&' +
            'x=' + col + '&' +
            'y=' + row + '&' +
            'z=' + level + '&' +
            's=' + s;
          return url;
        }
      }
      const vectorTileLayer = new VectorLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 0.2
      });
      const terrainTileLayer = new TerrainLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 0.2
      });
      const hxLayer = new WMSLayer({
        url: 'http://120.26.44.171:9872/geoserver/hx/wms',
        sublayers: [new WMSSublayer({ name: 'hx:hx' })],
        opacity: 0.8
      });
      mapProperties.basemap = {
        baseLayers: [vectorTileLayer, hxLayer],
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
          baseLayers: [terrainTileLayer, hxLayer],
          id: 'terrainlayer',
          thumbnailUrl: '../../assets/Images/terrain.png',
          title: '卫星图像'
        }
      });
      mapView.ui.add(basemapToggle, 'top-right');
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
          // station name
          const stnNameGraphic = new Graphic();
          stnNameGraphic.symbol = new TextSymbol({
            font: { size: 6 },
            text: ele.Station_Name.valueOf()
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
            if (dt.PRE && dt.PRE !== '') {  // 降水
              const rainGraphic = new Graphic();
              rainGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: (dt.PRE.valueOf() > '9999' ? '' : dt.PRE.valueOf() + 'mm'),
                color: '6633FF',
                xoffset: -2,
                yoffset: -20,
                horizontalAlignment: 'right'
              });
              rainGraphic.geometry = pt;
              ly.add(rainGraphic);
            }
            if (dt.RHU && dt.RHU !== '') { // 相对湿度
              const rhuGraphic = new Graphic();
              rhuGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: (dt.RHU.valueOf() > '9999' ? '' : dt.RHU.valueOf() + '%'),
                color: '6633FF',
                xoffset: -2,
                yoffset: -30,
                horizontalAlignment: 'right'
              });
              rhuGraphic.geometry = pt;
              ly.add(rhuGraphic);
            }
            if (dt.PRS && dt.PRS !== '') { // 气压
              const pressGraphic = new Graphic();
              pressGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: (dt.PRS.valueOf() > '9999' ? '' : dt.PRS.valueOf() + 'hpa'),
                color: '6633FF',
                xoffset: 2,
                yoffset: -10,
                horizontalAlignment: 'left'
              });
              pressGraphic.geometry = pt;
              ly.add(pressGraphic);
            }
            if (dt.WIN_S_Inst_Max && dt.WIN_S_Inst_Max !== '') {
              const wsGraphic = new Graphic();
              wsGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: (dt.WIN_S_Inst_Max.valueOf() > '9999' ? '' : dt.WIN_S_Inst_Max.valueOf() + 'm/s'),
                color: '6633FF',
                xoffset: 2,
                yoffset: -20,
                horizontalAlignment: 'left'
              });
              wsGraphic.geometry = pt;
              ly.add(wsGraphic);
            }
            if (dt.WIN_D_INST_Max && dt.WIN_D_INST_Max !== '') {
              const wdGraphic = new Graphic();
              wdGraphic.symbol = new TextSymbol({
                font: { size: 8 },
                text: (dt.WIN_D_INST_Max.valueOf() > '9999' ? '' : dt.WIN_D_INST_Max.valueOf() + '°'),
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
          const pt = new Point({ latitude: ele.Lat.valueOf(), longitude: ele.Lon.valueOf() });
          if (ele.Station_Id_C === '57132') {
            pt.longitude = 108.5841;
            pt.latitude = 34.1354;
          }
          graphic.geometry = pt;
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
}
