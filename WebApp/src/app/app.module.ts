import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { ServiceService } from './service/service.service';
import { Ng2Webstorage } from 'ng2-webstorage';
// import { ResourceModule } from './resource/resource.module';
// import { RecordModule } from './record/record.module';
// import { StatisticsModule } from './statistics/statistics.module';
// import { GisModule } from './gis/gis.module';
import { Md2Module } from 'md2';
import { FileUploadModule, TreeModule } from 'primeng/primeng';
import {
  CovalentFileModule, CovalentDataTableModule, CovalentLayoutModule,
  CovalentSearchModule, CovalentPagingModule
} from '@covalent/core';
import { AppComponent } from './app.component';
import 'hammerjs';
import { LoginComponent } from './login/login.component';
import { RescueComponent } from './rescue/rescue.component';
import { RescueOperComponent } from './rescue/rescue-oper/rescue-oper.component';
import { EditRescueComponent } from './dialog/edit-rescue/edit-rescue.component';
import { EditRescueShipComponent } from './dialog/edit-rescue-ship/edit-rescue-ship.component';
import { CountComponent } from './rescue/count/count.component';
import { IndexComponent } from './index/index.component';
import { SelectOrgComponent } from './dialog/select-org/select-org.component';
const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: IndexComponent, children: [
      { path: 'rescue', component: RescueComponent },
      { path: 'rescue/add', component: RescueOperComponent },
      { path: 'rescue/:type/view/:id', component: RescueOperComponent },
      { path: 'rescue/edit/:id', component: RescueOperComponent },
      { path: 'rescue/statistics', component: CountComponent },
      { path: 'gis', loadChildren: './gis/gis.module#GisModule' },
      { path: 'resource', loadChildren: './resource/resource.module#ResourceModule' },
      { path: 'record', loadChildren: './record/record.module#RecordModule' },
      { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsModule' },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
    ]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RescueComponent,
    RescueOperComponent,
    EditRescueComponent,
    EditRescueShipComponent,
    CountComponent,
    IndexComponent,
    SelectOrgComponent
  ],
  entryComponents: [SelectOrgComponent, EditRescueComponent, EditRescueShipComponent],
  imports: [
    BrowserModule,
    FormsModule,
    TreeModule,
    BrowserAnimationsModule,
    Ng2Webstorage,
    // ResourceModule,
    // RecordModule,
    // GisModule,
    Md2Module,
    FileUploadModule,
    // StatisticsModule,
    MaterialModule,
    NgxDatatableModule,
    CovalentFileModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentPagingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }, ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
