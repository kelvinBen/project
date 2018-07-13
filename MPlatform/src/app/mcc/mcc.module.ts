import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { AuthenticationService } from '../service/authentication.service';
import { ProductService } from '../service/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2Webstorage } from 'ngx-webstorage';
import { MccComponent } from './mcc.component';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';
import { MymccComponent } from './mymcc/mymcc.component';
import { MyplatformComponent } from './mymcc/myplatform/myplatform.component';
import { AccountComponent } from './mymcc/account/account.component';
import { RecordComponent } from './mymcc/record/record.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PaypageComponent } from './paypage/paypage.component';
import { DetailsComponent } from './mymcc/details/details.component';
import { DocComponent } from './doc/doc.component';
import { ResetPassComponent } from './reset-pass/reset-pass.component';
import { MydataComponent } from './mymcc/mydata/mydata.component';
import { RoleupdateComponent } from './mymcc/roleupdate/roleupdate.component';
import { EmailactiveComponent } from '../mcc/emailactive/emailactive.component';
import { ResetComponent } from './reset/reset.component';

const routes: Routes = [
  {
    path: 'mcc', component: MccComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'reg', component: RegComponent },
      { path: 'reset', component: ResetPassComponent },
      { path: 'setpass', component: ResetComponent },
      { path: 'active', component: EmailactiveComponent },
      {
        path: '', canActivate: [AuthGuard], children: [
          {
            path: 'mymcc', component: MymccComponent, children: [
              {
                path: '', canActivateChild: [AuthGuard], children: [
                  { path: 'myplatform', component: MyplatformComponent },
                  { path: 'account', component: AccountComponent },
                  { path: 'record', component: RecordComponent },
                  { path: 'data', component: MydataComponent },
                  { path: 'updatevip', component: RoleupdateComponent },
                  { path: 'detail/:id', component: DetailsComponent },
                ]
              }
            ]
          },
          { path: 'purchase', component: PurchaseComponent },
          { path: 'pay', component: PaypageComponent },
          { path: 'doc', component: DocComponent }
        ]
      }

    ]
  }

]
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    Ng2Webstorage,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule,

    NgZorroAntdModule.forRoot(),
    FlexLayoutModule,
    RouterModule.forChild(routes),
  ],
  providers: [AuthenticationService, AuthGuard, ProductService],
  declarations: [MccComponent, LoginComponent, RegComponent, MymccComponent, RecordComponent, AccountComponent, MyplatformComponent, PurchaseComponent, PaypageComponent, DetailsComponent, DocComponent, ResetPassComponent, MydataComponent, RoleupdateComponent, EmailactiveComponent, ResetComponent]
})
export class MccModule { }
