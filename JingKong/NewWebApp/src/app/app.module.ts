import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2Webstorage } from 'ngx-webstorage';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import {DpDatePickerModule} from 'ng2-date-picker';
import { ApiService} from './service/api.service';
// import { SelectItem} from './form-type/item-select';
// import { VarcharItem} from './form-type/item-varchar';
// import { QuestionService} from './service/question.service';
import { ItemControlService} from './service/item-control.service';

import { AuthGuard } from './guard/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ContentComponent } from './main/content/content.component';
import { MapComponent } from './main/map/map.component';
import { FormComponent } from './main/form/form.component';
import { DetailComponent } from './main/detail/detail.component';
import { FormItemComponent } from './main/form/form-item/form-item.component';

const routes:Routes = [
  {path:'main', component:MainComponent,canActivate: [AuthGuard], children:[
   { path:'map', component: MapComponent},
   { path:'con/:id', component: ContentComponent},
   { path:'detail/:id/:type/:item', component: DetailComponent},
   { path:'detail/:id', component: DetailComponent},
  ]},
  {path:'login' , component:LoginComponent},
  {path:'' ,redirectTo:'login', pathMatch:'full'}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ContentComponent,
    MapComponent,
    FormComponent,
    DetailComponent,
    FormItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlexLayoutModule,
    Ng2Webstorage,
    DpDatePickerModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ApiService,AuthGuard,ItemControlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
