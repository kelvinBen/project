import { Component, OnInit } from '@angular/core';
import { TabMenu } from '../models/menus';
@Component({
  selector: 'app-forcast',
  templateUrl: './forcast.component.html',
  styleUrls: ['./forcast.component.css']
})
export class ForcastComponent implements OnInit {
  menus: TabMenu[] = [];

  constructor() {
    this.menus = [
      { text: '智能网格', url: '/forcast/grid' },
      // { text: '七天预报', url: '/forcast/seven' },
      { text: '精细化预报', url: '/forcast/county' },
      { text: '常规预报', url: '/forcast/normal' },
      { text: '雷达', url: '/forcast/radar' },
      { text: '卫星云图', url: '/forcast/cloud' },
      { text: '箱线图', url: '/forcast/box' },
      { text: 'XANEWS', url: '/forcast/news' }
    ];
  }
  ngOnInit() {
  }

}
