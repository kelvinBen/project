import { Station } from './stations';

export class HourRain {
    public station: Station;
    public Rain: number;
    public LastRain: number;
    public MaxRain: number;
    public MaxTime: String;
}

export class HourPress {
    public station: Station;
    public PRS: String;
    public PRS_Change_3h: String;
    public PRS_Change_24h: String;
}

export class HourTemp {
    public station: Station;
    public TEM: String;
    public TEM_Max_OTime: String;
    public TEM_Max: String;
    public TEM_Min: String;
    public TEM_Min_OTime: String;
}

export class HourWind {
    public station: Station;
    public WIN_D_INST_Max: String;
    public WIN_S_Inst_Max: String;
    public WIN_S_INST_Max_OTime: String;
}



