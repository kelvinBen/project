import { Component, OnInit, ViewChild } from '@angular/core';
import { CimissResult, CimissSoilHour, CimissHour, CimissSSH, CimissDay } from '../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
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
  @ViewChild('groudTempGrid') groudTempGrid: AgGridNg2;
  @ViewChild('sshGrid') sshGrid: AgGridNg2;
  @ViewChild('soilGrid') soilGrid: AgGridNg2;
  @ViewChild('dayGrid') dayGrid: AgGridNg2;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }
  initGroundTempGrid() {
    if (!this.groudTempGrid.api) { return; }
    this.groudTempGrid.api.setColumnDefs([
      {
        headerName: '日期', field: 'Datetime', width: 120, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD HH');
        }
      },
      { headerName: '草面温度', field: 'LGST', width: 110 },
      { headerName: '地面温度', field: 'GST', width: 110 },
      { headerName: '地面最高温', field: 'GST_Max', width: 100 },
      { headerName: '地面最低温', field: 'GST_Min', width: 110 },
      { headerName: '5cm地温', field: 'GST_5cm', width: 110 },
      { headerName: '10cm地温', field: 'GST_10cm', width: 110 },
      { headerName: '15cm地温', field: 'GST_15cm', width: 110 },
      { headerName: '20cm地温', field: 'GST_20cm', width: 110 },
      { headerName: '40cm地温', field: 'GST_40cm', width: 110 },
      { headerName: '80cm地温', field: 'GST_80cm', width: 110 },
      { headerName: '160cm地温', field: 'GST_160cm', width: 110 },
      { headerName: '320cm地温', field: 'GST_320cm', width: 110 }
    ]);
    this.queryGroudTemp();
  }
  queryGroudTemp() {
    this.gounds = [];
    const st = moment().add(-32, 'hours').format('YYYYMMDDHH') + '0000';
    const et = moment().add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_HOR';
    url += '&elements=Station_Id_C,LGST,Station_Name,Datetime,GST,GST_Max,GST_Max_Otime,GST_Min,GST_320cm,';
    url += 'GST_Min_OTime,GST_5cm,GST_10cm,GST_15cm,GST_20cm,GST_40cm,GST_80cm,GST_160cm&dataFormat=json';
    url += '&staIds=57132&timeRange=[' + st + ',' + et + ']';
    this._http.get(url).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.gounds = cimissDt.DS as CimissHour[];
        if (this.groudTempGrid.api) {
          this.groudTempGrid.api.setRowData([]);
          this.groudTempGrid.api.updateRowData({ add: this.gounds });
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
        if (this.sshGrid.api) {
          this.sshGrid.api.setRowData([]);
          this.sshGrid.api.updateRowData({ add: this.sshs });
        }
      }
    });
  }
  initSSHGridGrid() {
    if (!this.sshGrid.api) { return; }
    this.sshGrid.api.setColumnDefs([
      {
        headerName: '日期', field: 'Datetime', width: 100, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD');
        }
      },
      { headerName: '日照时数', field: 'SSH', width: 110 },
      { headerName: '07-08', field: 'SSH_Time_0708', width: 110 },
      { headerName: '08-09', field: 'SSH_Time_0809', width: 100 },
      { headerName: '09-10', field: 'SSH_Time_0910', width: 110 },
      { headerName: '10-11', field: 'SSH_Time_1011', width: 110 },
      { headerName: '11-12', field: 'SSH_Time_1112', width: 110 },
      { headerName: '12-13', field: 'SSH_Time_1213', width: 110 },
      { headerName: '13-14', field: 'SSH_Time_1314', width: 110 },
      { headerName: '14-15', field: 'SSH_Time_1415', width: 110 },
      { headerName: '15-16', field: 'SSH_Time_1516', width: 110 },
      { headerName: '16-17', field: 'SSH_Time_1617', width: 110 },
      { headerName: '17-18', field: 'SSH_Time_1718', width: 110 },
      { headerName: '18-19', field: 'SSH_Time_1819', width: 110 },
      { headerName: '19-20', field: 'SSH_Time_1920', width: 110 }
    ]);
    this.querySSH();
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
    if (this.soilGrid.api) {
      this.soilGrid.api.setRowData([]);
      this.soilGrid.api.updateRowData({ add: this.soils });
    }
  }

  initSoilGrid() {
    if (!this.soilGrid.api) { return; }
    this.soilGrid.api.setColumnDefs([
      {
        headerName: '日期', field: 'Datetime', width: 120, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD HH');
        }
      },
      { headerName: '10cm', field: 'SRHU10', width: 110 },
      { headerName: '20cm', field: 'SRHU20', width: 110 },
      { headerName: '30cm', field: 'SRHU30', width: 100 },
      { headerName: '40cm', field: 'SRHU40', width: 110 },
      { headerName: '50cm', field: 'SRHU50', width: 110 },
      { headerName: '60cm', field: 'SRHU60', width: 110 },
      { headerName: '80cm', field: 'SRHU80', width: 110 },
      { headerName: '100cm', field: 'SRHU100', width: 110 }
    ]);
    this.querySoil();
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
        if (this.dayGrid.api) {
          this.dayGrid.api.setRowData([]);
          this.dayGrid.api.updateRowData({ add: this.days });
        }
      }
    });
  }
  initDayGrid() {
    if (!this.dayGrid.api) { return; }
    this.dayGrid.api.setColumnDefs([
      {
        headerName: '日期', field: 'Datetime', width: 100, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD');
        }
      },
      { headerName: '蒸发量', field: 'EVP', width: 110 },
      { headerName: '平均气温', field: 'TEM_Avg', width: 110 },
      { headerName: '最高气温', field: 'TEM_Max', width: 100 },
      { headerName: '最低气温', field: 'TEM_Min', width: 110 },
      { headerName: '20-20时降水量', field: 'PRE_Time_2020', width: 140 },
      { headerName: '1小时最大降水量', field: 'PRE_Max_1h', width: 150 },
      { headerName: '平均相对湿度', field: 'RHU_Avg', width: 120 },
      { headerName: '最小相对湿度', field: 'RHU_Min', width: 120 }
    ]);
    this.queryDay();
  }
}
