import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { User, LoginUser } from '../model/user';
import { Msg } from '../model/msg';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser;
  vm: User = new User();
  logUser: LoginUser;
  constructor(private apiService: ApiService, private router: Router, private storage: LocalStorageService, ) { }

  ngOnInit() {
    // if (this.curUser === null) { // 已经正常退出，需再次输入用户和密码登陆
    //   this.router.navigate(['/login'])
    // } else { // 用户未退出，需要验证token是否有效，无效则需再次输入用户和密码登陆，有效则调整到首页。
    //   // this.http.get('/api/getuser').subscribe(result=>{ // 有效
    //   this.router.navigate(['/main/map'])

    // }
  }
  submit() {
    this.apiService.login(this.vm.name, this.vm.password).subscribe(result => {
      let info = result as Msg;
      if (info.errCode === 0) {
        this.logUser = new LoginUser();
        this.logUser.username = this.vm.name;
        this.logUser.id = info.data.id;
        this.storage.store('CurrentUser', this.logUser);
        this.router.navigate(['/main/map'])
      } else {
        alert('用户名密码错误。');
      }
    }, error => {
      alert('登录错误。');
    });
  }
}

