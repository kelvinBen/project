import { Component, OnInit } from '@angular/core';
import { CimissResult, CimissHYear, CimissStation } from '../../../models/cimiss';
import { Element } from '../../../models/element';
import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import * as moment from 'moment';
@Component({
  selector: 'app-h-year',
  templateUrl: './h-year.component.html',
  styleUrls: ['./h-year.component.css']
})
export class HYearComponent implements OnInit {
  stations: CimissStation[] = [];
  stationList: CimissStation[] = [];
  selStation: String = '57132';
  cityList: String[] = [];
  selCity: String = '西安市';
  yearData: CimissHYear;
  elements: Element[] = [];
  selUrl: String = '';
  constructor(private _http: HttpClient) {
    this.elements = [
      { label: '平均气温', value: 'TEM_Avg', checked: true },
      { label: '平均最高气温', value: 'TEM_Max_Avg', checked: true },
      { label: '平均最低气温', value: 'TEM_Min_Avg', checked: true },
      { label: '最高气温', value: 'TEM_Max', checked: false },
      { label: '极端最高气温出现日', value: 'TEM_Max_ODay', checked: false },
      { label: '极端最高气温出现月', value: 'TEM_Max_OMon', checked: false },
      // { label: '最低地面气温出现年', value: 'TEM_Max_OYear', checked: false },
      { label: '最低气温', value: 'TEM_Min', checked: false },
      { label: '最低气温出现日', value: 'TEM_Min_ODay', checked: false },
      { label: '最低气温出现月', value: 'TEM_Min_OMon', checked: false },
      { label: '最低气温出现年', value: 'TEM_Min_OYear', checked: false },
      { label: '平均气温日较差', value: 'TEM_Avg_Dev', checked: false },
      { label: '最大气温日较差', value: 'TEM_Max_Dev', checked: false },
      { label: '最大气温日较差出现日', value: 'TEM_Dev_Max_ODay', checked: false },
      { label: '最大气温日较差出现月', value: 'TEM_Dev_Max_OMon', checked: false },
      // { label: '最大气温日较差出现年', value: 'TEM_Dev_Max_OYear', checked: false },
      // { label: '累年日最高气温≥30℃日数', value: 'TEM_Max_A30C_Days_MMUT', checked: false },
      // { label: ' 累年日最高气温≥30.0℃最长连续日数', value: 'TEM_Max_A30_LCDays_MMUT', checked: false },
      // { label: '日最高气温≥30.0℃最长连续日数止年', value: 'V12707_30', checked: false },
      // { label: '日最高气温≥30.0℃最长连续日数之止月', value: 'TEM_Max_A30_LCDays_EMon', checked: false },
      // { label: '日最高气温≥30.0℃最长连续日数之止日', value: 'TEM_Max_A30_LCDays_EDay', checked: false },
      // { label: '累年日最高气温≥35℃日数', value: 'TEM_Max_A35C_Days_MMUT', checked: false },
      // { label: ' 累年日最高气温≥35.0℃最长连续日数', value: 'TEM_Max_A35_LCDays_MMUT', checked: false },
      // { label: '日最高气温≥35.0℃最长连续日数止年', value: 'V12707_35', checked: false },
      // { label: '日最高气温≥35.0℃最长连续日数之止月', value: 'TEM_Max_A35_LCDays_EMon', checked: false },
      // { label: '日最高气温≥35.0℃最长连续日数之止日', value: 'TEM_Max_A35_LCDays_EDay', checked: false },
      // { label: '累年日最高气温≥37℃日数', value: 'TEM_Max_A37C_Days_MMUT', checked: false },
      // { label: ' 累年日最高气温≥37.0℃最长连续日数', value: 'TEM_Max_A37_LCDays_MMUT', checked: false },
      // { label: '日最高气温≥37.0℃最长连续日数止年', value: 'V12707_37', checked: false },
      // { label: '日最高气温≥37.0℃最长连续日数之止月', value: 'TEM_Max_A37_LCDays_EMon', checked: false },
      // { label: '日最高气温≥37.0℃最长连续日数之止日', value: 'TEM_Max_A37_LCDays_EDay', checked: false },
      // { label: '累年日最高气温≥40℃日数', value: 'TEM_Max_A40C_Days_MMUT', checked: false },
      // { label: ' 累年日最高气温≥40.0℃最长连续日数', value: 'TEM_Max_A40_LCDays_MMUT', checked: false },
      // { label: '日最高气温≥40.0℃最长连续日数止年', value: 'V12707_40', checked: false },
      // { label: '日最高气温≥40.0℃最长连续日数之止月', value: 'TEM_Max_A40_LCDays_EMon', checked: false },
      // { label: '日最高气温≥40.0℃最长连续日数之止日', value: 'TEM_Max_A40_LCDays_EDay', checked: false },
      { label: '累年日最低气温＜2℃日数', value: 'TEM_Min_B2C_Days_MMUT', checked: false },
      { label: '累年20-20时平均降水量', value: 'PRE_Time_2020_MMUT', checked: false },
      { label: '累年08-08时平均降水量', value: 'PRE_Time_0808_MMUT', checked: false },
      { label: '累年日降水量≥0.1mm日数', value: 'PRE_A0p1mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥1mm日数', value: 'PRE_A1mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥5mm日数', value: 'PRE_A5mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥10mm日数', value: 'PRE_A10mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥25mm日数', value: 'PRE_A25mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥50mm日数', value: 'PRE_A50mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥100mm日数', value: 'PRE_A100mm_Days_MMUT', checked: false },
      { label: '累年日降水量≥150mm日数', value: 'PRE_A150mm_Days_MMUT', checked: false },
      { label: '降水量相对平均差', value: 'RAD_PRE', checked: false },
      { label: '降水量平均差', value: 'PRE_AD', checked: false },
      { label: '降水量相对标准差', value: 'PRE_RSD', checked: false },
      { label: '降水量标准差', value: 'PRE_SD', checked: false },
      { label: '极大风速', value: 'WIN_S_Inst_Max', checked: false },
      { label: '极大风速的风向', value: 'WIN_D_INST_Max', checked: false },
      { label: '极大风速出现年份', value: 'WIN_S_INST_Max_OYear', checked: false },
      { label: '极大风速出现月', value: 'EGST_Max_OMon', checked: false },
      { label: '极大风速出现日', value: 'WIN_S_INST_Max_ODay', checked: false },
      { label: '累年最大风速≥5.0m/s日数	', value: 'WIN_S_Max_A5ms_Days_MMUT', checked: false },
      { label: '累年最大风速≥10.0m/s日数	', value: 'WIN_S_Max_A10ms_Days_MMUT', checked: false },
      { label: '累年最大风速≥12.0m/s日数	', value: 'WIN_S_Max_A12ms_Days_MMUT', checked: false },
      { label: '累年最大风速≥15.0m/s日数	', value: 'WIN_S_Max_A15ms_Days_MMUT', checked: false },
      { label: '累年最大风速≥17.0m/s日数	', value: 'WIN_S_Max_A17ms_Days_MMUT', checked: false },
      { label: '平均地面温度', value: 'GST_Avg', checked: false },
      { label: '日照时数', value: 'SSH', checked: false },
      { label: '月日照百分率', value: 'SSP_Mon', checked: false },
      { label: '累年气温平均差', value: 'TEM_Avg_Dev_MMUT', checked: false },
      { label: '累年温度标准差	', value: 'TEM_SD_MMUT', checked: false },
      { label: '累年月气温最大正距平', value: 'TEM_Panom_Max', checked: false },
      { label: '累年月气温最大负距平', value: 'TEM_Nanom_Max', checked: false },
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
    this.queryHyear();
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
  queryHyear() {
    this.setUrl();
    let sUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    sUrl += 'interfaceId=getSurfMYerEleByStaID&dataCode=SURF_CHN_YER_MMUT_19812010&dataFormat=json&staIds=';
    sUrl += this.selStation.valueOf();
    sUrl += '&elements=Station_Id_C,Station_Name,Years_MMUT,' + this.selUrl;
    this._http.get(sUrl).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        this.yearData = (cimissDt.DS as CimissHYear[])[0];
      }
    });
  }
}
