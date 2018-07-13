import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { ProductService } from '../../../service/product.service';
import * as moment from 'moment';
import { LoginUser } from '../../../models/user';
export interface Config {
  code: number;
  msg: string;
  data: {
    apiKey: string;
    apiUpdateTime: string;
    createTime: string;
    email: string;
    id: number;
    password: string;
    telphone: string;
    updateTime: string;
    userName: string;
    usernumber:string;
  };
}
export interface services {
  code: number;
  msg: string;
  data: object[]
}
@Component({
  selector: 'app-myplatform',
  templateUrl: './myplatform.component.html',
  styleUrls: ['./myplatform.component.css']
})
export class MyplatformComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser:LoginUser;
  userId: Number;
  userName:string;
  userNumber:string;
  apiKey: string;
  url = 'https://end.extraweather.com';
  userServices = [];
  constructor(private http: HttpClient, private storage: LocalStorageService, private productService: ProductService) { }

  ngOnInit() {
    if (this.curUser) {
      var jwt =this.curUser.token;
      var authHeader = new HttpHeaders();
      if (jwt) {
        authHeader.append('Authorization', 'Bearer ' + jwt);
      }
      this.userId = this.curUser.id;
      this.http.get(this.url + '/api/getuser' + '?id=' + this.userId, { headers: authHeader }).subscribe(result => {
        let userInfo = result as Config;
        if (!userInfo.code) {
          this.apiKey = userInfo.data.apiKey;
          this.userNumber = userInfo.data.usernumber;
          this.userName = userInfo.data.userName;
        }
      })
    }
    this.getServices();
  }
  getServices() {
    this.productService.getServices(this.userId).subscribe(result => {
      let info = result as services;
      if (!info.code) {
        this.userServices = info.data;
        this.userServices.forEach(ele => {
         ele.userservice.starttime = moment(ele.userservice.starttime).format("YYYY-MM-DD HH:mm:ss")
        });
      } else {
        console.log(info.msg)
      }
    }, error => { console.error(); }
    );
  }


}
