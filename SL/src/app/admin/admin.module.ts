import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from '@angular/material';
import { Md2Module } from 'md2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuillEditorModule } from 'ngx-quill-editor';
import { FileUploadModule } from 'primeng/primeng';

import { AdminComponent } from './admin.component';
import { AdminCountryComponent } from './admin-country/admin-country.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AdminFileComponent } from './admin-file/admin-file.component';
import { AdminCountryoperComponent } from './admin-country/admin-countryoper/admin-countryoper.component';
import { AdminFileoperComponent } from './admin-file/admin-fileoper/admin-fileoper.component';

import { ServiceService } from '../service/service.service';
const appRoutes: Routes = [
  {
    path: 'admin', component: AdminComponent,
    children: [
      { path: 'admincountry', component: AdminCountryComponent },
      { path: 'admincountry/add', component: AdminCountryoperComponent },
      { path: 'admincountry/edit/:id', component: AdminCountryoperComponent },
      { path: 'admincountry/:type/view/:id', component: AdminCountryoperComponent },
      { path: 'adminfile', component: AdminFileComponent },
      { path: 'adminfile/add', component: AdminFileoperComponent },
      { path: 'adminfile/edit/:id', component: AdminFileoperComponent },
      { path: 'adminfile/:type/view/:id', component: AdminFileoperComponent }
    ]
  }
]
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BrowserModule,
    MaterialModule,
    RouterModule.forChild(appRoutes),
    Md2Module,
    NgxDatatableModule,
    QuillEditorModule,
    FileUploadModule
  ],
  providers: [ServiceService],
  declarations: [AdminComponent, AdminCountryComponent, AdminMenuComponent, AdminFileComponent, AdminCountryoperComponent, AdminFileoperComponent]
})
export class AdminModule { }
