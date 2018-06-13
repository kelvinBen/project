import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { CimissResult, CimissStation, CimissDay, CimissSoilHour } from '../../../models/cimiss';
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
  echartsIntance: any;
  option: any;
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  selCity: String = '西安市';
  cityList: String[] = [];
  arr_time: String[] = [];
  arr_value10: Number[] = [];
  arr_value20: Number[] = [];
  arr_value30: Number[] = [];
  dayDatas: SoilGridData[] = [];
  sDate: String = moment().add(-24, 'hours').format('YYYY-MM-DD HH');
  eDate: String = moment().format('YYYY-MM-DD HH');
  timeConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  @ViewChild('agGrid') agGrid: AgGridNg2;
  constructor(private _http: HttpClient) { }
  ngOnInit() {
    this.option = this.createOption();
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getStaInfoByRegionCode&dataCode=STA_INFO_SURF_CHN&dataFormat=json&adminCodes=610000&';
    sUrl += 'staLevels=011,012,013,015&elements=Station_Id_C,Station_Name,City,Cnty,Town';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.stations = cimissDt.DS as CimissStation[];
        this.stations.forEach(stn => {
          const city = this.cityList.find(s => {
            return s === stn.City;
          });
          if (!city) { this.cityList.push(stn.City); }
        });
        this.changeCity();
        this.selStation = '57132';
      }
    });
  }
  changeCity() {
    this.stationList = this.stations.filter(s => {
      return s.City === this.selCity;
    });
    if (this.stationList.length > 0) {
      this.selStation = this.stationList[0].Station_Id_C;
    }
  }
  initGrid() {
    if (!this.agGrid.api) { return; }
    const ary = [
      { headerName: '站名', field: 'Station_Name', width: 90 },
      { headerName: '日期', field: 'Datetime', width: 120 },
      { headerName: '10cm', field: 'SRHU10', width: 100 },
      { headerName: '20cm', field: 'SRHU20', width: 100 },
      { headerName: '30cm', field: 'SRHU30', width: 110 },
      { headerName: '40cm', field: 'SRHU40', width: 110 },
      { headerName: '50cm', field: 'SRHU50', width: 110 },
      { headerName: '60cm', field: 'SRHU60', width: 110 },
      { headerName: '80cm', field: 'SRHU80', width: 110 },
      { headerName: '100cm', field: 'SRHU100', width: 110 }
    ];
    this.agGrid.api.setColumnDefs(ary);
    this.query();
  }
  query() {
    this.dayDatas = [];
    let url = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getAgmeEleByTimeRangeAndStaID&dataCode=AGME_CHN_SOIL_HOR';
    url += '&elements=Station_Id_C,Station_Name,Datetime,Soil_Depth_BelS,SRHU&dataFormat=json';
    url += '&staIds=' + this.selStation + '&timeRange=[';
    const st = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
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
    let st = moment(this.sDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
    const et = moment(this.eDate.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours').minutes(0).seconds(0).milliseconds(0);
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
        this.arr_time.push(row.Datetime);
        const d10 = dts.find(s => {
          return s.Soil_Depth_BelS === '10';
        });
        if (d10) {
          row.SRHU10 = d10.SRHU;
          this.arr_value10.push(parseFloat(row.SRHU10.valueOf()));
        }
        const d20 = dts.find(s => {
          return s.Soil_Depth_BelS === '20';
        });
        if (d20) {
          row.SRHU20 = d20.SRHU;
          this.arr_value20.push(parseFloat(row.SRHU20.valueOf()));
        }
        const d30 = dts.find(s => {
          return s.Soil_Depth_BelS === '30';
        });
        if (d30) {
          row.SRHU30 = d30.SRHU;
          this.arr_value30.push(parseFloat(row.SRHU30.valueOf()));
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
    if (this.echartsIntance) {
      this.echartsIntance.setOption(this.createOption());
    }
    if (this.agGrid.api) {
      this.agGrid.api.setRowData([]);
      this.agGrid.api.updateRowData({ add: this.dayDatas });
    }
  }

  onChartInit(ec) {
    this.echartsIntance = ec;
  }
  createOption(): any {
    return {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        }
      },
      legend: {
        data: ['土壤深度10cm', '土壤深度20cm', '土壤深度30cm'],
        x: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.arr_time
      },
      yAxis: {
        type: 'value',
        show: true,
        scale: true,
        offset: 10,
        axisTick: { show: false }
      },
      series: [
        {
          name: '土壤深度10cm',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
          type: 'line',
          data: this.arr_value10
        },
        {
          name: '土壤深度20cm',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
          type: 'line',
          data: this.arr_value20
        },
        {
          name: '土壤深度30cm',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
          type: 'line',
          data: this.arr_value30
        }
      ]
    };
  }
}
