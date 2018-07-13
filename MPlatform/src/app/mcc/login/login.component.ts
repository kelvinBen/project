import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Msg } from '../../models/data'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { LoginUser } from '../../models/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser: LoginUser;
  token: string;
  validateForm: FormGroup;
  logUser: LoginUser;
  constructor(private storage: LocalStorageService, private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router, private modalService: NzModalService) {
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.required]],
      remember: [true]
    });

    // this.logUser = this.storage.retrieve('CurrentUser') as LoginUser; 
    if (this.curUser === null) { // 已经正常退出，需再次输入用户和密码登陆
      this.router.navigate(['/mcc/login'])
    } else { // 用户未退出，需要验证token是否有效，无效则需再次输入用户和密码登陆，有效则调整到首页。
      // this.http.get('/api/getuser').subscribe(result=>{ // 有效
      this.router.navigate(['/mcc/mymcc/myplatform'])
      // }, error=>{ // 无效

      // })
    }
  }
  submitForm(e): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.authenticationService.login(e.value.email, e.value.password)
      .subscribe(result => {
        if (!result.code) {
          // login successful
          let token = result.data.token;
          let id = result.data.id;
          if (token) {
            this.logUser = new LoginUser();
            this.logUser.id = id;
            this.logUser.email = e.value.email;
            this.logUser.token = token;
            var curTime = new Date().getTime();
            this.storage.store('CurrentUser', this.logUser);
            this.router.navigate(['/mcc/mymcc/myplatform'])

          } else {
            this.error();
          }
        } else {
          this.error();
        }
      }, error => {
        this.error();
      });
  }
  success(): void {
    this.modalService.success({
      nzTitle: '登录提示：',
      nzContent: '登录成功！',
      nzOnOk: () => this.router.navigate(['/mcc/mymcc/myplatform'])
    });
  }

  error(): void {
    this.modalService.error({
      nzTitle: '登录提示：',
      nzContent: '登录失败！'
    });
  }
}
