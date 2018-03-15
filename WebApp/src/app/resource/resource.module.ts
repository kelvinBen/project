import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ServiceService } from '../service/service.service';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Md2Module } from 'md2';
import { PlanComponent } from './plan/plan.component';
import { PlanoperComponent } from './plan/planoper/planoper.component';
import { EditorModule, FileUploadModule, DropdownModule, TreeModule } from 'primeng/primeng';
import {
  CovalentFileModule, CovalentDataTableModule, CovalentExpansionPanelModule,
  CovalentLayoutModule, CovalentSearchModule, CovalentPagingModule
} from '@covalent/core';
import { QuillEditorModule } from 'ngx-quill-editor';

import { ProfessorComponent } from './professor/professor.component';
import { ProfessoroperComponent } from './professor/professoroper/professoroper.component';
import { GroupComponent } from './group/group.component';
import { GroupoperComponent } from './group/groupoper/groupoper.component';
import { OutComponent } from './out/out.component';
import { OutoperComponent } from './out/outoper/outoper.component';
import { MaterialComponent } from './material/material.component';
import { GoodsoperComponent } from './material/goodsoper/goodsoper.component';
import { StorageoperComponent } from './material/storageoper/storageoper.component';
import { PlaneComponent } from './material/special/plane/plane.component';
import { CarComponent } from './material/special//car/car.component';
import { ShipComponent } from './material/special//ship/ship.component';
import { WeiyouComponent } from './material/special/weiyou/weiyou.component';
import { DongliComponent } from './material/special/dongli/dongli.component';
import { PieoilComponent } from './material/special/pieoil/pieoil.component';
import { WorkboatComponent } from './material/special/workboat/workboat.component';
import { SaveoilComponent } from './material/special/saveoil/saveoil.component';
import { EquipComponent } from './material/special/equip/equip.component';
import { GunComponent } from './material/special/gun/gun.component';
import { NetComponent } from './material/special/net/net.component';
import { XiaooilComponent } from './material/special/xiaooil/xiaooil.component';
import { OthersComponent } from './material/special/others/others.component';
import { SelectGroupComponent } from '../dialog/select-group/select-group.component';
// import { SelectOrgComponent } from '../dialog/select-org/select-org.component';
import { AddresslistComponent } from './addresslist/addresslist.component';
import { AddOrgComponent } from '../dialog/add-org/add-org.component';
import { TdFileService } from '@covalent/core';
import { OrganizationComponent } from './organization/organization.component';
import { AddEmergencyorgComponent } from '../dialog/add-emergencyorg/add-emergencyorg.component';
import { HelicopterComponent } from './helicopter/helicopter.component';
import { ShipexComponent } from './shipex/shipex.component';
import { HelicopterOperComponent } from './helicopter/helicopter-oper/helicopter-oper.component';
import { ShipExOperComponent } from './shipex/ship-ex-oper/ship-ex-oper.component';
import { AddListComponent } from '../dialog/add-list/add-list.component';
import { SelectMaterialTypeComponent } from '../dialog/select-material-type/select-material-type.component';
const appRoutes: Routes = [
  { path: 'plan', component: PlanComponent },
  { path: ':type/plan/:id', component: PlanoperComponent },
  { path: 'plan/add', component: PlanoperComponent },
  { path: 'plan/edit/:id', component: PlanoperComponent },
  { path: 'professor', component: ProfessorComponent },
  { path: ':type/professor/:id', component: ProfessoroperComponent },
  { path: 'professor/add', component: ProfessoroperComponent },
  { path: 'professor/edit/:id', component: ProfessoroperComponent },
  { path: 'group', component: GroupComponent },
  { path: ':type/group/:id', component: GroupoperComponent },
  { path: 'group/add', component: GroupoperComponent },
  { path: 'group/edit/:id', component: GroupoperComponent },
  { path: 'out', component: OutComponent },
  { path: 'out/:id', component: OutComponent },
  { path: 'out/:view/view/:type/out/:id', component: OutoperComponent },
  { path: 'out/:type/add', component: OutoperComponent },
  { path: 'out/:type/edit/:id', component: OutoperComponent },
  { path: 'material', component: MaterialComponent },
  { path: 'material/:type/goodsview/:id', component: GoodsoperComponent },
  { path: 'material/goodsadd', component: GoodsoperComponent },
  { path: 'material/goodsedit/:id', component: GoodsoperComponent },
  { path: 'material/:type/storageview/:id', component: StorageoperComponent },
  { path: 'material/storageadd', component: StorageoperComponent },
  { path: 'material/storageedit/:id', component: StorageoperComponent },
  { path: 'addresslist', component: AddresslistComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'ship', component: ShipexComponent },
  { path: ':type/ship/:id', component: ShipExOperComponent },
  { path: 'ship/add', component: ShipExOperComponent },
  { path: 'ship/edit/:id', component: ShipExOperComponent },
  { path: 'helicopter', component: HelicopterComponent },
  { path: ':type/helicopter/:id', component: HelicopterOperComponent },
  { path: 'helicopter/add', component: HelicopterOperComponent },
  { path: 'helicopter/edit/:id', component: HelicopterOperComponent }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    HttpModule,
    NgxDatatableModule,
    EditorModule,
    FileUploadModule,
    TreeModule,
    RouterModule.forChild(appRoutes),
    Md2Module,
    DropdownModule,
    CovalentFileModule,
    QuillEditorModule,
    CovalentDataTableModule,
    CovalentLayoutModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentExpansionPanelModule
  ],
  providers: [ServiceService, TdFileService],
  declarations: [
    PlanComponent, PlanoperComponent, ProfessorComponent,
    ProfessoroperComponent, GroupComponent, GroupoperComponent,
    OutComponent, OutoperComponent, MaterialComponent,
    GoodsoperComponent, StorageoperComponent, PlaneComponent,
    CarComponent, ShipComponent, WeiyouComponent,
    DongliComponent, PieoilComponent, WorkboatComponent,
    SaveoilComponent, EquipComponent, GunComponent,
    NetComponent, XiaooilComponent, OthersComponent,
    SelectGroupComponent, AddOrgComponent, AddresslistComponent,
    OrganizationComponent,
    AddEmergencyorgComponent,
    HelicopterComponent,
    ShipexComponent,
    HelicopterOperComponent,
    ShipExOperComponent,
    AddListComponent,
    SelectMaterialTypeComponent
  ],
  entryComponents: [SelectGroupComponent, AddOrgComponent,
    AddEmergencyorgComponent, AddListComponent, SelectMaterialTypeComponent]
})
export class ResourceModule { }
