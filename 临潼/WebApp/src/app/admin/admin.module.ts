import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from './admin.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Md2Module } from 'md2'

const appRoutes: Routes = [
  { path: '', component: AdminComponent }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(appRoutes),
    FlexLayoutModule.forRoot(),
    Md2Module.forRoot()
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
