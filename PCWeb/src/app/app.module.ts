import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CustomDxModule } from './custom-dx/custom-dx.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { EsriloadService } from './esri-service/esriload.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RealComponent } from './real/real.component';
import { HourComponent } from './real/hour/hour.component';
import { MinuteComponent } from './real/minute/minute.component';
import { IndexComponent } from './real/index/index.component';
import { ChartComponent } from './real/chart/chart.component';
import { ForcastComponent } from './forcast/forcast.component';
import { SevenComponent } from './forcast/seven/seven.component';
import { CountyComponent } from './forcast/county/county.component';
import { GridComponent } from './forcast/grid/grid.component';
import { NormalComponent } from './forcast/normal/normal.component';
import { AgricultureComponent } from './agriculture/agriculture.component';
import { MonitorComponent } from './Agriculture/monitor/monitor.component';
import { AgrindexComponent } from './Agriculture/agrindex/agrindex.component';
import { EvaluateComponent } from './Agriculture/evaluate/evaluate.component';
import { InfoComponent } from './Agriculture/info/info.component';
import { ReferComponent } from './Agriculture/refer/refer.component';
import { ClimateComponent } from './climate/climate.component';
import { ProveComponent } from './prove/prove.component';
import { RiskComponent } from './risk/risk.component';
import { ProductComponent } from './product/product.component';
import { RainComponent } from './Product/rain/rain.component';
import { ShortComponent } from './Product/short/short.component';
import { WarningComponent } from './Product/warning/warning.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { MonthComponent } from './analysis/month/month.component';
import { HistoryComponent } from './analysis/history/history.component';
import { TempComponent } from './agriculture/refer/temp/temp.component';
import { SunshineComponent } from './agriculture/refer/sunshine/sunshine.component';
import { EvaporationComponent } from './agriculture/refer/evaporation/evaporation.component';
import { DayrainComponent } from './agriculture/refer/dayrain/dayrain.component';
import { SoilComponent } from './agriculture/refer/soil/soil.component';
import { MonComponent } from './analysis/month/mon/mon.component';
import { TenComponent } from './analysis/month/ten/ten.component';
import { HDayComponent } from './analysis/history/h-day/h-day.component';
import { HTenComponent } from './analysis/history/h-ten/h-ten.component';
import { HMonthComponent } from './analysis/history//h-month/h-month.component';
import { HYearComponent } from './analysis/history/h-year/h-year.component';
import { RadarComponent } from './forcast/radar/radar.component';
import { CloudComponent } from './forcast/cloud/cloud.component';
import { WeatherAnalysisComponent } from './real/weather-analysis/weather-analysis.component';
import { ProveOperComponent } from './prove/prove-oper/prove-oper.component';
import { EAssessComponent } from './agriculture/evaluate/e-assess/e-assess.component';
import { EMonitorComponent } from './agriculture/evaluate/e-monitor/e-monitor.component';
import { InfoTempComponent } from './agriculture/info/info-temp/info-temp.component';
import { InfoDryComponent } from './agriculture/info/info-dry/info-dry.component';
import { InfoPassComponent } from './agriculture/info/info-pass/info-pass.component';
import { InfoServiceComponent } from './agriculture/info/info-service/info-service.component';
import { InfoServiceOperComponent } from './agriculture/info/info-service/info-service-oper/info-service-oper.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/real/index', pathMatch: 'full' },
  {
    path: 'real', component: RealComponent, children: [
      { path: 'index', component: IndexComponent },
      { path: 'minute', component: MinuteComponent },
      { path: 'chart', component: ChartComponent },
      { path: 'hour', component: HourComponent },
      { path: 'analysis', component: WeatherAnalysisComponent }
    ]
  },
  {
    path: 'forcast', component: ForcastComponent, children: [
      { path: 'grid', component: GridComponent },
      { path: 'seven', component: SevenComponent },
      { path: 'county', component: CountyComponent },
      { path: 'normal', component: NormalComponent },
      { path: 'radar', component: RadarComponent },
      { path: 'cloud', component: CloudComponent }
    ]
  },
  {
    path: 'analysis', component: AnalysisComponent, children: [
      {
        path: 'month', component: MonthComponent, children: [
          { path: 'mon', component: MonComponent },
          { path: 'ten', component: TempComponent }
        ]
      },
      {
        path: 'history', component: HistoryComponent, children: [
          { path: 'h-day', component: HDayComponent },
          // { path:'h-ten' , component: HTenComponent },
          { path: 'h-month', component: HMonthComponent },
          { path: 'h-year', component: HYearComponent }
        ]
      }
    ]
  },
  { path: 'climate', component: ClimateComponent },
  { path: 'risk', component: RiskComponent },
  { path: 'prove', component: ProveComponent },
  { path: 'prove/add', component: ProveOperComponent },
  { path: 'prove/edit/:id', component: ProveOperComponent },
  {
    path: 'product', component: ProductComponent, children: [
      { path: 'rain', component: RainComponent },
      { path: 'short', component: ShortComponent },
      { path: 'warning', component: WarningComponent }
    ]
  },
  {
    path: 'agriculture', component: AgricultureComponent, children: [
      { path: 'monitor', component: MonitorComponent },
      { path: 'refer', component: ReferComponent },
      {
        path: 'evaluate', component: EvaluateComponent, children: [
          { path: 'e-assess', component: EAssessComponent },
          { path: 'e-monitor', component: EMonitorComponent }
        ]
      },
      { path: 'agrindex', component: AgrindexComponent },
      {
        path: 'info', component: InfoComponent, children: [
          { path: 'info-dry', component: InfoDryComponent },
          { path: 'info-pass', component: InfoPassComponent },
          { path: 'info-temp', component: InfoTempComponent },
          {
            path: 'info-service', component: InfoServiceComponent, children: [
              { path: 'add', component: InfoServiceOperComponent }
            ]
          }
        ]
      }
    ]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    RealComponent,
    HourComponent,
    MinuteComponent,
    IndexComponent,
    ChartComponent,
    ForcastComponent,
    SevenComponent,
    CountyComponent,
    GridComponent,
    NormalComponent,
    AgricultureComponent,
    MonitorComponent,
    AgrindexComponent,
    EvaluateComponent,
    InfoComponent,
    ReferComponent,
    ClimateComponent,
    ProveComponent,
    RiskComponent,
    ProductComponent,
    RainComponent,
    ShortComponent,
    WarningComponent,
    AnalysisComponent,
    MonthComponent,
    HistoryComponent,
    TempComponent,
    SunshineComponent,
    EvaporationComponent,
    DayrainComponent,
    SoilComponent,
    MonComponent,
    TenComponent,
    HDayComponent,
    HTenComponent,
    HMonthComponent,
    HYearComponent,
    RadarComponent,
    CloudComponent,
    WeatherAnalysisComponent,
    ProveOperComponent,
    EAssessComponent,
    EMonitorComponent,
    InfoTempComponent,
    InfoDryComponent,
    InfoPassComponent,
    InfoServiceComponent,
    InfoServiceOperComponent
  ],
  imports: [
    BrowserModule,
    CustomDxModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    NgxEchartsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule
  ],
  providers: [EsriloadService, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
