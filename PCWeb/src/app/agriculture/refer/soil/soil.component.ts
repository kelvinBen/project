import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CimissResult, CimissSoilHour } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

class SoilGridData {
  public Station_Id_C: String;
  public Station_Name: String;
  public Datetime: String;
  public SRHU10: String;
  public SRHU20: String;
  public SRHU30: String;
  public SRHU40: String;
  public SRHU50: String;
  public SRHU60: String;
  public SRHU80: String;
  public SRHU100: String;
}

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.css']
})
export class SoilComponent implements OnInit {
  sDate: Date = moment().add(-12, 'hours').toDate();
  eDate: Date = new Date();
  dayDatas: SoilGridData[] = [];
  @ViewChild('tGrid') tGrid: DxDataGridComponent;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.query();
  }
  query() {
    this.dayDatas = [];
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getAgmeEleByTimeRangeAndStaID&dataCode=AGME_CHN_SOIL_HOR';
    url += '&elements=Station_Id_C,Station_Name,Datetime,Soil_Depth_BelS,SRHU&dataFormat=json';
    url += '&staIds=57132&timeRange=[';
    const st = moment(this.sDate).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    url += st.format('YYYYMMDDHH') + '0000,';
    url += et.format('YYYYMMDDHH') + '0000]';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const datas = cimissDt.DS as CimissSoilHour[];
        this.initChartDatas(datas);
      }
    }, error => {
      this.initChartDatas([]);
    });
  }

  initChartDatas(datas: CimissSoilHour[]) {
    if (!datas || datas.length === 0) { return; }
    let st = moment(this.sDate).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    for (; st.isSameOrBefore(et); st = st.add(1, 'hours')) {
      const dt = st.format('YYYY-MM-DD HH:mm:ss');
      const dts = datas.filter(s => {
        return s.Datetime === dt;
      });
      if (dts && dts.length > 0) {
        const row = new SoilGridData();
        row.Station_Name = dts[0].Station_Name;
        row.Station_Id_C = dts[0].Station_Id_C;
        row.Datetime = moment(dts[0].Datetime.valueOf()).add(8, 'hours').format('YYYY-MM-DD HH');
        const d10 = dts.find(s => {
          return s.Soil_Depth_BelS === '10';
        });
        if (d10) {
          row.SRHU10 = d10.SRHU;
        }
        const d20 = dts.find(s => {
          return s.Soil_Depth_BelS === '20';
        });
        if (d20) {
          row.SRHU20 = d20.SRHU;
        }
        const d30 = dts.find(s => {
          return s.Soil_Depth_BelS === '30';
        });
        if (d30) {
          row.SRHU30 = d30.SRHU;
        }
        const d40 = dts.find(s => {
          return s.Soil_Depth_BelS === '40';
        });
        if (d40) {
          row.SRHU40 = d40.SRHU;
        }
        const d50 = dts.find(s => {
          return s.Soil_Depth_BelS === '50';
        });
        if (d50) {
          row.SRHU50 = d50.SRHU;
        }
        const d60 = dts.find(s => {
          return s.Soil_Depth_BelS === '60';
        });
        if (d60) {
          row.SRHU60 = d60.SRHU;
        }
        const d80 = dts.find(s => {
          return s.Soil_Depth_BelS === '80';
        });
        if (d80) {
          row.SRHU80 = d80.SRHU;
        }
        const d100 = dts.find(s => {
          return s.Soil_Depth_BelS === '100';
        });
        if (d100) {
          row.SRHU100 = d100.SRHU;
        }
        this.dayDatas.push(row);
      }
    }
    if (this.tGrid) {
      this.tGrid.instance.refresh();
    }
  }

  customizeTooltip(arg) {
    return {
      text: arg.argumentText + '\n' + arg.seriesName + ':' + arg.valueText + '%'
    };
  }
}
