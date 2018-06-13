export class CimissResult {
    public returnCode: String;
    public returnMessage: String;
    public rowCount: String;
    public colCount: String;
    public DS: Object[];
}

export class CimissStation {
    public Station_Id_C: String;
    public Station_Name: String;
    public City: String;
    public Cnty: String;
    public Town: String;
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
    public Station_Name: String;
    public Datetime: String;
    public PRE_1h: String;
    public PRS: String;
    public RHU: String;
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
    public WIN_D_Avg_2mi: String; // 2分钟平均风向
    public WIN_S_Avg_2mi: String; // 2分钟平均风速
    public VIS: String;
    public VIS_Min: String; // 最小水平能见度
    public VIS_Min_OTime: String; // 最小水平能见度出现时间
    public GST: String; // 地面温度
    public GST_Max: String; // 最高地面温度
    public GST_Max_Otime: String; // 最高地面温度出现时间
    public GST_Min: String; // 最低地面温度
    public GST_Min_OTime: String; // 最低地面温度出现时间
    public GST_5cm: String; // 5cm地温
    public GST_10cm: String;
    public GST_15cm: String;
    public GST_20cm: String;
    public GST_40cm: String;
    public GST_80cm: String;
    public GST_160cm: String;
    public GST_320cm: String;
    public LGST: String; // 草温
}

// 中国地面日值资料
export class CimissDay {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public TEM_Avg: String;
    public TEM_Max: String;
    public TEM_Max_OTime: String;
    public TEM_Min: String;
    public TEM_Min_OTime: String;
    public SSH: String; // 日照时数
    public Sunrist_Time: String; // 日出时间
    public Sunset_Time: String; // 日落时间 时分
    public EVP: String; // 蒸发 毫米
    public PRE_Time_2020: String; // 20-20时降水量
    public PRE_Time_0808: String; // 08-08时降水量
    public PRE_Max_1h: String; // 1小时最大降水量
    public PRE_Max_1h_OTime: String; // 日小时最大降水量出现时间
    public RHU_Avg: String;
    public RHU_Min: String;
    public RHU_Min_OTIME: String;
}

// 中国地面累年日值数据（1981-2010）
export class CimissDayMMUT19812010 {
    public Station_Id_C: String;
    public Station_Name: String;
    public Day_Seq: String;
    public TEM_Avg: String;
    public TEM_Max_Avg_MMUT: String; // 累年平均日最高气温
    public TEM_Min_Avg_MMUT: String; // 累年平均日最低气温
    public GST_Avg: String;
    public GST_Max_Avg_MMUT: String; // 累年日平均最高地面温度
    public GST_Min_Avg_MMUT: String; // 累年日平均最低地面温度
    public SSH: String; // 日照时数
    public PRE_Time_2020_MMUT: String;
    public PRE_Time_0808_MMUT: String;
}

// 土壤水分逐小时要素资料 AGME_CHN_SOIL_HOR
export class CimissSoilHour {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public Soil_Depth_BelS: String; // 地表以下(土壤、土层)深度
    public SRHU: String; // 土壤相对湿度 百分率
}

