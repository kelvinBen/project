import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomEsriService } from '../custom-esri/custom-esri.service';
import { ApiServiceService } from '../api-service/api-service.service';
import { Station } from '../models/stations';
import { AgGridNg2 } from 'ag-grid-angular';
import { ApiResult, CimissResult, CimissHour, ApiHour } from '../models/cimiss';
import { HourRain, HourPress, HourTemp, HourWind } from '../models/hour';
import moment from 'moment-es6';
@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {
  getContextMenuItems: any;
  rainsGrid: HourRain[] = [];
  pressGrid: HourPress[] = [];
  tempsGrid: HourTemp[] = [];
  windsGrid: HourWind[] = [];
  xmin: Number = 107.500; // 格点经纬度范围
  xmax: Number = 110.000;
  ymin: Number = 33.500;
  ymax: Number = 35.000;
  rains= [];
  press = [];
  temps: HourTemp[] = [];
  winds = [];
  stations: Station[] = [];
  mapType: Number = 1;
  boundaryLy: Boolean = true;
  stationLy: Boolean = true;
  typeList = ['降水', '气温', '变压', '极大风'];
  selType: String = '降水';
  cityList: String[] = ['全市', '城区', '周至', '鄠邑', '长安', '蓝田', '临潼', '高陵', '阎良', '灞桥', '西咸新区'];
  selCity: String = '全市';
  countyList: String[] = ['城六区', '新城', '碑林', '莲湖', '未央', '雁塔', '灞桥'];
  selCounty: String = '城六区';
  sDate: String = moment().add(-24, 'hours').format('YYYY-MM-DD HH');
  eDate: String = moment().format('YYYY-MM-DD HH');
  hourConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  @ViewChild('hourGrid') hourGrid: AgGridNg2;
  @ViewChild('map') mapEl: ElementRef;
  constructor(private _http: HttpClient,
    public _esriLoad: CustomEsriService, private _apiService: ApiServiceService) {
    this.getContextMenuItems = function (params) {
      console.log(1);
    };
  }
  ngOnInit() {
    const mapProperties: __esri.MapProperties = {};
    const mapViewProperties: __esri.MapViewProperties = {
      center: {
        x: (this.xmax.valueOf() + this.xmin.valueOf()) / 2,
        y: (this.ymax.valueOf() + this.ymin.valueOf()) / 2
      },
      zoom: 9
    };
    this._esriLoad.loadMap(mapProperties, mapViewProperties, this.mapEl);

    //this._esriLoad.LoadMap('esriMap').then(mapResult => {
      //this._esriLoad.CreateGraphicsLayer('station', 1, this.stationLy).then(result => {
      //  this.initStation();
      //});
   // });
  }

  initStation() {
    // this._http.get('http://10.172.99.15:3000/stationinfo?cityid=eq.10').subscribe(result => {
    //   this.stations = result as Station[];
    //   this._esriLoad.InitStationLayer('station', this.stations);

    // });
    this._apiService.getStations().subscribe(result => {
    //this._http.get('http://47.98.32.177:7100/station/city?cityid=10').subscribe(result => {
      const dt = result as ApiResult;
      if (dt && dt.returnCode === 0) {
        this.stations = dt.DS as Station[];
        this._esriLoad.InitStationLayer('station', this.stations);
      }
    })
  }

  initGrid() {
    if (!this.hourGrid.api) { return; }
    if (this.selType === '降水') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '站号', field: 'station.stationnum', width: 70 },
        { headerName: '站名', field: 'station.stationname', width: 110 },
        { headerName: '累计雨量', field: 'totalrain', width: 100, sort: 'desc' },
        { headerName: '极大雨量', field: 'maxvalue', width: 100 },
        { headerName: '发生时间', field: 'maxtime', width: 100 }
      ]);
      this.queryRain();
    } else if (this.selType === '气温') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '站号', field: 'station.stationnum', width: 70 },
        { headerName: '站名', field: 'station.stationname', width: 100 },
        { headerName: '最近1h T', field: 'TEM', width: 90, sort: 'desc' },
        { headerName: '区间 Tmax', field: 'TEM_Max', width: 90 },
        { headerName: '出现时间', field: 'TEM_Max_OTime', width: 110 },
        { headerName: '区间 Tmin', field: 'TEM_Min', width: 90 },
        { headerName: '出现时间', field: 'TEM_Min_OTime', width: 110 }
      ]);
      this.queryTemp();
    } else if (this.selType === '变压') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '站号', field: 'station.stationnum', width: 70 },
        { headerName: '站名', field: 'station.stationname', width: 110 },
        { headerName: '气压', field: 'PRS', width: 90, sort: 'desc' },
        { headerName: '3h变压', field: 'PRS_Change_3h', width: 105 },
        { headerName: '24h变压', field: 'PRS_Change_24h', width: 105 }
      ]);
      this.queryPress();
    } else if (this.selType === '极大风') {
      this.hourGrid.api.setColumnDefs([
        { headerName: '站号', field: 'station.stationnum', width: 70 },
        { headerName: '站名', field: 'station.stationname', width: 100 },
        { headerName: '最近1h Vmax', field: 'WIN_S', width: 110, sort: 'desc' },
        { headerName: '风级', field: 'WIND_S_Level', width: 60 },
        { headerName: '极大风向', field: 'WIN_D', width: 90 },
        { headerName: '区间 Vmax', field: 'WIN_S_Inst_Max', width: 110 },
        { headerName: '风级', field: 'WIND_S_INST_Level', width: 60 },
        { headerName: '极大风向', field: 'WIN_D_INST_Max', width: 110 },
        { headerName: '出现时间', field: 'WIN_S_INST_Max_OTime', width: 90 },
      ]);
      this.queryWind();
    }
  }
  // "WIN_S_Max": "999999",
  // "WIN_D_INST_Max": "999999",
  // "WIN_S_Inst_Max": "999999",
  // "Station_Id_C": "V8721",
  // "Datetime": "2018-07-09 13:00:00",
  // "WIN_D_S_Max": "999999",
  // "WIN_S_INST_Max_OTime": "1970-01-01 08:16:40"
  queryRain() {
    this.rains = this.rainsGrid = [];

    // let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    // rainUrl += 'elements=Station_Id_C,Datetime,PRE_1h';
    // rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&timeRange=(';
    // const sdt = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
    // const edt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
    // rainUrl += sdt.format('YYYYMMDDHH') + '0000,';
    // rainUrl += edt.format('YYYYMMDDHH') + '0000]';
    // let rainUrl:String = 'http://47.98.32.177:7100';
    const sdt = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYYMMDDHH');
    const edt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYYMMDDHH');
    this._apiService.getRainByTimeRange(sdt, edt, 10).subscribe(result => {
      const dt = result as ApiResult;
      if (dt && dt.returnCode === 0) {
        const dts = dt.DS as HourRain[];
        console.log(dts);
        if (dts && dts.length > 0) {
          this.initRainArray(dts);
        } else {
          this.initRainArray([]);
        }
      }
    }

    )
  }
  initRainArray(data: HourRain[]) {
    const ary = [];
    this.stations.forEach(station => {
      // const rain = new HourRain();
      // rain.station = station;
      // rain.Rain = rain.MaxRain = rain.LastRain = 0;
      let dts = data.filter(s => s.stationIdC === station.stationnum);
      if(dts.length>0){
         const rain = {
        "station": station,
        "totalrain": dts[0].totalrain > 9999? 0 :(dts[0].totalrain).toFixed(1),
        "maxvalue": dts[0].maxvalue,
        "maxtime": dts[0].maxtime
      }
      ary.push(rain);
      }
     
      // if (dts && dts.length > 0) {
      //   rain.LastRain = this.calRain(dts[dts.length - 1].PRE_1h);
      // }
      // dts.forEach(dt => {
      //   const r = this.calRain(dt.PRE_1h);
      //   rain.Rain += r;
      //   if (r >= rain.MaxRain) {
      //     rain.MaxRain = r;
      //     const maxtime = moment(dt.Datetime.valueOf());
      //     if (maxtime) {
      //       rain.MaxTime = maxtime.add(8, 'hours').format('DD日HH时');
      //     }
      //   }
      // });
      // rain.totalrain =dts[0].totalrain ;
     
    });
    this.rains = ary;
    console.log(this.rains);
    this.filterRainGrid();
  }
  filterRainGrid() {
    if (this.selCity === '全市') {
      this.rainsGrid = this.rains;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.rainsGrid = this.rains.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.rainsGrid = this.rains.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.rainsGrid = this.rains.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.hourGrid.api) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: this.rainsGrid });
    }
  }

  queryTemp() {
    this.temps = this.tempsGrid = [];
    // let tempUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // tempUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    // tempUrl += 'elements=Station_Id_C,Datetime,TEM,TEM_Max_OTime,TEM_Max,TEM_Min,TEM_Min_OTime';
    // tempUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&timeRange=(';
    const sdt = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYYMMDDHH');
    const edt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYYMMDDHH');
    this._apiService.getTempByTimeRange(sdt, edt, 10).subscribe(result => {
      const dt = result as ApiResult;
      if (dt && dt.returnCode === 0) {
        const dts = dt.DS as HourTemp[];
        if (dts && dts.length > 0) {
          console.log(dts)
          // this.initTempArray(dts);
        } else {
          // this.initTempArray([]);
        }
      }
    });
  }
  // initTempArray(data: HourTemp[]) {
  //   const ary: HourTemp[] = [];
  //   this.stations.forEach(station => {
  //     const temp = new HourTemp();
  //     temp.station = station;
  //     const dts = data.filter(s => s.Station_Id_C === station.stationnum).sort(function (a, b) {
  //       return moment(a.Datetime.valueOf()).toDate().getTime() - moment(b.Datetime.valueOf()).toDate().getTime();
  //     });
  //     const standTime = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYY-MM-DD HH') + ':00:00';
  //     if (dts && dts.length > 0) {
  //       for (let i = 0; i < dts.length; ++i) {
  //         const dt = dts[i];
  //         const maxT = this.formatValue(dt.TEM_Max);
  //         const minT = this.formatValue(dt.TEM_Min);
  //         const st = moment(dt.Datetime.valueOf()).format('YYYYMMDDHH');

  //         if (dt.Datetime === standTime) {
  //           temp.TEM = this.formatValue(dt.TEM);
  //         }

  //         if (i === 0) {
  //           temp.TEM_Max = maxT;
  //           temp.TEM_Min = minT;
  //           if (dt.TEM_Max_OTime.length === 3) {
  //             dt.TEM_Max_OTime = '0' + dt.TEM_Max_OTime;
  //           }
  //           if (dt.TEM_Min_OTime.length === 3) {
  //             dt.TEM_Min_OTime = '0' + dt.TEM_Min_OTime;
  //           }
  //           if (dt.TEM_Max_OTime.length === 4) {
  //             temp.TEM_Max_OTime = moment(st + dt.TEM_Max_OTime, 'YYYYMMDDHHmmss').add(8, 'hours').format('DD日HH时mm分');
  //           }
  //           if (dt.TEM_Min_OTime.length === 4) {
  //             temp.TEM_Min_OTime = moment(st + dt.TEM_Min_OTime, 'YYYYMMDDHHmmss').add(8, 'hours').format('DD日HH时mm分');
  //           }
  //         } else {
  //           if (temp.TEM_Min > minT) {
  //             temp.TEM_Min = minT;
  //             if (dt.TEM_Min_OTime.length === 3) {
  //               dt.TEM_Min_OTime = '0' + dt.TEM_Min_OTime;
  //             }
  //             if (dt.TEM_Min_OTime.length === 4) {
  //               temp.TEM_Min_OTime = moment(st + dt.TEM_Min_OTime, 'YYYYMMDDHHmmss').add(8, 'hours').format('DD日HH时mm分');
  //             }
  //           }
  //           if (temp.TEM_Max < maxT) {
  //             temp.TEM_Max = maxT;
  //             if (dt.TEM_Max_OTime.length === 3) {
  //               dt.TEM_Max_OTime = '0' + dt.TEM_Max_OTime;
  //             }
  //             if (dt.TEM_Max_OTime.length === 4) {
  //               temp.TEM_Max_OTime = moment(st + dt.TEM_Max_OTime, 'YYYYMMDDHHmmss').add(8, 'hours').format('DD日HH时mm分');
  //             }
  //           }
  //         }
  //       }
  //       ary.push(temp);
  //     }
  //   });  
  //   this.temps = ary;
  //   this.filterTempGrid();
  // }
  // filterTempGrid() {
  //   if (this.selCity === '全市') {
  //     this.tempsGrid = this.temps;
  //   } else if (this.selCity === '城区') {    
  //     if (this.selCounty === '城六区') {
  //       this.tempsGrid = this.temps.filter(ele => {
  //         return (ele.station.county === '西安' || ele.station.county === '新城'
  //           || ele.station.county === '碑林' || ele.station.county === '莲湖'
  //           || ele.station.county === '未央' || ele.station.county === '雁塔'
  //           || ele.station.county === '灞桥');
  //       });
  //     } else {
  //       this.tempsGrid = this.temps.filter(ele => {
  //         return ele.station.county === this.selCounty;
  //       });
  //     }
  //   } else {
  //     this.tempsGrid = this.temps.filter(ele => {
  //       return ele.station.county === this.selCity;
  //     });
  //   }
  //   if (this.hourGrid.api) {
  //     this.hourGrid.api.setRowData([]);
  //     this.hourGrid.api.updateRowData({ add: this.tempsGrid });
  //   }
  // }

  queryPress() {
    this.press = this.pressGrid = [];
    // let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    // rainUrl += 'interfaceId=getSurfEleInRectByTime&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    // rainUrl += 'elements=Station_Id_C,Datetime,PRS,PRS_Change_3h,PRS_Change_24h';
    // rainUrl += '&minLat=33.42&maxLat=35&minLon=107.4&maxLon=109.7&times=';
    const dt = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').format('YYYYMMDDHH');
    this._apiService.getPressByTime(dt,10).subscribe(result => {
      const apiDt = result as ApiResult;
      if (apiDt && apiDt.returnCode === 0) {
        const dts = apiDt.DS as HourPress[];
        if (dts && dts.length > 0) {
          this.initPressArray(dts);
        } else {
          this.initPressArray([]);
        }
      }
    });
  }
  initPressArray(data: HourPress[]) {
    const ary =[];
    this.stations.forEach(station => {
      const dts = data.filter(s => s.stationIdC === station.stationnum);
      if (dts && dts.length > 0) {
        const prs = {
          "station": station,
          "PRS": this.formatValue(dts[0].prs).toString(),
          "PRS_Change_3h":this.formatValue(dts[0].prsChange3h).toString(),
          "PRS_Change_24h": this.formatValue(dts[0].prsChange24h).toString()
        }
        ary.push(prs);
      }
    });
    this.press = ary;
    this.filterPressGrid();
  }
  filterPressGrid() {
    if (this.selCity === '全市') {
      this.pressGrid = this.press;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.pressGrid = this.press.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.pressGrid = this.press.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.pressGrid = this.press.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.hourGrid) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: this.pressGrid });
    }
  }

  queryWind() {
    this.winds = this.windsGrid = [];
    const sdt = moment(this.sDate.valueOf()).add(-8, 'hours').format('YYYYMMDDHH');
    const edt = moment(this.eDate.valueOf()).add(-8, 'hours').format('YYYYMMDDHH');
    this._apiService.getWindByTimeRange(sdt,edt,10).subscribe(result => {
      const apiDt = result as ApiResult;
      console.log(apiDt)
      if (apiDt && apiDt.returnCode === 0) {
        const dts = apiDt.DS as HourWind[];
        if (dts && dts.length > 0) {
          this.initWindArray(dts);
        } else {
          this.initWindArray([]);
        }
      }
    });
  }
  initWindArray(data: HourWind[]) {
    const ary = [];
    // const hs = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').diff(moment(this.sDate.valueOf(), 'YYYY-MM-DD HH'), 'hours');
    this.stations.forEach(station => {
      const dts = data.filter(s => s.stationIdC === station.stationnum);
      if (dts && dts.length > 0) {
        const wind = {
          "station": station,
          "WIN_S": dts[0].winSMax > 999 ? 0 :dts[0].winSMax,
          "WIN_D":dts[0].winDSMax > 999 ? 0 :dts[0].winDSMax,
          "WIND_S_Level":this.getWindlevel(dts[0].winSMax),
          "WIN_S_Inst_Max": dts[0].winSInstMax > 999? 0: dts[0].winSInstMax,
          "WIN_D_INST_Max": dts[0].winDInstMax > 999 ? 0 :  dts[0].winDInstMax,
          "WIND_S_INST_Level": this.getWindlevel(dts[0].winSInstMax),
          "WIN_S_INST_Max_OTime": dts[0].winSInstMaxOTime
        }
        ary.push(wind);
      }
    });
    this.winds = ary;
    this.filterWindGrid();
  }
  filterWindGrid() {
    if (this.selCity === '全市') {
      this.windsGrid = this.winds;
    } else if (this.selCity === '城区') {
      if (this.selCounty === '城六区') {
        this.windsGrid = this.winds.filter(ele => {
          return (ele.station.county === '西安' || ele.station.county === '新城'
            || ele.station.county === '碑林' || ele.station.county === '莲湖'
            || ele.station.county === '未央' || ele.station.county === '雁塔'
            || ele.station.county === '灞桥');
        });
      } else {
        this.windsGrid = this.winds.filter(ele => {
          return ele.station.county === this.selCounty;
        });
      }
    } else {
      this.windsGrid = this.winds.filter(ele => {
        return ele.station.county === this.selCity;
      });
    }
    if (this.hourGrid) {
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: this.windsGrid });
    }
  }

  filter() {
    if (this.selType === '降水') {
      this.filterRainGrid();
    } else if (this.selType === '变压') {
      this.filterPressGrid();
    } else if (this.selType === '气温') {
      // this.filterTempGrid();
    } else if (this.selType === '极大风') {
      this.filterWindGrid();
    }
  }

  gridDbClicked(params) {
    const row = params.data.station as Station;
    if (row) {
      this._esriLoad.centerAndZoom(row.longitude, row.latitude, 13);
    }
  }

  getWindlevel(winds: Number) {
   if(winds > 999) {return 0;} else
    if (winds > 32.7) { return 12; } else
      if (winds > 28.5) { return 11; } else
        if (winds > 24.5) { return 10; } else
          if (winds > 20.8) { return 9; } else
            if (winds > 17.2) { return 8; } else
              if (winds > 13.9) { return 7; } else
                if (winds > 10.8) { return 6; } else
                  if (winds > 8.0) { return 5; } else
                    if (winds > 5.5) { return 4; } else
                      if (winds > 3.4) { return 3; } else
                        if (winds > 1.6) { return 2; } else
                          if (winds > 0.3) { return 1; }
    return 0;
  }

  calRain(r: String): number {
    if (!r || r > '9999') { return 0; }
    return parseFloat(parseFloat(r.valueOf()).toFixed(2));
  }
  formatValue(r: String): Number {
    const d = parseFloat(r.valueOf());
    if (d > 999) {
      return 0;
    }

    return d;
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

  rainFileDown() {
    let msg = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').format('DD日HH时') + '至';
    msg += moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').format('DD日HH时') + ',';
    msg += '我市 xxx，具体雨量如下（单位毫米）';
    msg += this.getCountyRaingMsg('周至', '57032', '周至县');
    msg += this.getCountyRaingMsg('鄠邑', '57132', '鄠邑区');
    msg += this.getCountyRaingMsg('长安', '57039', '长安区');
    msg += this.getCountyRaingMsg('蓝田', '57047', '蓝田县');
    msg += this.getCountyRaingMsg('临潼', '57044', '临潼区');
    msg += this.getCountyRaingMsg('高陵', '57040', '高陵区');
    const dts0 = this.rains.filter(s => {
      return (s.station.county === '阎良' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts0.length > 0) {
      for (let i = 0; i < dts0.length; ++i) {
        if (i === 0) {
          msg += '阎良区' + dts0[i].station.stationname + dts0[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts0[i].station.stationname + dts0[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts = this.rains.filter(s => {
      return (s.station.county === '灞桥' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts.length > 0) {
      for (let i = 0; i < dts.length; ++i) {
        if (i === 0) {
          msg += '灞桥区' + dts[i].station.stationname + dts[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts[i].station.stationname + dts[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts1 = this.rains.filter(s => {
      return (s.station.county === '雁塔' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts1.length > 0) {
      for (let i = 0; i < dts1.length; ++i) {
        if (i === 0) {
          msg += '雁塔区' + dts1[i].station.stationname + dts1[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts1[i].station.stationname + dts1[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts2 = this.rains.filter(s => {
      return (s.station.county === '未央' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts2.length > 0) {
      for (let i = 0; i < dts2.length; ++i) {
        if (i === 0) {
          msg += '未央区' + dts2[i].station.stationname + dts2[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts2[i].station.stationname + dts2[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts3 = this.rains.filter(s => {
      return (s.station.county === '新城' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts3.length > 0) {
      for (let i = 0; i < dts3.length; ++i) {
        if (i === 0) {
          msg += '新城区' + dts3[i].station.stationname + dts3[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts3[i].station.stationname + dts3[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts4 = this.rains.filter(s => {
      return (s.station.county === '西咸新区' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts4.length > 0) {
      for (let i = 0; i < dts4.length; ++i) {
        if (i === 0) {
          msg += '西咸新区' + dts4[i].station.stationname + dts4[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts4[i].station.stationname + dts4[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    const dts5 = this.rains.filter(s => {
      return (s.station.county === '莲湖' && s.totalrain > 0);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    if (dts5.length > 0) {
      for (let i = 0; i < dts5.length; ++i) {
        if (i === 0) {
          msg += '莲湖区' + dts5[i].station.stationname + dts5[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts5[i].station.stationname + dts5[i].totalrain.toFixed(1) + '；';
        }
      }
    }
    msg += '加密雨量最大为';
    const dt = this.rains.sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    msg += dt[0].station.county.toString() + dt[0].station.stationname + dt[0].totalrain.toFixed(1) + '毫米。';
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    const blob = new Blob([msg]);
    aLink.href = URL.createObjectURL(blob);
    aLink.target = '_blank';
    aLink.download = 'rain.txt';
    aLink.click();
    document.body.removeChild(aLink);
  }

  getCountyRaingMsg(county: String, stn: String, countyName: String) {
    let msg = '';
    const dts = this.rains.filter(s => {
      return (s.station.county === county && s.totalrain > 0 && s.station.stationnum !== stn);
    }).sort(function (a, b) {
      return b.totalrain - a.totalrain;
    });
    const dt = this.rains.find(s => {
      return s.station.stationnum === stn;
    });
    if (dt && dt.length > 0) {
      msg += countyName + dt[0].totalrain.toFixed(1) + '、';
      if (dts.length > 0) {
        msg += dts[0].station.stationname + dts[0].totalrain.toFixed(1) + '；';
      }
    } else {
      if(dts.length>0){
            for (let i = 0; i < dts.length; ++i) {
        if (i === 0) {
          msg += countyName.valueOf() + dts[i].station.stationname + dts[i].totalrain.toFixed(1) + '、';
        } else if (i === 1) {
          msg += dts[i].station.stationname + dts[i].totalrain.toFixed(1) + '；';
        }
      }
      }
  
    }
    return msg;
  }
}
