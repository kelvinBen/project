import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ServiceService } from '../service/service.service';
import { MaterialModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import * as esriLoader from 'esri-loader';
const appRoutes: Routes = [
  { path: 'index', component: IndexComponent }
];
esriLoader.bootstrap((err) => {
  if (err) {
    // handle any loading errors
    console.error(err);
  } else {
    // optionall execute any code once it's preloaded
  }
}, {
    // use a specific version instead of latest 4.x
    url: 'http://120.26.44.171:5558/init.js'
  });
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    MaterialModule,
    OverlayPanelModule,
    NgxDatatableModule,
    RouterModule.forChild(appRoutes)
  ],
  providers: [ServiceService],
  declarations: [IndexComponent]
})
export class GisModule { }