// 中国地面月值资料
export class CimissMonth {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public TEM_Avg: String; // 平均气温
    public TEM_Max_Avg: String; // 平均最高气温
    public TEM_Min_Avg: String; // 平均最低气温
    public TEM_Max: String; // 最高气温
    public TEM_Max_Days: String; // 极端最高气温出现日数
    public TEM_Max_ODay_C: String; // 极端最高气温出现日(字符型)
    public TEM_Min: String; // 最低气温
    public TEM_Min_Days: String; // 极端最低气温出现日数
    public TEM_Min_ODay_C: String; // 最低气温出现日(字符型)
    public TEM_Avg_Dev: String; // 平均气温日较差
    public TEM_Max_Dev: String; // 最大气温日较差
    public V12304_040: String; // 最大气温日较差出现日
    public TEM_Dev_Max_ODay: String; // 最大气温日较差出现日
    public TEM_Dev_Max_ODay_C: String; // 最大气温日较差出现日(字符型)
    public TEM_Min_Dev_Mon: String; // 月最小气温日较差
    public TEM_Dev_Min_Days: String; // 最小气温日较差出现日数
    public TEM_Dev_Min_ODay_C: String; // 月最小气温日较差出现日(字符型)
    public TEM_Max_A30C_Days: String; // 日最高气温≥30℃日数
    public TEM_Max_A35C_Days: String; // 日最高气温≥35℃日数
    public TEM_Max_A40C_Days: String; // 日最高气温≥40℃日数
    public TEM_Min_B2C_Days: String; // 日最低气温＜2Cel日数
    public TEM_Min_B0C_Days: String; // 日最低气温＜0℃日数
    public TEM_Min_Bn2C_Days: String; // 日最低气温＜-2℃日数
    public TEM_Min_Bn15C_Days: String; // 日最低气温＜-15℃日数
    public TEM_Min_Bn30C_Days: String; // 日最低气温＜-30Cel日数
    public TEM_Min_Bn40C_Days: String; // 日最低气温＜-40Cel日数
    public TEM_Avg_A26_Days: String; // 冷度日数(日平均气温≥26.0℃)
    public TEM_Avg_B18_Days: String; // 暖度日数(日平均气温≤18.0℃)
    public PRE_Time_2020: String; // 20-20时降水量
    public PRE_Time_0808: String; // 08-08时降水量
    public PRE_Max_Day: String; // 最大日降水量
    public PRE_Max_Mon_Days: String; // 月最大日降水量出现日数
    public PRE_Max_ODay_C: String; // 最大日降水量出现日(字符型)
    public PRE_A0p1mm_Days: String; // 日降水量≥0.1mm日数
    public PRE_A1mm_Days: String; // 日降水量≥1mm日数
    public PRE_A5mm_Days: String; // 日降水量≥5mm日数
    public PRE_A10mm_Days: String; // 日降水量≥10mm日数
    public PRE_A25mm_Days: String; // 日降水量≥25mm日数
    public PRE_A50mm_Days: String; // 日降水量≥50mm日数
    public PRE_A100mm_Days: String; // 日降水量≥100mm日数
    public PRE_A150mm_Days: String; // 日降水量≥150mm日数
    public Days_Max_Coti_PRE: String; // 最长连续降水日数
    public PRE_Conti_Max: String; // 最长连续降水量
    public EDay_Max_Coti_PRE: String; // 最长连续降水止日
    public NPRE_LCDays: String; // 最长连续无降水日数
    public NPRE_LCDays_EDay: String; // 最长连续无降水止日
    public PRE_Max_Conti: String; // 最大连续降水量
    public Days_Max_Conti_PRE: String; // 最大连续降水日数
    public PRE_Coti_Max_EDay: String; // 最大连续降水止日
    public PRE_Max_1h: String; // 1小时最大降水量
    public PRE_Max_1h_Days: String; // 1小时最大降雨量出现日数
    public PRE_Max_1h_ODay_C: String; // 1小时最大降水量出现日(字符型)
    public WIN_S_2mi_Avg: String; // 平均2分钟风速
    public WIN_S_Max: String; // 最大风速
    public WIN_D_S_Max_C: String; // 最大风速的风向(字符型)
    public Days_WIN_S_Max: String; // 最大风速出现日数
    public WIN_S_Max_ODay_C: String; // 最大风速出现日(字符型)
    public WIN_S_A5ms_Days: String; // 最大风速≥5.0m/s日数
    public WIN_S_Max_A10ms_Days: String; // 最大风速≥10m/s日数
    public WIN_S_A12ms_Days: String; // 最大风速≥12.0m/s日数
    public V11042_15: String; // 最大风速≥15.0m/s日数
    public WIN_S_A17ms_Days: String; // 最大风速≥17.0m/s日数
    public WIN_S_Inst_Max: String; // 极大风速
    public WIN_D_INST_Max_C: String; // 极大风速的风向(字符型)
    public V11046_040: String; // 极大风速之出现日数
    public WIN_S_INST_Max_ODay_C: String; // 极大风速出现日(字符型)
}
//地面旬值资料
export class CimissTen {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public TEM_Avg: String; // 平均气温
    public TEM_Max: String; // 最高气温
    public TEM_Max_Days: String; // 极端最高气温出现日数
    public TEM_Max_ODay_C: String; // 极端最高气温出现日(字符型)
    public TEM_Min: String; // 最低气温
    public TEM_Min_Days: String; // 极端最低气温出现日数
    public TEM_Min_ODay_C: String; // 最低气温出现日(字符型)
    public GST_Avg: String; // 平均地面温度
    public GST_Max: String; // 最高地面温度
    public EGST_Max_Days: String; // 极端最高地面气温出现日数	
    public EGST_Max_ODay_C: String; // 极端最高地面温度出现日(字符型)
    public GST_Min: String; // 最低地面温度	
    public Days_GST_Min: String; // 极端最低地面气温出现日数
    public GST_Min_Ten_ODay_C: String; //旬极端最低地面温度出现日(字符型)
    public VAP_Avg: String; //平均水汽压
    public RHU_Avg: String; //平均相对湿度
    public GST_Avg_5cm: String; //平均5cm地温
    public GST_Avg_10cm: String; //平均10cm地温
    public GST_Avg_15cm: String; //平均15cm地温
    public GST_Avg_20cm: String; //平均20cm地温
    public GST_Avg_40cm: String; //平均40cm地温
    public GST_Avg_80cm: String; //平均80cm地温
    public GST_Avg_160cm: String; //平均160cm地温
    public GST_Avg_320cm: String; //平均320cm地温
    public WIN_S_2mi_Avg: String; //平均2分钟风速
    public WIN_S_10mi_Avg: String; //平均10分钟风速
    public GaWIN_Days: String; //大风日数
    public Snow_Depth_Max: String; //最大积雪深度
    public V13334_040: String; //最大积雪深度日数
    public V13334_060_C: String; //最大积雪深度出现日
    public EVP: String; //蒸发
    public EVP_Big: String; //蒸发（大型）
    public SSH: String; //日照时数
    public SSP_Mon: String; //月日照百分率
    public PRE_Time_2020: String; // 20-20时降水量
    public PRE_Time_0808: String; // 08-08时降水量
    public PRE_A0p1mm_Days: String; // 日降水量≥0.1mm日数
    public PRE_A25mm_Days: String; // 日降水量≥25mm日数
    public PRE_A50mm_Days: String; // 日降水量≥50mm日数
}
//累年日值资料
export class CimissHDay {
    public Station_Id_C: String;
    public Station_Name: String;
    public Years_MMUT: String;//累年年段
    public Day_Seq: String; // 日序
    public TEM_Avg: String; // 平均气温
    public TEM_Max_Avg_MMUT: String; // 累年平均日最高气温
    public TEM_Min_Avg_MMUT: String; // 累年平均日最低气温
    public VAP_Avg: String; // 平均水气压
    public PRE_Time_2020_MMUT: String; // 累年20-20时平均降水量
    public PRE_Time_0808_MMUT: String; // 累年08-08时平均降水量
    public WIN_S_Avg: String; // 平均风速
    public GST_Avg: String; // 平均地面温度
    public GST_Min_Avg_MMUT: String; // 累年日平均最低地面温度
    public GST_Max_Avg_MMUT: String; // 累年日平均最高地面温度
    public SSH: String; // 日照时数	
}
// 累年月值资料
export class CimissHMonth {
    public Station_Id_C: String;
    public Station_Name: String;
    public Years_MMUT: String; // 累年年段
    public PRS_Max_OYear: String; // 极端最高气压出现年
    public Mon_Seq: String; // 月序
    public GST_Min_OYear: String; // 最低地面气温出现年
    public TEM_Min_OYear: String; // 最低气温出现年
    public TEM_Dev_Min_OYear: String; // 月最小气温日较差出现年
    public PRE_Max_OYear: String; // 最大日降水量出现年
    public NPRE_LCDays_EDay: String; // 最长连续无降水止日
    public V13334_057: String; // 最大积雪深度出现年
    public WIN_S_INST_Max_OYear: String; // 极大风速出现年份
    public EGST_Max_OYear: String; // 极端最高地面温度出现年
    public GST_Min_OYear_err: String; // 最低地面温度出现时间
}

