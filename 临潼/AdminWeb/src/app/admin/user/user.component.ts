import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from "../../models/user";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  tempUsers: User[] = [];
  constructor(private _http: HttpClient) { }

  baseUrl: string = 'http://www.lintongqx.com/rest/';
  ngOnInit() {
    this.query();
  }
  query(){
    this._http.get(this.baseUrl + 'Users?order=Id.asc').subscribe(result => {
      this.users = result as User[];
    });
  }
  delete(id){
    if (confirm('操作无法恢复，确定删除?')){
      this._http.delete(this.baseUrl+'Users?Id=eq.'+id).subscribe(result=>{
        this.query();
      });
    }
  }
}
