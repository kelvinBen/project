import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener} from '@angular/core';
import { UserService } from '../Service/user.service';
import { Result } from '../Service/result';
import { LocalStorageService } from 'ng2-webstorage';
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginModel: Object = {
    name: '',
    password: ''
  };
  result: Result;
  msg: string;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderer.setElementStyle(this.login.nativeElement, 'left', ((window.innerWidth - 692) / 2).toString() + 'px');
  }

  @ViewChild('loginDiv') login: ElementRef;

  constructor(private renderer: Renderer,
    private userService: UserService,
    private storage: LocalStorageService,
    private router: Router) {
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.login.nativeElement, 'position', 'absolute');
    this.renderer.setElementStyle(this.login.nativeElement, 'left', ((window.innerWidth - 692) / 2).toString() + 'px');
  }

  //用户登陆
  onSubmit() {
    this.userService.login(this.loginModel)
      .subscribe(
      result => {
        this.result = result;
        if (this.result.code == 0) {
          //jwt存入LocalStorage
          this.storage.store('token', this.result.data);
          //跳转到登陆页面
          this.router.navigate(['/backstage/admin']);
        }else{
          console.log(this.result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
}
