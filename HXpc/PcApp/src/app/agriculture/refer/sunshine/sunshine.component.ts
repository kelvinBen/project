import { Component, OnInit, ViewChild } from '@angular/core';
import { CimissResult, CimissStation, CimissDay, CimissDayMMUT19812010 } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
class TempGridData {
  public day: CimissDay;
  public dayMMUT: CimissDayMMUT19812010;
  public dayEx: String;
}
@Component({
  selector: 'app-sunshine',
  templateUrl: './sunshine.component.html',
  styleUrls: ['./sunshine.component.css']
})
export class SunshineComponent implements OnInit {
  echartsIntance: any;
  option: any;
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  arr_time: String[] = [];
  arr_value: Number[] = [];
  dayDatas: CimissDay[] = [];
  dayMMUTS: CimissDayMMUT19812010[] = [];
  dayGridDatas: TempGridData[] = [];
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
      { headerName: '日照时数', field: 'day.SSH', width: 110 },
      { headerName: '日出时间', field: 'day.Sunrist_Time', width: 110 },
      { headerName: '日落时间', field: 'day.Sunset_Time', width: 110 },
      { headerName: '日照时数距平', field: 'dayEx', width: 130 },
      { headerName: '30总日照时数', field: 'dayMMUT.SSH', width: 140 }
    ];
    this.agGrid.api.setColumnDefs(ary);
    this.query();
  }
  query() {
    this.arr_time = [];
    this.arr_value = [];
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=';
    sUrl += this.selStation.valueOf();
    sUrl += '&elements=Station_Id_C,Station_Name,SSH,Datetime&timeRange=[';
    sUrl += moment(this.sDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          this.arr_time.push(moment(ele.Datetime.toString()).format('YYYY-MM-DD'));
          this.arr_value.push(parseFloat(ele.SSH.toString()));
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
        this.queryHistoryDay();
      }
    });
  }
  queryHistoryDay() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010';
    url += '&elements=Station_Id_C,Station_Name,Day_Seq,SSH&';
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
              dayEx: (parseFloat(dayValue.SSH.toString()) - parseFloat(element.SSH.toString())).toFixed(1)
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
        data: ['日照时数'],
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
          name: '日照时数',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c} 小时'
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
          data: this.arr_value
        }
      ]
    };
  }
  onChartInit(ec) {
    this.echartsIntance = ec;
  }
}
