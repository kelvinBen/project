import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IndexModule } from './index/index.module';
import { BackstageModule } from './backstage/backstage.module';
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from './app.component';
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IndexModule,
    BackstageModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
