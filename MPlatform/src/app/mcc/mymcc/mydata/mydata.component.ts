import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { LoginUser } from '../../../models/user';
import * as moment from 'moment';
export interface services {
  code: number;
  msg: string;
  data: servitem[]
}
export interface servitem {
  connector: string;
  disabled: number;
  freenumber: number;
  id: number;
  name: string;
  operate: string;
  paynumber: number
  time: string;
}

@Component({
  selector: 'app-mydata',
  templateUrl: './mydata.component.html',
  styleUrls: ['./mydata.component.css']
})
export class MydataComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser:LoginUser;
  userId: Number;
  searchValue = '';
  userServices = [];
  serviceData:servitem[] = [];
  searchAddress = [];
  constructor(private storage: LocalStorageService, private productService: ProductService) { }
  displayData:servitem[] = [];

  ngOnInit() {
    if (this.curUser) {
      this.userId = this.curUser.id;
    }
    this.getServices();
    this.displayData = this.serviceData;
    console.log(this.displayData)
  }
  getServices() {
    this.productService.getServices(this.userId).subscribe(result => {
      let info = result as services;
      if (!info.code) {
        this.userServices = info.data;
        this.userServices.forEach(ele => {
          var obj:servitem = {
            id: ele.userservice.id, name: ele.servic.name, connector: ele.servic.doc, time: moment(ele.userservice.starttime).format("YYYY-MM-DD HH:mm:ss"), freenumber: ele.userservice.visit, paynumber: ele.userservice.payvisit, disabled: ele.userservice.disabled, operate: "停用"
          };
          obj.freenumber = ele.userservice.visit - ele.userservice.used;
          obj.paynumber = ele.userservice.payvisit
          this.serviceData.push(obj)
        })
      } else {
        console.log(info.msg)
      }
    }, error => { console.error(); }
    );
  }
  search(): void {
    this.displayData = this.serviceData.filter(item => { return (item.name || '').indexOf(this.searchValue) !== -1; });
  }
  changeservice(e) {
    if (e.disabled) {
      this.productService.startService(e.id).subscribe(result => {
        e.disabled = !e.disabled;
      }, error => { console.error(); }
      );
    } else {
      this.productService.endService(e.id).subscribe(result => {
        e.disabled = !e.disabled;
      }, error => { console.error(); }
      );
    }
  }
}
