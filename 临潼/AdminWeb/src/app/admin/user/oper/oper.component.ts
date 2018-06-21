import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserOper } from "../../../models/user";
@Component({
  selector: 'app-oper',
  templateUrl: './oper.component.html',
  styleUrls: ['./oper.component.css']
})
export class OperComponent implements OnInit {
  baseUrl: string = 'http://www.lintongqx.com/rest/';
  pId: number = undefined;
  type: number = undefined;
  confirmPassword: string;
  vm: UserOper = new UserOper();
  constructor(private _route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router) { }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.pId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.pId) {
        this._http.get(this.baseUrl + 'Users?Id=eq.' + this.pId).subscribe(result => {
          let us = result as UserOper[];
          if (us && us.length > 0) {
            this.vm = us[0];
            this.confirmPassword = this.vm.Password;
          }
        });
      }else{
        this.vm.Type = 2;
      }
    });
  }

  onSubmit() {
    if (this.vm.Password != this.confirmPassword){
      alert("两次输入密码不一致");
      return;
    }
    if (this.pId) {//Edit
      this._http.patch(this.baseUrl + 'Users?Id=eq.' + this.pId, this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/user');
      }, error => {
        console.log(error);
      });
    } else {//Add
      this._http.post(this.baseUrl + 'Users', this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/user');
      }, error => {
        console.log(error);
      });
    }
  }
}
