export class CimissModel {
    public returnCode: String;
    public returnMessage: String;
    public rowCount: String;
    public colCount: String;
    public requestParams: String;
    public requestTime: String;
    public responseTime: String;
    public takeTime: String;
    public fieldNames: String;
    public fieldUnits: String;
    public DS: Object[];
}
export class MinuteMainModel {
    public Station_ID_C: String;
    public Station_Name: String;
    public Datetime: Date;
    public TEM: String;
    public PRS: String;
    public RHU: String;
    public WIN_D_Avg_1mi: String;
    public WIN_S_Avg_1mi: String;
}