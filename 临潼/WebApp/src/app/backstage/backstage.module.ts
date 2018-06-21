import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { BackstageComponent } from './backstage.component'
import { LoginComponent } from '../login/login.component';
import { HttpModule } from '@angular/http';
import { UserService } from '../Service/user.service';
import { Ng2Webstorage } from 'ng2-webstorage';
// import { AdminModule } from '../admin/admin.module';
import { UserModule } from '../user/user.module';
const appRoutes: Routes = [
  {
    path: 'backstage', component: BackstageComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'admin', loadChildren: '../admin/admin.module#AdminModule'},//延迟加载admin子模块
      { path: 'user', loadChildren: '../user/user.module#UserModule'}//延迟加载user子模块
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    Ng2Webstorage,
    // AdminModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [BackstageComponent, LoginComponent],
  providers: [UserService]
})
export class BackstageModule { }
