import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SmallClass } from "../../models/category";
import { TempModel, NewModelOper } from "../../models/news";
import { LocalStorageService } from 'ng2-webstorage';
import { User } from "../../models/user";

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  vm: User;
  users: User[] = [];
  baseUrl: string = 'http://www.lintongqx.com/rest/';
  temps: TempModel[] = []
  selSmall: number;
  smallClasses: SmallClass[] = [];
  constructor(private _http: HttpClient,
    private localSto: LocalStorageService) { }

  ngOnInit() {
    this.vm = this.localSto.retrieve('user') as User;
    this.queryUsers();
    this.querySmallClass();
  }

  queryUsers() {
    this._http.get(this.baseUrl + 'Users?Type=eq.2').subscribe(result => {
      this.users = result as User[];
    });
  }
  getUserName(id: number) {
    for (let i = 0; i < this.users.length; ++i) {
      if (this.users[i].Id == id) {
        return this.users[i].Name;
      }
    }
  }
  querySmallClass() {
    this._http.get(this.baseUrl + 'SmallClass?BigClassID=eq.7').subscribe(result => {
      this.smallClasses = result as SmallClass[];
      if (this.smallClasses.length > 0) {
        this.selSmall = this.smallClasses[0].Id;
      }
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
    let url = this.baseUrl + 'Temps?SmallClassID=eq.' + this.selSmall + '&order=Time.desc';
    this._http.get(url).subscribe(result => {
      this.temps = result as TempModel[];
    });
  }
  check(obj: TempModel, success: boolean) {
    if (success) {
      obj.Status = 1;
      this._http.patch(this.baseUrl + 'Temps?Id=eq.' + obj.Id, obj).subscribe(result => { 
        this.query();
      });
      const ns = new NewModelOper();
      ns.Author = obj.Author;
      ns.Time = obj.Time;
      ns.BigClassID = obj.BigClassID;
      ns.SmallClassID = obj.SmallClassID;
      ns.Context = obj.Context;
      ns.Title = obj.Title;
      console.log(ns);
      this._http.post(this.baseUrl + 'News', ns).subscribe(result => { });
    } else {
      obj.Status = 2;
      this._http.patch(this.baseUrl + 'Temps?Id=eq.' + obj.Id, obj).subscribe(result => { this.query() });
    }
  }
}
