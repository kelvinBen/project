import { Station } from './stations';
import { CimissOtherMinute, CimissMainMinute } from './cimiss';

export class RainModel {
    public station: Station;
    public R1: Number;
    public R2: Number;
    public R3: Number;
    public R4: Number;
    public R5: Number;
    public R6: Number;
}

export class OtherModel {
    public station: Station;
    public value: CimissOtherMinute;
}

export class MainModel {
    public station: Station;
    public value: CimissMainMinute;
}

export class MinuteTabGrid {
    public title: String;
    public index: Number;
}

export class MinuteData {
    public Station_Id_C: String;
    public PRS: String;
    public TEM: String;
    public RHU: String;
    public PRE: String;
    public TEM_Max: String;
    public TEM_Max_OTime: String;
    public TEM_Min: String;
    public TEM_Min_OTime: String;
    public WIN_D_INST_Max: String;
    public WIN_S_Inst_Max: String;
    public WIN_S_INST_Max_OTime: String;
    public VIS_Min: String;
}
