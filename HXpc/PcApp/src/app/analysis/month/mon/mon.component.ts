import { Component, OnInit, ViewChild } from '@angular/core';
import { CimissResult, CimissDay, CimissDayMMUT19812010, CimissMonth, CimissStation } from '../../../models/cimiss';
import { Element } from '../../../models/element';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';

@Component({
  selector: 'app-mon',
  templateUrl: './mon.component.html',
  styleUrls: ['./mon.component.css']
})
export class MonComponent implements OnInit {
  stations: CimissStation[] = [];
  selStation: String = '57132';
  stationList: CimissStation[] = [];
  cityList: String[] = [];
  selCity: String = '西安市';
  selUrl: String = '';
  sDate: String = moment().add(-13, 'months').format('YYYY-MM');
  eDate: String = moment().add(-1, 'months').format('YYYY-MM');
  monDatas: CimissMonth[] = [];
  elements: Element[] = [];
  @ViewChild('monGrid') monGrid: AgGridNg2;
  monthConfig = { format: 'YYYY-MM', locale: moment.locale('zh-CN') };
  constructor(private _http: HttpClient) {
    this.elements = [
      { label: '平均气温', value: 'TEM_Avg', checked: true },
      { label: '平均最高气温', value: 'TEM_Max_Avg', checked: true },
      { label: '平均最低气温', value: 'TEM_Min_Avg', checked: true },
      { label: '最高气温', value: 'TEM_Max', checked: true },
      { label: '极端最高气温出现日数', value: 'TEM_Max_Days', checked: false },
      { label: '极端最高气温出现日(字符型)', value: 'TEM_Max_ODay_C', checked: false },
      { label: '最低气温', value: 'TEM_Min', checked: false },
      { label: '极端最低气温出现日数', value: 'TEM_Min_Days', checked: false },
      { label: '最低气温出现日(字符型)', value: 'TEM_Min_ODay_C', checked: false },
      { label: '平均气温日较差', value: 'TEM_Avg_Dev', checked: false },
      { label: '最大气温日较差', value: 'TEM_Max_Dev', checked: false },
      // { label: '最大气温日较差出现日s', value: 'V12304_040', checked: false },
      // { label: '最大气温日较差出现日', value: 'TEM_Dev_Max_ODay', checked: false },
      // { label: '最大气温日较差出现日(字符型)', value: 'TEM_Dev_Max_ODay_C', checked: false },
      { label: '月最小气温日较差', value: 'TEM_Min_Dev_Mon', checked: false },
      { label: '最小气温日较差出现日数', value: 'TEM_Dev_Min_Days', checked: false },
      { label: '月最小气温日较差出现日(字符型)', value: 'TEM_Dev_Min_ODay_C', checked: false },
      { label: '日最高气温≥30℃日数', value: 'TEM_Max_A30C_Days', checked: false },
      { label: '日最高气温≥35℃日数', value: 'TEM_Max_A35C_Days', checked: false },
      { label: '日最高气温≥40℃日数', value: 'TEM_Max_A40C_Days', checked: false },
      { label: '日最低气温＜2Cel日数', value: 'TEM_Min_B2C_Days', checked: false },
      { label: '日最低气温＜0℃日数', value: 'TEM_Min_B0C_Days', checked: false },
      { label: '日最低气温＜-2℃日数', value: 'TEM_Min_Bn2C_Days', checked: false },
      { label: '日最低气温＜-15℃日数', value: 'TEM_Min_Bn15C_Days', checked: false },
      { label: '日最低气温＜-30℃日数', value: 'TEM_Min_Bn30C_Days', checked: false },
      { label: '日最低气温＜-40Cel日数', value: 'TEM_Min_Bn40C_Days', checked: false },
      { label: '冷度日数(日平均气温≥26.0℃)', value: 'TEM_Avg_A26_Days', checked: false },
      { label: '暖度日数(日平均气温≤18.0℃)', value: 'TEM_Avg_B18_Days', checked: false },
      { label: '20-20时降水量', value: 'PRE_Time_2020', checked: true },
      { label: '08-08时降水量', value: 'PRE_Time_0808', checked: false },
      { label: '最大日降水量', value: 'PRE_Max_Day', checked: true },
      { label: '月最大日降水量出现日数', value: 'PRE_Max_Mon_Days', checked: false },
      { label: '最大日降水量出现日(字符型)', value: 'PRE_Max_ODay_C', checked: false },
      { label: '日降水量≥0.1mm日数', value: 'PRE_A0p1mm_Days', checked: false },
      { label: '日降水量≥1mm日数', value: 'PRE_A1mm_Days', checked: false },
      { label: '日降水量≥5mm日数', value: 'PRE_A5mm_Days', checked: false },
      { label: '日降水量≥10mm日数', value: 'PRE_A10mm_Days', checked: false },
      { label: '日降水量≥25mm日数', value: 'PRE_A25mm_Days', checked: false },
      { label: '日降水量≥50mm日数', value: 'PRE_A50mm_Days', checked: false },
      { label: '日降水量≥100mm日数', value: 'PRE_A100mm_Days', checked: false },
      { label: '日降水量≥150mm日数', value: 'PRE_A150mm_Days', checked: false },
      { label: '最长连续降水日数', value: 'Days_Max_Coti_PRE', checked: true },
      { label: '最长连续降水量', value: 'PRE_Conti_Max', checked: true },
      { label: '最长连续降水止日', value: 'EDay_Max_Coti_PRE', checked: false },
      { label: '最长连续无降水日数', value: 'NPRE_LCDays', checked: false },
      { label: '最长连续无降水止日', value: 'NPRE_LCDays_EDay', checked: false },
      { label: '最大连续降水量', value: 'PRE_Max_Conti', checked: true },
      { label: '最大连续降水日数', value: 'Days_Max_Conti_PRE', checked: false },
      { label: '最大连续降水止日', value: 'PRE_Coti_Max_EDay', checked: false },
      { label: '1小时最大降水量', value: 'PRE_Max_1h', checked: true },
      { label: '1小时最大降雨量出现日数', value: 'PRE_Max_1h_Days', checked: false },
      { label: '1小时最大降水量出现日(字符型)', value: 'PRE_Max_1h_ODay_C', checked: false },
      { label: '平均2分钟风速', value: 'WIN_S_2mi_Avg', checked: false },
      { label: '最大风速', value: 'WIN_S_Max', checked: true },
      { label: '最大风速的风向(字符型)', value: 'WIN_D_S_Max_C', checked: false },
      { label: '最大风速出现日数', value: 'Days_WIN_S_Max', checked: false },
      { label: '最大风速出现日(字符型)', value: 'WIN_S_Max_ODay_C', checked: false },
      { label: '最大风速≥5.0m/s日数', value: 'WIN_S_A5ms_Days', checked: false },
      { label: '最大风速≥10m/s日数', value: 'WIN_S_Max_A10ms_Days', checked: false },
      { label: '最大风速≥12.0m/s日数', value: 'WIN_S_A12ms_Days', checked: false },
      { label: '最大风速≥15.0m/s日数', value: 'V11042_15', checked: false },
      { label: '最大风速≥17.0m/s日数', value: 'WIN_S_A17ms_Days', checked: false },
      { label: '极大风速', value: 'WIN_S_Inst_Max', checked: true },
      { label: '极大风速的风向(字符型)', value: 'WIN_D_INST_Max_C', checked: false },
      { label: '极大风速之出现日数', value: 'V11046_040', checked: false },
      { label: '极大风速出现日(字符型)', value: 'WIN_S_INST_Max_ODay_C', checked: false }
    ];
  }
  ngOnInit() {
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
  setUrl() {
    this.selUrl = '';
    this.elements.forEach(ele => {
      if (ele.checked) {
        if (this.selUrl === '') {
          this.selUrl = ele.value;
        } else {
          this.selUrl += ',' + ele.value;
        }
      }
    });
  }
  queryMon() {
    this.setUrl();
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_MON&dataFormat=json&staIds=' + this.selStation;
    sUrl += '&elements=Station_Id_C,Station_Name,Datetime,' + this.selUrl + '&timeRange=[';
    sUrl += moment(this.sDate.valueOf(), 'YYYY-MM').format('YYYYMM') + '01000000,';
    sUrl += moment(this.eDate.valueOf(), 'YYYY-MM').format('YYYYMM') + '01000000]';
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.monDatas = cimissDt.DS as CimissMonth[];
        if (this.monGrid.api) {
          this.monGrid.api.setRowData([]);
          this.monGrid.api.updateRowData({ add: this.monDatas });
        }
      }
    });
  }
  formatTime(t: String) {
    if (t) {
      return moment(t.valueOf()).format('YYYY年MM月');
    }
    return '';
  }
  initGrid() {
    if (!this.monGrid.api) { return; }
    const ary = [
      { headerName: '站名', field: 'Station_Name', width: 80 },
      {
        headerName: '日期', field: 'Datetime', width: 100, valueFormatter: function (params) {
          return moment(params.value).format('YYYY-MM');
        }
      }
    ];
    this.elements.forEach(ele => {
      if (ele.checked === true) {
        ary.push({ headerName: ele.label.valueOf(), field: ele.value.valueOf(), width: 110 });
      }
    });
    this.monGrid.api.setColumnDefs(ary);
    this.queryMon();
  }
}
