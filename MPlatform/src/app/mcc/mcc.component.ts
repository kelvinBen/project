import { Component, OnInit} from '@angular/core';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { AuthenticationService } from '../service/authentication.service'
// import {} 

@Component({
  selector: 'app-mcc',
  templateUrl: './mcc.component.html',
  styleUrls: ['./mcc.component.css']
})

export class MccComponent implements OnInit {
  @LocalStorage('CurrentUser') loggedIn;
  constructor(private storage: LocalStorageService, private authservice: AuthenticationService) {
  }
  ngOnInit() {
  }
  goHelp() {
    window.location.href = 'http://www.extraweather.com/help';
  }
  goMain() {
    window.location.href = 'http://www.extraweather.com';
  }
  loginOut() {
    this.authservice.loginout();
  }
}

