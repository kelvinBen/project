import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.css']
})
export class ReferComponent implements OnInit {
  listMenus: String[] = ['气温实况', '日照时数', '土壤商情', '蒸发量', '降水']; // , '葡萄光照要素'
  selMenu: String = '气温实况';


  constructor() { }

  ngOnInit() {
  }

  menuChanged() {
  }


}
