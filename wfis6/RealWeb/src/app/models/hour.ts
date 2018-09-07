import { Station } from './stations';

export class HourRain {
    // public station: Station;
    public stationIdC:String;
    public totalrain: number;
    public maxvalue: number;
    public maxtime: String;
}
export class HourPress {
    public stationIdC: String;
    public prs: String;
    public prsChange3h: String;
    public prsChange24h: String;
}

export class HourTemp {
    public stationIdC: Station;
    public value: Number;
    public maxtime: String;
    public maxvalue: Number;
    // public TEM_Min: Number;
    // public TEM_Min_OTime: String;
}
// "datetime": "2018-07-09 13:00:00",
//                 "maxvalue": 22.5,
//                 "Station_Id_C": "V8721",
//                 "value": 21.6,
//                 "maxtime": "2018-07-09 08:00:00"

export class HourWind {
    public stationIdC: String;
    public winDSMax: Number;
    public winSMax: Number;
    public winDInstMax: Number;
    public winSInstMax: Number;
    public winSInstMaxOTime: String;
    public Datetime: String;
    // public WIND_S_Level: Number;
    // public WIND_S_INST_Level: Number;
}

// "WIN_S_Max": "999999",
// "WIN_D_INST_Max": "999999",
// "WIN_S_Inst_Max": "999999",
// "Station_Id_C": "V8721",
// "Datetime": "2018-07-09 13:00:00",
// "WIN_D_S_Max": "999999",
// "WIN_S_INST_Max_OTime": "1970-01-01 08:16:40"
// },

