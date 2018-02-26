import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agrindex',
  templateUrl: './agrindex.component.html',
  styleUrls: ['./agrindex.component.css']
})
export class AgrindexComponent implements OnInit {
  listMenus: String[] = ['葡萄', '作物生育气象适宜性指标', '农事活动气象适宜性指标', '农业气象灾害指标'];
  selMenu: String = '葡萄';
  constructor() { }

  ngOnInit() {
  }

}
