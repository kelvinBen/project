import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherInfo } from '../../models/weather';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ForcastModel } from '../../models/forcast';
import { ActionSheetController, ActionSheet } from 'ionic-angular';
import * as moment from 'moment';
import { CimissModel } from '../../models/cimiss';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {
  stationMenus: WeatherInfo[] = [];
  stations: WeatherInfo[] = [];
  actionSheet: ActionSheet;
  listFlag: Boolean = false;
  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public storage: Storage,
    public _http: HttpClient) {

  }
  ngOnInit() {
    this._http.get('./assets/config/stations.json').subscribe(result => {
      this.stations = result as WeatherInfo[];
    });

    this.storage.get('forcast').then(result => {
      const menus = result as WeatherInfo[];
      if (menus && menus.length > 0) {
        this.stationMenus = menus;
      } else {
        this._http.get('./assets/config/stationmenu.json').subscribe(menus => {
          this.stationMenus = menus as WeatherInfo[];
        });
      }
    });
  }

  openMenu() {
    const btns = [];
    this.stations.forEach(ele => {
      const index = this.stationMenus.findIndex(s => {
        return s.StationNum === ele.StationNum;
      });
      if (index === -1) {
        btns.push({
          text: ele.StationName,
          handler: () => {
            this.stationMenus.push(ele);
            this.storage.set('forcast', this.stationMenus)
          }
        });
      }
    });
    btns.push({
      text: '取消',
      role: 'cancel'
    })
    this.actionSheet = this.actionSheetCtrl.create({
      title: '添加城市',
      buttons: btns
    });

    this.actionSheet.present();
  }
  delMenu(m: WeatherInfo) {
    const ary: WeatherInfo[] = [];
    this.stationMenus.forEach(ele => {
      if (ele.StationNum !== m.StationNum) {
        ary.push(ele);
      }
    });
    this.stationMenus = ary;
    this.storage.set('forcast', this.stationMenus);
  }
  queryForcast(m: WeatherInfo): ForcastModel[] {
    const datas: ForcastModel[] = [];
    let url = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSevpWefcRffcByTimeAndStaID &dataCode=SEVP_CHN_WEFC_RFFC';
    url += '&elements=Station_ID_C,Validtime,WEP,VIS,TEM,RHU,WIN_D,WIN_S&dataFormat=json&staIds=57034';
    url += '&time=20180108000000';
    const currentDate = moment();
    if (currentDate.hours() < 8) { // 取前一天晚上20点起报的数据
      url += currentDate.add(-1, 'days').format('YYYYMMDD') + '120000';
    } else if (currentDate.hours() < 20) {// 取当天08点起报的数据
      url += currentDate.format('YYYYMMDD') + '000000';
    } else {// 取当天20点起报的数据
      url += currentDate.format('YYYYMMDD') + '120000';
    }
    this._http.get(url).subscribe(result => {
      const cimiss = result as CimissModel;
      console.log(cimiss);
      if (cimiss && cimiss.returnCode === '0') {
        const ds = cimiss.DS as ForcastModel[];
        for (let i = 3; i <= 168; i += 3) {
          const filters = ds.filter(s => {
            return s.Validtime === i.toString()
          });
          if (filters.length > 0) {
            datas.push(filters[0]);
          }
        }
      }
      return datas
    });
    return datas;
  }
}
