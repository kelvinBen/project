import { Component, OnInit } from '@angular/core';
import { TabMenu } from '../models/menus';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agriculture',
  templateUrl: './agriculture.component.html',
  styleUrls: ['./agriculture.component.css']
})
export class AgricultureComponent implements OnInit {
  menus: TabMenu[] = [];
  constructor(private _http: HttpClient,
    private _router: Router) {
    this.menus = [
      { text: '农气监测', url: '/agriculture/monitor' },
      { text: '农气查询', url: '/agriculture/refer' },
      { text: '农气情报', url: '/agriculture/info' },
      // { text: '农气灾害评估与监测', url: '/agriculture/evaluate' },
      { text: '农业服务指标', url: '/agriculture/agrindex' }
    ];
  }

  ngOnInit() {
  }
  selectTab(e) {
    this._router.navigateByUrl(this.menus[e.itemIndex].url.valueOf());
  }

}
