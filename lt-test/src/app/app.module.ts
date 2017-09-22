import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CarouselModule } from '../../node_modules/ngx-bootstrap/carousel';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './home/list/list.component';
import { DefaultComponent } from './home/default/default.component';
import { CategoryComponent } from './home/list/category/category.component';

const appRoutes:Routes=[
  {path:'',component:HomeComponent,children:[
    {path:'',component:DefaultComponent},
    {
      path: 'list/:id', component: ListComponent, children: [
        { path: 'cate/:subid', component: CategoryComponent }
      ]
    }
  ]}
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    DefaultComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxDatatableModule,
    CarouselModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
