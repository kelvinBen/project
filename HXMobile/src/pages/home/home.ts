import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppService } from '../../app/app.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { MinuteMainModel, CimissModel } from '../../models/cimiss';
import { WeatherInfo } from '../../models/weather';
import { ActionSheetController, ActionSheet } from 'ionic-angular';
import * as moment from 'moment';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  listFlag: Boolean = false;
  datas: MinuteMainModel[] = [];
  listStaions: WeatherInfo[] = [];
  stationMenus: WeatherInfo[] = [];
  actionSheet: ActionSheet;
  constructor(public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    private storage: Storage,
    private service: AppService,
    public _http: HttpClient) {
    this.storage.get('realdatas').then(val => {
      this.datas = val as MinuteMainModel[];
      this.QueryLast();
    }, error => {
      this.QueryLast();
    });
    this._http.get('./assets/config/stations.json').subscribe(result => {
      this.listStaions = result as WeatherInfo[];
    });
    this.storage.get('stationmenus').then(result => {
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

  OpenMenu() {
    const btns = [];
    this.listStaions.forEach(ele => {
      const index = this.stationMenus.findIndex(s => {
        return s.StationNum === ele.StationNum;
      });
      if (index === -1) {
        btns.push({
          text: ele.StationName,
          handler: () => {
            this.stationMenus.push(ele);
            this.storage.set('stationmenus', this.stationMenus)
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

  DelMenu(m: WeatherInfo) {
    const ary: WeatherInfo[] = [];
    this.stationMenus.forEach(ele => {
      if (ele.StationNum !== m.StationNum) {
        ary.push(ele);
      }
    });
    this.stationMenus = ary;
    if (this.stationMenus.length === 0) {
      this._http.get('./assets/config/stationmenu.json').subscribe(menus => {
        this.stationMenus = menus as WeatherInfo[];
        this.storage.set('stationmenus', this.stationMenus);
      });
    } else {
      this.storage.set('stationmenus', this.stationMenus);
    }
  }

  QueryLast() {
    this.service.QueryRealWeather().subscribe(result => {
      const cimiss = result as CimissModel;
      if (cimiss && cimiss.returnCode === '0') {
        const dts = cimiss.DS as MinuteMainModel[];
        this.storage.set('realdatas', this.datas);
        this.datas = dts;
        this.service.realDatas = this.datas;
      }
    });
  }

  DoRefresh(refresher) {
    this.service.QueryRealWeather().subscribe(result => {
      const cimiss = result as CimissModel;
      if (cimiss && cimiss.returnCode === '0') {
        const dts = cimiss.DS as MinuteMainModel[];
        this.storage.set('realdatas', this.datas);
        this.datas = dts;
        this.service.realDatas = dts;
      }
      refresher.complete();
    });
  }

  GetWeatherData(ms: WeatherInfo[]): MinuteMainModel[] {
    const ary = [];
    this.datas.forEach(data => {
      const m = ms.find(s => {
        return s.StationNum === data.Station_ID_C;
      });
      if (m) {
        ary.push(data);
      }
    });
    return ary;
  }

  FormatDateTime(time: Date): String {
    return moment(time).add(8, 'hours').format('YYYY年MM月DD日HH时mm分');
  }
}
