import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { MinuteMainModel } from '../../models/cimiss';
import * as moment from 'moment';

@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html'
})
export class WeatherPage implements OnInit {

  bWarn: Boolean = true;
  bShowWarn: Boolean = false;
  @Input() data: MinuteMainModel;
  constructor(public navCtrl: NavController,
    public _http: HttpClient) {

  }
  ngOnInit() {
  }

  FormatDateTime(time: Date): String {
    return moment(time).add(8, 'hours').format('YYYY年MM月DD日HH时mm分');
  }

}