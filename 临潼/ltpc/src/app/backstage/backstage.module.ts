import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from "@angular/router";
import { Ng2Webstorage } from 'ng2-webstorage';
import { BackstageComponent } from './backstage.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { DbServiceService } from '../service/db-service.service';
import { AccordionMenuComponent } from './accordion-menu/accordion-menu.component';
import { AdminstationComponent } from './admin/adminstation/adminstation.component';
import { AdminnewsComponent } from './admin/adminnews/adminnews.component';
import { AdminlogComponent } from './admin/adminlog/adminlog.component';
import { AdminnewsaddComponent } from './admin/adminnewsadd/adminnewsadd.component';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EditorModule } from '../../../node_modules/primeng/components/editor/editor';
import { FileUploadModule } from '../../../node_modules/primeng/components/fileupload/fileupload';
import { AdminstationaddComponent } from './admin/adminstationadd/adminstationadd.component';
import { AdminlogviewComponent } from './admin/adminlogview/adminlogview.component';
import { MenuModule, RadioButtonModule, InputTextareaModule } from '../../../node_modules/primeng/primeng';
import { StationlogComponent } from './admin/stationlog/stationlog.component';
import { StationlogaddComponent } from './admin/stationlogadd/stationlogadd.component';

const appRoutes: Routes = [
  {
    path: 'backstage', component: BackstageComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'admin', component: AdminComponent,
        children: [
          { path: 'adminstation', component: AdminstationComponent },
          { path: 'adminnews', component: AdminnewsComponent },
          { path: 'adminlog', component: AdminlogComponent },
          {
            path: 'adminnewsadd',
            children: [{
              path: '',
              component: AdminnewsaddComponent
            }, {
              path: ':id',
              component: AdminnewsaddComponent
            }]
          },
          {
            path: 'adminstationadd',
            children: [{
              path: '',
              component: AdminstationaddComponent
            }, {
              path: ':id',
              component: AdminstationaddComponent
            }]
          },
          { path: 'adminlogview/:id', component: AdminlogviewComponent },
          { path: 'stationlog', component: StationlogComponent },
          {
            path: 'stationlogadd',
            children: [{
              path: '',
              component: StationlogaddComponent
            }, {
              path: ':id',
              component: StationlogaddComponent
            }]
          }
        ]
      }
      //  { path: 'admin', loadChildren: '../admin/admin.module#AdminModule'}, //延迟加载admin子模块
      // { path: 'user', loadChildren: '../user/user.module#UserModule'}//延迟加载user子模块
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2Webstorage,
    FileUploadModule,
    MenuModule,
    RadioButtonModule,
    InputTextareaModule,
    RouterModule.forChild(appRoutes),
    EditorModule
  ],
  declarations: [
    BackstageComponent,
    LoginComponent,
    AdminComponent,
    AccordionMenuComponent,
    AdminstationComponent,
    AdminnewsComponent,
    AdminlogComponent,
    AdminnewsaddComponent,
    AdminstationaddComponent,
    AdminlogviewComponent,
    StationlogComponent,
    StationlogaddComponent
  ],
  providers: [DbServiceService]
})
export class BackstageModule { }
