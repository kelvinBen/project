import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { EsriLoaderService } from 'angular2-esri-loader';
import { ServerService } from '../service/server.service';
import { IndexComponent } from './index.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { WeatherComponent } from './weather/weather.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CarouselModule } from '../../../node_modules/ng2-bootstrap/carousel/carousel.module';
import { ChartModule, RadioButtonModule } from 'primeng/primeng';
import { RealComponent } from './real/real.component';

const appRoutes: Routes = [
  {
    path: '', component: IndexComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'real/:id', component: RealComponent },
      { path: 'list/:cate', component: ListComponent },
      { path: 'detail/:id', component: DetailComponent }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    RadioButtonModule,
    ChartModule, FormsModule,
    RouterModule.forChild(appRoutes),
    CarouselModule.forRoot()
  ],
  declarations: [
    IndexComponent,
    MapComponent,
    HomeComponent,
    WeatherComponent,
    ListComponent,
    DetailComponent,
    RealComponent
  ],
  providers: [
    EsriLoaderService,
    ServerService
  ]
})
export class IndexModule { }
