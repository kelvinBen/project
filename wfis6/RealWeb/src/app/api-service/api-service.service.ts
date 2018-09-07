import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable()
export class ApiServiceService {
baseUrl = 'http://localhost:9000/wfis';
  constructor(private _http: HttpClient) { }

  // getSurfEleByTimeRangeAndStaID(startTime: String, endTime: String, stationId: String) {
  //   let parUrl = 'http://47.98.32.177:7100/cimiss?interfaceId=getSurfEleByTimeRangeAndStaID&dataCode=SURF_CHN_MUL_HOR';
  //   parUrl += '&elements=Station_ID_C,Station_Name,Lon,Lat,Datetime,PRE_1h,PRS,RHU,';
  //   parUrl += 'TEM,TEM_Min,TEM_Max,WIN_S_Inst_Max,WIN_D_INST_Max,VIS_Min';
  //   parUrl += '&staIds=' + stationId;
  //   parUrl += '&timeRange=[';
  //   parUrl += startTime + ',' + endTime + ']';
  //   console.log(parUrl);
  //   this._http.get(parUrl).subscribe(result=>{
  //     console.log(result);
  //   });
  // }
  public getRainByTimeRange(startTime: String, endTime: String, cityId: Number){
    let parUrl = this.baseUrl+'/hour/rangerain?';
    parUrl += '&starttime='+startTime;
    parUrl += '&endtime='+ endTime;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getTempByTimeRange(startTime: String, endTime: String, cityId: Number){
    let parUrl = this.baseUrl+'/hour/rangetemp?';
    parUrl += '&starttime='+startTime;
    parUrl += '&endtime='+ endTime;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getWindByTimeRange(startTime: String, endTime: String, cityId: Number){
    let parUrl = this.baseUrl+'/hour/rangewind?';
    parUrl += '&starttime='+startTime;
    parUrl += '&endtime='+ endTime;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getStaionHourByTimeRange(startTime: String, endTime: String, stationid: String){
    let parUrl = this.baseUrl+'/hour/stationhour?';
    parUrl += '&starttime='+startTime;
    parUrl += '&endtime='+ endTime;
    parUrl += '&stationid='+ stationid;
    return this._http.get(parUrl);
  }
  public getPressByTime(time: String, cityId: Number){
    let parUrl = this.baseUrl+'/hour/press?';
    parUrl += 'time='+time;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getRainByMinute(date:String, cityId: Number){
    let parUrl = this.baseUrl + '/minute/pre?';
    parUrl += 'date='+ date;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getYwsfByMinute(date:String, cityId:Number){
    let parUrl = this.baseUrl + '/minute/ywsf?';
    parUrl += 'date=' +date;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getOtherByMinute(date:String, cityId:Number){
    let parUrl = this.baseUrl + '/minute/ywsf?';
    parUrl += 'date=' +date;
    parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getStations(){
    let parUrl = this.baseUrl + '/station/city?';
    parUrl += 'cityid=' +10;
    //parUrl += '&cityid='+ cityId;
    return this._http.get(parUrl);
  }
  public getShp(){
    let parUrl = this.baseUrl + '/shp?name=西安市&type=行政';
    return this._http.get(parUrl);
  }
}
