import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule, RadioButtonModule } from 'primeng/primeng';
import { QuillEditorModule } from 'ngx-quill-editor';
import { Ng2Webstorage } from 'ng2-webstorage';
import { Md2Module } from 'md2';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import * as esriLoader from 'esri-loader';
import 'hammerjs';
import 'quill';
import { AppComponent } from './app.component';
import { UserComponent } from './admin/user/user.component';
import { ContentComponent } from './admin/content/content.component';
import { CheckComponent } from './admin/check/check.component';
import { OperComponent } from './admin/user/oper/oper.component';
import { ContentOperComponent } from './admin/content/content-oper/content-oper.component';
import { CheckOperComponent } from "./admin/check/check-oper/check-oper.component";
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { WorkComponent } from './user/work/work.component';
import { WorkOperComponent } from './user/work/work-oper/work-oper.component';
import { HomeComponent } from './home/home.component';
import { DefaultComponent } from './home/default/default.component';
import { ListComponent } from './home/list/list.component';
import { CategoryComponent } from './home/list/category/category.component';
import { DetailComponent } from './home/list/detail/detail.component';
import { WeatherComponent } from './home/weather/weather.component';
import { MapComponent } from './home/map/map.component';
import { RealComponent } from './home/real/real.component';
import { QueryComponent } from './admin/query/query.component';
import { WeatherloginComponent } from './weatherlogin/weatherlogin.component';
import { WeatherdataComponent } from './weatherdata/weatherdata.component';
import { HourComponent } from './weatherdata/hour/hour.component';
import { MinutesComponent } from './weatherdata/minutes/minutes.component';
import { HistoryComponent } from './weatherdata/history/history.component';
// preload the ArcGIS API
esriLoader.bootstrap((err) => {
  if (err) {
    console.error(err);
  } else { }
}, {
    url: 'https://js.arcgis.com/3.21/'
  });
const appRoutes: Routes = [
  // { path: '', redirectTo: '/default', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'weatherlogin', component: WeatherloginComponent },
  {
    path: 'weather', component: WeatherdataComponent, children: [
      { path: 'hour', component: HourComponent },
      { path: 'minutes', component: MinutesComponent },
      { path: 'history', component: HistoryComponent }
    ]
  },
  {
    path: 'admin', component: IndexComponent, children: [
      { path: 'user', component: UserComponent },
      { path: 'user/add', component: OperComponent },
      { path: 'user/edit/:id', component: OperComponent },
      { path: 'user/:type/view/:id', component: OperComponent },
      { path: 'content', component: ContentComponent },
      { path: 'content/add', component: ContentOperComponent },
      { path: 'content/edit/:id', component: ContentOperComponent },
      { path: 'content/:type/view/:id', component: ContentOperComponent },
      { path: 'check', component: CheckComponent },
      { path: 'work', component: WorkComponent },
      { path: 'work/add', component: WorkOperComponent },
      { path: 'work/edit/:id', component: WorkOperComponent },
      { path: 'work/:type/view/:id', component: WorkOperComponent }
      // { path: 'query', component: QueryComponent }
    ]
  },
  {
    path: '', component: HomeComponent, children: [
      { path: '', component: DefaultComponent },
      {
        path: 'list/:id', component: ListComponent, children: [
          { path: 'cate/:subid', component: CategoryComponent },
          { path: 'detail/:newid', component: DetailComponent },
        ]
      },
      { path: 'real/:id', component: RealComponent },
      { path: 'real/:id/:layerid', component: RealComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ContentComponent,
    CheckComponent,
    OperComponent,
    ContentOperComponent,
    CheckOperComponent,
    LoginComponent,
    IndexComponent,
    WorkComponent,
    WorkOperComponent,
    HomeComponent,
    DefaultComponent,
    ListComponent,
    CategoryComponent,
    DetailComponent,
    WeatherComponent,
    MapComponent,
    RealComponent,
    QueryComponent,
    WeatherloginComponent,
    WeatherdataComponent,
    HourComponent,
    MinutesComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxDatatableModule,
    HttpClientModule,
    RadioButtonModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FileUploadModule,
    QuillEditorModule,
    Ng2Webstorage,
    Md2Module,
    CarouselModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
