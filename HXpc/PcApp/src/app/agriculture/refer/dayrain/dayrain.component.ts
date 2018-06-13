import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { CimissResult, CimissStation, CimissDay, CimissDayMMUT19812010 } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
class TempGridData {
  public day: CimissDay;
  public dayMMUT: CimissDayMMUT19812010;
}
@Component({
  selector: 'app-dayrain',
  templateUrl: './dayrain.component.html',
  styleUrls: ['./dayrain.component.css']
})
export class DayrainComponent implements OnInit {
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
      { headerName: '站名', field: 'day.Station_Name', width: 95 },
      {
        headerName: '日期', field: 'day.Datetime', width: 110, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD');
        }
      },
      { headerName: '20-20时降水量', field: 'day.PRE_Time_2020', width: 150 },
      { headerName: '08-08时降水量', field: 'day.PRE_Time_0808', width: 150 },
      { headerName: '1小时最大降水量', field: 'day.PRE_Max_1h', width: 150 },
      { headerName: '累年20-20时平均降水量', field: 'dayMMUT.PRE_Time_2020_MMUT', width: 210 },
      { headerName: '累年08-08时平均降水量', field: 'dayMMUT.PRE_Time_0808_MMUT', width: 210 }
    ];
    this.agGrid.api.setColumnDefs(ary);
    this.query();
  }
  query() {
    this.arr_time = [];
    this.arr_value = [];
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=';
    sUrl += this.selStation;
    sUrl += '&elements=Station_Id_C,Station_Name,Datetime,PRE_Time_2020,PRE_Time_0808,PRE_Max_1h,PRE_Max_1h_OTime&timeRange=[';
    sUrl += moment(this.sDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          this.arr_time.push(moment(ele.Datetime.toString()).format('YYYY-MM-DD'));
          this.arr_value.push(parseFloat(ele.PRE_Time_2020.toString()));
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
        this.queryHistoryDayTemp();
      }
    });
  }
  queryHistoryDayTemp() {
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010';
    url += '&elements=Station_Id_C,Station_Name,Day_Seq,PRE_Time_2020_MMUT,PRE_Time_0808_MMUT&';
    url += 'dataFormat=json&staIds=' + this.selStation.valueOf() + '&daysOfYear=';
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
              dayMMUT: element
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
        data: ['20-20时降水量'],
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
          name: '20-20时降水量',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
          type: 'bar',
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
}