//累年年值资料
export class CimissHYear {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public TEM_Avg: String; // 平均气温
    public TEM_Max_Avg: String; // 平均最高气温
    public TEM_Min_Avg: String; // 平均最低气温
    public TEM_Max: String; // 最高气温
    public TEM_Max_ODay: String; // 极端最高气温出现日
    public TEM_Max_OMon: String; // 极端最高气温出现月
    public TEM_Max_OYear: String; // 极端最高气温出现年
    public TEM_Min: String; // 最低气温
    public TEM_Min_ODay: String; // 最低气温出现日
    public TEM_Min_OMon: String; // 最低气温出现月
    public TEM_Min_OYear: String; // 最低气温出现年
    public TEM_Avg_Dev: String; // 平均气温日较差
    public TEM_Max_Dev: String; // 最大气温日较差
    public TEM_Dev_Max_ODay: String; // 最大气温日较差出现日
    public TEM_Dev_Max_OMon: String; // 最大气温日较差出现月
    public TEM_Dev_Max_OYear: String; // 最大气温日较差出现年
    public TEM_Min_Dev_Mon: String; // 月最小气温日较差
    public TEM_Dev_Min_ODay: String; // 月最小气温日较差出现日
    public TEM_Dev_Min_OMon: String; // 月最小气温日较差出现月
    public TEM_Dev_Min_OYear: String; // 月最小气温日较差出现年
    public TEM_Max_A30C_Days_MMUT: String; // 累年日最高气温≥30℃日数
    public TEM_Max_A30_LCDays_MMUT: String; // 累年日最高气温≥30.0℃最长连续日数
    public V12707_30: String; // 日最高气温≥30.0℃最长连续日数止年
    public TEM_Max_A30_LCDays_EMon: String; // 日最高气温≥30.0℃最长连续日数之止月
    public TEM_Max_A30_LCDays_EDay: String; // 日最高气温≥30.0℃最长连续日数之止日
    public TEM_Max_A35C_Days_MMUT: String; // 累年日最高气温≥35℃日数
    public TEM_Max_A35_LCDays_MMUT: String; // 累年日最高气温≥35.0℃最长连续日数
    public V12707_35: String; // 日最高气温≥35.0℃最长连续日数止年
    public TEM_Max_A35_LCDays_EMon: String; // 日最高气温≥35.0℃最长连续日数之止月
    public TEM_Max_A35_LCDays_EDay: String; // 日最高气温≥35.0℃最长连续日数之止日
    public TEM_Max_A37C_Days_MMUT: String; // 累年日最高气温≥37℃日数
    public TEM_Max_A37_LCDays_MMUT: String; // 累年日最高气温≥37.0℃最长连续日数
    public V12707_37: String; // 日最高气温≥37.0℃最长连续日数止年
    public TEM_Max_A37_LCDays_EMon: String; // 日最高气温≥37.0℃最长连续日数之止月
    public TEM_Max_A37_LCDays_EDay: String; // 日最高气温≥37.0℃最长连续日数之止日
    public TEM_Max_A40C_Days_MMUT: String; // 累年日最高气温≥40℃日数
    public TEM_Max_A40_LCDays_MMUT: String; // 累年日最高气温≥40.0℃最长连续日数
    public V12707_40: String; // 日最高气温≥40.0℃最长连续日数止年
    public TEM_Max_A40_LCDays_EMon: String; // 日最高气温≥40.0℃最长连续日数之止月
    public TEM_Max_A40_LCDays_EDay: String; // 日最高气温≥40.0℃最长连续日数之止日
    public TEM_Min_B2C_Days_MMUT: String; // 累年日最低气温＜2℃日数
    public PRE_Time_2020_MMUT: String; // 累年20-20时平均降水量
    public PRE_Time_0808_MMUT: String; // 累年08-08时平均降水量
    public PRE_Max_Mon: String; // 月最多降水量
    public PRE_Max_Mon_OYear: String; // 月最多降水量出现年份
    public PRE_Min_Mon: String; // 月最少降水量
    public PRE_Min_Mon_OYear: String; // 月最少降水量出现年份	
    public PRE_Max_Day: String; // 最大日降水量	
    public PRE_Max_OYear: String; // 最大日降水量出现年	
    public PRE_Max_OMon: String; // 最大日降水量出现月	
    public PRE_Max_ODay: String; // 最大日降水量出现日	
    public PRE_A0p1mm_Days_MMUT: String; // 累年日降水量≥0.1mm日数
    public PRE_A1mm_Days_MMUT: String; // 累年日降水量≥1mm日数
    public PRE_A5mm_Days_MMUT: String; // 累年日降水量≥5mm日数
    public PRE_A10mm_Days_MMUT: String; // 累年日降水量≥10mm日数
    public PRE_A25mm_Days_MMUT: String; // 累年日降水量≥25mm日数
    public PRE_A50mm_Days_MMUT: String; // 累年日降水量≥50mm日数
    public PRE_A100mm_Days_MMUT: String; // 累年日降水量≥100mm日数
    public PRE_A150mm_Days_MMUT: String; // 累年日降水量≥150mm日数
    // public Days_Max_Coti_PRE_MMUT: String; // 累年最长连续降水日数	
    // public PRE_Conti_Max: String; // 最长连续降水量	
    // public PRE_Conti_Max_EDay_Year: String; // 最长连续降水止日年份	
    // public PRE_LCDays_EMon: String; // 最长连续降水止月	
    // public EDay_Max_Coti_PRE: String; // 最长连续降水止日
    // public PRE_Max_Conti: String; // 最大连续降水量
    // public V20434_701: String; // 累年最大连续降水日数
    // public PRE_Max: String; // 月最大连续降水止日年份
    // public PRE_1h_Max: String; // 最大1小时降水量
    // public PRE_1h_Max_OYear: String; // 最大1小时降水量出现年份		
    // public PRE_1h_Max_OMon: String; // 最大1小时降水量出现月	
    // public PRE_1h_Max_ODATE	: String; // 最大1小时降水量出现日期	
    public RAD_PRE: String; // 降水量相对平均差	
    public PRE_AD: String; // 降水量平均差
    public PRE_RSD: String; // 降水量相对标准差
    public PRE_SD: String; // 降水量标准差
    public WIN_S_Inst_Max: String; // 极大风速
    public WIN_D_INST_Max: String; // 极大风速的风向	
    public WIN_S_INST_Max_OYear: String; // 极大风速出现年份
    public WIN_S_INST_Max_OMon: String; // 极大风速出现月	
    public WIN_S_INST_Max_ODay: String; // 极大风速出现日	
    public WIN_S_Max_A5ms_Days_MMUT: String; // 累年最大风速≥5.0m/s日数	
    public WIN_S_Max_A10ms_Days_MMUT: String; // 累年最大风速≥10.0m/s日数	
    public WIN_S_Max_A12ms_Days_MMUT: String; // 累年最大风速≥12.0m/s日数	
    public WIN_S_Max_A15ms_Days_MMUT: String; // 累年最大风速≥15.0m/s日数	
    public WIN_S_Max_A17ms_Days_MMUT: String; // 累年最大风速≥17.0m/s日数	
    public GST_Avg: String; // 平均地面温度		
    // public EGST_Max_Avg_Mon	: String; // 月平均最高地面温度			
    // public GST_Min_Avg: String; // 月平均最低地面温度			
    // public EGST_Max: String; // 极端最高地面温度			
    // public EGST_Max_OYear: String; // 极端最高地面温度出现年			
    // public EGST_Max_OMon: String; // 极端最高地面温度出现月			
    // public EGST_Max_ODay: String; // 极端最高地面温度出现日			
    // public GST_Min: String; // 最低地面温度			
    // public GST_Min_OYear_err: String; // 最低地面温度出现时间				
    // public GST_Min_Ten_OMon	: String; // 旬极端最低地面温度出现月				
    // public GST_Min_Ten_ODay: String; // 旬极端最低地面温度出现日				
    // public GST_Avg_5cm: String; // 平均5cm地温				
    // public GST_Avg_10cm: String; // 平均10cm地温				
    // public GST_Avg_15cm: String; // 平均15cm地温				
    // public GST_Avg_20cm: String; // 平均20cm地温				
    // public GST_Avg_40cm: String; // 平均40cm地温				
    // public GST_Avg_80cm: String; // 平均80cm地温
    // public GST_Avg_160cm: String; // 平均160cm地温
    // public GST_Avg_320cm: String; // 平均320cm地温
    public SSH: String; // 日照时数
    public SSP_Mon: String; // 月日照百分率
    public TEM_Avg_Dev_MMUT: String; // 累年气温平均差
    public TEM_SD_MMUT: String; // 累年气温标准差
    public TEM_Panom_Max: String; // 累年月气温最大正距平
    public TEM_Nanom_Max: String; // 累年月气温最大负距平
    public ACTEM_TEM_Avg_StPas_0: String; // 日平均气温稳定通过0.0℃之积温
    public ACTEM_TEM_Avg_StPas_5: String; // 日平均气温稳定通过5.0℃之积温
    public ACTEM_TEM_Avg_StPas_10: String; // 日平均气温稳定通过10.0℃之积温
    public ACTEM_TEM_Avg_StPas_12: String; // 日平均气温稳定通过12.0℃之积温
    public ACTEM_TEM_Avg_StPas_15: String; // 日平均气温稳定通过15.0℃之积温
    public ACTEM_TEM_Avg_StPas_20: String; // 日平均气温稳定通过20.0℃之积温
    public ACTEM_TEM_Avg_StPas_22: String; // 日平均气温稳定通过22.0℃之积温
}


