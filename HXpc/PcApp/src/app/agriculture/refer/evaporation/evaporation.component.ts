import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import { CimissResult, CimissStation, CimissDay, CimissDayMMUT19812010 } from '../../../models/cimiss';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

class TempChartData {
  public Datetime: String;
  public EVP: number;
}
@Component({
  selector: 'app-evaporation',
  templateUrl: './evaporation.component.html',
  styleUrls: ['./evaporation.component.css']
})
export class EvaporationComponent implements OnInit {
  echartsIntance: any;
  option: any;
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  arr_time: String[] = [];
  arr_value: Number[] = [];
  dayDatas: CimissDay[] = [];
  sDate: String = moment().add(-14, 'days').format('YYYY-MM-DD');
  eDate: String = moment().add(-1, 'days').format('YYYY-MM-DD');
  timeConfig = { format: 'YYYY-MM-DD', locale: moment.locale('zh-CN') };
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
      { headerName: '站名', field: 'Station_Name', width: 150 },
      {
        headerName: '日期', field: 'Datetime', width: 110, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM-DD');
        }
      },
      { headerName: '日蒸发量', field: 'EVP', width: 150 }
    ];
    this.agGrid.api.setColumnDefs(ary);
    this.query();
  }
  query() {
    this.arr_time = [];
    this.arr_value = [];
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_DAY&dataFormat=json&staIds=';
    sUrl += this.selStation.valueOf();
    sUrl += '&elements=Station_Id_C,Station_Name,EVP,Datetime&timeRange=[';
    sUrl += moment(this.sDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000,';
    sUrl += moment(this.eDate.valueOf(), 'YYYY-MM-DD').format('YYYYMMDD') + '000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.dayDatas = cimissDt.DS as CimissDay[];
        const ary = [];
        this.dayDatas.forEach(ele => {
          this.arr_time.push(moment(ele.Datetime.toString()).format('YYYY-MM-DD'));
          this.arr_value.push(parseFloat(ele.EVP.toString()));
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
        if (this.agGrid.api) {
          this.agGrid.api.setRowData([]);
          this.agGrid.api.updateRowData({ add: this.dayDatas });
        }
      }
    });
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
        data: ['日蒸发量'],
        x: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.arr_time
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '日蒸发量',
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
          type: 'line',
          itemStyle: {
            normal: {
              color: '#408e84',
              lineStyle: {
                color: '#408e84'
              }
            }
          },
          data: this.arr_value
        }
      ]
    };
  }
}
