import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CimissResult, CimissDay, CimissDayMMUT19812010 } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

class TempGridData {
  public day: CimissDay;
  public dayMMUT: CimissDayMMUT19812010;
  public dayEx: String;
}

class TempChartData {
  public Datetime: String;
  public SSH: number;
}

@Component({
  selector: 'app-sunshine',
  templateUrl: './sunshine.component.html',
  styleUrls: ['./sunshine.component.css']
})
export class SunshineComponent implements OnInit {
  sDate: Date = moment().add(-15, 'days').toDate();
  eDate: Date = new Date();
  dayDatas: CimissDay[] = [];
  dayMMUTS: CimissDayMMUT19812010[] = [];
  chartDatas: TempChartData[] = [];
  dayGridDatas: TempGridData[] = [];
  @ViewChild('tGrid') tGrid: DxDataGridComponent;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.query();
  }
  query() {
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=57132&';
    sUrl += 'elements=Station_Id_C,Station_Name,SSH,Datetime&timeRange=[';
    sUrl += moment(this.sDate).format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate).format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          const d: TempChartData = {
            SSH: parseFloat(ele.SSH.toString()),
            Datetime: moment(ele.Datetime.toString()).format('YYYY-MM-DD')
          };
          ary.push(d);
        });
        this.chartDatas = ary;
        this.queryHistoryDay();
      }
    });
  }
  queryHistoryDay() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010';
    url += '&elements=Station_Id_C,Station_Name,Day_Seq,SSH&';
    url += 'dataFormat=json&staIds=57132&daysOfYear=';
    let index = 0;
    for (let s = moment(this.sDate); s.isSameOrBefore(moment(this.eDate)); s = s.add(1, 'days'), index++) {
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
          const dayValue = this.dayDatas.find(s => {
            return moment(s.Datetime.toString()).dayOfYear().toString() === element.Day_Seq;
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
        if (this.tGrid) {
          this.tGrid.instance.refresh();
        }
      }
    });
  }
  customizeTooltip(arg) {
    return {
      text: arg.argumentText + '\n' + arg.seriesName + ':' + arg.valueText + '小时'
    };
  }
}
