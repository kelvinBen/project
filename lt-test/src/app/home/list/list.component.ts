import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NewModel } from "../../models/news";
import { BigClass, SmallClass } from "../../models/category";
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  bigClass: BigClass = new BigClass();
  smallClasses: SmallClass[] = [];
  bigClassId: number;
  constructor(private _http: HttpClient,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    // console.log(this._route.params);
    this._route.params.forEach((params: Params) => {
      this.bigClassId = params['id'] as number;
      console.log(params);
      console.log( this.bigClassId);
      if (this.bigClassId) {
        this._http.get('http://www.lintongqx.com/rest/BigClass?Id=eq.' + this.bigClassId).subscribe(result => {
          let bigs = result as BigClass[];
          console.log(result);
          if (bigs && bigs.length > 0) {
            this.bigClass = bigs[0];

          }
        });
        this.querySmallClasses();
      }
    });
  }

  querySmallClasses() {
    this._http.get('http://www.lintongqx.com/rest/SmallClass?BigClassID=eq.' + this.bigClassId).subscribe(result => {
      this.smallClasses = result as SmallClass[];
    });
  }
}
