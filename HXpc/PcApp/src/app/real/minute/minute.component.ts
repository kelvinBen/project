import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/stations';
import { CustomEsriService } from '../../custom-esri/custom-esri.service';
import { CimissResult, CimissPREMinute, CimissOtherMinute, CimissMainMinute } from '../../models/cimiss';
import { RainModel, OtherModel, MainModel, MinuteData } from '../../models/minute';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.css']
})
export class MinuteComponent implements OnInit {
  stations: Station[] = [];
  rainGridDatas: RainModel[] = [];
  otherGridDatas: OtherModel[] = [];
  mainGridDatas: MainModel[] = [];
  selType: Number = 1;
  selDate: String = moment().format('YYYY-MM-DD HH:mm');
  autoDate: String = moment().format('YYYY-MM-DD HH:mm');
  minuteConfig = { format: 'YYYY-MM-DD HH:mm', locale: moment.locale('zh-CN') };
  map: __esri.Map;
  mapView: __esri.MapView;
  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('minuteGrid') minuteGrid: AgGridNg2;
  constructor(private _http: HttpClient, private _esriService: CustomEsriService) { }

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
        this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
          this.stations = result as Station[];
          this.loadData();
          this.queryRealWeather();
        });
      });
    });
  }
  initGrid() {
    if (!this.minuteGrid.api) { return; }
    if (this.selType === 1) {
      this.minuteGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 150 },
        { headerName: '1h', field: 'R6', width: 80 },
        { headerName: '0-10', field: 'R1', width: 80 },
        { headerName: '0-20', field: 'R2', width: 80 },
        { headerName: '0-30', field: 'R3', width: 80 },
        { headerName: '0-40', field: 'R4', width: 80 },
        { headerName: '0-50', field: 'R5', width: 80 }
      ]);
      this.minuteGrid.api.setRowData([]);
      this.minuteGrid.api.updateRowData({ add: this.rainGridDatas });
    } else if (this.selType === 2) {
      this.minuteGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 110 },
        { headerName: '温度', field: 'value.TEM', width: 100 },
        { headerName: '气压', field: 'value.PRS', width: 110 },
        { headerName: '相对湿度', field: 'value.RHU', width: 110 },
        { headerName: '平均风速', field: 'value.WIN_S_Avg_1mi', width: 110 },
        { headerName: '平均风向', field: 'value.WIN_D_Avg_1mi', width: 110 }
      ]);
      this.minuteGrid.api.setRowData([]);
      this.minuteGrid.api.updateRowData({ add: this.mainGridDatas });
    } else if (this.selType === 3) {
      this.minuteGrid.api.setColumnDefs([
        { headerName: '区站号', field: 'station.Station_Id_C', width: 100 },
        { headerName: '站名', field: 'station.Station_Name', width: 110 },
        { headerName: '最高温', field: 'value.TEM_Max', width: 100 },
        { headerName: '最低温', field: 'value.TEM_Min', width: 110 },
        { headerName: '最小湿度', field: 'value.RHU_Min', width: 110 },
        { headerName: '极大风速', field: 'value.WIN_S_Inst_Max', width: 110 },
        { headerName: '极大风向', field: 'value.WIN_D_INST_Max', width: 110 }
      ]);
      this.minuteGrid.api.setRowData([]);
      this.minuteGrid.api.updateRowData({ add: this.otherGridDatas });
    }
  }
  loadData() {
    this.queryMRainDatas();
    this.queryMMainDatas();
    this.queryMOtherDatas();
  }
  queryMRainDatas() {

    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_TENMIN_PRE&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,PRE,Datetime,Station_Name&&minLat=33.7&maxLat=34.3&minLon=108.35&maxLon=108.8&timeRange=(';
    const startDt = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    const endDt = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').add(-7, 'hours').format('YYYYMMDDHH') + '0000';
    rainUrl += startDt + ',' + endDt + ']';
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
      const dts = data.filter(s => s.Station_Id_C === station.Station_Id_C);
      console.log(dts);
      const rain = new RainModel();
      rain.station = station;
      const d1 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 10;
      });
      rain.R6 = rain.R5 = rain.R4 = rain.R3 = rain.R2 = rain.R1 = d1 != null ? this.calRain(d1.PRE.valueOf()) : 0;
      const d2 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 20;
      });
      if (d2) {
        rain.R6 = rain.R5 = rain.R4 = rain.R3 = rain.R2 = this.calRain(d2.PRE.valueOf());
      }
      const d3 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 30;
      });
      if (d3) {
        rain.R6 = rain.R5 = rain.R4 = rain.R3 = this.calRain(d3.PRE.valueOf());
      }
      const d4 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 40;
      });
      if (d4) {
        rain.R6 = rain.R5 = rain.R4 = this.calRain(d4.PRE.valueOf());
      }
      const d5 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 50;
      });
      if (d5) {
        rain.R6 = rain.R5 = this.calRain(d5.PRE.valueOf());
      }
      const d6 = dts.find(s => {
        return moment(s.Datetime.valueOf()).minutes() === 0;
      });
      if (d6) {
        rain.R6 = this.calRain(d6.PRE.valueOf());
      }
      ary.push(rain);
    });
    this.rainGridDatas = ary;
    this.initGrid();
  }

  queryMMainDatas() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MAIN_MIN&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRS,TEM,RHU,WIN_D_Avg_1mi,WIN_S_Avg_1mi';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes(minu).add(-8, 'hours');
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
    this.initGrid();
  }

  queryMOtherDatas() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_OTHER_MIN&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRS_Max,PRS_Min,TEM_Max,TEM_Min,RHU_Min,WIN_D_INST_Max,WIN_S_Inst_Max';
    rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes(minu).add(-8, 'hours');
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
    this.initGrid();
  }

  queryRealWeather() {
    const now = new Date();
    let minu = moment(now).minutes();
    minu = minu - (minu % 5);
    const selReal = moment(now).minutes(minu).add(-5, 'minutes');
    this.autoDate = selReal.format('YYYY-MM-DD HH:mm');
    const currentDate = selReal.add(-8, 'hours');
    const url = 'http://www.lintongqx.com/api/minute/610125/' + currentDate.format('YYYYMMDDHHmm') + '00';
    this._http.get(url).subscribe(minResult => {
      console.log(minResult);
      const dts = minResult as MinuteData[];
      this._esriService.setStationLayerDatas('station', currentDate.format('YYYYMMDDHHmm'), this.stations, dts);
    }, error => {
      this._esriService.setStationLayerDatas('station', currentDate.format('YYYYMMDDHHmm'), this.stations, []);
    });
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
