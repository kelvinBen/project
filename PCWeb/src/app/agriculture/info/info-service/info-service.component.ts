import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProveFile } from '../../../models/file';
@Component({
  selector: 'app-info-service',
  templateUrl: './info-service.component.html',
  styleUrls: ['./info-service.component.css']
})
export class InfoServiceComponent implements OnInit {
  files: ProveFile[] = [];
  constructor(private _http: HttpClient, private _router: Router) { }

  ngOnInit() {
    this.query();
  }
  query() {
    this._http.get('http://117.34.117.196:9008/Prove').subscribe(result => {
      this.files = result as ProveFile[];
    });
  }
  oper(id: Number) {
    if (id) {

    } else {
      this._router.navigateByUrl('/info-service-add');
    }
  }
}
