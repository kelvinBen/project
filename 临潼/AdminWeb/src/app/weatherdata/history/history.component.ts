import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CimissModel, CimissMonthHistoryModel } from '../../models/cimiss';
import * as moment from 'moment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  selMon: String = '';
  parUrl: String = '';
  cimissValueModels: CimissMonthHistoryModel[] = [];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.selMon = moment().format('MM');
    this.query();
  }
  initURlParameters() { // 同月地面逐月数据要素
    this.parUrl = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang';
    this.parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfMonthEleInHistoryBySameMonth';
    this.parUrl += '&elements=Station_Name,Year,Mon,TEM_Avg,TEM_Max,TEM_Min,WIN_D_INST_Max_C,WIN_S_INST_Max_ODay_C,';
    this.parUrl += 'PRE_Max_Day,Days_Max_Coti_PRE,PRE_Conti_Max,PRE_Max_Conti,PRE_Max_1h,WIN_S_Inst_Max';
    this.parUrl += '&dataFormat=json&staids=57044&month=' + this.selMon;
  }
  query() {
    this.initURlParameters();
    this._http.get(this.parUrl.valueOf()).subscribe(result => {
      const dt = result as CimissModel;
      if (dt && dt.returnCode === '0') {
        this.cimissValueModels = dt.DS as CimissMonthHistoryModel[];
        console.log(this.cimissValueModels);
      }
    }, error => { console.log(error); });
  }
  export() {
    let csv = '站名,年,月,平均气温,最高气温,最低气温,最大日降水量,最长连续降水日数,最长连续降水量,最大连续降水量,1小时最大降水量\n';
    this.cimissValueModels.forEach(ele => {
      csv += ele.Station_Name + ',' + ele.Year + ',' + ele.Mon + ',' + ele.TEM_Avg;
      csv += ',' + ele.TEM_Max + ',' + ele.TEM_Min + ',' + ele.TEM_Min + ',' + ele.PRE_Max_Day;
      csv += ',' + ele.Days_Max_Coti_PRE + ',' + ele.PRE_Conti_Max;
      csv += ',' + ele.PRE_Max_Conti + ',' + ele.PRE_Max_1h + '\n';
    });
    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  }

}
