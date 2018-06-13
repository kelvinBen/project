export class HourMainModel {
    public Station_Name: string;
    public Station_ID_C: string;
    public Datetime: string;
    public Lon: number;
    public Lat: number;
    public PRE_1h: number;
    public PRE_3h: number;
    public PRE_6h: number;
    public PRS: number;
    public RHU: number;
    public PRS_3h: string;
    public PRS_3h_Pre: string;
    public TEM: number;
    public PRE_Max: number;
    public PRE_Sum: number;
    public TEM_Min: number;
    public TEM_Min_OTime: number;
    public TEM_Max: number;
    public TEM_Max_OTime: string;
    public WIN_D_INST_Max: number;
    public WIN_S_Inst_Max: number;
    public WIN_S_INST_Max_OTime: string;
    public VIS_Min: number; // 最小水平能见度
    public VIS_Min_OTime: string; // 最小水平能见度出现时间
}
