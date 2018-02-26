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
  public TEM_Avg: number;
  public TEM_Max: number;
  public TEM_Min: number;
}

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {
  sDate: Date = moment().add(-15, 'days').toDate();
  eDate: Date = new Date();
  dayDatas: CimissDay[] = [];
  dayMMUTS: CimissDayMMUT19812010[] = [];
  dayGridDatas: TempGridData[] = [];
  chartDatas: TempChartData[] = [];
  @ViewChild('tGrid') tGrid: DxDataGridComponent;

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.queryTemp();
  }
  queryTemp() {
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=57132&';
    sUrl += 'elements=Station_Id_C,Station_Name,TEM_Avg,TEM_Max,TEM_Max_OTime,Datetime,TEM_Min,TEM_Min_OTime&timeRange=[';
    sUrl += moment(this.sDate).format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate).format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          const d: TempChartData = {
            TEM_Avg: parseFloat(ele.TEM_Avg.toString()),
            TEM_Min: parseFloat(ele.TEM_Min.toString()),
            TEM_Max: parseFloat(ele.TEM_Max.toString()),
            Datetime: moment(ele.Datetime.toString()).format('YYYY-MM-DD')
          };
          ary.push(d);
        });
        this.chartDatas = ary;
        this.queryHistoryDayTemp();
      }
    });
  }
  queryHistoryDayTemp() {
    let url: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010';
    url += '&elements=Station_Id_C,Station_Name,Day_Seq,TEM_Avg,TEM_Max_Avg_MMUT,TEM_Min_Avg_MMUT&';
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
              dayEx: (parseFloat(dayValue.TEM_Avg.toString()) - parseFloat(element.TEM_Avg.toString())).toFixed(1)
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
      text: arg.argumentText + '\n' + arg.seriesName + ':' + arg.valueText + '℃'
    };
  }
}
