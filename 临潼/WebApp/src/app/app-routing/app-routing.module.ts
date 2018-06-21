import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from '../index/index.component';
import { BackstageComponent } from '../backstage/backstage.component';
import { IndexModule } from "../index/index.module";
import { BackstageModule} from "../backstage/backstage.module";

const appRoutes: Routes = [
  {
      path: '',
      redirectTo: '',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    IndexModule,
    BackstageModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: []
})
export class AppRoutingModule { }
