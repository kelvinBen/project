import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewModel } from '../models/news';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  duanLin: NewModel;
  baseUrl: String = 'http://www.lintongqx.com/rest/';
  constructor(private router: Router,
    private _http: HttpClient) { }

  ngOnInit() {
    const url = this.baseUrl + 'News?SmallClassID=eq.13&order=Time.desc&limit=1';
    this._http.get(url).subscribe(result => {// 短临预报
      const dl = result as NewModel[];
      if (dl && dl.length === 1) {
        this.duanLin = dl[0];
      }
    });
  }

  bShow(): boolean {
    const stdTime = moment(this.duanLin.TimeEx).add(6, 'hours');
    const nowTime = moment();
    return stdTime.isAfter(nowTime);
  }
  urlActive(url): boolean {
    return this.router.isActive(url, false);
  }

  isRootActive(): boolean {
    return this.router.isActive('/', true);
  }
}
