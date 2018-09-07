
export class ApiResult {
    public returnCode: Number;
    public returnMessage: String;
    public DS: object[];
}
export class CimissResult {
    public returnCode: String;
    public returnMessage: String;
    public rowCount: String;
    public colCount: String;
    public DS: Object[];
}

// 中国地面分钟降水资料
export class CimissPREMinute {
    public Station_Id_C: String;
    public Datetime: String;
    public PRE: String;
}

// SURF_CHN_MUL_TENMIN_PRE
export class CimissTenMinutePRE {
    public Station_Id_C: String;
    public Station_Name: String;
    public PRE: String;
    public Datetime: String;
}

// 中国地面分钟其它要素资料
export class CimissOtherMinute {
    public Station_Id_C: String;
    public Datetime: String;
    public PRS_Max: String;
    public PRS_Min: String;
    public RHU_Min: String;
    public TEM_Max: String;
    public TEM_Min: String;
    public WIN_D_INST_Max: String;
    public WIN_S_Inst_Max: String;
}

// 中国地面分钟压温湿风资料
export class CimissMainMinute {
    public Station_Id_C: String;
    public Station_Name:String;
    public Datetime: String;
    public PRS: String;
    public TEM: String;
    public RHU: String;
    public WIN_D_Avg_1mi: String;
    public WIN_S_Avg_1mi: String;
}
// 中国地面逐小时资料
export class CimissHour {
    public Station_Id_C: String;
    public Datetime: String;
    public PRE_1h: String;
    public PRS: String;
    public RHU: number;
    public PRS_Change_3h: String;
    public PRS_Change_24h: String;
    public TEM: String;
    public TEM_Max_OTime: String;
    public TEM_Max: String;
    public TEM_Min: String;
    public TEM_Min_OTime: String;
    public WIN_D_INST_Max: String;
    public WIN_S_Inst_Max: String;
    public WIN_S_INST_Max_OTime: String;
}
//单站小时数据
export class ApiHour {
    public prs:String;
    public temMax:String;
    public winSAvg2mi:String;
    public winDInstMax:String;
    public winSInstMax:String;
    public winDAvg2mi:String;
    public pre1h:String;
    public stationIdC:String;
    public temMin:String;
    public tem:String;
    public rhu:String;
    public datetime:String;
}