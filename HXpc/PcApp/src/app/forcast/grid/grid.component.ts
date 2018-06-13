import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomEsriService } from '../../custom-esri/custom-esri.service';
import { GeocoderModel, GridParameter, GridResult } from '../../models/grid';
import * as moment from 'moment';
import * as echarts from 'echarts';
let controll: any;
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  selDate: String = moment().add(-1, 'days').format('YYYY-MM-DD');
  selHour: Number = 8;
  geocoder: GeocoderModel;
  xmin: Number = 107.500; // 格点经纬度范围
  xmax: Number = 110.000;
  ymin: Number = 33.500;
  ymax: Number = 35.000;
  map: __esri.Map;
  mapView: __esri.MapView;
  @ViewChild('map') mapEl: ElementRef;
  dayConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
  constructor(private _esriService: CustomEsriService, private _http: HttpClient) {
  }

  ngOnInit() {
    this.selDateValueChange(108.5841, 34.1354);
    this.loadMap();
  }
  loadMap() {
    const mapProperties: __esri.MapProperties = {};
    const mapViewProperties: __esri.MapViewProperties = { center: { x: 108.81, y: 34 }, zoom: 9 };
    const gridlyProperties: __esri.GraphicsLayerProperties = { id: 'grid', opacity: 0.8, visible: true };
    const marklyProperties: __esri.GraphicsLayerProperties = { id: 'mark', opacity: 1, visible: true };
    this._esriService.loadMap(mapProperties, mapViewProperties, this.mapEl).then(mapInfo => {
      this.map = mapInfo.map;
      this.mapView = mapInfo.mapView;
      controll = this;
      this._esriService.createGraphicsLayer(gridlyProperties).then(map => {
        this.map = map;
        this._esriService.createGrid('grid', this.xmin, this.xmax, this.ymin, this.ymax);
      });
      this._esriService.createGraphicsLayer(marklyProperties).then(map => {
        this.map = map;
        this._esriService.createMark('mark', 34.1354, 108.5841);
        this.mapView.on('click', function (evt) {
          const mapPoint = evt.mapPoint;
          controll._esriService.createMark('mark', mapPoint.latitude, mapPoint.longitude);
          controll.selDateValueChange(mapPoint.longitude, mapPoint.latitude);
        });
      });
    });
  }
  selDateValueChange(lon: Number, lat: Number) {
    const par = new GridParameter();
    par.Xmax = par.Xmin = lon;
    par.Ymax = par.Ymin = lat;
    par.Num = 14;
    par.Fhour = this.selHour;
    par.Ftime = moment(this.selDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD');
    par.Ftype = 't2m';
    par.Timeslot = 1;
    const x = (lon.valueOf() - 103) % 0.025;
    const y = (lat.valueOf() - 31) % 0.025;
    let url = 'http://restapi.amap.com/v3/geocode/regeo?key=38e2ca25ef0935f8318e258fab45bf04';
    url += '&location=' + lon.toString() + ',' + lat.toString() + '&poitype=&radius=100';
    url += '&extensions=all&batch=false&roadlevel=0';
    this._http.get(url).subscribe(geoResult => {
      this.geocoder = geoResult as GeocoderModel;
      this._http.post('gridapi/Forcast', par).subscribe(result => {
        const dts = result as GridResult[];
        this.createChart(dts, 'line', '°C', '气温', 'tChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
      par.Ftype = 'rain';
      this._http.post('gridapi/Forcast', par).subscribe(result => {
        const dts = result as GridResult[];
        this.createChart(dts, 'bar', 'mm', '降水', 'rChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
      par.Ftype = 'vis';
      this._http.post('gridapi/Forcast', par).subscribe(result => {
        const dts = result as GridResult[];
        this.createChart(dts, 'line', 'km', '能见度', 'vChart', x < 0.0125 ? 0 : 1, y < 0.0125 ? 0 : 1);
      }, err => {
        console.log(err);
      });
    });
  }

  createChart(datas: GridResult[], type: String, unit: String, Title: String, id: String, x: Number, y: Number) {
    const myChart = echarts.init(document.getElementById(id.toString()));
    const xList: String[] = [];
    const yList: Number[] = [];
    datas.forEach(ele => {
      xList.push(ele.Time);
      if (ele.Values.length === 0) {
        yList.push(null);
      } else {
        yList.push(ele.Values[x.valueOf()][y.valueOf()]);
      }
    });
    const options = {
      title: {
        text: Title
      },
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false }
        }
      },
      xAxis: {
        data: xList
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} ' + unit
        },
        min: 'dataMin'
      },
      series: [{
        name: Title,
        type: type,
        data: yList,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }]
    };
    myChart.setOption(options);
  }
}
