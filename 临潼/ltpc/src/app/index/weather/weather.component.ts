import { Component, OnInit } from '@angular/core';
import { Result } from '../../service/result';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  constructor(private serverService: ServerService) { }

  forcast: any;//七天预报
  ngOnInit() {
    this.serverService.forcast().subscribe(
      result => { this.forcast = result; },
      error => { console.log(error); }
    )
  }

}
