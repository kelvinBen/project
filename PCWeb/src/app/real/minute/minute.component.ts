import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/stations';
import { EsriloadService } from '../../esri-service/esriload.service';
import { CimissResult, CimissPREMinute, CimissOtherMinute, CimissMainMinute } from '../../models/cimiss';
import { RainModel, OtherModel, MainModel } from '../../models/minute';
import { DxDataGridComponent } from 'devextreme-angular';
import * as moment from 'moment';

class MinuteTabGrid {
  public title: String;
  public index: Number;
}

@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.css']
})
export class MinuteComponent implements OnInit {
  resultTabs: MinuteTabGrid[];
  selDate: Date = new Date();
  stations: Station[] = [];
  rainGridDatas: RainModel[] = [];
  otherGridDatas: OtherModel[] = [];
  mainGridDatas: MainModel[] = [];
  map: __esri.Map;
  mapView: __esri.MapView;
  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('rainGrid') rainGrid: DxDataGridComponent;
  @ViewChild('otherGrid') otherGrid: DxDataGridComponent;
  @ViewChild('mainGrid') mainGrid: DxDataGridComponent;
  constructor(private _http: HttpClient, private esriService: EsriloadService) {
    this.resultTabs = [{ title: '十分钟雨量', index: 0 }, { title: '压温湿风', index: 1 }, { title: '其他要素', index: 2 }];
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
          this.loadData();
          this.esriService.initStationLayer('station', this.stations);
        });
      });
    });
  }

  loadData() {
    this.queryMRainDatas();
    this.queryMMainDatas();
    this.queryMOtherDatas();
  }
  queryMRainDatas() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_PRE_MIN&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,PRE,Datetime&&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const startDt = moment(this.selDate).add(-8, 'hours').format('YYYYMMDDHH');
    for (let i = 10; i < 60; i += 10) {
      rainUrl += startDt + i.toString() + '00,';
    }
    rainUrl += moment(this.selDate).add(-7, 'hours').format('YYYYMMDDHH') + '0000';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const rains = cimissDt.DS as CimissPREMinute[];
        this.initRainArray(rains);
      } else {
        this.initRainArray([]);
      }
    });
  }
  initRainArray(data: CimissPREMinute[]) {
    const ary: RainModel[] = [];
    this.stations.forEach(station => {
      const rain = new RainModel();
      rain.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      const dt = moment(this.selDate).minutes(0).seconds(0);
      for (let i = 1; i < 7; i++) {
        const stime = dt.add(-8, 'hours').add(i * 10, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        const rs = dts.filter(s => {
          return s.Datetime === stime;
        });
        if (rs && rs.length > 0) {
          const r = rs[0];
          if (r.PRE && i === 1) {
            rain.R1 = rain.R2 = rain.R3 = rain.R4 = rain.R5 = rain.R6 = this.calRain(r.PRE);
          } else if (r.PRE && i === 2) {
            rain.R2 = rain.R3 = rain.R4 = rain.R5 = rain.R6 = this.calRain(r.PRE);
          } else if (r.PRE && i === 3) {
            rain.R3 = rain.R4 = rain.R5 = rain.R6 = this.calRain(r.PRE);
          } else if (r.PRE && i === 4) {
            rain.R4 = rain.R5 = rain.R6 = this.calRain(r.PRE);
          } else if (r.PRE && i === 5) {
            rain.R5 = rain.R6 = this.calRain(r.PRE);
          } else if (r.PRE && i === 6) {
            rain.R6 = this.calRain(r.PRE);
          }
        } else {
          rain.R1 = rain.R2 = rain.R3 = rain.R4 = rain.R5 = rain.R6 = 0;
        }
      }
      ary.push(rain);
    });
    this.rainGridDatas = ary;
    if (this.rainGrid) {
      this.rainGrid.instance.refresh();
    }
  }

  queryMMainDatas() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MAIN_MIN&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRS,TEM,RHU,WIN_D_Avg_1mi,WIN_S_Avg_1mi';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate).minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate).minutes(minu).add(-8, 'hours');
    rainUrl += currentDate.format('YYYYMMDDHHmm') + '00';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const mains = cimissDt.DS as CimissMainMinute[];
        this.initMainArray(mains);
      } else {
        this.initMainArray([]);
      }
    });
  }

  initMainArray(data: CimissMainMinute[]) {
    const ary: MainModel[] = [];
    this.stations.forEach(station => {
      const rain = new MainModel();
      rain.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        rain.value = dts[0];
        rain.value.PRS = this.formatValue(rain.value.PRS);
        rain.value.TEM = this.formatValue(rain.value.TEM);
        rain.value.RHU = this.formatValue(rain.value.RHU);
        rain.value.WIN_D_Avg_1mi = this.formatValue(rain.value.WIN_D_Avg_1mi);
        rain.value.WIN_S_Avg_1mi = this.formatValue(rain.value.WIN_S_Avg_1mi);
      } else {
        rain.value = new CimissMainMinute();
        rain.value.PRS = rain.value.TEM = rain.value.RHU = '';
        rain.value.WIN_D_Avg_1mi = rain.value.WIN_D_Avg_1mi = '';
      }
      ary.push(rain);
    });
    this.mainGridDatas = ary;
    if (this.mainGrid) {
      this.mainGrid.instance.refresh();
    }
  }

  queryMOtherDatas() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_OTHER_MIN&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRS_Max,PRS_Min,TEM_Max,TEM_Min,RHU_Min,WIN_D_INST_Max,WIN_S_Inst_Max';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate).minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate).minutes(minu).add(-8, 'hours');
    rainUrl += currentDate.format('YYYYMMDDHHmm') + '00';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const others = cimissDt.DS as CimissOtherMinute[];
        this.initOhterArray(others);
      } else {
        this.initOhterArray([]);
      }
    });
  }

  initOhterArray(data: CimissOtherMinute[]) {
    const ary: OtherModel[] = [];
    this.stations.forEach(station => {
      const rain = new OtherModel();
      rain.station = station;
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C).sort(function (a, b) {
        return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
      });
      if (dts && dts.length > 0) {
        rain.value = dts[0];
        rain.value.PRS_Max = this.formatValue(rain.value.PRS_Max);
        rain.value.PRS_Min = this.formatValue(rain.value.PRS_Min);
        rain.value.RHU_Min = this.formatValue(rain.value.RHU_Min);
        rain.value.TEM_Max = this.formatValue(rain.value.TEM_Max);
        rain.value.TEM_Min = this.formatValue(rain.value.TEM_Min);
        rain.value.WIN_D_INST_Max = this.formatValue(rain.value.WIN_D_INST_Max);
        rain.value.WIN_S_Inst_Max = this.formatValue(rain.value.WIN_S_Inst_Max);
      } else {
        rain.value = new CimissOtherMinute();
        rain.value.PRS_Max = rain.value.PRS_Min = rain.value.RHU_Min = rain.value.TEM_Max = '';
        rain.value.TEM_Min = rain.value.WIN_D_INST_Max = rain.value.WIN_S_Inst_Max = '';
      }
      ary.push(rain);
    });
    this.otherGridDatas = ary;
    if (this.otherGrid) {
      this.otherGrid.instance.refresh();
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
}
