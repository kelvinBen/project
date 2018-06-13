import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { CimissResult } from '../../models/cimiss';

class Forecast {
  public day: String;
  public micon: String;
  public htemp: String;
  public ltemp: String;
  public eicon: String;
  public windd: String;
  public windv: String;
}
class ForcastModel {
  public Station_ID_C: String;
  public Validtime: String;
  public WEP: String;
  public VIS: String;
  public TEM: String;
  public RHU: String;
  public WIN_D: String;
  public WIN_S: String;
}
@Component({
  selector: 'app-seven',
  templateUrl: './seven.component.html',
  styleUrls: ['./seven.component.css']
})
export class SevenComponent implements OnInit {

  datas: ForcastModel[] = [];
  constructor(public _http: HttpClient) { }

  ngOnInit() {
    this.queryForcast();
  }
  queryForcast() {
    this.datas = [];
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSevpWefcRffcByTimeAndStaID&dataCode=SEVP_CHN_WEFC_RFFC';
    url += '&elements=Datetime,Station_ID_C,Validtime,WEP,VIS,TEM,RHU,WIN_D,WIN_S&dataFormat=json&staIds=57132&time=';
    const currentDate = moment();
    url += currentDate.format('YYYYMMDD') + '000000';
    url += '&eleValueRanges=TEM:(,99999)';
    this._http.get(url).subscribe(result => {
      console.log(result);
      const cimiss = result as CimissResult;
      if (cimiss && cimiss.returnCode === '0') {
        // const dts = cimiss.DS as ForcastModel[];
        // dts.forEach(dt => {
        //   const t = dt.Validtime;
        //   if (t === '12' || t === '24' || t === '36' || t === '48' || t === '60' || t === '160' || t === '172' ||
        //     t === '72' || t === '84' || t === '96' || t === '108' || t === '120' || t === '132' || t === '148') {
        //     this.datas.push(dt);
        //   }
        // });
        // console.log(this.datas);
        // this.dataExs = [];
        // this.listDatas = [];
        // this.datas.forEach((dt, index) => {
        //   if (index < 5) {
        //     this.listDatas.push(dt);
        //   }

        //   const t = dt.Validtime;
        //   if (t === '12' || t === '24' || t === '36' || t === '48' || t === '60' ||
        //     t === '72' || t === '84' || t === '96' || t === '108' || t === '120') {
        //     this.dataExs.push(dt);
        //   }
        // });
        // this.xdata = [];
        // this.yhdata = [];
        // this.yldata = [];
        // for (let i = 0; i < 5; ++i) {
        //   const f = new Forecast();
        //   f.day = moment(this.date).add(i, 'days').format('MM月DD日');
        //   let j = 0;
        //   if (i === 0) {
        //     j = 12;
        //   } else if (i === 1) {
        //     j = 36;
        //   } else if (i === 2) {
        //     j = 60;
        //   } else if (i === 3) {
        //     j = 84;
        //   } else if (i === 4) {
        //     j = 108;
        //   }
        //   const d1 = this.dataExs.find(s => {
        //     return s.Validtime === (j + 12).toString();
        //   });
        //   const d2 = this.dataExs.find(s => {
        //     return s.Validtime === j.toString();
        //   })
        //   f.htemp = d1.TEM.valueOf();
        //   f.ltemp = d2.TEM.valueOf();
        //   f.eicon = d1.WEP;
        //   f.micon = d2.WEP;
        //   f.windd = d2.WIN_D;
        //   f.windv = d2.WIN_S;
        //   this.xdata.push(f.day);
        //   this.yhdata.push(f.htemp);
        //   this.yldata.push(f.ltemp);
        //   this.items.push(f);
        // }
      }
    });
  }
}
