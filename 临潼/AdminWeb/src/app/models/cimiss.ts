export class CimissValueModel {
    public Station_Name: string;
    public Station_ID_C: string;
    public Datetime: string;
    public City: string;
    public Cnty: string;
    public Town: string;
    public Lon: string;
    public Lat: string;
    public PRS: string;
    public PRE: string;
    public PRE_1h: number;
    public PRE_3h: number;
    public PRE_6h: number;
    public TEM: number;
    public TEM_Min: number;
    public TEM_Min_OTime: string;
    public TEM_Max: number;
    public TEM_Max_OTime: string;
    public WIN_S_Inst_Max: string;
    public WIN_D_INST_Max: string;
    public WIN_S_INST_Max_OTime: string;
}

export class CimissMonthHistoryModel {
    public Station_Name: string;
    public Year: string;
    public Mon: string;
    public TEM_Avg: string; // 平均气温
    public TEM_Max: string; // 最高气温
    public TEM_Min: string; // TEM_Min
    public PRE_Max_Day: string; // 最大日降水量
    public Days_Max_Coti_PRE: string; // 最长连续降水日数
    public PRE_Conti_Max: string; // 最长连续降水量
    public PRE_Max_Conti: string; // 最大连续降水量
    public PRE_Max_1h: string; // 1小时最大降水量
    public WIN_S_Inst_Max: string;
    public WIN_D_INST_Max_C: string;
    public WIN_S_INST_Max_ODay_C: string;
}

export class CimissModel {
    public returnCode: string;
    public returnMessage: string;
    public rowCount: string;
    public colCount: string;
    public requestParams: string;
    public requestTime: string;
    public responseTime: string;
    public takeTime: string;
    public fieldNames: string;
    public fieldUnits: string;
    public DS: Object[];
}

export class CimissStation {
    public Station_Name: string;
    public Station_Id_C: string;
    public Province: string;
    public City: string;
    public Cnty: string;
    public Station_levl: string;
    public Town: string;
    public Lon: string;
    public Lat: string;
    public Alti: string;
}
