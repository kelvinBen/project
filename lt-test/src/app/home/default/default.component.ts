import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NewModel} from '../../models/news'

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
 baseUrl:string ='http://www.lintongqx.com/rest/';
  constructor(private _http:HttpClient,
  private _router:Router) { }
 picNews:NewModel[]=[];
 news:NewModel[]=[];
 products:NewModel[]=[];
 suggest:NewModel[]=[];
 laws:NewModel[]=[];
 
  ngOnInit() {
    let url=this.baseUrl+'News?SmallClassID=eq.1&order=Time.desc&limit=5&select=Id,Title,Time,Pic';
    this._http.get(url).subscribe(result=>{
      this.picNews=result as NewModel[];
    });
    url = this.baseUrl + 'News?SmallClassID=eq.2&order=Time.desc&limit=7&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {//区内新闻
      this.news = result as NewModel[];
    });
    url = this.baseUrl + 'News?BigClassID=eq.6&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {//气象防灾减灾
      this.products = result as NewModel[];
    });
    url = this.baseUrl + 'News?SmallClassID=eq.23&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {//农业气象科普
      this.suggest = result as NewModel[];
    });
    url = this.baseUrl + 'News?BigClassID=eq.8&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {//法律法规
      this.laws = result as NewModel[];
    });
  }

}
