export class SevenForcast {
    public Date: string;
    public Temp: TempForcast;
    public Weather: WeatherForcast;
    public Wind: WindForcast;
}

export class TempForcast {
    public MAX: string;
    public Min: string;
}

export class WeatherForcast {
    public WImage1: string;
    public WImage2: string;
    public WName1: string;
    public WName2: string;
    public Weather1: number;
    public Weather2: number;
}

export class WindForcast {
    public WindD: string;
    public WindV: string;
}
