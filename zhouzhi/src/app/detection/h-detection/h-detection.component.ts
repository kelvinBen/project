import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import * as esriLoader from 'esri-loader';
import * as moment from 'moment';

import { Stations} from '../../model/stations';
import {Info} from '../../model/info';
@Component({
  selector: 'app-h-detection',
  templateUrl: './h-detection.component.html',
  styleUrls: ['./h-detection.component.css']
})

export class HDetectionComponent implements OnInit {
  radioValue = 'A';
  infos: Info[] = [];
  infos_1: Info[]= [];
  infos_2: Info[]= [];
  year: Number= 0;
  mindate: Date;
  maxdate: Date;
  // choice: String;
  // tDatas = [
  //   {
  //     name   : 'Tab 1',
  //     content: 'Content of Tab Pane 1'
  //   },
  //   {
  //     name   : 'Tab 2',
  //     content: 'Content of Tab Pane 2'
  //   },
  //   {
  //     name   : 'Tab 3',
  //     content: 'Content of Tab Pane 3'
  //   }
  // ];
  constructor(private _http: HttpClient) { }
  ngOnInit() {
    this.createMap();
    // this.querry(choice);
  }
querry(choice){
  if( choice === 'A') {
    let min =moment(this.mindate).format('YYYYMMDDHH');
  let max =moment(this.maxdate).format('YYYYMMDDHH');
  this._http.get('http://www.lintongqx.com/wdata/autotimedata_minute?stationnum=eq.57032' +
  '&observtimes=gte.'+ min+'&observtimes=lte.'+ max + '&&order=observtimes.desc'+'&&limit=50' ).
  subscribe(result => {
    this.infos_1 = result as Info[];
   console.log(this.infos_1);
});
  console.log( min);
  }
  else if(choice === 'B'){}
  else if(choice === 'C'){}
  else if(choice === 'D'){}
  else if(choice === 'E'){}
  
}
  createMap() {
    esriLoader.dojoRequire([ 'dojo/dom-construct',
    'esri/map',
    'esri/geometry/Point',
    'esri/symbols/PictureMarkerSymbol',
    'esri/graphic',
    // 'extLayers/gaodeLayer',
    // 'esri/dijit/InfoWindowLite',
    'esri/SpatialReference',
    'esri/layers/GraphicsLayer',
    'esri/InfoTemplate',
    'dojo/domReady!'],
    (domConstruct, Map,Point,  PictureMarkerSymbol, Graphic,  SpatialReference, GraphicsLayer, InfoTemplate
      //  gaodeLayer, 
      //  InfoWindowLite, 
      ) => {
         const map = new Map('viewDiv', {
          center: [108.2064, 34.1441 ],
          zoom: 10,
          sliderPosition: 'top-right',
          basemap: 'topo'
        });
        // this.baselayer = new gaodeLayer({ layertype: 'road'});
        // map.addLayer(this.baselayer);
        // const infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, map.root));
        // infoWindow.startup();
        // infoWindow.setMap(map);

        const infoLayer = new GraphicsLayer({ id: 'info', opacity: 0.9 });
        map.addLayer(infoLayer);
        const template = new InfoTemplate();
        template.setTitle('站点:${stationname}');
        template.setContent('<p>经度:${longitude} &nbsp;纬度:${latitude} &nbsp; </p>');
        const picSymbol = new PictureMarkerSymbol('../../../assets/pic.png', 18, 22);
        this._http.get('http://www.lintongqx.com/wdata/stationinfo?county=eq.周至').subscribe(result => {
          const dts = result as Stations[];
          dts.forEach(function (v) {
          // console.log(v);
          const lat = v.latitude;
          const lon = v.longitude;
          if (lon && lat) {
          const wzpt = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
          const graphic = new Graphic(wzpt, picSymbol, v, template);
          infoLayer.add(graphic);
          }
          map.addLayer(infoLayer);
          });
      });
  });
}



}

