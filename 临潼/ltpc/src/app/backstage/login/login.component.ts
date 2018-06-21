import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { DbServiceService } from '../../service/db-service.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Result } from '../../service/result';
import { Router } from "@angular/router";
import { LoginModel } from "./loginModel";
import { User } from "../../models/User";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginModel: LoginModel = new LoginModel('', '');
  msg: string;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderer.setElementStyle(this.login.nativeElement, 'left', ((window.innerWidth - 692) / 2).toString() + 'px');
  }

  @ViewChild('loginDiv') login: ElementRef;

  constructor(private renderer: Renderer,
    private _service: DbServiceService,
    private storage: LocalStorageService,
    private router: Router) {
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.login.nativeElement, 'position', 'absolute');
    this.renderer.setElementStyle(this.login.nativeElement, 'left', ((window.innerWidth - 692) / 2).toString() + 'px');
  }

  //用户登陆
  onSubmit() {
    let par = '?Name=eq.' + this.loginModel.name + '&Password=eq.' + this.loginModel.password;
    par += "&select=Id,Name,Type"
    this._service.Get('Users', par)
      .subscribe(
      result => {
        let us = result as User[];
        if (us && us.length > 0){
          this.storage.store('user', us[0]);
          if (us[0].Type == 1) {
            this.router.navigate(['/backstage/admin/adminstation']);
          } else {
            this.router.navigate(['/backstage/admin']);
          }
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
}
