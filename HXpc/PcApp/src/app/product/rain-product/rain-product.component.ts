import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RainFile, DownFile } from '../../models/file';
import * as moment from 'moment';
@Component({
  selector: 'app-rain-product',
  templateUrl: './rain-product.component.html',
  styleUrls: ['./rain-product.component.css']
})
export class RainProductComponent implements OnInit {
  dataSource: RainFile[] = [];
  columnsToDisplay = ['Num', 'CreateTime', 'Author', 'Id'];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this._http.get('http://117.34.117.196:9008/Rain').subscribe(result => {
      this.dataSource = (result as RainFile[]).sort((a, b) => {
        return moment(a.CreateTime.valueOf()).diff(moment(b.CreateTime.valueOf()));
      });
    });
  }
  delete(id: Number) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      this._http.delete('http://117.34.117.196:9008/Rain?Id=eq.' + id.toString()).subscribe(result => {
        this.loadData();
      });
    }
  }
  down(id: Number) {
    this._http.get('http://117.34.117.196:9010/Rain?Id=' + id.toString()).subscribe(result => {
      const downFile = result as DownFile;
      if (downFile) {
        const downUrl = 'http://117.34.117.196:9011/' + downFile.FileName;
        window.open(downUrl, '_parent');
      }
    });
  }
  timeFormat(t: String): String {
    return moment(t.valueOf()).format('YYYY-MM-DD HH');
  }
}
