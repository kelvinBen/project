import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import { CimissResult } from '../../models/cimiss';
import * as moment from 'moment';

class ForcastModel {
  public Station_Name: String;
  public Station_ID_C: String;
  public Validtime: String;
  public Datetime: String;
  public WEP: String;
  public VIS: String;
  public TEM: String;
  public RHU: String;
  public WIN_D: String;
  public WIN_S: String;
}
@Component({
  selector: 'app-county',
  templateUrl: './county.component.html',
  styleUrls: ['./county.component.css']
})
export class CountyComponent implements OnInit {
  selDate: String = moment().format('YYYY-MM-DD');
  datas: ForcastModel[] = [];
  dayConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
  @ViewChild('forcastGrid') forcastGrid: AgGridNg2;
  constructor(public _http: HttpClient) { }

  ngOnInit() {

  }
  queryForcast() {
    this.datas = [];
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSevpWefcRffcByTimeAndStaID&dataCode=SEVP_CHN_WEFC_RFFC';
    url += '&elements=Station_Name,Station_ID_C,Datetime,Validtime,WEP,VIS,TEM,RHU,WIN_D,WIN_S&dataFormat=json&staIds=57132&time=';
    const currentDate = moment(this.selDate.valueOf(), 'YYYY-MM-DD');
    url += currentDate.format('YYYYMMDD') + '000000';
    url += '&eleValueRanges=TEM:(,99999)';
    this._http.get(url).subscribe(result => {
      console.log(result);
      const cimiss = result as CimissResult;
      if (cimiss && cimiss.returnCode === '0') {
        this.datas = cimiss.DS as ForcastModel[];
        if (this.forcastGrid.api) {
          this.forcastGrid.api.setRowData([]);
          this.forcastGrid.api.updateRowData({ add: this.datas });
        }
      }
    });
  }
  initGrid() {
    if (!this.forcastGrid.api) { return; }
    this.forcastGrid.api.setColumnDefs([
      { headerName: '站名', field: 'Station_Name', width: 110 },
      { headerName: '预报时效', field: 'Validtime', width: 100 },
      { headerName: '天气现象', field: 'WEP', width: 110 },
      { headerName: '温度/气温', field: 'TEM', width: 110 },
      { headerName: '相对湿度', field: 'RHU', width: 110 },
      { headerName: '风向', field: 'WIN_D', width: 110 },
      { headerName: '风速', field: 'WIN_S', width: 110 },
      { headerName: '水平能见度', field: 'VIS', width: 110 }
    ]);
    this.queryForcast();
  }
}
