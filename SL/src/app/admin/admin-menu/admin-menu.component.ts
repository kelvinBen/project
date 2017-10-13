import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
   onMenuClick(item) {
    this.seletItem = item;
  }

  onSubMenuClic(item) {
    this.subSelectItem = item;
  }
   mDatas = [
    {
      name: '国家气候', routerLink: "admincountry"
    },
    {
      name: '视频和论坛文件', routerLink: "adminfile"
    }
  ];

  seletItem = this.mDatas[0];
  subSelectItem = null;

}
