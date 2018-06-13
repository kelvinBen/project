export class RegeoCode {
    public formatted_address: String;
}

export class GeocoderModel {
    public status: String;
    public regeocode: RegeoCode;
}

export class GridResult {
    public Time: String;
    public Values: Number[][];
}

export class GridParameter {
    public Xmax: Number;
    public Xmin: Number;
    public Ymax: Number;
    public Ymin: Number;
    public Num: Number;
    public Fhour: Number;
    public Ftime: String;
    public Ftype: String;
    public Timeslot: Number;
}
