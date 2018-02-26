import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TabMenu } from '../models/menus';
@Component({
  selector: 'app-forcast',
  templateUrl: './forcast.component.html',
  styleUrls: ['./forcast.component.css']
})
export class ForcastComponent implements OnInit {
  menus: TabMenu[] = [];
  constructor(private _http: HttpClient,
    private _router: Router) {
    this.menus = [
      // { text: '格点预报', url: '/forcast/grid' },
      // { text: '七天预报', url: '/forcast/seven' },
      // { text: '乡镇预报', url: '/forcast/county' },
      { text: '常规预报', url: '/forcast/normal' },
      { text: '雷达', url: '/forcast/radar' },
      { text: '卫星云图', url: '/forcast/cloud' }
    ];
  }

  ngOnInit() {
  }
  selectTab(e) {
    console.log(this.menus[e.itemIndex].url.valueOf());
    this._router.navigateByUrl(this.menus[e.itemIndex].url.valueOf());
  }
}
