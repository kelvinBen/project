import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomEsriService } from '../custom-esri/custom-esri.service';
import { Station } from '../models/stations';
import { AgGridNg2 } from 'ag-grid-angular';
import moment from 'moment-es6';
import { ApiServiceService } from '../api-service/api-service.service';
import { RainModel, MainModel, OtherModel } from '../models/minute';
import { ApiResult,CimissResult, CimissTenMinutePRE, CimissMainMinute, CimissOtherMinute } from '../models/cimiss';
interface shpRes{
  id:String,
  name:String,
  type:String,
  shpcontent:any;
} 
@Component({
  selector: 'app-minute',
  templateUrl: './minute.component.html',
  styleUrls: ['./minute.component.css']
})
export class MinuteComponent implements OnInit, OnDestroy {
  timer: any = null;
  mapType: Number = 1;
  boundaryLy: Boolean = true;
  stationLy: Boolean = true;
  autoCheck: Boolean = true;
  stations: Station[] = [];
  selDate: String = moment().format('YYYY-MM-DD HH:mm');
  minuteConfig = { format: 'YYYY-MM-DD HH:mm', locale: moment.locale('zh-CN') };
  cityList: String[] = ['全市', '城区', '周至', '鄠邑', '长安', '蓝田', '临潼', '高陵', '阎良', '灞桥', '西咸新区'];
  selCity: String = '全市';
  countyList: String[] = ['城六区', '新城', '碑林', '莲湖', '未央', '雁塔', '灞桥'];
  selCounty: String = '城六区';
  rainDatas= [];
  rainGridDatas = [];
  mainDatas: MainModel[] = [];
  mainGridDatas: MainModel[] = [];
  otherDatas: OtherModel[] = [];
  otherGridDatas: OtherModel[] = [];

  xmin: Number = 107.500; // 格点经纬度范围
  xmax: Number = 110.000;
  ymin: Number = 33.500;
  ymax: Number = 35.000;

  @ViewChild('rGrid') rGrid: AgGridNg2;
  @ViewChild('mainGrid') mainGrid: AgGridNg2;
  @ViewChild('otherGrid') otherGrid: AgGridNg2;
  @ViewChild('map') mapEl: ElementRef;
  constructor(private _http: HttpClient,
    public _esriLoad: CustomEsriService,private _apiService: ApiServiceService ) { }

