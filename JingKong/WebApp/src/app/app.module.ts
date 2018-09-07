import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import 'hammerjs';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './home/admin/admin.component';
import { ConfigComponent } from './home/config/config.component';
import { AdminOperComponent } from './home/admin-oper/admin-oper.component';
import { ConfigOperComponent } from './home/config-oper/config-oper.component';
import { ConfigSetComponent } from './dialog/config-set/config-set.component';
import { ProfessorComponent } from './home/professor/professor.component';
import { ProfessoroperComponent } from './home/professor/professoroper/professoroper.component';
import { PlanComponent } from './home/plan/plan.component';
import { PlanoperComponent } from './home/plan/planoper/planoper.component';
import { CaseComponent } from './home/case/case.component';
import { CaseOperComponent } from './home/case/case-oper/case-oper.component';
import { ShipeComponent } from './home/shipe/shipe.component';
import { ShipeOperComponent } from './home/shipe/shipe-oper/shipe-oper.component';
import { EquipmentComponent } from './home/equipment/equipment.component';
import { EquipmentOperComponent } from './home/equipment/equipment-oper/equipment-oper.component';
import { SelectMaterialTypeComponent } from './dialog/select-material-type/select-material-type.component';
import { GisComponent } from './home/gis/gis.component';
const routes: Routes = [
  { path: '', redirectTo: '/home/plan', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, children: [
      { path: 'gis', component: GisComponent },
      { path: 'user', component: AdminComponent },
      { path: 'adduser', component: AdminOperComponent },
      { path: 'config', component: ConfigComponent },
      { path: 'addconfig', component: ConfigOperComponent },
      { path: 'professor', component: ProfessorComponent },
      { path: 'addprofessor', component: ProfessoroperComponent },
      { path: 'plan', component: PlanComponent },
      { path: 'addplan', component: PlanoperComponent },
      { path: 'case', component: CaseComponent },
      { path: 'addcase', component: CaseOperComponent },
      { path: 'ship', component: ShipeComponent },
      { path: 'addship', component: ShipeOperComponent },
      { path: 'equipment', component: EquipmentComponent },
      { path: 'addequipment', component: EquipmentOperComponent }
    ]
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    ConfigComponent,
    AdminOperComponent,
    ConfigOperComponent,
    ConfigSetComponent,
    ProfessorComponent,
    ProfessoroperComponent,
    PlanComponent,
    PlanoperComponent,
    CaseComponent,
    CaseOperComponent,
    ShipeComponent,
    ShipeOperComponent,
    EquipmentComponent,
    EquipmentOperComponent,
    SelectMaterialTypeComponent,
    GisComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfigSetComponent, SelectMaterialTypeComponent]
})
export class AppModule { }
