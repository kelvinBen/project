import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  // listMenus: String[] = ['积温查询', '稳定通过', '干旱指数', '气象周年服务方案'];
  listMenus: String[] = ['积温查询', '稳定通过', '气象周年服务方案'];
  selMenu: String = '积温查询';
  constructor() { }

  ngOnInit() {
  }

}
