import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProveFile } from '../models/file';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-prove',
  templateUrl: './prove.component.html',
  styleUrls: ['./prove.component.css']
})
export class ProveComponent implements OnInit {
  files: ProveFile[] = [];
  safeUrl: SafeResourceUrl;
  bShow: Boolean = false;
  constructor(private _http: HttpClient, private _router: Router,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.query();
  }

  query() {
    // this._http.get('http://117.34.117.196:9008/Prove').subscribe(result => {
    //   this.files = result as ProveFile[];
    // });
    this.files = [{
      Id: 1,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170105.pdf',
      CreateTime: new Date(2017, 1, 5, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 2,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170406.pdf',
      CreateTime: new Date(2017, 4, 6, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 3,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170510.pdf',
      CreateTime: new Date(2017, 5, 10, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 4,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170614.pdf',
      CreateTime: new Date(2017, 6, 14, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 5,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170622.pdf',
      CreateTime: new Date(2017, 6, 22, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 6,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170724.pdf',
      CreateTime: new Date(2017, 7, 24, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 7,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170724（1）.pdf',
      CreateTime: new Date(2017, 7, 24, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 8,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170725.pdf',
      CreateTime: new Date(2017, 7, 25, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 9,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170727.pdf',
      CreateTime: new Date(2017, 7, 27, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 10,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170728.pdf',
      CreateTime: new Date(2017, 7, 28, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 11,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170731.pdf',
      CreateTime: new Date(2017, 7, 31, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 12,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170731-1.pdf',
      CreateTime: new Date(2017, 7, 31, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }, {
      Id: 13,
      Title: '气象资料应用报告',
      FileName: '气象资料应用报告20170731-2.pdf',
      CreateTime: new Date(2017, 7, 31, 0, 0, 0, 0),
      Depart: '',
      Reason: '',
      Author: ''
    }];
  }

  oper(id: Number) {
    if (id) {

    } else {
      this._router.navigateByUrl('/prove/add');
    }
  }

  view(id: Number) {
    console.log(id);
    const d = this.files.find(s => {
      return s.Id === id;
    });
    if (!d) {
      return;
    }
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/Files/气象证明/2017年/' + d.FileName);
    this.bShow = true;
  }
}
