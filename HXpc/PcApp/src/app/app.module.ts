import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { CustomEsriService } from './custom-esri/custom-esri.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxEchartsModule } from 'ngx-echarts';
import 'hammerjs';
import { AppComponent } from './app.component';
import { RealComponent } from './real/real.component';
import { HourComponent } from './real/hour/hour.component';
import { IndexComponent } from './real/index/index.component';
import { MinuteComponent } from './real/minute/minute.component';
import { WeatherAnalysisComponent } from './real/weather-analysis/weather-analysis.component';
import { ChartComponent } from './real/chart/chart.component';
import { ForcastComponent } from './forcast/forcast.component';
import { GridComponent } from './forcast/grid/grid.component';
import { SevenComponent } from './forcast/seven/seven.component';
import { CountyComponent } from './forcast/county/county.component';
import { NormalComponent } from './forcast/normal/normal.component';
import { RadarComponent } from './forcast/radar/radar.component';
import { CloudComponent } from './forcast/cloud/cloud.component';
import { BoxComponent } from './forcast/box/box.component';
import { XanewsComponent } from './forcast/xanews/xanews.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { MonthComponent } from './analysis/month/month.component';
import { HistoryComponent } from './analysis/history/history.component';
import { AgricultureComponent } from './agriculture/agriculture.component';
import { MonitorComponent } from './agriculture/monitor/monitor.component';
import { ReferComponent } from './agriculture/refer/refer.component';
import { InfoComponent } from './agriculture/info/info.component';
import { EvaluateComponent } from './agriculture/evaluate/evaluate.component';
import { AgrindexComponent } from './agriculture/agrindex/agrindex.component';
import { ClimateComponent } from './climate/climate.component';
import { RiskComponent } from './risk/risk.component';
import { ProveComponent } from './prove/prove.component';
import { MonComponent } from './analysis/month/mon/mon.component';
import { TenComponent } from './analysis/month/ten/ten.component';
import { HDayComponent } from './analysis/history/h-day/h-day.component';
import { HMonthComponent } from './analysis/history/h-month/h-month.component';
import { HYearComponent } from './analysis/history/h-year/h-year.component';
import { TempComponent } from './agriculture/refer/temp/temp.component';
import { SunshineComponent } from './agriculture/refer/sunshine/sunshine.component';
import { EvaporationComponent } from './agriculture/refer/evaporation/evaporation.component';
import { DayrainComponent } from './agriculture/refer/dayrain/dayrain.component';
import { SoilComponent } from './agriculture/refer/soil/soil.component';
import { InfoTempComponent } from './agriculture/info/info-temp/info-temp.component';
import { InfoPassComponent } from './agriculture/info/info-pass/info-pass.component';
import { InfoDryComponent } from './agriculture/info/info-dry/info-dry.component';
import { InfoServiceComponent } from './agriculture/info/info-service/info-service.component';
import { ProveOperationComponent } from './prove/prove-operation/prove-operation.component';
import { ProductComponent } from './product/product.component';
import { RainProductComponent } from './product/rain-product/rain-product.component';
import { ShortProductComponent } from './product/short-product/short-product.component';
import { WarningProductComponent } from './product/warning-product/warning-product.component';
import { RainOperationComponent } from './product/rain-product/rain-operation/rain-operation.component';
import { WarnOperComponent } from './product/warning-product/warn-oper/warn-oper.component';
import { ShortOperComponent } from './product/short-product/short-oper/short-oper.component';
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
      { path: 'cloud', component: CloudComponent },
      { path: 'box', component: BoxComponent },
      { path: 'news', component: XanewsComponent }
    ]
  },
  {
    path: 'analysis', component: AnalysisComponent, children: [
      {
        path: 'month', component: MonthComponent, children: [
          { path: 'mon', component: MonComponent },
          { path: 'ten', component: TenComponent }
        ]
      },
      {
        path: 'history', component: HistoryComponent, children: [
          { path: 'h-day', component: HDayComponent },
          { path: 'h-month', component: HMonthComponent },
          { path: 'h-year', component: HYearComponent }
        ]
      }
    ]
  },
  { path: 'climate', component: ClimateComponent },
  { path: 'risk', component: RiskComponent },
  { path: 'prove', component: ProveComponent },
  { path: 'prove/add', component: ProveOperationComponent },
  { path: 'prove/edit/:id', component: ProveOperationComponent },
  {
    path: 'product', component: ProductComponent, children: [
      { path: 'rain', component: RainProductComponent },
      { path: 'rain/add', component: RainOperationComponent },
      { path: 'rain/edit/:id', component: RainOperationComponent },
      { path: 'short', component: ShortProductComponent },
      { path: 'short/add', component: ShortOperComponent },
      { path: 'short/edit/:id', component: ShortOperComponent },
      { path: 'warning', component: WarningProductComponent },
      { path: 'warning/add', component: WarnOperComponent },
      { path: 'warning/edit/:id', component: WarnOperComponent }
    ]
  },
  {
    path: 'agriculture', component: AgricultureComponent, children: [
      { path: 'monitor', component: MonitorComponent },
      { path: 'refer', component: ReferComponent },
      {
        path: 'evaluate', component: EvaluateComponent, children: [
          // { path: 'e-assess', component: EAssessComponent },
          // { path: 'e-monitor', component: EMonitorComponent }
        ]
      },
      { path: 'agrindex', component: AgrindexComponent },
      {
        path: 'info', component: InfoComponent, children: [
          // { path: 'info-dry', component: InfoDryComponent },
          // { path: 'info-pass', component: InfoPassComponent },
          // { path: 'info-temp', component: InfoTempComponent },
          // {
          // path: 'info-service', component: InfoServiceComponent, children: [
          //   { path: 'add', component: InfoServiceOperComponent }
          // ]
          // }
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
    IndexComponent,
    MinuteComponent,
    ChartComponent,
    WeatherAnalysisComponent,
    ForcastComponent,
    GridComponent,
    SevenComponent,
    CountyComponent,
    NormalComponent,
    RadarComponent,
    CloudComponent,
    BoxComponent,
    XanewsComponent,
    AnalysisComponent,
    MonthComponent,
    HistoryComponent,
    AgricultureComponent,
    MonitorComponent,
    ReferComponent,
    InfoComponent,
    EvaluateComponent,
    AgrindexComponent,
    ClimateComponent,
    RiskComponent,
    ProveComponent,
    MonComponent,
    TenComponent,
    HDayComponent,
    HMonthComponent,
    HYearComponent,
    TempComponent,
    SunshineComponent,
    EvaporationComponent,
    DayrainComponent,
    SoilComponent,
    InfoTempComponent,
    InfoPassComponent,
    InfoDryComponent,
    InfoServiceComponent,
    ProveOperationComponent,
    ProductComponent,
    RainProductComponent,
    ShortProductComponent,
    WarningProductComponent,
    RainOperationComponent,
    WarnOperComponent,
    ShortOperComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FlexLayoutModule,
    NgxEchartsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpClientModule,
    HttpModule,
    DpDatePickerModule,
    AgGridModule.withComponents([]),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [CustomEsriService,
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
