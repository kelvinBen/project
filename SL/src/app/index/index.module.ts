import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-carousel';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import 'hammerjs';
import * as esriLoader from 'esri-loader';

import { IndexComponent } from './index.component';
import { HomeComponent } from './home/home.component';
import { PdfComponent } from './pdf/pdf.component';
import { VideoComponent } from './video/video.component';
import { CountryComponent } from './country/country.component';

const appRoutes: Routes = [
  {
    path: '', component: IndexComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'pdf', component: PdfComponent },
      { path: 'video', component: VideoComponent },
      { path: 'country', component: CountryComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    MdDatepickerModule,
    MdNativeDateModule,
    RouterModule.forChild(appRoutes),
    CarouselModule
  ],
  declarations: [IndexComponent, HomeComponent, PdfComponent, VideoComponent, CountryComponent]
})
export class IndexModule { }