  ngOnInit() {
    const mapProperties: __esri.MapProperties = {};
    const mapViewProperties: __esri.MapViewProperties = {
      center: {
        x: (this.xmax.valueOf() + this.xmin.valueOf()) / 2,
        y: (this.ymax.valueOf() + this.ymin.valueOf()) / 2
      },
      zoom: 9
    };

    this._esriLoad.loadMap(mapProperties, mapViewProperties, this.mapEl).then(mapResult => {
      this._esriLoad.CreateGraphicsLayer('station', 1, this.stationLy).then(result => {
        this.initStation();
      });
    });
    this._apiService.getShp().subscribe(result=>{
    //this._http.get("http://47.98.32.177:7100/shp?name=西安市&type=行政").subscribe(result=>{
      console.log(result)
    })
  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  autoLoad() {
    if (this.autoCheck) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.selDate = moment().format('YYYY-MM-DD HH:mm');
          this.loadData();
        }, 1000 * 60 * 1);
      }
    } else {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  initStation() {
    this._apiService.getStations().subscribe(result => {
    //this._http.get('http://47.98.32.177:7100/station/city?cityid=10').subscribe(result => {
      const dt = result as ApiResult;
      if (dt && dt.returnCode === 0) {
        this.stations = dt.DS as Station[];
        console.log(this.stations)
        console.log(111)
        this._esriLoad.InitStationLayer('station', this.stations);
        this.queryMRainDatas();
      this.queryMOtherDatas();
      this.queryMMainDatas();
      this.autoLoad();
      }
    })
    // this._http.get('http://10.172.99.15:3000/stationinfo?cityid=eq.10').subscribe(result => {
    //   this.stations = result as Station[];
    //   this._esriLoad.InitStationLayer('station', this.stations);
    //   this.queryMRainDatas();
    //   this.queryMOtherDatas();
    //   this.queryMMainDatas();
    //   this.autoLoad();
    // });
  }

  loadData() {
    this.queryMRainDatas();
    this.queryMOtherDatas();
    this.queryMMainDatas();
  }

  initRGrid() {
    if (!this.rGrid.api) { return; }
    this.rGrid.api.setColumnDefs([
      { headerName: '站号', field: 'station.stationnum', width: 65},
      { headerName: '站名', field: 'station.stationname', width: 80 },
      { headerName: '0-10', field: 'R1', width: 58 },
      { headerName: '0-20', field: 'R2', width: 60 },
      { headerName: '0-30', field: 'R3', width: 60 },
      { headerName: '0-40', field: 'R4', width: 60 },
      { headerName: '0-50', field: 'R5', width: 60 },
      { headerName: '0-60', field: 'R6', width: 58, sort: 'desc' }
    ]);
    this.rGrid.api.setRowData([]);
    this.rGrid.api.updateRowData({ add: this.rainGridDatas });
  }
  rGridDbClicked(params) {
    const row = params.data;
    if (row) {
      this._esriLoad.centerAndZoom(row.station.longitude, row.station.latitude, 13);
    }
  }
  queryMRainDatas() {
    this.rainDatas = this.rainGridDatas = [];
    this.rGrid.api.setRowData([]);
    this.rGrid.api.updateRowData({ add: [] });
    // let rainUrl: String = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_TENMIN_PRE&dataFormat=json&';
    // rainUrl += 'elements=Station_Id_C,PRE,Datetime,Station_Name&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&timeRange=(';
    const startDt = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').add(-8, 'hours').format('YYYYMMDDHH');
    // const endDt = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').add(-7, 'hours').format('YYYYMMDDHH') + '0000';
    // rainUrl += startDt + ',' + endDt + ']';
    this._apiService.getRainByMinute(startDt , 10).subscribe(result => {
      const dt = result as ApiResult;
      if (dt && dt.returnCode === 0) {
        const dts = dt.DS as RainModel[];
        console.log(dts);
        if (dts && dts.length > 0) {
          this.initRainArray(dts);
        } else {
          this.initRainArray([]);
        }
      }
    })
    // this._http.get(rainUrl.valueOf()).subscribe(result => {
    //   const cimissDt = result as CimissResult;
    //   if (cimissDt && cimissDt.returnCode === '0') {
    //     const rains = cimissDt.DS as CimissTenMinutePRE[];
    //     this.initRainArray(rains);
    //   } else {
    //     this.initRainArray([]);
    //   }
    // });
  }
  initRainArray(data: RainModel[]) {
    const ary= [];
    this.stations.forEach(station => {
      const dts = data.filter(s => s.stationid === station.stationnum);
      if(dts.length>0){
        const rain = {
       "station": station,
       "R1": dts[0].pre10 > 9999? 0 :(dts[0].pre10).toFixed(1),
       "R2": dts[0].pre10 > 9999? 0 :(dts[0].pre20).toFixed(1),
       "R3": dts[0].pre10 > 9999? 0 :(dts[0].pre30).toFixed(1),
       "R4": dts[0].pre10 > 9999? 0 :(dts[0].pre40).toFixed(1),
       "R5": dts[0].pre10 > 9999? 0 :(dts[0].pre50).toFixed(1),
       "R6": dts[0].pre10 > 9999? 0 :(dts[0].pre60).toFixed(1),
     }
     ary.push(rain);
    }
      // rain.station = station;
      // const d1 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 10;
      // });
      // rain.R6 = rain.R5 = rain.R4 = rain.R3 = rain.R2 = rain.R1 = d1 != null ? this.calRain(d1.PRE.valueOf()) : 0;
      // const d2 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 20;
      // });
      // if (d2) {
      //   rain.R6 = rain.R5 = rain.R4 = rain.R3 = rain.R2 = this.calRain(d2.PRE.valueOf());
      // }
      // const d3 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 30;
      // });
      // if (d3) {
      //   rain.R6 = rain.R5 = rain.R4 = rain.R3 = this.calRain(d3.PRE.valueOf());
      // }
      // const d4 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 40;
      // });
      // if (d4) {
      //   rain.R6 = rain.R5 = rain.R4 = this.calRain(d4.PRE.valueOf());
      // }
      // const d5 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 50;
      // });
      // if (d5) {
      //   rain.R6 = rain.R5 = this.calRain(d5.PRE.valueOf());
      // }
      // const d6 = dts.find(s => {
      //   return moment(s.Datetime.valueOf()).minutes() === 0;
      // });
      // if (d6) {
      //   rain.R6 = this.calRain(d6.PRE.valueOf());
      // }
      
    });
    this.rainDatas = ary;
    this.filterRainArray();
  }
  filterRainArray() {
    if (this.selCity === '全市') {
      this.rainGridDatas = this.rainDatas;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.rainGridDatas = this.rainDatas.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.rainGridDatas = this.rainDatas.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.rainGridDatas = this.rainDatas.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.rGrid) {
      this.rGrid.api.setRowData([]);
      this.rGrid.api.updateRowData({ add: this.rainGridDatas });
    }
  }

  initMainGrid() {
    if (!this.mainGrid.api) { return; }
    this.mainGrid.api.setColumnDefs([
      { headerName: '站号', field: 'station.stationnum', width: 70 },
      { headerName: '站名', field: 'station.stationname', width: 100 },
      { headerName: '温度', field: 'value.TEM', width: 70, sort: 'desc' },
      { headerName: '气压', field: 'value.PRS', width: 70 },
      { headerName: '相对湿度', field: 'value.RHU', width: 90 },
      { headerName: '平均风速', field: 'value.WIN_S_Avg_1mi', width: 90 },
      { headerName: '平均风向', field: 'value.WIN_D_Avg_1mi', width: 90 }
    ]);
    this.mainGrid.api.setRowData([]);
    this.mainGrid.api.updateRowData({ add: this.mainGridDatas });
  }
  mainGridDbClicked(params) {
    const row = params.data as MainModel;
    if (row) {
      this._esriLoad.centerAndZoom(row.station.longitude, row.station.latitude, 13);
    }
  }
  queryMMainDatas() {
    this.mainDatas = this.mainGridDatas = [];
    this.mainGrid.api.setRowData([]);
    this.mainGrid.api.updateRowData({ add: [] });
    // let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MAIN_MIN&dataFormat=json&';
    // rainUrl += 'elements=Station_Id_C,Datetime,PRS,TEM,RHU,WIN_D_Avg_1mi,WIN_S_Avg_1mi';
    // rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes(minu).add(-8, 'hours').format('YYYYMMDDHHmm');
    // rainUrl += currentDate.format('YYYYMMDDHHmm') + '00';
    this._apiService.getYwsfByMinute(currentDate, 10).subscribe(result => {
      const apiDt = result as ApiResult;
      if (apiDt && apiDt.returnCode === 0) {
        const mains = apiDt.DS as CimissMainMinute[];
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
      const dts = data.filter(s => s.Station_Id_C === station.stationnum);
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
    this.mainDatas = ary;
    console.log(this.mainDatas)
    this.filterMainArray();
  }
  filterMainArray() {
    if (this.selCity === '全市') {
      this.mainGridDatas = this.mainDatas;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.mainGridDatas = this.mainDatas.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.mainGridDatas = this.mainDatas.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.mainGridDatas = this.mainDatas.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.mainGrid) {
      this.mainGrid.api.setRowData([]);
      this.mainGrid.api.updateRowData({ add: this.mainGridDatas });
    }
  }

  initOtherGrid() {
    if (!this.otherGrid.api) { return; }
    this.otherGrid.api.setColumnDefs([
      { headerName: '站号', field: 'station.stationnum', width: 70 },
      { headerName: '站名', field: 'station.stationname', width: 100 },
      { headerName: '最高温', field: 'value.TEM_Max', width: 80, sort: 'desc' },
      { headerName: '最低温', field: 'value.TEM_Min', width: 80 },
      { headerName: '最小湿度', field: 'value.RHU_Min', width: 90 },
      { headerName: '极大风速', field: 'value.WIN_S_Inst_Max', width: 90 },
      { headerName: '极大风向', field: 'value.WIN_D_INST_Max', width: 90 }
    ]);
    this.otherGrid.api.setRowData([]);
    this.otherGrid.api.updateRowData({ add: this.otherGridDatas });
  }
  otherGridDbClicked(params) {
    const row = params.data as OtherModel;
    if (row) {
      this._esriLoad.centerAndZoom(row.station.longitude, row.station.latitude, 13);
    }
  }
  queryMOtherDatas() {
    this.otherDatas = this.otherGridDatas = [];
    this.otherGrid.api.setRowData([]);
    this.otherGrid.api.updateRowData({ add: [] });
    // let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_OTHER_MIN&dataFormat=json&';
    // rainUrl += 'elements=Station_Id_C,Datetime,PRS_Max,PRS_Min,TEM_Max,TEM_Min,RHU_Min,WIN_D_INST_Max,WIN_S_Inst_Max';
    // rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    let minu = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes().valueOf();
    minu = minu - (minu % 5);
    const currentDate = moment(this.selDate.valueOf(), 'YYYY-MM-DD HH:mm').minutes(minu).add(-8, 'hours').format('YYYYMMDDHHmm');
    // rainUrl += currentDate.format('YYYYMMDDHHmm') + '00';
    this._apiService.getOtherByMinute(currentDate, 10).subscribe(result => {
      const apiDt = result as ApiResult;
      if (apiDt && apiDt.returnCode === 0) {
        const others = apiDt.DS as CimissOtherMinute[];
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
      const dts = data.filter(s => s.Station_Id_C === station.stationnum).sort(function (a, b) {
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
    this.otherDatas = ary;
    this.filterOtherArray();
  }
  filterOtherArray() {
    if (this.selCity === '全市') {
      this.otherGridDatas = this.otherDatas;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.otherGridDatas = this.otherDatas.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.otherGridDatas = this.otherDatas.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.otherGridDatas = this.otherDatas.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.otherGrid) {
      this.otherGrid.api.setRowData([]);
      this.otherGrid.api.updateRowData({ add: this.otherGridDatas });
    }
  }

  filter() {
    this.filterRainArray();
    this.filterMainArray();
    this.filterOtherArray();
  }

  calRain(r: String): number {
    if (r > '9999') { return 0; }
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
