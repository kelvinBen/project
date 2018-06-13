import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CimissResult, CimissYear, CimissStation } from '../../../models/cimiss';
import * as moment from 'moment';

@Component({
  selector: 'app-info-pass',
  templateUrl: './info-pass.component.html',
  styleUrls: ['./info-pass.component.css']
})
export class InfoPassComponent implements OnInit {
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  yearData: CimissYear;
  selYear: String = moment().add(-2, 'years').format('YYYY');
  timeConfig = { format: 'YYYY', locale: moment.locale('zh-CN') };
  constructor(private _http: HttpClient) { }

  ngOnInit() {
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
        this.query();
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
  query() {
    this.yearData = null;
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    url += '&interfaceId=getSurfEleByTimeAndStaID&dataCode=SURF_CHN_MUL_YER&dataFormat=json&staIds=' + this.selStation;
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
