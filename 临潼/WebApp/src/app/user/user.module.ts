import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component'
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  { path: '', component: UserComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [UserComponent]
})
export class UserModule { }
