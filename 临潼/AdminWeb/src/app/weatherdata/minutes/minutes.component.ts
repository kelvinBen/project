import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CimissModel, CimissValueModel, CimissStation } from '../../models/cimiss';
import * as moment from 'moment';
@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['./minutes.component.css']
})
export class MinutesComponent implements OnInit {
  selTime: Date = new Date();
  parUrl: String = '';
  cimissValueModels: CimissValueModel[] = [];
  stations: CimissStation[] = [];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('http://www.lintongqx.com/api/station?id=610115').subscribe(data => {
      this.stations = data as CimissStation[];
      this.query();
    });
  }
  initURlParameters() {
    const currentDate = moment(this.selTime).add(-8, 'hours');
    this.parUrl = 'cimiss?userId=BEXA_XIAN_liuchang';
    this.parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleInRegionByTime';
    this.parUrl += '&dataCode=SURF_CHN_OTHER_MIN';
    this.parUrl += '&elements=Station_ID_C,Station_Name,Datetime,PRE_1h,';
    this.parUrl += 'TEM_Min,TEM_Max,TEM_Max_OTime,TEM_Min_OTime,WIN_S_Inst_Max,WIN_S_INST_Max_OTime';
    this.parUrl += '&dataFormat=json&adminCodes=610115&times=';
    const min = parseInt((currentDate.minutes() / 5).toString(), null) * 5;
    this.parUrl += currentDate.format('YYYYMMDDHH') + min.toString() + '00';
  }
  query() {
    // this.initURlParameters();
    const currentDate = moment(this.selTime).add(-8, 'hours');
    const min = parseInt((currentDate.minutes() / 5).toString(), null) * 5;
    const t = currentDate.format('YYYYMMDDHH') + min.toString() + '00';
    this._http.get('http://www.lintongqx.com/api/minute/610115/' + t).subscribe(result => {
      this.cimissValueModels = result as CimissValueModel[];
    }, error => { console.log(error); });
  }
  getStationName(id: string): string {
    for (let i = 0; i < this.stations.length; ++i) {
      if (this.stations[i].Station_Id_C === id) {
        return this.stations[i].Station_Name;
      }
    }
    return id;
  }
  formatTime(time: string) {
    const t = moment(time).add(8, 'hours').format('YYYY-MM-DD HH:mm');
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
    const t = moment(this.selTime).format('YYYYMMDDHH') + time;
    return moment(t, 'YYYYMMDDHHmmss').format('HH:mm:ss');
  }
  export() {
    let csv = '站名,区站号,时间,过去1小时降水量';
    csv += ',最高气温,最高气温出现时间,最低气温,最低气温出现时间,极大风速,极大风速出现时间\n';
    this.cimissValueModels.forEach(ele => {
      csv += ele.Station_Name + ',' + ele.Station_ID_C + ',' + ele.Datetime + ',' + ele.PRE_1h;
      csv += ',' + ele.TEM_Max + ',' + ele.TEM_Max_OTime + ',' + ele.TEM_Min + ',' + ele.TEM_Min_OTime;
      csv += ',' + ele.WIN_S_Inst_Max + ',' + ele.WIN_S_INST_Max_OTime + '\n';
    });
    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  }

}
