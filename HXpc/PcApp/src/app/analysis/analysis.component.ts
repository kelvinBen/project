import { Component, OnInit } from '@angular/core';
import { TabMenu } from '../models/menus';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  menus: TabMenu[] = [];
  constructor(private _http: HttpClient,
    private _router: Router) {
    this.menus = [
      { text: '月/旬统计', url: '/analysis/month' },
      { text: '历史统计', url: '/analysis/history' }
    ];
  }

  ngOnInit() {
  }
  selectTab(e) {
    console.log(this.menus[e.itemIndex].url.valueOf());
    this._router.navigateByUrl(this.menus[e.itemIndex].url.valueOf());
  }

}
