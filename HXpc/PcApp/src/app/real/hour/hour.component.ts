import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/stations';
import { CustomEsriService } from '../../custom-esri/custom-esri.service';
import { CimissResult, CimissHour } from '../../models/cimiss';
import { MinuteData } from '../../models/minute';
import { HourRain, HourPress, HourTemp, HourWind } from '../../models/hour';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {
  sDate: String = moment().add(-24, 'hours').format('YYYY-MM-DD HH');
  eDate: String = moment().format('YYYY-MM-DD HH');
  autoDate: String = moment().format('YYYY-MM-DD HH');
  selType: String = '降水';
  stations: Station[] = [];
  map: __esri.Map;
  mapView: __esri.MapView;
  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('hourGrid') hourGrid: AgGridNg2;
  hourConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  constructor(private _http: HttpClient, private _esriService: CustomEsriService) {
  }
  ngOnInit() {
    this.loadMap();
  }
  loadMap() {
    const mapProperties: __esri.MapProperties = {};
    const stnlyProperties: __esri.GraphicsLayerProperties = { id: 'station', opacity: 0.8, visible: true };
    const mapViewProperties: __esri.MapViewProperties = { center: { x: 108.61, y: 34 }, zoom: 10 };
    this._esriService.loadMap(mapProperties, mapViewProperties, this.mapEl).then(mapInfo => {
      this.map = mapInfo.map;
      this.mapView = mapInfo.mapView;
      this._esriService.createGraphicsLayer(stnlyProperties).then(map => {
        this.map = map;
        this.queryReal();
      });
    });
  }
  queryReal() {
    this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
      this.stations = result as Station[];
      let url = 'http://www.lintongqx.com/api/hour/610125/';
      const dtime = moment(this.autoDate.valueOf(), 'YYYY-MM-DD HH');
      url += dtime.add(-8, 'hours').format('YYYYMMDDHH') + '0000';
      this._http.get(url).subscribe(hourResult => {
        const dts = hourResult as CimissHour[];
        const ary = [];
        dts.forEach(ele => {
          const mdata = new MinuteData();
          mdata.Station_Id_C = ele.Station_Id_C;
          mdata.TEM = ele.TEM;
          mdata.PRE = ele.PRE_1h;
          mdata.RHU = ele.RHU;
          mdata.PRS = ele.PRS;
          mdata.WIN_S_Inst_Max = ele.WIN_S_Inst_Max;
          mdata.WIN_D_INST_Max = ele.WIN_D_INST_Max;
          ary.push(mdata);
        });
        this._esriService.setStationLayerDatas('station', dtime.format('YYYYMMDDHHmm'), this.stations, ary);
      });
    });
  }
  initGrid() {
    if (!this.hourGrid.api) { return; }
    if (this.selType === '降水') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 110 },
        { headerName: '累计雨量', field: 'Rain', width: 100 },
        { headerName: '极大雨量', field: 'MaxRain', width: 110 },
        { headerName: '发生时间', field: 'MaxTime', width: 110 }
      ]);
      this.queryRain();
    } else if (this.selType === '气温') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 110 },
        { headerName: '气温', field: 'TEM', width: 100 },
        { headerName: '最高温', field: 'TEM_Max', width: 110 },
        { headerName: '出现时间', field: 'TEM_Max_OTime', width: 110 },
        { headerName: '最低温', field: 'TEM_Min', width: 110 },
        { headerName: '出现时间', field: 'TEM_Min_OTime', width: 110 }
      ]);
      this.queryTemp();
    } else if (this.selType === '极大风') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 110 },
        { headerName: '极大风速', field: 'WIN_S_Inst_Max', width: 110 },
        { headerName: '极大风向', field: 'WIN_D_INST_Max', width: 110 },
        { headerName: '出现时间', field: 'WIN_S_INST_Max_OTime', width: 110 }
      ]);
      this.queryWind();
    }
  }
  loadData() {
    this.initGrid();
  }

  queryRain() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRE_1h';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&timeRange=(';
    const sdt = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
    const edt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
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
    if (this.hourGrid.api) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: ary });
    }
  }

  queryTemp() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,TEM,TEM_Max_OTime,TEM_Max,TEM_Min,TEM_Min_OTime';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
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
    if (this.hourGrid.api) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: ary });
    }
  }

  queryWind() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,WIN_D_INST_Max,WIN_S_Inst_Max,WIN_S_INST_Max_OTime';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
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
    if (this.hourGrid.api) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: ary });
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
