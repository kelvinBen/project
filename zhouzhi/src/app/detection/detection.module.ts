import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MatButtonModule } from '@angular/material';
import { Md2Module } from 'md2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as esriLoader from 'esri-loader';
import * as moment from 'moment';


import { DetectionComponent} from './detection.component';
import { MDetectionComponent } from './m-detection/m-detection.component';
import { HDetectionComponent } from './h-detection/h-detection.component';
import { RadarDetectionComponent } from './radar-detection/radar-detection.component';
import { ThunderDetectionComponent } from './thunder-detection/thunder-detection.component';
import { ColorMapComponent } from './color-map/color-map.component';

const appRoutes: Routes = [{
  path: 'detection', component: DetectionComponent, children: [
    { path: 'm-detection', component: MDetectionComponent },
    { path: 'h-detection', component: HDetectionComponent },
    { path: 'radar-detection', component: RadarDetectionComponent },
    { path: 'thunder-detection', component: ThunderDetectionComponent },
    { path: 'color-map', component: ColorMapComponent }
  ]
}];

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
    MatButtonModule,
    FormsModule,
    Md2Module,
    NgxDatatableModule,
    NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: '../../assets/fonts/iconfont' }),
    RouterModule.forChild(appRoutes),
  ],
  declarations: [
     DetectionComponent,
     MDetectionComponent,
     HDetectionComponent,
     RadarDetectionComponent,
     ThunderDetectionComponent,
     ColorMapComponent]
})
export class DetectionModule { }
