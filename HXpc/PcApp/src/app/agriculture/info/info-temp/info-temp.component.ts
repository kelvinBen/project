import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CimissResult, CimissStation, CimissHYear, CimissDay } from '../../../models/cimiss';
import * as moment from 'moment';
@Component({
  selector: 'app-info-temp',
  templateUrl: './info-temp.component.html',
  styleUrls: ['./info-temp.component.css']
})
export class InfoTempComponent implements OnInit {
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  selTemp: Number = 5;
  history: CimissHYear;
  tempData: Number = 0; // 活动积温
  tempDataEx: Number = 0; // 有效积温
  sDate: String = moment().add(-10, 'days').format('YYYY-MM-DD');
  eDate: String = moment().format('YYYY-MM-DD');
  timeConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
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
    this.history = null;
    this.tempData = this.tempDataEx = 0;
    this.queryHistory();
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=' + this.selStation;
    url += '&elements=Station_Name,TEM_Avg&timeRange=[';
    const st = moment(this.sDate.valueOf()).minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate.valueOf()).minutes(0).seconds(0).milliseconds(0);
    url += st.format('YYYYMMDD') + '000000,';
    url += et.format('YYYYMMDD') + '000000]';
    this._http.get(url).subscribe(result => {
      console.log(result);
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const datas = dt.DS as CimissDay[];
        datas.forEach(ele => {
          const t = parseFloat(ele.TEM_Avg.valueOf());
          if (t && t < 999) {
            this.tempData = this.tempData.valueOf() + t;
            this.tempDataEx = (t - this.selTemp.valueOf()) + this.tempDataEx.valueOf();
          }
        });
      }
    });
  }

  queryHistory() {
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfMYerEleByStaID&dataCode=SURF_CHN_YER_MMUT_19812010&dataFormat=json&staIds=' + this.selStation;
    url += '&elements=Station_Name,ACTEM_TEM_Avg_StPas_' + this.selTemp;
    this._http.get(url).subscribe(result => {
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
