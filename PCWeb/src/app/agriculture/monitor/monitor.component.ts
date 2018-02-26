import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { CimissResult, CimissSoilHour, CimissHour, CimissSSH, CimissDay } from '../../models/cimiss';
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
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  gounds: CimissHour[] = [];
  sshs: CimissSSH[] = [];
  soils: SoilGridData[] = [];
  days: CimissDay[] = [];
  @ViewChild('gGrid') gGrid: DxDataGridComponent;
  @ViewChild('sGrid') sGrid: DxDataGridComponent;
  @ViewChild('soilGrid') soilGrid: DxDataGridComponent;
  @ViewChild('dayGrid') dayGrid: DxDataGridComponent;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.queryGroudTemp();
    this.querySSH();
    this.querySoil();
    this.queryDay();
  }

  queryGroudTemp() {
    this.gounds = [];
    const st = moment().add(-32, 'hours').format('YYYYMMDDHH') + '0000';
    const et = moment().add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_HOR';
    url += '&elements=Station_Id_C,Station_Name,Datetime,GST,GST_Max,GST_Max_Otime,GST_Min,GST_320cm,';
    url += 'GST_Min_OTime,GST_5cm,GST_10cm,GST_15cm,GST_20cm,GST_40cm,GST_80cm,GST_160cm&dataFormat=json';
    url += '&staIds=57132&timeRange=[' + st + ',' + et + ']';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.gounds = cimissDt.DS as CimissHour[];
        if (this.gGrid) {
          this.gGrid.instance.refresh();
        }
      }
    });
  }

  querySSH() {
    this.sshs = [];
    const st = moment().add(-14, 'days').format('YYYYMMDD') + '000000';
    const et = moment().add(-1, 'days').format('YYYYMMDD') + '000000';
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_SSD_HOR';
    url += '&elements=Station_Id_C,Station_Name,Datetime,SSH,SSH_Time_0506,SSH_Time_0607,';
    url += 'SSH_Time_1213,SSH_Time_1314,SSH_Time_1415,SSH_Time_1516,SSH_Time_1617,SSH_Time_1718,SSH_Time_1920,';
    url += 'SSH_Time_1819,SSH_Time_0708,SSH_Time_0809,SSH_Time_0910,SSH_Time_1011,SSH_Time_1112&dataFormat=json';
    url += '&staIds=57132&timeRange=[' + st + ',' + et + ']';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.sshs = cimissDt.DS as CimissSSH[];
        if (this.sGrid) {
          this.sGrid.instance.refresh();
        }
      }
    });
  }

  querySoil() {
    this.soils = [];
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getAgmeEleByTimeRangeAndStaID&dataCode=AGME_CHN_SOIL_HOR';
    url += '&elements=Station_Id_C,Station_Name,Datetime,Soil_Depth_BelS,SRHU&dataFormat=json';
    url += '&staIds=57132&timeRange=[';
    const st = moment().add(-32, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment().add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    url += st.format('YYYYMMDDHH') + '0000,';
    url += et.format('YYYYMMDDHH') + '0000]';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const datas = cimissDt.DS as CimissSoilHour[];
        this.initChartDatas(st.toDate(), et.toDate(), datas);
      }
    }, error => {
      this.initChartDatas(st.toDate(), et.toDate(), []);
    });
  }

  initChartDatas(stime: Date, etime: Date, datas: CimissSoilHour[]) {
    if (!datas || datas.length === 0) { return; }
    let st = moment(stime).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment(etime).add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
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
        this.soils.push(row);
      }
    }
    if (this.soilGrid) {
      this.soilGrid.instance.refresh();
    }
  }

  queryDay() {
    this.days = [];
    const st = moment().add(-14, 'days').format('YYYYMMDD') + '000000';
    const et = moment().add(-1, 'days').format('YYYYMMDD') + '000000';
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY';
    url += '&elements=Station_Id_C,Station_Name,Datetime,EVP,TEM_Avg,';
    url += 'TEM_Max,TEM_Min,PRE_Time_2020,PRE_Max_1h,RHU_Avg,RHU_Min';
    url += '&dataFormat=json';
    url += '&staIds=57132&timeRange=[' + st + ',' + et + ']';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.days = cimissDt.DS as CimissDay[];
        if (this.dayGrid) {
          this.dayGrid.instance.refresh();
        }
      }
    });
  }

  formatDateTimeString(s) {
    const t = moment(s);
    if (t) {
      return t.add(8, 'hours').format('YYYY-MM-DD HH');
    }
    return s;
  }
}
