import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {
  listMenus: String[] = ['历史月值查询', '历史旬值查询']; 
  selMenu: String = '历史月值查询';
  constructor() { }

  ngOnInit() {
  }

}
