import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'primeng/primeng';
import { Md2Module } from 'md2';
import {
  CovalentFileModule, CovalentDataTableModule,
  CovalentLayoutModule, CovalentSearchModule, CovalentPagingModule
} from '@covalent/core';
import { ServiceService } from '../service/service.service';
import { TrainComponent } from './train/train.component';
import { ActionComponent } from './action/action.component';
import { ActionoperComponent } from './action/actionoper/actionoper.component';
import { ResponseComponent } from './response/response.component';
import { ResponseoperComponent } from './response/responseoper/responseoper.component';
import { DisasterComponent } from './disaster/disaster.component';
import { DisasteroperComponent } from './disaster/disasteroper/disasteroper.component';
import { LawComponent } from './law/law.component';
import { LawoperComponent } from './law/lawoper/lawoper.component';
import { TrainoperComponent } from './train/trainoper/trainoper.component';
import { ResponseGroupComponent } from '../dialog/response-group/response-group.component';
import { MaterialGroupComponent } from '../dialog/material-group/material-group.component';
import { MaterialPersonComponent } from '../dialog/material-person/material-person.component';
const appRoutes: Routes = [
  { path: 'train', component: TrainComponent },
  { path: ':type/train/:id', component: TrainoperComponent },
  { path: 'train/add', component: TrainoperComponent },
  { path: 'train/edit/:id', component: TrainoperComponent },
  { path: 'action', component: ActionComponent },
  { path: ':type/action/:id', component: ActionoperComponent },
  { path: 'action/add', component: ActionoperComponent },
  { path: 'action/edit/:id', component: ActionoperComponent },
  { path: 'response', component: ResponseComponent },
  { path: ':type/response/:id', component: ResponseoperComponent },
  { path: 'response/add', component: ResponseoperComponent },
  { path: 'response/edit/:id', component: ResponseoperComponent },
  { path: 'disaster', component: DisasterComponent },
  { path: ':type/disaster/:id', component: DisasteroperComponent },
  { path: 'disaster/add', component: DisasteroperComponent },
  { path: 'disaster/edit/:id', component: DisasteroperComponent },
  { path: 'law', component: LawComponent },
  { path: ':type/law/:id', component: LawoperComponent },
  { path: 'law/add', component: LawoperComponent },
  { path: 'law/edit/:id', component: LawoperComponent }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgxDatatableModule,
    MaterialModule,
    FileUploadModule,
    RouterModule.forChild(appRoutes),
    Md2Module,
    CovalentFileModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentPagingModule
  ],
  providers: [ServiceService],
  declarations: [TrainComponent, ActionComponent, ActionoperComponent,
    ResponseComponent, ResponseoperComponent, DisasterComponent,
    DisasteroperComponent, LawComponent, LawoperComponent,
    TrainoperComponent, ResponseGroupComponent, MaterialGroupComponent,
    MaterialPersonComponent],
  entryComponents: [ResponseGroupComponent, MaterialGroupComponent, MaterialPersonComponent]
})
export class RecordModule { }
