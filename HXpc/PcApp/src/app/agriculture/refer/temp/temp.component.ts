import { Component, OnInit, ViewChild } from '@angular/core';
import { CimissResult, CimissDay, CimissDayMMUT19812010, CimissStation } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
class TempGridData {
  public day: CimissDay;
  public dayMMUT: CimissDayMMUT19812010;
  public dayEx: String;
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {
  echartsIntance: any;
  option: any;
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  dayDatas: CimissDay[] = [];
  dayMMUTS: CimissDayMMUT19812010[] = [];
  dayGridDatas: TempGridData[] = [];
  arr_time: String[] = [];
  arr_avg: Number[] = [];
  arr_max: Number[] = [];
  arr_min: Number[] = [];
  sDate: String = moment().add(-14, 'days').format('YYYY-MM-DD');
  eDate: String = moment().add(-1, 'days').format('YYYY-MM-DD');
  timeConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
  @ViewChild('agGrid') agGrid: AgGridNg2;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.option = this.createOption();
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getStaInfoByRegionCode&dataCode=STA_INFO_SURF_CHN&dataFormat=json&adminCodes=610000&';
    sUrl += 'staLevels=011,012,013,015&elements=Station_Id_C,Station_Name,City,Cnty,Town';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.stations = cimissDt.DS as CimissStation[];
        this.stations.forEach(stn => {
          const city = this.cityList.find(s => {
            return s === stn.City;
          });
          if (!city) { this.cityList.push(stn.City); }
        });
        this.changeCity();
        this.selStation = '57132';
      }
    });
  }
  changeCity() {
    this.stationList = this.stations.filter(s => {
      return s.City === this.selCity;
    });
    if (this.stationList.length > 0) {
      this.selStation = this.stationList[0].Station_Id_C;
    }
  }
  initGrid() {
    if (!this.agGrid.api) { return; }
    const ary = [
      { headerName: '站名', field: 'day.Station_Name', width: 80 },
      {
        headerName: '日期', field: 'day.Datetime', width: 100, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD');
        }
      },
      { headerName: '平均气温', field: 'day.TEM_Avg', width: 110 },
      { headerName: '最高气温', field: 'day.TEM_Max', width: 110 },
      { headerName: '最低气温', field: 'day.TEM_Min', width: 110 },
      { headerName: '平均气温距平', field: 'dayEx', width: 130 },
      { headerName: '30总最高气温', field: 'dayMMUT.TEM_Max_Avg_MMUT', width: 170 },
      { headerName: '30总高低气温', field: 'dayMMUT.TEM_Min_Avg_MMUT', width: 170 }
    ];
    this.agGrid.api.setColumnDefs(ary);
    this.queryTemp();
  }
  queryTemp() {
    this.arr_time = [];
    this.arr_avg = [];
    this.arr_max = [];
    this.arr_min = [];
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=';
    sUrl += this.selStation.valueOf();
    sUrl += '&elements=Station_Id_C,Station_Name,TEM_Avg,TEM_Max,TEM_Max_OTime,Datetime,TEM_Min,TEM_Min_OTime&timeRange=[';
    sUrl += moment(this.sDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          this.arr_time.push(moment(ele.Datetime.toString()).format('YYYY-MM-DD'));
          this.arr_avg.push(parseFloat(ele.TEM_Avg.toString() > '9999' ? '0' : ele.TEM_Avg.toString()));
          this.arr_max.push(parseFloat(ele.TEM_Max.toString() > '9999' ? '0' : ele.TEM_Max.toString()));
          this.arr_min.push(parseFloat(ele.TEM_Min.toString() > '9999' ? '0' : ele.TEM_Min.toString()));
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
        this.queryHistoryDayTemp();
      }
    });
  }
  queryHistoryDayTemp() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010';
    url += '&elements=Station_Id_C,Station_Name,Day_Seq,TEM_Avg,TEM_Max_Avg_MMUT,TEM_Min_Avg_MMUT&';
    url += 'dataFormat=json&staIds=' + this.selStation + '&daysOfYear=';
    let index = 0;
    let s = moment(this.sDate.valueOf(), 'YYYY-MM-DD');
    for (; s.isSameOrBefore(moment(this.eDate.valueOf(), 'YYYY-MM-DD')); s = s.add(1, 'days'), index++) {
      if (index === 0) {
        url += s.dayOfYear().toString();
      } else {
        url += ',' + s.dayOfYear();
      }
    }
    this._http.get(url.valueOf()).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        this.dayGridDatas = [];
        this.dayMMUTS = dt.DS as CimissDayMMUT19812010[];
        const ary = [];
        this.dayMMUTS.forEach(element => {
          const dayValue = this.dayDatas.find(ss => {
            return moment(ss.Datetime.toString()).dayOfYear().toString() === element.Day_Seq;
          });
          if (dayValue) {
            const d: TempGridData = {
              day: dayValue,
              dayMMUT: element,
              dayEx: (parseFloat(dayValue.TEM_Avg.toString()) - parseFloat(element.TEM_Avg.toString())).toFixed(1)
            };
            ary.push(d);
          }

        });
        this.dayGridDatas = ary;
        if (this.agGrid.api) {
          this.agGrid.api.setRowData([]);
          this.agGrid.api.updateRowData({ add: this.dayGridDatas });
        }
      }
    });
  }
  onChartInit(ec) {
    this.echartsIntance = ec;
  }
  createOption(): any {
    return {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        }
      },
      legend: {
        data: ['平均气温', '最高温度', '最低温度'],
        x: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.arr_time
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '平均气温',
          symbolSize: 6,
          // tooltip: {
          //   trigger: 'axis'
          // },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
          itemStyle: {
            normal: {
              color: '#37b510',
              lineStyle: {
                color: '#37b510'
              }
            }
          },
          type: 'line',
          data: this.arr_avg
        },
        {
          name: '最高温度',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
          type: 'line',
          itemStyle: {
            normal: {
              color: '#f15626',
              lineStyle: {
                color: '#f15626'
              }
            }
          },
          data: this.arr_max
        },
        {
          name: '最低温度',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
          type: 'line',
          itemStyle: {
            normal: {
              color: '#408e84',
              lineStyle: {
                color: '#408e84'
              }
            }
          },
          data: this.arr_min
        }
      ]
    };
  }
}
