import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { CimissResult, CimissHYear, CimissDay } from '../../../models/cimiss';

@Component({
  selector: 'app-info-temp',
  templateUrl: './info-temp.component.html',
  styleUrls: ['./info-temp.component.css']
})
export class InfoTempComponent implements OnInit {
  sDate: Date = moment().add(-3, 'days').toDate();
  eDate: Date = moment().add(-1, 'days').toDate();
  tempList: String[] = ['0', '5', '10', '12', '15', '20', '22'];
  selTemp: String = '5';
  history: CimissHYear;
  tempData: Number = 0; // 活动积温
  tempDataEx: Number = 0; // 有效积温
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.history = null;
    this.tempData = this.tempDataEx = 0;
    this.queryHistory();
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=57132';
    url += '$elements=Station_Name,TEM_Avg&timeRange=[';
    const st = moment(this.sDate).minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate).minutes(0).seconds(0).milliseconds(0);
    url += st.format('YYYYMMDD') + '000000,';
    url += et.format('YYYYMMDD') + '000000]';
    this._http.get(url).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const datas = dt.DS as CimissDay[];
        datas.forEach(ele => {
          const t = parseFloat(ele.TEM_Avg.valueOf());
          if (t && t < 999) {
            this.tempData = this.tempData.valueOf() + t;
            this.tempDataEx = (t - parseFloat(this.selTemp.valueOf())) + this.tempDataEx.valueOf();
          }
        });
      }
    });
  }

  queryHistory() {
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfMYerEleByStaID&dataCode=SURF_CHN_YER_MMUT_19812010&dataFormat=json&staIds=57132';
    url += '&elements=Station_Name,ACTEM_TEM_Avg_StPas_' + this.selTemp;
    this._http.get(url).subscribe(result => {
      console.log(result);
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const datas = dt.DS as CimissHYear[];
        if (datas && datas.length > 0) {
          this.history = datas[0];
        }
      }
    });
  }
}
