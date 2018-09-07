import { Component, OnInit, Inject } from '@angular/core';
import { SilkForcastParameter } from '../models/silk';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class SilkForecastResult {
  public returnCode: Number;
  public returnMessage: Number;
  public DS: {
    windV: String;
    windD: String;
    maxtemp: String;
    mintemp: String;
    weather: String;
    time: String;
  }[];
}

@Component({
  selector: 'app-silk-forcast',
  templateUrl: './silk-forcast.component.html',
  styleUrls: ['./silk-forcast.component.css']
})
export class SilkForcastComponent implements OnInit {
  forcast: any;
  vm: SilkForecastResult = null;
  constructor(@Inject(MAT_DIALOG_DATA) public dt: SilkForcastParameter,
    public dialogRef: MatDialogRef<SilkForcastComponent>,
    private http: Http,
    private _httpClient: HttpClient,
    private sanitizer: DomSanitizer) { }


  ngOnInit() {
    const url = 'http://47.98.32.177:7100/silk/forecast?stationid=' + this.dt.id;
    this._httpClient.get(url).subscribe(result => {
      this.vm = result as SilkForecastResult;
    });
  }
}
