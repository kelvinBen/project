import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BigClass, SmallClass } from "../../models/category";
import { NewModel } from "../../models/news";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  bigClasses: BigClass[] = [];
  selBig: number;
  smallClasses: SmallClass[] = [];
  selSmall: number;
  news: NewModel[] = [];
  constructor(private _http: HttpClient) { }

  baseUrl: string = 'http://www.lintongqx.com/rest/';

  ngOnInit() {
    this._http.get(this.baseUrl + 'BigClass').subscribe(result => {
      this.bigClasses = result as BigClass[];
      if (this.bigClasses.length > 0) this.selBig = this.bigClasses[0].Id;
      this.querySmallClass();
    });
  }

  querySmallClass() {
    this._http.get(this.baseUrl + 'SmallClass?BigClassID=eq.' + this.selBig).subscribe(result => {
      this.smallClasses = result as SmallClass[];
      if (this.smallClasses.length > 0) this.selSmall = this.smallClasses[0].Id;
      this.query();
    });
  }
  getSmallName(id:number){
    for (let i=0;i<this.smallClasses.length;i++){
      if (this.smallClasses[i].Id == id){
        return this.smallClasses[i].SmallClassName;
      }
    }
  }
  query() {
    this._http.get(this.baseUrl + 'News?SmallClassID=eq.' + this.selSmall + '&order=Time.desc&select=Id,SmallClassID,Title,Time,Author,Pic').subscribe(result => {
      this.news = result as NewModel[];
    });
  }
  delete(id){
    if (confirm('操作无法恢复，确定删除?')){
      this._http.delete(this.baseUrl+'News?Id=eq.'+id).subscribe(result=>{
        this.query();
      });
    }
  }
}
