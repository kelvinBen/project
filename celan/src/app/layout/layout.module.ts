import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import {LayoutComponent} from './layout.component';

import {
    // AsideToggleDirective,
    NAV_DROPDOWN_DIRECTIVES,
    // ReplaceDirective,
    SIDEBAR_TOGGLE_DIRECTIVES
  } from '../directives';
  const APP_DIRECTIVES = [
    // AsideToggleDirective,
    NAV_DROPDOWN_DIRECTIVES,
    // ReplaceDirective,
    SIDEBAR_TOGGLE_DIRECTIVES
  ]
const appRoutes: Routes = [
    { path: '', component: LayoutComponent }
  ];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  declarations: [ LayoutComponent, ...APP_DIRECTIVES ]
})
export class LayoutModule { }
