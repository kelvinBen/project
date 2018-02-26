import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { CimissResult, CimissYear } from '../../../models/cimiss';

@Component({
  selector: 'app-info-pass',
  templateUrl: './info-pass.component.html',
  styleUrls: ['./info-pass.component.css']
})
export class InfoPassComponent implements OnInit {
  selYear: Number = moment().add(-2, 'years').year();
  tempList: String[] = ['0', '5', '10', '12', '15', '20', '22'];
  selTemp: String = '5';
  yearData: CimissYear;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.yearData = null;
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeAndStaID&dataCode=SURF_CHN_MUL_YER&dataFormat=json&staIds=57132';
    url += '&elements=Station_Name,ACTEM_TEM_Avg_StPas_0,ACTEM_TEM_Avg_StPas_5,ACTEM_TEM_Avg_StPas_10,';
    url += 'ACTEM_TEM_Avg_StPas_15,ACTEM_TEM_Avg_StPas_20,ACTEM_TEM_Avg_StPas_22';
    url += '&times=' + this.selYear.toString() + '0101000000';
    this._http.get(url).subscribe(result => {
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const datas = dt.DS as CimissYear[];
        datas.forEach(ele => {
          this.yearData = datas[0];
        });
      }
    });
  }
}
