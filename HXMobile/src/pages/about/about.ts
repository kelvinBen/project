import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as esriLoad from 'esri-loader';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { GridParameter, GeocoderModel } from '../../models/grid';
// import { GridParameter, GeocoderModel, GridResult } from '../../models/grid';

let controll: any;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  map: any;
  mapView: any;
  geocoder: GeocoderModel;
  constructor(public navCtrl: NavController,
    public _http: HttpClient) {
    this.loadMap().then(() => {
      controll = this;
      const stnlyProperties = { id: 'mark', opacity: 0.8, visible: true };
      this.createGraphicsLayer(stnlyProperties).then(map => {
        this.map = map;
        this.createMark('mark', 34.1354, 108.5841);
        this.selDateValueChange(34.1354, 108.5841);
        this.mapView.on('click', function (evt) {
          const mapPoint = evt.mapPoint;
          controll.createMark('mark', mapPoint.latitude, mapPoint.longitude);
          controll.selDateValueChange(mapPoint.longitude, mapPoint.latitude);
        });
      });
    });
  }
  loadMap() {
    return esriLoad.loadModules([
      'esri/config', 'esri/Map', 'esri/views/MapView', 'esri/request', 'esri/layers/BaseTileLayer',
      'esri/layers/WMSLayer', 'esri/geometry/SpatialReference', 'esri/layers/support/TileInfo',
      'esri/widgets/BasemapToggle', 'esri/layers/support/WMSSublayer'
    ]).then(([
      Config, Map, MapView, esriRequest, BaseTileLayer, WMSLayer, SpatialReference, TileInfo, BasemapToggle, WMSSublayer
    ]) => {
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
      const vectorTileLayer = new VectorLayer();
      vectorTileLayer.spatialReference = spatialReference;
      vectorTileLayer.tileInfo = tileInfo;
      vectorTileLayer.opacity = 0.2;
      const terrainTileLayer = new TerrainLayer();
      terrainTileLayer.spatialReference = spatialReference;
      terrainTileLayer.tileInfo = tileInfo;
      terrainTileLayer.opacity = 0.2;
      const hxLayer = new WMSLayer({
        url: 'http://120.26.44.171:9872/geoserver/hx/wms',
        sublayers: [new WMSSublayer({ name: 'hx:hx' })],
        opacity: 0.6
      });
      this.map = new Map({
        basemap: {
          baseLayers: [vectorTileLayer, hxLayer],
          id: 'vectorlayer',
          thumbnailUrl: './assets/imgs/vector.png',
          title: ''
        }
      });
      this.mapView = new MapView({
        container: "locationMap",
        map: this.map,
        center: { x: 108.56, y: 34.01 },
        zoom: 10
      });
      const basemapToggle = new BasemapToggle({
        titleVisible: true,
        view: this.mapView,
        nextBasemap: {
          baseLayers: [terrainTileLayer, hxLayer],
          id: 'terrainlayer',
          thumbnailUrl: './assets/imgs/terrain.png',
          title: ''
        }
      });
      this.mapView.ui.add(basemapToggle, 'top-right');
    });
  }
  createGraphicsLayer(layerProperties: object) {
    return esriLoad.loadModules(['esri/layers/GraphicsLayer'])
      .then(([GraphicsLayer]) => {
        const ly = new GraphicsLayer(layerProperties);
        this.map.add(ly);
        return this.map;
      });
  }
  createMark(layerid: string, latitude: number, longitude: number) {
    esriLoad.loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/Graphic'])
      .then(([Point, PictureMarkerSymbol, Graphic
      ]) => {
        const ly = this.map.findLayerById(layerid);
        if (!ly) { return; }
        ly.removeAll();
        const symbol = new PictureMarkerSymbol({
          url: './assets/imgs/station.png',
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
  selDateValueChange(lon: Number, lat: Number) {
    const par = new GridParameter();
    par.Xmax = par.Xmin = lon;
    par.Ymax = par.Ymin = lat;
    par.Num = 14;
    par.Fhour = 8;
    par.Ftime = moment().format('YYYYMMDD');
    par.Ftype = 't2m';
    par.Timeslot = 1;
    // const x = (lon.valueOf() - 103) % 0.025;
    // const y = (lat.valueOf() - 31) % 0.025;
    let url = 'http://restapi.amap.com/v3/geocode/regeo?key=38e2ca25ef0935f8318e258fab45bf04';
    url += '&location=' + lon.toString() + ',' + lat.toString() + '&poitype=&radius=100';
    url += '&extensions=all&batch=false&roadlevel=0';
    this._http.get(url).subscribe(geoResult => {
      this.geocoder = geoResult as GeocoderModel;
      this._http.post('http://www.lintongqx.com/gridapi/Forcast', par).subscribe(result => {
        // let dts = result as GridResult[];
        // this.createChart(dts, 'line', '°C', '气温', 'tChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
      par.Ftype = 'rain';
      this._http.post('http://www.lintongqx.com/gridapi/Forcast', par).subscribe(result => {
        // const dts = result as GridResult[];
        // this.createChart(dts, 'bar', 'mm', '降水', 'rChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
      par.Ftype = 'vis';
      this._http.post('http://www.lintongqx.com/gridapi/Forcast', par).subscribe(result => {
        // const dts = result as GridResult[];
        // this.createChart(dts, 'line', 'km', '能见度', 'vChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
    });
  }
}
