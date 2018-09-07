import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { RouterModule, Routes } from '@angular/router';
import { CustomEsriService } from './custom-esri/custom-esri.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AgGridModule } from 'ag-grid-angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApiServiceService } from './api-service/api-service.service';
import 'hammerjs';
import { RealWebComponent } from './app.component';
import { MinuteComponent } from './minute/minute.component';
import { HourComponent } from './hour/hour.component';
import { RadarComponent } from './radar/radar.component';
import { ChartComponent } from './chart/chart.component';
import { GradsComponent } from './grads/grads.component';
const appRoutes: Routes = [
  { path: '', redirectTo: '/hour', pathMatch: 'full' },
  { path: 'minute', component: MinuteComponent },
  { path: 'hour', component: HourComponent },
  { path: 'radar', component: RadarComponent },
  { path: 'grads', component: GradsComponent },
  { path: 'chart', component: ChartComponent }
];
@NgModule({
  declarations: [
    RealWebComponent,
    MinuteComponent,
    HourComponent,
    RadarComponent,
    ChartComponent,
    GradsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgxEchartsModule,
    DpDatePickerModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [CustomEsriService,
    ApiServiceService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [RealWebComponent]
})
export class RealWebModule { }
