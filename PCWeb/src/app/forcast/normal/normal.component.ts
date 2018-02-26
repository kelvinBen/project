import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})
export class NormalComponent implements OnInit {
  urlXZ: SafeResourceUrl; // 05
  urlXN: SafeResourceUrl; // 10
  urlXY: SafeResourceUrl; // 16
  selDate: Date = moment().add(-1, 'days').toDate();
  constructor(private _http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.query();
  }

  query() {
    const baseUrl = 'http://10.172.99.100:8001/Files/';
    const dt = moment(this.selDate).format('YYMMDD') + '.TXT';
    this.urlXZ = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'XZ' + dt);
    this.urlXN = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'XN' + dt);
    this.urlXY = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl + 'XY' + dt);
  }

  showPlane(hour: Number): Boolean {
    const dt = moment(this.selDate).hours(hour.valueOf()).minutes(0).seconds(0).milliseconds(0);
    return dt.isSameOrBefore(moment());
  }
}
