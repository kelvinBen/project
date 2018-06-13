import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProveFile, DownFile } from '../models/file';
import * as moment from 'moment';
@Component({
  selector: 'app-prove',
  templateUrl: './prove.component.html',
  styleUrls: ['./prove.component.css']
})
export class ProveComponent implements OnInit {
  dataSource: ProveFile[] = [];
  columnsToDisplay = ['CreateTime', 'Depart', 'Author', 'Reason', 'Id'];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this._http.get('http://117.34.117.196:9008/Prove').subscribe(result => {
      this.dataSource = (result as ProveFile[]).sort((a, b) => {
        return moment(a.CreateTime.valueOf()).diff(moment(b.CreateTime.valueOf()));
      });
    });
  }
  delete(id: Number) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      this._http.delete('http://117.34.117.196:9008/Prove?Id=eq.' + id.toString()).subscribe(result => {
        this.loadData();
      });
    }
  }
  down(id: Number) {
    this._http.get('http://117.34.117.196:9010/Prove?Id=' + id.toString()).subscribe(result => {
      const downFile = result as DownFile;
      if (downFile) {
        const downUrl = 'http://117.34.117.196:9011/' + downFile.FileName;
        window.open(downUrl, '_parent');
      }
    });
  }
  timeFormat(t: String): String {
    return moment(t.valueOf()).format('YYYY-MM-DD HH:mm:ss');
  }
}
