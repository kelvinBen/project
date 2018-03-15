import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxCheckBoxModule } from 'devextreme-angular';
import { CimissResult, CimissHMonth } from '../../../models/cimiss';
import { Element } from '../../../models/element';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-h-month',
  templateUrl: './h-month.component.html',
  styleUrls: ['./h-month.component.css']
})
export class HMonthComponent implements OnInit {
  elements: Element[] = [];
  sDate: Date = new Date();
  selUrl: String = '';
  monhDatas: CimissHMonth[] = [];
  @ViewChild('tGrid') tGrid: DxDataGridComponent;
  constructor(private _http: HttpClient) {
    this.elements = [
      { label: '极端最高气压出现年', value: 'PRS_Max_OYear', checked: true },
      { label: '最低地面气温出现年', value: 'GST_Min_OYear', checked: false },
      { label: '最低气温出现年', value: 'TEM_Min_OYear', checked: false },
      { label: '月最小气温日较差出现年', value: 'TEM_Dev_Min_OYear', checked: false },
      { label: '最大日降水量出现年', value: 'PRE_Max_OYear', checked: false },
      { label: '最长连续无降水止日', value: 'NPRE_LCDays_EDay', checked: false },
      { label: '最大积雪深度出现年', value: 'V13334_057', checked: false },
      { label: '极大风速出现年份', value: 'WIN_S_INST_Max_OYear', checked: false },
      { label: '极端最高地面温度出现年', value: 'EGST_Max_OYear', checked: false },
      { label: '最低地面温度出现时间', value: 'GST_Min_OYear_err', checked: false }
    ];
  }

  ngOnInit() {
    this.queryMon();
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

  queryMon() {
    this.setUrl();
    const newMonth = this.sDate.getMonth() + 1;
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfMMonEleByMonthsOfYearAndStaID&dataCode=SURF_CHN_MON_MMUT_19812010&dataFormat=json&staIds=57132&';
    sUrl += 'elements=Station_Id_C,Station_Name,Years_MMUT,Mon_Seq,' + this.selUrl + '&monsOfYear=' + newMonth;
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.monhDatas = cimissDt.DS as CimissHMonth[];
        if (this.tGrid) {
          this.tGrid.instance.refresh();
        }
      }
    });
  }
  formatTime(t: String) {
    if (t) {
      return moment(t.valueOf()).format('YYYY年MM月');
    }
    return '';
  }
}