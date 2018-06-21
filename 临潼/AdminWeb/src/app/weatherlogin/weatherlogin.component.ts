import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginModel } from '../models/login';
import { User } from '../models/user';
@Component({
  selector: 'app-weatherlogin',
  templateUrl: './weatherlogin.component.html',
  styleUrls: ['./weatherlogin.component.css']
})
export class WeatherloginComponent implements OnInit {

  vm: LoginModel = new LoginModel();
  constructor(private _http: HttpClient,
    private router: Router) { }

  ngOnInit() {
  }
  onSubmit() {
    if (this.vm.name === 'Admin' && this.vm.password === '123456') {
      this.router.navigate(['/weather/hour']);
    }
  }

}
