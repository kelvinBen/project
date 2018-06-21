import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmallClass } from "../../models/category";
import { LocalStorageService } from 'ng2-webstorage';
import { TempModel } from "../../models/news";
import { User } from "../../models/user";

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  vm: User;
  baseUrl: string = 'http://www.lintongqx.com/rest/';
  temps: TempModel[] = []
  selSmall: number;
  smallClasses: SmallClass[] = [];
  constructor(private localSto: LocalStorageService,
    private _http: HttpClient) { }

  ngOnInit() {
    this.vm = this.localSto.retrieve('user') as User;
    this.querySmallClass();
  }

  querySmallClass() {
    this._http.get(this.baseUrl + 'SmallClass?BigClassID=eq.7').subscribe(result => {
      this.smallClasses = result as SmallClass[];
      if (this.smallClasses.length > 0) this.selSmall = this.smallClasses[0].Id;
      this.query();
    });
  }
  getSmallName(id: number) {
    for (let i = 0; i < this.smallClasses.length; i++) {
      if (this.smallClasses[i].Id == id) {
        return this.smallClasses[i].SmallClassName;
      }
    }
  }
  statusStr(status: number) {
    if (status == 0) return '未审核';
    else if (status == 1) return '审核通过';
    return '审核未通过';
  }
  query() {
    let url = this.baseUrl + 'Temps?SmallClassID=eq.' + this.selSmall + '&UserID=eq.' + this.vm.Id;
    url += '&order=Time.desc&select=Id,SmallClassID,Title,Time,Author,Status';
    this._http.get(url).subscribe(result => {
      this.temps = result as TempModel[];
    });
  }
  delete(id) {
    if (confirm('操作无法恢复，确定删除?')) {
      this._http.delete(this.baseUrl + 'Temps?Id=eq.' + id).subscribe(result => {
        this.query();
      });
    }
  }
}
