import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ServiceService } from '../service/service.service';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { Md2Module } from 'md2';
import { EditorModule, FileUploadModule, DropdownModule, TreeModule } from 'primeng/primeng';
import {
  CovalentFileModule, CovalentDataTableModule, CovalentExpansionPanelModule,
  CovalentLayoutModule, CovalentSearchModule, CovalentPagingModule
} from '@covalent/core';
import { UsermgrComponent } from './usermgr/usermgr.component';
import { UseroperComponent } from './usermgr/useroper/useroper.component';
import { RoleComponent } from './role/role.component';
import { RoleoperComponent } from './role/roleoper/roleoper.component';
import { SelectUserComponent } from '../dialog/select-user/select-user.component';
const appRoutes: Routes = [
  { path: 'user', component: UsermgrComponent },
  { path: ':type/user/:id', component: UseroperComponent },
  { path: 'user/add', component: UseroperComponent },
  { path: 'user/edit/:id', component: UseroperComponent },
  { path: 'role', component: RoleComponent },
  { path: ':type/role/:id', component: RoleoperComponent },
  { path: 'role/add', component: RoleoperComponent },
  { path: 'role/edit/:id', component: RoleoperComponent }
];
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    MaterialModule,
    Md2Module,
    FormsModule,
    CovalentFileModule, CovalentDataTableModule, CovalentExpansionPanelModule,
    CovalentLayoutModule, CovalentSearchModule, CovalentPagingModule,
    EditorModule, FileUploadModule, DropdownModule, TreeModule,
    RouterModule.forChild(appRoutes)
  ],
  providers: [ServiceService],
  declarations: [SelectUserComponent, UsermgrComponent, UseroperComponent, RoleComponent, RoleoperComponent],
  entryComponents: [SelectUserComponent]
})
export class AdminModule { }
