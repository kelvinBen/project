import { Component, OnInit } from '@angular/core';
import { TabMenu } from '../models/menus';

@Component({
  selector: 'app-real',
  templateUrl: './real.component.html',
  styleUrls: ['./real.component.css']
})
export class RealComponent implements OnInit {
  menus: TabMenu[] = [];

  constructor() {
    this.menus = [
      { text: '实况', url: '/real/index' },
      { text: '分钟监测', url: '/real/minute' },
      { text: '小时监测', url: '/real/hour' },
      { text: '基本天气分析', url: '/real/analysis' },
      { text: '单站演变', url: '/real/chart' }
      // { text: '物理量诊断', url: '/real/minute' }
    ];
  }
  ngOnInit() {
  }
}
