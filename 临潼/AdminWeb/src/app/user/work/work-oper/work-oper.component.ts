import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BigClass, SmallClass } from "../../../models/category";
import { TempModelOper } from "../../../models/news";
import { UploadFile } from "../../../models/upload";
import { User } from "../../../models/user";
import { LocalStorageService } from 'ng2-webstorage';
import * as moment from "moment";
@Component({
  selector: 'app-work-oper',
  templateUrl: './work-oper.component.html',
  styleUrls: ['./work-oper.component.css']
})
export class WorkOperComponent implements OnInit {
  user:User;
  baseUrl: string = 'http://www.lintongqx.com/rest/';
  vm: TempModelOper = new TempModelOper();
  bigClasses: BigClass[] = [];
  smallClasses: SmallClass[] = [];
  pId: number = undefined;
  type: number = undefined;
  selTime: Date;
  constructor(private _route: ActivatedRoute,
    private localSto: LocalStorageService,
    private _http: HttpClient,
    private _router: Router) { }

  ngOnInit() {
    this.user = this.localSto.retrieve('user') as User;
    this._route.params.forEach((params: Params) => {
      this.pId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.pId) {
        this._http.get(this.baseUrl + 'Temps?Id=eq.' + this.pId).subscribe(result => {
          let us = result as TempModelOper[];
          if (us && us.length > 0) {
            this.vm = us[0];
            this.selTime = new Date(this.vm.Time);
            this.querySmallClass();
          }
        });
      } else {
        this.querySmallClass();
      }
    });

  }
  querySmallClass() {
    this._http.get(this.baseUrl + 'SmallClass?BigClassID=eq.7').subscribe(result => {
      this.smallClasses = result as SmallClass[];
      if (this.smallClasses.length > 0 && !this.pId) this.vm.SmallClassID = this.smallClasses[0].Id;
    });
  }
  onSubmit() {
    this.vm.Time = moment(this.selTime).format("YYYY-MM-DD");
    this.vm.UserID = this.user.Id;
    this.vm.BigClassID = 7;
    if (this.pId) {//Edit
      this._http.patch(this.baseUrl + 'Temps?Id=eq.' + this.pId, this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/work');
      }, error => {
        console.log(error);
      });
    } else {//Add
      this.vm.Status = 0;
      this._http.post(this.baseUrl + 'Temps', this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/work');
      }, error => {
        console.log(error);
      });
    }
  }

}
