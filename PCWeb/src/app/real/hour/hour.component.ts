import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/stations';
import { EsriloadService } from '../../esri-service/esriload.service';
import { CimissResult, CimissHour } from '../../models/cimiss';
import { HourRain, HourPress, HourTemp, HourWind } from '../../models/hour';
import { DxDataGridComponent } from 'devextreme-angular';
import * as moment from 'moment';
@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {
  rainsGrid: HourRain[] = [];
  pressGrid: HourPress[] = [];
  tempsGrid: HourTemp[] = [];
  windsGrid: HourWind[] = [];
  typeList: String[] = [];
  selType: String;
  stations: Station[] = [];
  map: __esri.Map;
  mapView: __esri.MapView;
  sDate: Date = moment().add(-24, 'hours').toDate();
  eDate: Date = new Date();
  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('rainGrid') rainGrid: DxDataGridComponent;
  @ViewChild('pGrid') pGrid: DxDataGridComponent;
  @ViewChild('tGrid') tGrid: DxDataGridComponent;
  @ViewChild('wGrid') wGrid: DxDataGridComponent;
  constructor(private _http: HttpClient, private esriService: EsriloadService) {
    this.typeList = ['降水', '气温', '极大风'];
    this.selType = this.typeList[0];
  }
  ngOnInit() {
    this.loadMap();
  }
  loadMap() {
    const mapProperties: __esri.MapProperties = {};
    const stnlyProperties: __esri.GraphicsLayerProperties = { id: 'station', opacity: 0.8, visible: true };
    const mapViewProperties: __esri.MapViewProperties = { center: { x: 108.61, y: 34 }, zoom: 10 };
    this.esriService.loadMap(mapProperties, mapViewProperties, this.mapEl).then(mapInfo => {
      this.map = mapInfo.map;
      this.mapView = mapInfo.mapView;
      this.esriService.createGraphicsLayer(stnlyProperties).then(map => {
        this.map = map;
        this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
          this.stations = result as Station[];
          // this.loadData();
          this.esriService.initStationLayer('station', this.stations);
        });
      });
    });
  }
  loadData() {
    if (this.selType === '降水') {
      this.queryRain();
    } else if (this.selType === '变压') {
      this.queryPress();
    } else if (this.selType === '气温') {
      this.queryTemp();
    } else if (this.selType === '极大风') {
      this.queryWind();
    }
  }

  queryRain() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRE_1h';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&timeRange=(';
    const sdt = moment(this.sDate).add(-8, 'hours');
    const edt = moment(this.eDate).add(-8, 'hours');
    rainUrl += sdt.format('YYYYMMDDHH') + '0000,';
    rainUrl += edt.format('YYYYMMDDHH') + '0000]';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const dts = cimissDt.DS as CimissHour[];
        if (dts && dts.length > 0) {
          this.initRainArray(dts);
        } else {
          this.initRainArray([]);
        }
      }
    });
  }

  initRainArray(data: CimissHour[]) {
    const ary: HourRain[] = [];
    this.stations.forEach(station => {
      const rain = new HourRain();
      rain.station = station;
      rain.Rain = rain.MaxRain = rain.LastRain = 0;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        rain.LastRain = this.calRain(dts[dts.length - 1].PRE_1h);
      }
      dts.forEach(dt => {
        const r = this.calRain(dt.PRE_1h);
        rain.Rain += r;
        if (r >= rain.MaxRain) {
          rain.MaxRain = r;
          const maxtime = moment(dt.Datetime.valueOf());
          if (maxtime) {
            rain.MaxTime = maxtime.add(8, 'hours').format('DD日HH时');
          }
        }
      });
      rain.Rain = parseFloat(rain.Rain.toFixed(2));
      ary.push(rain);

    });
    this.rainsGrid = ary;
    if (this.rainGrid) {
      this.rainGrid.instance.refresh();
    }
  }

  queryTemp() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,TEM,TEM_Max_OTime,TEM_Max,TEM_Min,TEM_Min_OTime';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate).add(-8, 'hours');
    rainUrl += dt.format('YYYYMMDDHH') + '0000';
    console.log(rainUrl);
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const dts = cimissDt.DS as CimissHour[];
        if (dts && dts.length > 0) {
          this.initTempArray(dts);
        } else {
          this.initTempArray([]);
        }
      }
    });
  }

  initTempArray(data: CimissHour[]) {
    const ary: HourTemp[] = [];
    this.stations.forEach(station => {
      const temp = new HourTemp();
      temp.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        dts.forEach(dt => {
          temp.TEM = this.formatValue(dt.TEM);
          temp.TEM_Max = this.formatValue(dt.TEM_Max);
          temp.TEM_Min = this.formatValue(dt.TEM_Min);
          temp.TEM_Max_OTime = this.formatMinuteTimeString(dt.TEM_Max_OTime);
          temp.TEM_Min_OTime = this.formatMinuteTimeString(dt.TEM_Min_OTime);
        });
        ary.push(temp);
      }
    });
    this.tempsGrid = ary;
    if (this.tGrid) {
      this.tGrid.instance.refresh();
    }
  }

  queryPress() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRS,PRS_Change_3h,PRS_Change_24h';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate).add(-8, 'hours');
    rainUrl += dt.format('YYYYMMDDHH') + '0000';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const dts = cimissDt.DS as CimissHour[];
        if (dts && dts.length > 0) {
          this.initPressArray(dts);
        } else {
          this.initPressArray([]);
        }
      }
    });
  }

  initPressArray(data: CimissHour[]) {
    const ary: HourPress[] = [];
    this.stations.forEach(station => {
      const prs = new HourPress();
      prs.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        dts.forEach(dt => {
          prs.PRS = this.formatValue(dt.PRS);
          prs.PRS_Change_3h = this.formatValue(dt.PRS_Change_3h);
          prs.PRS_Change_24h = this.formatValue(dt.PRS_Change_24h);
        });
        ary.push(prs);
      }
    });
    this.pressGrid = ary;
    if (this.pGrid) {
      this.pGrid.instance.refresh();
    }
  }

  queryWind() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,WIN_D_INST_Max,WIN_S_Inst_Max,WIN_S_INST_Max_OTime';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate).add(-8, 'hours');
    rainUrl += dt.format('YYYYMMDDHH') + '0000';
    console.log(rainUrl);
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const dts = cimissDt.DS as CimissHour[];
        if (dts && dts.length > 0) {
          this.initWindArray(dts);
        } else {
          this.initWindArray([]);
        }
      }
    });
  }

  initWindArray(data: CimissHour[]) {
    const ary: HourWind[] = [];
    this.stations.forEach(station => {
      const temp = new HourWind();
      temp.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        dts.forEach(dt => {
          temp.WIN_D_INST_Max = this.formatValue(dt.WIN_D_INST_Max);
          temp.WIN_S_Inst_Max = this.formatValue(dt.WIN_S_Inst_Max);
          temp.WIN_S_INST_Max_OTime = this.formatMinuteTimeString(dt.WIN_S_INST_Max_OTime);
        });
        ary.push(temp);
      }
    });
    this.windsGrid = ary;
    if (this.wGrid) {
      this.wGrid.instance.refresh();
    }
  }
  calRain(r: String): number {
    if (r > '99990') { return 0; }
    return parseFloat(parseFloat(r.valueOf()).toFixed(2));
  }
  formatValue(r: String): String {
    if (r) {
      if (r > '9999') {
        return '';
      }
      return r;
    }
    return '';
  }
  formatMinuteTimeString(r: String): String {
    if (r.length === 3) {
      r = '0' + r;
    }
    if (r.length === 4) {
      const dt = moment(r.valueOf(), 'mmss');
      if (dt) {
        return dt.format('mm分ss秒');
      }

      return r;
    }

    return '';
  }
}
