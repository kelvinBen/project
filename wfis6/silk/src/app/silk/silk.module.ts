import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SilkComponent } from './silk/silk.component';
import { SilkForcastComponent } from './silk-forcast/silk-forcast.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

//import {NgxEchartsModule} from 'ngx-echarts';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    HttpClientModule,
    HttpModule,
    //NgxEchartsModule,
    BrowserAnimationsModule
  ],
  declarations: [
    SilkComponent,
    SilkForcastComponent
  ],
  entryComponents: [SilkForcastComponent]
})
export class SilkModule { }
