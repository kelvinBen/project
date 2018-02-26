import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  listMenus: String[] = ['累年日值查询', '累年月值查询', '累年年值查询'];
  selMenu: String = '累年日值查询';
  constructor() { }

  ngOnInit() {
  }

}
