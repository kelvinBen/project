import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DbServiceService } from '../../service/db-service.service';
import { subCategory } from '../../index/list/subcategory';
import { List } from '../../index/list/list';
import { LocalStorageService } from 'ng2-webstorage';
import { User } from '../../models/User';
import { MenuItem } from '../../../../node_modules/primeng/primeng';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  items: MenuItem[];
  constructor(private _service: DbServiceService, private localSto: LocalStorageService,private router: Router) { }
  user: User;
  ngOnInit() {
    this.items = [
      { label: '首页', icon: 'fa-arrow-circle-left', routerLink:['/']},
      { label: '登出', icon: 'fa-times', routerLink:['/backstage/login'] }
    ];
    this.user = this.localSto.retrieve('user') as User;
  }
}
