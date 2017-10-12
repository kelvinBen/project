import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { MonitorComponent } from './monitor.component';
import { MinuteComponent } from './minute/minute.component';
import { HourComponent } from './hour/hour.component';
import { RadarComponent } from './radar/radar.component';
import * as esriLoader from 'esri-loader';

const appRoutes: Routes = [
  {
    path: 'monitor', component: MonitorComponent,
    children: [
      { path: 'minute', component: MinuteComponent },
      { path: 'hour', component: HourComponent },
      { path: 'radar', component: RadarComponent }
    ]
  },
];
esriLoader.bootstrap((err) => {
  if (err) {
    console.log(err);
  } else {
    // optionall execute any code once it's preloaded
  }
}, {
    // url: 'https://js.arcgis.com/3.21/'
    url: 'http://120.26.44.171:5558/init.js'
  });
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    HttpClientModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [MonitorComponent, MinuteComponent, HourComponent, RadarComponent]
})
export class MonitorModule { }
