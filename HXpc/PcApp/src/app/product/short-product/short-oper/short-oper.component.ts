import { Component, OnInit } from '@angular/core';
import { ShortFile, ShortFileOper } from '../../../models/file';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-short-oper',
  templateUrl: './short-oper.component.html',
  styleUrls: ['./short-oper.component.css']
})
export class ShortOperComponent implements OnInit {
  vmId: Number;
  vm: ShortFileOper = null;
  timeConfig = { format: 'YYYY-MM-DD HH:mm', locale: moment.locale('zh-CN') };
  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit() {
    this.vm = new ShortFileOper();
    this.vm.CreateTime = moment().format('YYYY-MM-DD HH:mm');
    this._route.params.forEach((params: Params) => {
      this.vmId = params['id'] as Number;
      if (this.vmId) { // edit
        this._http.get('http://117.34.117.196:9008/Short?Id=eq.' + this.vmId.toString()).subscribe(result => {
          this.vm = (result as ShortFileOper[])[0];
          this.vm.CreateTime = moment(this.vm.CreateTime.valueOf()).format('YYYY-MM-DD HH:mm');
        }, error => {
          alert('数据不存在，返回列表');
          this._router.navigateByUrl('/product/Short');
        });
      }
    });
  }
  onSubmit() {
    this.vm.CreateTime = moment(this.vm.CreateTime.valueOf(), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
    this.vm.FileName = moment(this.vm.CreateTime.valueOf()).format('YYYYMMDDHHmm') + '短时临近预报';
    if (this.vmId) {
      this._http.patch('http://117.34.117.196:9008/Short?Id=eq.' + this.vmId.toString(), this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/short');
      }, error => {
        console.log(error);
      });
    } else {
      this._http.post('http://117.34.117.196:9008/Short', this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/short');
      }, error => {
        console.log(error);
      });
    }
  }
}
