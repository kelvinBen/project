import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Router } from '@angular/router';
// import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { LoginUser } from '../models/user';

@Injectable()
export class AuthenticationService {
  public token: String;
  redirectUrl: string;
  isLogin = false;
  url = 'https://end.extraweather.com';
  constructor(private http: HttpClient, private storage: LocalStorageService,private router:Router) {
    // // set token if saved in local storage
    // var currentUser = this.storage.retrieve('CurrentUser') as LoginUser;
    // this.token = currentUser && currentUser.token;
  }
  login(email: string, password: string): Observable<any> {
    let postOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) };
    return this.http.post(this.url+'/login', JSON.stringify({ email: email, password: password }), postOptions)
  }
  loginout(){
    this.storage.clear('CurrentUser');
    this.storage.clear('order');
    this.router.navigate(['/mcc/login'])
  }
}
