export class RealWeather {
    constructor(
      public High: string,
      public Latitude: string,
      public Longitude: string,
      public StnName: string,
      public StnNum: string,
      public StnType: number,
      public Temp: number
    ) { }
  }