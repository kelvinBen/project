import { Component, OnInit } from '@angular/core';
import { TabMenu } from '../models/menus';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  menus: TabMenu[] = [];
  constructor() {
    this.menus = [
      { text: '雨情通报', url: '/product/rain' },
      { text: '短时临近', url: '/product/short' },
      { text: '天气预警', url: '/product/warning' }
    ];
  }
  ngOnInit() {
  }

}
