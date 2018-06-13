import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { MinuteMainModel } from '../models/cimiss';
import * as moment from 'moment';
import { Station } from '../models/station';

@Injectable()
export class AppService {
    public realDatas: MinuteMainModel[] = [];
    public stations: Station[] = [];
    constructor(public _http: HttpClient, private storage: Storage) {
        this.storage.get('realdatas').then((val) => {
            this.realDatas = val as MinuteMainModel[];
        });
        this.storage.get('stations').then( val => {
            const stns = val as Station[];
            if (!stns || stns.length == 0){
                this.initStation();
            }
        });
    }
    private initStation() {
        this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
            const dts = result as Station[];
            this.storage.set('stations', dts);
        });
    }
    QueryRealWeather() {
        let url = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
        url += '&interfaceId=getSurfEleByTimeAndStaID&dataCode=SURF_CHN_MAIN_MIN';
        url += '&elements=Station_ID_C,Station_Name,Datetime,TEM,PRS,RHU,WIN_D_Avg_1mi,';
        url += 'WIN_S_Avg_1mi&dataFormat=json&staIds=57132,57131,57048,57047,57044,57040,57039,57032,57033&times=';
        let currentDate = moment().add(-8, 'hours');
        let minu = currentDate.minutes();
        minu = minu - (minu % 5);
        currentDate = currentDate.minutes(minu).add(-5, 'minutes');
        url += currentDate.format('YYYYMMDDHHmm') + '00';
        return this._http.get(url);
    }
}