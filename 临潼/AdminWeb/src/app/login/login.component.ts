import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { LoginModel } from "../models/login";
import { User } from "../models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  vm: LoginModel = new LoginModel();
  baseUrl: string = "http://www.lintongqx.com/uploadapi/login";
  constructor(private _http: HttpClient,
    private storage: LocalStorageService,
    private router: Router) { }

  ngOnInit() {
  }
  onSubmit() {
    let par = "name=" + this.vm.name + "&password=" + this.vm.password;
    let headers = new HttpHeaders().append("Content-Type", "application/x-www-form-urlencoded");
    this._http.post(this.baseUrl, par, {
      headers: headers
    }).subscribe(result => {
      let us = result as User[];
      if (us && us.length > 0) {
        this.storage.store('user', us[0]);
        if (us[0].Type == 1) {
          this.router.navigate(['/admin/user']);
        } else {
          this.router.navigate(['/admin/work']);
        }
      } else {
        alert("用户密码错误。");
      }
    });
  }
}
