import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { LocalStorageService } from 'ng2-webstorage';
import { Router } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  vm: User = new User();
  constructor(private _service: ServiceService,
    private storage: LocalStorageService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    const par = '?email=eq.' + this.vm.name + '&password=eq.' + this.vm.password + '&select=id,email,name';
    this._service.Get('user', par).subscribe(result => {
      const us = result as User[];
      if (us && us.length > 0) {
        this.storage.store('user', us[0]);
        this.router.navigate(['/gis/index']);
      } else {
        alert('用户名密码错误。');
      }
    }, error => {
      alert('登录错误。');
    });
  }
}
