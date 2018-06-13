import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

class NormalForecastPar {
  public title: String;
}

class NormalForecastModel {
  public Name: String;
  public Time: String;
  public Title: String;
}

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})
export class NormalComponent implements OnInit {
  urlXZ: SafeResourceUrl = null; // 05
  urlXN: SafeResourceUrl = null; // 10
  urlXY: SafeResourceUrl = null; // 16
  XZList: NormalForecastModel[] = []; // 05
  XNList: NormalForecastModel[] = []; // 10
  XYList: NormalForecastModel[] = []; // 16
  XZFlag: Boolean = true; // 05
  XYFlag: Boolean = true; // 16
  XNFlag: Boolean = true; // 10
  // selDate: String = moment().add(-1, 'days').format('YYYY-MM-DD');
  // dayConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
  constructor(private _http: Http, private sanitizer: DomSanitizer, private _httpClient: HttpClient) {
  }

  ngOnInit() {
    const p1 = new NormalForecastPar();
    p1.title = '早晨预报';
    this._httpClient.post('http://10.172.99.15:3007/normalforecast/OtherForcast/GetOtherForcastListByType', p1).subscribe(result => {
      this.XZList = result as NormalForecastModel[];
    });
    p1.title = '中午预报';
    this._httpClient.post('http://10.172.99.15:3007/normalforecast/OtherForcast/GetOtherForcastListByType', p1).subscribe(result => {
      this.XNList = result as NormalForecastModel[];
    });
    p1.title = '下午预报';
    this._httpClient.post('http://10.172.99.15:3007/normalforecast/OtherForcast/GetOtherForcastListByType', p1).subscribe(result => {
      this.XYList = result as NormalForecastModel[];
    });
  }

  showContent(type: String, file: String) {
    const baseUrl = 'http://10.172.99.15:3007/normalforecast/Files/' + file;
    if (type === 'XZ') {
      this.urlXZ = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
      this.XZFlag = false;
    } else if (type === 'XN') {
      this.urlXN = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
      this.XNFlag = false;
    } else if (type === 'XY') {
      this.urlXY = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
      this.XYFlag = false;
    }
  }

}
