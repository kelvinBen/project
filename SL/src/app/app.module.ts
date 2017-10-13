import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { IndexModule } from './index/index.module';
import { AdminModule } from './admin/admin.module';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }
]
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    IndexModule,
    AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
