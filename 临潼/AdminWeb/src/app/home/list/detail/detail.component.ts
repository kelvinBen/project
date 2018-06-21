import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NewModel } from "../../../models/news";
import { BigClass, SmallClass } from "../../../models/category";
import * as moment from "moment";
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  html: SafeHtml;
  newId: number;
  smallClasse: SmallClass = new SmallClass();
  vm: NewModel = new NewModel();
  constructor(private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.forEach((params: Params) => {
      this.newId = params['newid'] as number;
      if (this.newId) {
        this._http.get('http://www.lintongqx.com/rest/News?Id=eq.' + this.newId).subscribe(result => {
          const news = result as NewModel[];
          if (news && news.length > 0) {
            this.vm = news[0];
            if (this.vm.Context.indexOf('&lt;') !== -1) {
              this.vm.Context = this.HTMLDecode(this.vm.Context);
            }
            this.html = this.sanitizer.bypassSecurityTrustHtml(this.vm.Context);

            this.querySmallClasses();
          }
        });
      }
    });
  }

  querySmallClasses() {
    this._http.get('http://www.lintongqx.com/rest/SmallClass?Id=eq.' + this.vm.SmallClassID).subscribe(result => {
      let smalles = result as SmallClass[];
      if (smalles && smalles.length > 0) this.smallClasse = smalles[0];
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
}
