import { Station } from './stations';
import { CimissOtherMinute, CimissMainMinute } from './cimiss';

export class RainModel {
    public stationid: String;
    public pre10: Number;
    public pre20: Number;
    public pre30: Number;
    public pre40: Number;
    public pre50: Number;
    public pre60: Number;
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
