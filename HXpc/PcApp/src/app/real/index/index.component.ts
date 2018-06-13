import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomEsriService } from '../../custom-esri/custom-esri.service';
import { Station } from '../../models/stations';
import { CimissResult, CimissHour, CimissPREMinute, CimissTenMinutePRE } from '../../models/cimiss';
import { MinuteData, RainModel } from '../../models/minute';
import { HistoryDay } from '../../models/history';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  historyDay: HistoryDay;
  historyMinTemp: HistoryDay;
  historyRain2020: HistoryDay;
  lastHour: CimissHour = null;
  timer: any = null;
  timer1: any = null;
  map: __esri.Map;
  mapView: __esri.MapView;
  minuteRainType: Boolean = true;
  stations: Station[] = [];
  selStation: String = '57132';
  echartsIntance: any;
  option: any;
  arr_dewtemp = []; // 瞬时温度
  arr_precipitation = []; // 降水量
  arr_instantwindd = []; // 风向
  arr_instantwindv = []; // 风速
  arr_maxtemp = []; // 最高温度
  arr_mintemp = []; // 最小温度
  arr_stationpress = []; // 气压
  arr_relhumidity = []; // 湿度
  arr_time = [];
  minuteDatas: RainModel[] = [];
  minuteDatasEx: RainModel[] = [];
  hourDatas: CimissHour[] = [];
  realDatas: MinuteData[] = [];
  minuteConfig = { format: 'YYYY-MM-DD HH:mm', locale: moment.locale('zh-CN') };
  hourConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  selMinute: String = moment().format('YYYY-MM-DD HH:mm');
  selHour: String = moment().format('YYYY-MM-DD HH');
  autoMinute: String = moment().format('YYYY-MM-DD HH:mm');
  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('minuteGrid') minuteGrid: AgGridNg2;
  @ViewChild('minuteGridEx') minuteGridEx: AgGridNg2;
  @ViewChild('hourGrid') hourGrid: AgGridNg2;
  constructor(private _esriService: CustomEsriService, private _http: HttpClient) {
  }

  ngOnInit() {
    this.queryLastHourData();
    this.queryHistoryDayMaxTemp();
    this.queryHistoryDayMinTemp();
    this.queryHistoryDayRain2020();
    this.timer1 = setInterval(() => {
      this.queryLastHourData();
    }, 1000 * 60 * 20);
    this.initMinuteGrid();
    this.initHourGrid();
    this.queryStations();
  }
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.timer1) {
      clearInterval(this.timer1);
      this.timer1 = null;
    }
  }
  initMinuteGrid() {
    this.minuteGrid.gridOptions = {
      columnDefs: [
        { headerName: '区站号', field: 'station.Station_Id_C', width: 95 },
        { headerName: '站名', field: 'station.Station_Name', width: 100 },
        { headerName: '1h', field: 'R6', width: 70 },
        { headerName: '0-10', field: 'R1', width: 85 },
        { headerName: '0-20', field: 'R2', width: 85 },
        { headerName: '0-30', field: 'R3', width: 85 },
        { headerName: '0-40', field: 'R4', width: 85 },
        { headerName: '0-50', field: 'R5', width: 85 }
      ],
      rowData: this.minuteDatas
    };
  }

  initMinuteGridEx() {
    this.minuteGridEx.gridOptions = {
      columnDefs: [
        { headerName: '区站号', field: 'station.Station_Id_C', width: 80 },
        { headerName: '站名', field: 'station.Station_Name', width: 100 },
        { headerName: '1h', field: 'R6', width: 70 },
        { headerName: '0-10', field: 'R1', width: 80 },
        { headerName: '10-20', field: 'R2', width: 80 },
        { headerName: '20-30', field: 'R3', width: 80 },
        { headerName: '30-40', field: 'R4', width: 80 },
        { headerName: '40-50', field: 'R5', width: 80 }
      ],
      rowData: this.minuteDatasEx
    };
  }

  initHourGrid() {
    this.hourGrid.gridOptions = {
      columnDefs: [
        { headerName: '区站号', field: 'Station_Id_C', width: 80 },
        { headerName: '站名', field: 'Station_Name', width: 100 },
        { headerName: '气温', field: 'TEM', width: 80 },
        { headerName: '降水', field: 'PRE_1h', width: 80 },
        { headerName: '极大风速', field: 'WIN_S_Inst_Max', width: 100 },
        { headerName: '极大风向', field: 'WIN_D_INST_Max', width: 100 },
        { headerName: '气压', field: 'PRS', width: 80 },
        { headerName: '相对湿度', field: 'RHU', width: 100 },
        { headerName: '能见度', field: 'VIS', width: 80 }
      ],
      rowData: this.hourDatas
    };
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
        this.queryRealWeather();
        this.timer = setInterval(() => {
          this.queryRealWeather();
        }, 1000 * 60 * 2);
      });
    });
  }
  queryRealWeather() {
    const now = new Date();
    let minu = moment(now).minutes();
    minu = minu - (minu % 5);
    const selReal = moment(now).minutes(minu).add(-5, 'minutes');
    this.autoMinute = selReal.format('YYYY-MM-DD HH:mm');
    const currentDate = selReal.add(-8, 'hours');
    const url = 'http://www.lintongqx.com/api/minute/610125/' + currentDate.format('YYYYMMDDHHmm') + '00';
    this._http.get(url).subscribe(minResult => {
      this.realDatas = minResult as MinuteData[];
      this._esriService.setStationLayerDatas('station', currentDate.format('YYYYMMDDHHmm'), this.stations, this.realDatas);
    }, error => {
      this._esriService.setStationLayerDatas('station', currentDate.format('YYYYMMDDHHmm'), this.stations, []);
    });
  }
  queryStations() {
    this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
      this.stations = result as Station[];
      this.option = this.createOption();
      this.queryFactor();
      this.queryHour();
      this.queryMRainDatas();
      this.loadMap();
    });
  }

  // hour weather data
  queryHour() {
    this.hourDatas = [];
    const currentDate = moment(this.selHour.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours'); // 世界时
    const url = 'http://www.lintongqx.com/api/hour/610125/' + currentDate.format('YYYYMMDDHH') + '0000';
    this._http.get(url).subscribe(result => {
      this.hourDatas = result as CimissHour[];
      this.hourDatas.forEach(ele => {
        const stn = this.stations.find(s => {
          return s.Station_Id_C === ele.Station_Id_C;
        });
        if (stn) {
          ele.Station_Name = stn.Station_Name;
        }
        ele.TEM = ele.TEM === '999999' ? '' : ele.TEM;
        if (ele.PRE_1h === '999999') {
          ele.PRE_1h = '';
        } else if (ele.PRE_1h === '999998') {
          ele.PRE_1h = '微量';
        }
        ele.WIN_S_Inst_Max = ele.WIN_S_Inst_Max === '999999' ? '' : ele.WIN_S_Inst_Max;
        ele.WIN_D_INST_Max = ele.WIN_D_INST_Max === '999999' ? '' : ele.WIN_D_INST_Max;
        ele.PRS = ele.PRS === '999999' ? '' : ele.PRS;
        ele.RHU = ele.RHU === '999999' ? '' : ele.RHU;
        ele.VIS = ele.VIS === '999999' ? '' : ele.VIS;
      });
      this.hourGrid.api.setRowData([]);
      this.hourGrid.api.updateRowData({ add: this.hourDatas });
    });
  }

  // 分钟雨量
  queryMRainDatas() {
    this.minuteGrid.api.setRowData([]);
    this.minuteGrid.api.updateRowData({ add: [] });
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRectByTimeRange&dataCode=SURF_CHN_MUL_TENMIN_PRE&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,PRE,Datetime,Station_Name&&minLat=33.7&maxLat=34.3&minLon=108.35&maxLon=108.8&timeRange=(';
    const startDt = moment(this.selMinute.valueOf(), 'YYYY-MM-DD HH:mm').add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    const endDt = moment(this.selMinute.valueOf(), 'YYYY-MM-DD HH:mm').add(-7, 'hours').format('YYYYMMDDHH') + '0000';
    rainUrl += startDt + ',' + endDt + ']';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      console.log(result);
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const rains = cimissDt.DS as CimissTenMinutePRE[];
        this.initRainArray(rains);
      } else {
        this.initRainArray([]);
      }
    });
  }
  initRainArray(data: CimissTenMinutePRE[]) {
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
    if (this.minuteRainType) {
      this.initMinuteGrid();
      this.minuteDatas = ary;
      this.minuteGrid.api.setRowData([]);
      this.minuteGrid.api.updateRowData({ add: this.minuteDatas });
    } else {
      // this.initMinuteGridEx();
      // this.minuteDatasEx = aryEx;
      // this.minuteGridEx.api.setRowData([]);
      // this.minuteGridEx.api.updateRowData({ add: this.minuteDatasEx });
    }
  }
  calRain(r: String): number {
    if (r > '99990') { return 0; }
    return parseFloat(parseFloat(r.valueOf()).toFixed(2));
  }

  // echart intance
  onChartInit(ec) {
    this.echartsIntance = ec;
  }
  createOption(): any {
    return {
      title: {
        left: 'center',
        top: 0,
        textStyle: {
          color: '#555',
          fontWeight: 'normal',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          let relVal = params[0].name + '<br/>';
          if (params.length === 3) {
            relVal += params[0].seriesName + ' : ' + params[0].value + '℃' + '<br/>';
            relVal += '高温' + params[1].seriesName + ' : ' + params[1].value + '℃' + '<br/>';
            relVal += '低温' + params[2].seriesName + ' : ' + params[2].value + '℃' + '<br/>';
          } else {
            relVal += params[0].seriesName + ' : ' + params[0].value + '<br/>';
          }

          return relVal;
        }
      },
      legend: {
        data: ['温度', '极大风', '相对湿度', '气压', '降水量'],
        x: 'center',
        selectedMode: 'single'
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 1,
          rotate: 40,
        },
        data: this.arr_time
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          show: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        {
          type: 'value',
          position: 'left',
          show: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value}hpa'
          }
        },
        {
          type: 'value',
          position: 'left',
          offset: 0,
          show: true,
          scale: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value}m/s'
          }
        },
        {
          type: 'value',
          position: 'left',
          show: true,
          scale: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value}℃'
          }
        },
        {
          type: 'value',
          position: 'left',
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          show: true,
          axisLabel: {
            formatter: '{value}mm'
          }
        }
      ],
      series: [
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#37b510',
              lineStyle: {
                color: '#37b510'
              }
            }
          },
          type: 'line',
          data: this.arr_dewtemp
        },
        {
          type: 'custom',
          name: '极大风',
          yAxisIndex: 2,
          renderItem: function (params, api) {
            const point = api.coord([
              api.value(0),
              api.value(1)
            ]);
            return {
              type: 'path',
              shape: {
                pathData: 'M508.928 1024L0.512 0l515.072 299.008L1024 2.048 508.928 1024z ',
                x: -8 / 2,
                y: -20 / 2,
                width: 8,
                height: 20
              },
              position: point,
              rotation: api.value(2),
              style: api.style({
                stroke: '#633296',
                lineWidth: 1,
                color: '#633296',
                background: '#633296',
              })
            };
          },
          data: this.arr_instantwindd
        },
        {
          type: 'line',
          name: '极大风',
          itemStyle: {
            normal: {
              color: '#633296',
              lineStyle: {
                color: '#633296'
              }
            }
          },

          yAxisIndex: 2,
          symbol: 'none',
          lineStyle: {
            normal: {
              color: '#f3ed0b',
              type: 'solid'
            }
          },
          data: this.arr_instantwindv,
          z: 1
        },
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#f15626',
              lineStyle: {
                color: '#f15626'
              }
            }
          },
          data: this.arr_maxtemp
        },
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#408e84',
              lineStyle: {
                color: '#408e84'
              }
            }
          },
          data: this.arr_mintemp
        },
        {
          name: '相对湿度',
          yAxisIndex: 0,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#20a4cc',
              lineStyle: {
                color: '#20a4cc'
              }
            }
          },
          areaStyle: '#20a4cc',
          data: this.arr_relhumidity
        },
        {
          name: '气压',
          type: 'line',
          yAxisIndex: 1,
          symbolSize: 6,
          symbol: 'roundRect',

          itemStyle: {
            normal: {
              color: '#e88608',
              lineStyle: {
                color: '#e88608',
              }
            }
          },
          data: this.arr_stationpress
        },
        {
          name: '降水量',
          type: 'bar',
          symbolSize: 6,
          xAxisIndex: 0,
          itemStyle: {
            normal: {
              color: '#20a4cc',
              lineStyle: {
                color: '#20a4cc'
              }
            }
          },
          yAxisIndex: 4,
          data: this.arr_precipitation
        },
      ]
    };
  }
  queryFactor() {
    const currentDate = moment().add(-8, 'hours'); // 世界时
    const endTime = currentDate.format('YYYYMMDDHH') + '0000';
    const startTime = currentDate.add(-24, 'hours').format('YYYYMMDDHH') + '0000';
    // let parUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang';
    let parUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleByTimeRangeAndStaID';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    parUrl += '&elements=Station_ID_C,Station_Name,Lon,Lat,Datetime,PRE_1h,PRS,RHU,';
    parUrl += 'TEM,TEM_Min,TEM_Max,WIN_S_Inst_Max,WIN_D_INST_Max,VIS_Min';
    parUrl += '&staIds=' + this.selStation;
    parUrl += '&dataFormat=json&timeRange=[';
    parUrl += startTime + ',' + endTime + ']';
    this.arr_dewtemp = [];
    this.arr_instantwindd = []; // 风向
    this.arr_precipitation = []; // 降水量
    this.arr_instantwindv = []; // 风速
    this.arr_maxtemp = []; // 最高温度
    this.arr_mintemp = []; // 最小温度
    this.arr_stationpress = []; // 大气压
    this.arr_relhumidity = []; // 相对湿度
    this.arr_time = [];
    this._http.get(parUrl).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const infos = dt.DS as CimissHour[];
        infos.forEach(item => {
          const strTime = moment(item.Datetime.valueOf(), 'YYYY-MM-DD HH:mm:ss').add(8, 'hours').format('DD' + '日' + 'HH' + '时');
          this.arr_dewtemp.push(item.TEM);
          this.arr_precipitation.push(item.PRE_1h > '9999' ? 0 : item.PRE_1h);
          this.arr_instantwindd.push([strTime,
            (item.WIN_S_Inst_Max > '9999' ? 0 : item.WIN_S_Inst_Max),
            (item.WIN_D_INST_Max > '9999' ? 0 : item.WIN_D_INST_Max)]);
          this.arr_instantwindv.push(item.WIN_S_Inst_Max > '9999' ? 0 : item.WIN_S_Inst_Max);
          this.arr_maxtemp.push(item.TEM_Max > '9999' ? 0 : item.TEM_Max);
          this.arr_mintemp.push(item.TEM_Min > '9999' ? 0 : item.TEM_Min);
          this.arr_stationpress.push(item.PRS > '9999' ? 0 : item.PRS);
          this.arr_relhumidity.push(item.RHU > '9999' ? 0 : item.RHU);
          this.arr_time.push(strTime);
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
      }
    });
  }

  // 历史同期对比
  queryHourWeatherByTime() {
    const st = moment().format('YYYY-MM-DD HH:') + '00:00';
  }

  // 获取57132最新小时数据
  queryLastHourData() {
    const strTime = moment().add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    let parUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521&interfaceId=getSurfEleByTimeAndStaID';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    parUrl += '&elements=Station_ID_C,Station_Name,Datetime,PRE_1h,PRS,RHU,';
    parUrl += 'TEM,TEM_Min,TEM_Max,WIN_S_Inst_Max,WIN_D_INST_Max,VIS_Min';
    parUrl += '&staIds=57132&dataFormat=json&times=' + strTime;
    this._http.get(parUrl).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const infos = dt.DS as CimissHour[];
        if (infos.length > 0) {
          this.lastHour = infos[0];
        }
      }
    });
  }

  formatterTime(s: String) {
    return moment(s.valueOf()).format('YYYY-MM-DD HH');
  }

  queryHistoryDayMaxTemp() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfEleInHistoryBySamePeriodAndStaID&dataCode=SURF_CHN_MUL_DAY&elements=TEM_Max,Datetime&';
    url += 'dataFormat=json&staIds=57132&orderBy=TEM_Max:desc&minYear=1951&maxYear=' + moment().format('YYYY');
    url += '&minMD=' + moment().format('MMDD') + '&maxMD=' + moment().format('MMDD') + '&limitCnt=1';
    this._http.get(url.valueOf()).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const ds = dt.DS as HistoryDay[];
        if (ds && ds.length > 0) {
          this.historyDay = ds[0];
          this.historyDay.Datetime = moment(this.historyDay.Datetime.valueOf()).format('YYYY年MM月DD日');
        }
      }
    });
  }
  queryHistoryDayMinTemp() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfEleInHistoryBySamePeriodAndStaID&dataCode=SURF_CHN_MUL_DAY&elements=TEM_Min,Datetime&';
    url += 'dataFormat=json&staIds=57132&orderBy=TEM_Min:asc&minYear=1951&maxYear=' + moment().format('YYYY');
    url += '&minMD=' + moment().format('MMDD') + '&maxMD=' + moment().format('MMDD') + '&limitCnt=1';
    this._http.get(url.valueOf()).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const ds = dt.DS as HistoryDay[];
        if (ds && ds.length > 0) {
          this.historyMinTemp = ds[0];
          this.historyMinTemp.Datetime = moment(this.historyMinTemp.Datetime.valueOf()).format('YYYY年MM月DD日');
        }
      }
    });
  }
  queryHistoryDayRain2020() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfEleInHistoryBySamePeriodAndStaID&dataCode=SURF_CHN_MUL_DAY&elements=PRE_Time_2020,Datetime&';
    url += 'dataFormat=json&staIds=57132&orderBy=PRE_Time_2020:desc&minYear=1951&maxYear=' + moment().format('YYYY');
    url += '&minMD=' + moment().format('MMDD') + '&maxMD=' + moment().format('MMDD') + '&limitCnt=1&eleValueRanges=PRE_Time_2020:(,9999)';
    this._http.get(url.valueOf()).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const ds = dt.DS as HistoryDay[];
        if (ds && ds.length > 0) {
          this.historyRain2020 = ds[0];
          this.historyRain2020.Datetime = moment(this.historyRain2020.Datetime.valueOf()).format('YYYY年MM月DD日');
        }
      }
    });
  }
}