// 中国地面日照资料
export class CimissSSH {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public SSH: String;
    public SSH_Time_0001: String;
    public SSH_Time_0102: String;
    public SSH_Time_0203: String;
    public SSH_Time_0304: String;
    public SSH_Time_0405: String;
    public SSH_Time_0506: String;
    public SSH_Time_0607: String;
    public SSH_Time_0708: String;
    public SSH_Time_0809: String;
    public SSH_Time_0910: String;
    public SSH_Time_1011: String;
    public SSH_Time_1112: String;
    public SSH_Time_1213: String;
    public SSH_Time_1314: String;
    public SSH_Time_1415: String;
    public SSH_Time_1516: String;
    public SSH_Time_1617: String;
    public SSH_Time_1718: String;
    public SSH_Time_1819: String;
    public SSH_Time_1920: String;
    public SSH_Time_2021: String;
    public SSH_Time_2122: String;
    public SSH_Time_2223: String;
    public SSH_Time_2324: String;
}

// 中国地面年值资料
export class CimissYear {
    public Station_Id_C: String;
    public Station_Name: String;
    public Datetime: String;
    public Year: String;
    public TEM_Avg: String;
    public ACTEM_TEM_Avg_StPas_0: String; // 日平均气温稳定通过0.0℃之积温
    public ACTEM_TEM_Avg_StPas_5: String; // 日平均气温稳定通过5.0℃之积温
    public ACTEM_TEM_Avg_StPas_10: String; // 日平均气温稳定通过10.0℃之积温
    public ACTEM_TEM_Avg_StPas_15: String; // 日平均气温稳定通过15.0℃之积温
    public ACTEM_TEM_Avg_StPas_20: String; // 日平均气温稳定通过20.0℃之积温
    public ACTEM_TEM_Avg_StPas_22: String; // 日平均气温稳定通过22.0℃之积温
}
