import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  // moduleId: module.id,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  @Input()
  type: number;

  @ViewChild('mapDiv') mapEl: ElementRef;

  map: any;
  constructor(private esriLoader: EsriLoaderService) { }

  ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the API instead of the latest
      url: 'http://120.26.44.171:5558/init.js'
    }).then(() => {
      return this.esriLoader.load({
        // use a specific version of the API instead of the latest
        url: '//js.arcgis.com/3.18/'
      }).then(() => {
        // load the map class needed to create a new map
        this.esriLoader.loadModules([
          'esri/map',
          'esri/SpatialReference',
          'esri/geometry/Extent',
          'esri/layers/MapImageLayer',
          'esri/layers/MapImage'])
          .then(([Map, SpatialReference, Extent, MapImageLayer, MapImage]) => {
            // create the map at the DOM element in this component
            this.map = new Map(this.mapEl.nativeElement, {
              zoom: 11,
              logo: false,
              extent: new Extent({
                xmin: 12136065.529927589,
                ymin: 4065528.307179362,
                xmax: 12193546.175198061,
                ymax: 4118116.9826395833,
                spatialReference: { wkid: 102100 }
              })
            });
            //添加临潼地图
            var gradsLayer = new MapImageLayer({ id: "gd", opacity: 1 });
            this.map.addLayer(gradsLayer);
            var extent = new Extent(109.017, 34.268, 109.54, 34.664, new SpatialReference({ wkid: 4326 }));
            var imageURL = '../../assets/images/map.jpg';
            var mi = new MapImage({
              'extent': extent,
              'href': imageURL,
              'width': 800,
              'height': 600
            });
            gradsLayer.addImage(mi);
          });
      });
    });
  }

  //初始化站点
  initStation() {

  }

}
