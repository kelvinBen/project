import { Component, OnInit } from '@angular/core';
import { WarnFile, WarnFileOper } from '../../../models/file';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
class Warninfo {
  public type: String;
  public level: String;
  public guide: String;
  public content: String;
  public img: String;
}
class WarnType {
  public label: String;
  public value: Number;
}
class WarnLevel {
  public label: String;
  public value: Number;
}
@Component({
  selector: 'app-warn-oper',
  templateUrl: './warn-oper.component.html',
  styleUrls: ['./warn-oper.component.css']
})
export class WarnOperComponent implements OnInit {
  vmId: Number;
  vm: WarnFileOper = null;
  typeoptions: WarnType[] = [];
  leveloptions: WarnLevel[] = [];
  items: Warninfo[] = [];
  timeConfig = { format: 'YYYY-MM-DD HH:mm', locale: moment.locale('zh-CN') };
  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute) {
  }
  ngOnInit() {
    this.vm = new WarnFileOper();
    this.vm.CreateTime = moment().format('YYYY-MM-DD HH:mm');
    this._http.get('../../../../assets/Config/warninfo.json').subscribe(result => {
      this.items = result as Warninfo[];
    });
    this._http.get('../../../../assets/Config/warntype.json').subscribe(result => {
      this.typeoptions = result as WarnType[];
    });
    this._http.get('../../../../assets/Config/warnlevel.json').subscribe(result => {
      this.leveloptions = result as WarnLevel[];
    });
    this._route.params.forEach((params: Params) => {
      this.vmId = params['id'] as Number;
      if (this.vmId) { // edit
        this._http.get('http://117.34.117.196:9008/Warn?Id=eq.' + this.vmId.toString()).subscribe(result => {
          this.vm = (result as WarnFileOper[])[0];
          this.vm.CreateTime = moment(this.vm.CreateTime.valueOf()).format('YYYY-MM-DD HH:mm');
        }, error => {
          alert('数据不存在，返回列表');
          this._router.navigateByUrl('/product/Warning');
        });
      }
    });
  }

  loadWarningInfo() {
    const item = this.items.find(s => {
      return s.type === this.vm.Type && s.level === this.vm.Level;
    });
    if (item) {
      this.vm.Pic = item.img;
      this.vm.Guide = item.guide;
      this.vm.Content = item.content;
      this.vm.Content = this.vm.Content.replace('{1}',
        moment(this.vm.CreateTime.valueOf(), 'YYYY-MM-DD HH:mm').format('YYYY年MM月DD日HH时mm分'));
    } else {
      this.vm.Content = this.vm.Guide = this.vm.Pic = null;
    }
  }

  onSubmit() {
    this.vm.CreateTime = moment(this.vm.CreateTime.valueOf(), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
    this.vm.FileName = this.vm.Type.valueOf() + this.vm.Level.valueOf() + '预警信号';
    this.vm.FileName += moment(this.vm.CreateTime.valueOf()).format('YYYYMMDDHHmm');
    if (this.vmId) {
      this._http.patch('http://117.34.117.196:9008/Warn?Id=eq.' + this.vmId.toString(), this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/warning');
      }, error => {
        console.log(error);
      });
    } else {
      this._http.post('http://117.34.117.196:9008/Warn', this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/warning');
      }, error => {
        console.log(error);
      });
    }
  }
}
