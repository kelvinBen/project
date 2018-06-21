import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { MapComponent } from '../map/map.component';
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from '../home/home.component';

const appRoutes: Routes = [
  {
    path: '', component: IndexComponent,
    children: [
        {path: '', component: HomeComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [IndexComponent, HomeComponent, MapComponent],
  providers: [EsriLoaderService]
})

export class IndexModule {

}
