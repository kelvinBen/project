import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService} from '../service/authentication.service';
@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.css']
})
export class PaySuccessComponent implements OnInit {
  count: number = 60;
  tim: any;
  result:string;
  ok:boolean = false;
  constructor(private router: Router,private activedRoute: ActivatedRoute,private authservice:AuthenticationService ) { }

  ngOnInit() {
    var that = this;
    that.activedRoute.params.forEach((params: Params) => {
      this.result = params['result'] as string;
      if(this.result === 'ok') this.ok=true;
    })
    console.log(this.result)
    this.tim = setInterval(function () {
      if (that.count === 1) {
        clearInterval(that.tim);
        that.authservice.loginout();
        that.router.navigate(['/mcc/login']);
        return;
      } else {
        that.count--;
      }
    }, 1000)
  }
  ngOnDestroy() {
    clearTimeout(this.tim);
  }
  goback(){
    window.history.go(-1);
  }
}
