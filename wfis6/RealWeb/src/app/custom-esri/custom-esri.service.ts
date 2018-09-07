import { Injectable,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as esriLoad from 'esri-loader';
import { Station } from '../models/stations';
import { ApiResult } from '../models/cimiss';
import { ApiServiceService } from '../api-service/api-service.service';
class GisPoint {
  public X: number;
  public Y: number;
}

class GisPolygon {
  public Points: GisPoint[];
}
class shpRes {
  id: String;
  name: String;
  type: String;
  shpcontent: any;
}
class shpCon {
  displayFieldName: String;
  fieldAliases: object;
  geometryType: String;
  spatialReference: object;
  fields: object[];
  features: [{
    attributes: object;
    geometry: {
      rings: Array<any>;
    }
  }]
}
@Injectable()
export class CustomEsriService {
  esriUrl: String = 'http://120.26.44.171:5557/init.js';
  map: any;
  mapView: __esri.MapView;
  verctorLayer: any;
  terrainLayer: any;
  constructor(private _http: HttpClient, private _apiService: ApiServiceService) {
    esriLoad.loadScript({ url: 'http://120.26.44.171:5557/init.js' });
  }
  loadMap(mapProperties: __esri.MapProperties, mapViewProperties: __esri.MapViewProperties, mapEl: ElementRef) {
    //return esriLoad.loadScript({ url: 'http://120.26.44.171:5557/init.js' }).then(() => {
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
        opacity: 1
      });
      const terrainTileLayer = new TerrainLayer({
        spatialReference: spatialReference,
        tileInfo: tileInfo,
        opacity: 1
      });
      mapProperties.basemap = {
        baseLayers: [vectorTileLayer],
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
          baseLayers: [terrainTileLayer],
          id: 'terrainlayer',
          thumbnailUrl: '../../assets/Images/terrain.png',
          title: '卫星图像'
        }
      });
      mapView.ui.add(basemapToggle, 'top-right');
      const hxLayer = new WMSLayer({
        url: 'http://120.26.44.171:9872/geoserver/xian/wms',
        sublayers: [new WMSSublayer({ name: 'xian:西安区县' })],
        opacity: 0.8
      });
      map.add(hxLayer);
      this.map = map;
      this.mapView = mapView;
      //this.isLoaded.emit();
      return {
        map: map,
        mapView: mapView
      };
    });
  };

  LoadMap(id: String) {
    return esriLoad.loadModules([
      'esri/map',
      'esri/Color',
      'esri/graphic',
      'extLayers/googleLayer',
      'esri/geometry/Extent',
      'esri/geometry/Point',
      'esri/symbols/SimpleFillSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/layers/GraphicsLayer',
      'esri/geometry/Polygon'
    ]).then(([
      Map, Color, Graphic, googleLayer, Extent, Point, SimpleFillSymbol, SimpleLineSymbol,
      GraphicsLayer, Polygon
    ]) => {
      const map = new Map(id, {
        center: [108.73, 34.15],
        zoom: 9,
      });
      //this.verctorLayer = new googleLayer({ layertype: 'Vector' });
      //this.terrainLayer = new googleLayer({ layertype: 'Terrain' });
      //this.terrainLayer.hide();
      //map.addLayer(this.verctorLayer);
      //map.addLayer(this.terrainLayer);
      //map.addLayer(GraphicsLayer({ id: 'boundary', opacity: 1, visiable: true })); // 边界
      const symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255, 1]), 1.5
        ),
        new Color([224, 224, 224, 0])
      );
      //       this._apiService.getShp().subscribe(result => {
      //       //this._http.get('http://47.98.32.177:7100/shp?name=西安市&type=行政').subscribe(result => {
      //         console.log(result);
      //         const res = result as ApiResult;
      // const shp = res.DS[0] as shpRes;
      // const content = JSON.parse(shp.shpcontent) as shpCon;
      // const boundary = content.features[0].geometry.rings;
      //         const gdLayer = map.getLayer('boundary');
      //         if (gdLayer != null) {
      //           for (let i = 0; i < boundary.length; ++i) {
      //             const polygon = boundary[i];
      //             const pts = new Array(polygon.length);
      //             for (let j = 0; j < polygon.length; ++j) {
      //               pts[j] = new Point(polygon[j][0], polygon[j][1]);
      //             }
      //             const ply = new Polygon();
      //             ply.addRing(pts);
      //             const graphic = new Graphic(ply, symbol);
      //             gdLayer.add(graphic);
      //           }
      //         }
      //       });
      this.map = map;
      return map;
    });
  }

  CreateGraphicsLayer(layerName: String, opacity: Number, visiable: Boolean) {
    return esriLoad.loadModules(['esri/layers/GraphicsLayer'])
      .then(([GraphicsLayer]) => {
        const ly = new GraphicsLayer({ id: layerName, opacity: opacity, visiable: visiable });
        this.map.addLayer(ly);
        return this.map;
      });
  }

  CreateMapImageLayer(layerName: String, opacity: Number, visiable: Boolean) {
    // return esriLoad.loadModules(['esri/layers/MapImageLayer'])
    //   .then(([MapImageLayer]) => {
    //     const ly = new MapImageLayer({ id: layerName, opacity: opacity });
    //     if (visiable) {
    //       ly.show();
    //     } else {
    //       ly.hide();
    //     }
    //     this.map.addLayer(ly);
    //     return this.map;
    //   });
  }

  AddNewImgIntoImageLayer(layerName: String, imgUrl: String) {
    // return esriLoad.loadModules(['esri/layers/MapImageLayer', 'esri/geometry/Extent', 'esri/layers/MapImage', 'esri/SpatialReference'])
    //   .then(([MapImageLayer, Extent, MapImage, SpatialReference]) => {
    //     const gdLayer = this.map.getLayer(layerName);
    //     if (gdLayer) {
    //       const images = gdLayer.getImages();
    //       if (images != null) {
    //         for (let i = 0; i < images.length; ++i) {
    //           gdLayer.removeImage(images[i]);
    //         }
    //       }
    //       const extent = new Extent(106.7890, 32.6360, 111.1450, 36.2296, new SpatialReference({
    //         wkid: 4326
    //       }));
    //       const mi = new MapImage({
    //         'extent': extent,
    //         'href': imgUrl,
    //         'width': 800,
    //         'height': 600
    //       });
    //       gdLayer.addImage(mi);
    //     }
    //     return this.map;
    //   });
  }

  InitStationLayer(layerid: String, stations: Station[]) {
    // esriLoad.loadModules(['esri/geometry/Point', 'esri/symbols/PictureMarkerSymbol', 'esri/graphic', 'esri/InfoTemplate'])
    //   .then(([Point, PictureMarkerSymbol, Graphic, InfoTemplate]) => {
    //     const ly = this.map.getLayer(layerid);
    //     if (!ly) { return; }
    //     const symbol = new PictureMarkerSymbol({ url: '../../assets/Images/station.png', width: 15, height: 15 });
    //     const infoTemplate = new InfoTemplate(
    //       '${stationname}',
    //       '</br><b>城市:西安</b></br><b>区县:${county}</b></br><b>站号:${stationnum}</b>'
    //     );
    //     stations.forEach(ele => {
    //       const pt = new Point({ latitude: ele.latitude.valueOf(), longitude: ele.longitude.valueOf() });
    //       const graphic = new Graphic(pt, symbol, ele, infoTemplate);
    //       ly.add(graphic);
    //     });
    //   });
  }

  ChangeMapType(type: Number) {
    // if (type === 1) {
    //   this.verctorLayer.show();
    //   this.terrainLayer.hide();
    // } else {
    //   this.verctorLayer.hide();
    //   this.terrainLayer.show();
    // }
  }

  ShowOrHideLayer(layerName: String, visiable: Boolean) {
    const gdLayer = this.map.getLayer(layerName);
    if (gdLayer) {
      if (visiable === true) {
        gdLayer.show();
      } else {
        gdLayer.hide();
      }
    }
  }

  centerAndZoom(lon: Number, lat: Number, level: Number) {
    // esriLoad.loadModules(['esri/geometry/Point']).then(([Point]) => {
    //   const pt = new Point(lon, lat);
    //   this.map.centerAndZoom(pt, level);
    // });
  }
}
