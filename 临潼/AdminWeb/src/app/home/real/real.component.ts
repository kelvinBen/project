import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NewModel } from '../../models/news';
import { BigClass, SmallClass } from '../../models/category';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-real',
  templateUrl: './real.component.html',
  styleUrls: ['./real.component.css']
})
export class RealComponent implements OnInit {
  bigClass: BigClass = new BigClass();
  smallClasses: SmallClass[] = [];
  bigClassId: number = 3;
  smallClass: SmallClass = null;
  smallId: number = 8;
  layerId: number = 1;
  cloudSrc: SafeResourceUrl;
  constructor(private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private _route: ActivatedRoute) { }


  ngOnInit() {
    const ct = moment().add(-1, 'hours').format('YYYYMMDDHH');
    this.cloudSrc = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.lintongqx.com/imgs/CLOUD_' + ct + '30.JPG');
    this._route.params.forEach((params: Params) => {
      this.smallId = parseInt(params['id'] as string, 0);
      this._http.get('http://www.lintongqx.com/rest/SmallClass?BigClassID=eq.' + this.bigClassId).subscribe(result => {
        this.smallClasses = result as SmallClass[];
        for (let i = 0; i < this.smallClasses.length; ++i) {
          if (this.smallClasses[i].Id === this.smallId) {
            this.smallClass = this.smallClasses[i];
            break;
          }
        }
        this.routerFun(this.smallId);
      });
      this._http.get('http://www.lintongqx.com/rest/BigClass?Id=eq.' + this.bigClassId).subscribe(result => {
        const bigs = result as BigClass[];
        if (bigs && bigs.length > 0) {
          this.bigClass = bigs[0];
        }
      });
    });
  }

  querySmallClassById() {
    for (let i = 0; i < this.smallClasses.length; ++i) {
      if (this.smallClasses[i].Id === this.smallId) {
        this.smallClass = this.smallClasses[i];
        break;
      }
    }
  }

  routerFun(id: number) {
    this.smallId = id;
    if (this.smallId === 8) {
      this.layerId = 1;
    } else if (this.smallId === 9) {
      this.layerId = 3;
    } else if (this.smallId === 10) {
      this.layerId = 2;
    } else if (this.smallId === 11) {
      this.layerId = 4;
    } else if (this.smallId === 43) {
      this.layerId = 5;
    } else if (this.smallId === 44) {
      this.layerId = 6;
    }
    this.querySmallClassById();
  }
}
