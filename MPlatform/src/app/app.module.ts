import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MccModule } from './mcc/mcc.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PaySuccessComponent } from './pay-success/pay-success.component';

const routes: Routes = [

  { path: 'mcc/paysuccess', component: PaySuccessComponent },
  { path: '', redirectTo: '/mcc/login', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    PaySuccessComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FlexLayoutModule,
    NgZorroAntdModule,
    RouterModule.forRoot(routes),
    MccModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
