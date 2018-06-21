import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SevenForcast } from "../../models/sevenforcast";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  forcastes: SevenForcast[] = [];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('http://www.lintongqx.com/weather/Default/GetSevenForcastInfo').subscribe(result => {
      this.forcastes = result as SevenForcast[];
    });
  }

}
