import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NewModel } from "../../../models/news";
import { BigClass, SmallClass } from "../../../models/category";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  smallClasse: SmallClass = new SmallClass();
  smallId: number;
  news: NewModel[] = [];
  constructor(private _http: HttpClient,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.smallId = params['subid'] as number;
      if (this.smallId) {
        this._http.get('http://www.lintongqx.com/rest/SmallClass?Id=eq.' + this.smallId).subscribe(result => {
          let smalles = result as SmallClass[];
          if (smalles && smalles.length > 0) {
            this.smallClasse = smalles[0];
          }
        });
        this.query();
      }
    });
  }
  query() {
    let url = 'http://www.lintongqx.com/rest/News?SmallClassID=eq.' + this.smallId + '&order=Time.desc';
    url += '&select=Id,Title,Time'
    this._http.get(url).subscribe(result => { this.news = result as NewModel[] });
  }
}
