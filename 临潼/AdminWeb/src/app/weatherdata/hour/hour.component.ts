import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CimissModel, CimissValueModel, CimissStation } from '../../models/cimiss';
import * as moment from 'moment';
@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.css']
})
export class HourComponent implements OnInit {

  selTime: Date = new Date();
  selHour: Number;
  parUrl: String = '';
  stations: CimissStation[] = [];
  cimissValueModels: CimissValueModel[] = [];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.selHour = this.selTime.getHours();
    this.query();
    // this._http.get('http://www.lintongqx.com/api/station?id=610115').subscribe(data => {
    //   this.stations = data as CimissStation[];
    //   this.query();
    // });
  }
  initURlParameters() {
    const currentDate = moment(this.selTime).hours(this.selHour.valueOf()).add(-8, 'hours'); // 转化为世界时
    this.parUrl = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang';
    this.parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleInRegionByTime';
    this.parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    this.parUrl += '&elements=Station_ID_C,Station_Name,Datetime,PRE_1h,PRE_3h,';
    this.parUrl += 'PRE_6h,TEM,TEM_Min,TEM_Max,TEM_Max_OTime,TEM_Min_OTime,WIN_S_Inst_Max,WIN_S_INST_Max_OTime';
    this.parUrl += '&dataFormat=json&adminCodes=610115&times=';
    this.parUrl += currentDate.format('YYYYMMDDHH') + '0000';
  }
  query() {
    this.initURlParameters();
    this._http.get(this.parUrl.valueOf()).subscribe(result => {
      const dt = result as CimissModel;
      if (dt && dt.returnCode === '0') {
        this.cimissValueModels = dt.DS as CimissValueModel[];
      }
    }, error => { console.log(error); });
  }
  formatTime(time: string) {
    const t = moment(time).add(8, 'hours').format('YYYY-MM-DD HH');
    return t;
  }
  formatTimeEx(time: string) {
    if (time === '999999') {
      return '///';
    }
    if (time.length === 3) {
      time = '0' + time;
    }
    if (time.length !== 4) {
      return time;
    }
    const t = moment(this.selTime).hours(this.selHour.valueOf()).format('YYYYMMDDHH') + time;
    return moment(t, 'YYYYMMDDHHmmss').format('HH:mm:ss');
  }
  export() {
    let csv = '站名,区站号,时间,过去1小时降水量,过去3小时降水量,过去6小时降水量';
    csv += ',气温,最高气温,最高气温出现时间,最低气温,最低气温出现时间,极大风速,极大风速出现时间\n';
    this.cimissValueModels.forEach(ele => {
      csv += ele.Station_Name + ',' + ele.Station_ID_C + ',' + ele.Datetime + ',' + ele.PRE_1h + ',' + ele.PRE_3h + ',' + ele.PRE_6h;
      csv += ',' + ele.TEM + ',' + ele.TEM_Max + ',' + ele.TEM_Max_OTime + ',' + ele.TEM_Min + ',' + ele.TEM_Min_OTime;
      csv += ',' + ele.WIN_S_Inst_Max + ',' + ele.WIN_S_INST_Max_OTime + '\n';
    });
    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  }

}
