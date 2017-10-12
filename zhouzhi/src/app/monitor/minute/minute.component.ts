import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as esriLoader from 'esri-loader';
@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.css']
})
export class MinuteComponent implements OnInit {

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.createMap();
  }
  createMap() {
    esriLoader.dojoRequire(['dojo/dom-construct', 'esri/map', 'dojo/domReady!'],
      (domConstruct, Map) => {
        const map = new Map('viewDiv', {
          center: [34.109722222222224, 108.5988888888889],
          zoom: 10,
          basemap: 'topo'
        });
      });
  }

}
