import { Component, OnInit } from '@angular/core';
import { ProveFile, ProveFileOper } from '../../models/file';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-prove-operation',
  templateUrl: './prove-operation.component.html',
  styleUrls: ['./prove-operation.component.css']
})
export class ProveOperationComponent implements OnInit {
  vmId: Number;
  vm: ProveFileOper = null;
  timeConfig = { format: 'YYYY-MM-DD HH:mm:ss', locale: moment.locale('zh-CN') };

  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute) {
  }
  ngOnInit() {
    this.vm = new ProveFileOper();
    this.vm.CreateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    this._route.params.forEach((params: Params) => {
      this.vmId = params['id'] as Number;
      if (this.vmId) { // edit
        this._http.get('http://117.34.117.196:9008/Prove?Id=eq.' + this.vmId.toString()).subscribe(result => {
          this.vm = (result as ProveFileOper[])[0];
          this.vm.CreateTime = moment(this.vm.CreateTime.valueOf()).format('YYYY-MM-DD HH:mm:ss');
        }, error => {
          alert('数据不存在，返回列表');
          this._router.navigateByUrl('/prove');
        });
      }
    });
  }

  onSubmit() {
    this.vm.FileName = moment(this.vm.CreateTime.valueOf()).format('YYYYMMDDHHmmss') + this.vm.Title;
    if (this.vmId) {
      this._http.patch('http://117.34.117.196:9008/Prove?Id=eq.' + this.vmId.toString(), this.vm).subscribe(result => {
        this._router.navigateByUrl('/prove');
      }, error => {
        console.log(error);
      });
    } else {
      this._http.post('http://117.34.117.196:9008/Prove', this.vm).subscribe(result => {
        this._router.navigateByUrl('/prove');
      }, error => {
        console.log(error);
      });
    }
  }
}
