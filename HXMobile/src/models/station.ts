import { MinuteData } from "./minute";

export class Station {
    public Station_Id_C: String;
    public Station_Name: String;
    public Province: String;
    public City: String;
    public Cnty: String;
    public Town: String;
    public Station_levl: String;
    public Lat: Number;
    public Lon: Number;
    public Alti: Number;
}

export class StationAttribute {
    public stn: Station;
    public time: Date;
    public min?: MinuteData;
}