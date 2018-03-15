import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule, TreeTableModule, SharedModule, TreeModule, ChartModule, DialogModule } from 'primeng/primeng';
import { Md2Module } from 'md2';
import { ServiceService, MissionService } from '../service/service.service';

import { CountComponent } from './count/count.component';
import { AbilityComponent } from './ability/ability.component';

const appRoutes: Routes = [
  { path: 'count', component: CountComponent },
  { path: 'ability', component: AbilityComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forChild(appRoutes),
    NgxDatatableModule,
    FileUploadModule,
    TreeTableModule,
    SharedModule,
    TreeModule,
    ChartModule,
    Md2Module,
    DialogModule
  ],
  providers: [ServiceService, MissionService],
  declarations: [CountComponent, AbilityComponent]
})
export class StatisticsModule { }
