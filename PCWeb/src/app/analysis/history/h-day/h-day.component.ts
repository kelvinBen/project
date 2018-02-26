import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxCheckBoxModule } from 'devextreme-angular';
import { CimissResult, CimissHDay } from '../../../models/cimiss';
import { Element } from '../../../models/element';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-h-day',
  templateUrl: './h-day.component.html',
  styleUrls: ['./h-day.component.css']
})
export class HDayComponent implements OnInit {
  checkBoxValue: boolean;
  days: String = '';
  selUrl: String = '';
  sDate: Date = new Date();
  // eDate: Date = moment().add(-1, 'days').toDate();
  dayDatas: CimissHDay[] = [];
  dayData: CimissHDay;
  elements: Element[] = [];
  constructor(private _http: HttpClient) {
    this.elements = [
      { label: '平均气温', value: 'TEM_Avg', checked: true },
      { label: '累年平均日最高气温', value: 'TEM_Max_Avg_MMUT', checked: true },
      { label: '累年平均日最低气温', value: 'TEM_Min_Avg_MMUT', checked: true },
      { label: '平均水气压', value: 'VAP_Avg', checked: false },
      { label: '累年20-20时平均降水量', value: 'PRE_Time_2020_MMUT', checked: true },
      { label: '累年08-08时平均降水量', value: 'PRE_Time_0808_MMUT', checked: true },
      { label: '平均风速', value: 'WIN_S_Avg', checked: false },
      { label: '平均地面温度', value: 'GST_Avg', checked: false },
      { label: '累年日平均最低地面温度', value: 'GST_Min_Avg_MMUT', checked: false },
      { label: '累年日平均最高地面温度	', value: 'GST_Max_Avg_MMUT', checked: false },
      { label: '日照时数', value: 'SSH', checked: false }
    ];
  }
  ngOnInit() {
    this.queryHday();
  }
  getDays() {
    const sTime = moment(this.sDate).format('YYYY') + '/01' + '/01' + ' 00:00:00';
    const sTimeM = new Date(sTime).valueOf();
    const eTimeM = (this.sDate).valueOf();
    this.days = Math.ceil((eTimeM - sTimeM) / (24 * 60 * 60 * 1000)) + '';
  }
  setUrl() {
    this.selUrl = '';
    this.elements.forEach(ele => {
      if (ele.checked) {
        if (this.selUrl === '') {
          this.selUrl = ele.value;
        } else {
          this.selUrl += ',' + ele.value;
        }
      }
    });
  }
  queryHday() {
    this.getDays();
    this.setUrl();
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfMDayEleByDaysOfYearAndStaID&dataCode=SURF_CHN_DAY_MMUT_19812010&dataFormat=json&staIds=57132&';
    sUrl += 'elements=Station_Id_C,Station_Name,Years_MMUT,Day_Seq,' + this.selUrl + '&daysOfYear=' + this.days;
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissHDay[];
        this.dayData = this.dayDatas[0];
      }
    });
  }
}
