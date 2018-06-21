import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BigClass, SmallClass } from "../../../models/category";
import { NewModelOper } from "../../../models/news";
import { UploadFile } from "../../../models/upload";
import * as moment from "moment";
@Component({
  selector: 'app-content-oper',
  templateUrl: './content-oper.component.html',
  styleUrls: ['./content-oper.component.css']
})
export class ContentOperComponent implements OnInit {
  baseUrl: string = 'http://www.lintongqx.com/rest/';
  vm: NewModelOper = new NewModelOper();
  bigClasses: BigClass[] = [];
  smallClasses: SmallClass[] = [];
  pId: number = undefined;
  type: number = undefined;
  picUrl: SafeResourceUrl;
  selTime: Date;
  constructor(private _route: ActivatedRoute,
    private _http: HttpClient,
    private _router: Router,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.pId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.pId) {
        this._http.get(this.baseUrl + 'News?Id=eq.' + this.pId).subscribe(result => {
          let us = result as NewModelOper[];
          if (us && us.length > 0) {
            this.vm = us[0];
            this.selTime = new Date(this.vm.Time);
            if (moment(this.selTime).isBefore(moment(new Date(2017, 4, 1)))) {
              this.vm.Context = this.HTMLDecode(this.vm.Context);
            }
            this.picUrl = this._sanitizer.bypassSecurityTrustResourceUrl('http://www.lintongqx.com/upload/' + this.vm.Pic);
            this.queryBigClass();
          }
        });
      } else {
        this.queryBigClass();
      }
    });

  }

  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      let fs: UploadFile[] = JSON.parse(res);
      this.vm.Pic = fs[0].ExName;
      let url = 'http://www.lintongqx.com/upload/' + this.vm.Pic;
      this.picUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
  queryBigClass() {
    this._http.get(this.baseUrl + 'BigClass').subscribe(result => {
      this.bigClasses = result as BigClass[];
      if (this.bigClasses.length > 0 && !this.pId) this.vm.BigClassID = this.bigClasses[0].Id;
      this.querySmallClass();
    });
  }
  querySmallClass() {
    this._http.get(this.baseUrl + 'SmallClass?BigClassID=eq.' + this.vm.BigClassID).subscribe(result => {
      this.smallClasses = result as SmallClass[];
      if (this.smallClasses.length > 0 && !this.pId) this.vm.SmallClassID = this.smallClasses[0].Id;
    });
  }
  HTMLDecode(text) {
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    if (output) {
      return output;
    }
    return text;
  }
  onSubmit() {
    this.vm.Time = moment(this.selTime).format("YYYY-MM-DD");
    if (this.pId) {//Edit
      this._http.patch(this.baseUrl + 'News?Id=eq.' + this.pId, this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/content');
      }, error => {
        console.log(error);
      });
    } else {//Add
      this._http.post(this.baseUrl + 'News', this.vm).subscribe(result => {
        this._router.navigateByUrl('/admin/content');
      }, error => {
        console.log(error);
      });
    }
  }
}
