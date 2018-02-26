import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CimissResult, CimissDay, CimissDayMMUT19812010 } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

class TempChartData {
  public Datetime: String;
  public EVP: number;
}
@Component({
  selector: 'app-evaporation',
  templateUrl: './evaporation.component.html',
  styleUrls: ['./evaporation.component.css']
})
export class EvaporationComponent implements OnInit {
  sDate: Date = moment().add(-15, 'days').toDate();
  eDate: Date = new Date();
  dayDatas: CimissDay[] = [];
  chartDatas: TempChartData[] = [];

  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.query();
  }
  query() {
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=57132&';
    sUrl += 'elements=Station_Id_C,Station_Name,EVP,Datetime&timeRange=[';
    sUrl += moment(this.sDate).format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate).format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          const d: TempChartData = {
            EVP: parseFloat(ele.EVP.toString()),
            Datetime: moment(ele.Datetime.toString()).format('YYYY-MM-DD')
          };
          ary.push(d);
        });
        this.chartDatas = ary;
        // this.queryHistoryDayTemp();
      }
    });
  }
  customizeTooltip(arg) {
    return {
      text: arg.argumentText + '\n' + arg.seriesName + ':' + arg.valueText + 'mm'
    };
  }
}
