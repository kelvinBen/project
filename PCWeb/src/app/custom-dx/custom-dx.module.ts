import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxToolbarModule,
  DxNumberBoxModule,
  DxCheckBoxModule,
  DxButtonModule,
  DxTabsModule,
  DxSelectBoxModule,
  DxChartModule,
  DxDateBoxModule,
  DxDataGridModule,
  DxBoxModule,
  DxTabPanelModule,
  DxNavBarModule,
  DxRadioGroupModule,
  DxPivotGridModule,
  DxFormModule
} from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
    DxToolbarModule,
    DxButtonModule,
    DxTabsModule,
    DxSelectBoxModule,
    DxChartModule,
    DxDateBoxModule,
    DxDataGridModule,
    DxBoxModule,
    DxTabPanelModule,
    DxNavBarModule,
    DxRadioGroupModule,
    DxPivotGridModule,
    DxFormModule
  ],
  declarations: [],
  exports: [
    DxToolbarModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxTabsModule,
    DxSelectBoxModule,
    DxChartModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxDataGridModule,
    DxBoxModule,
    DxTabPanelModule,
    DxNavBarModule,
    DxRadioGroupModule,
    DxPivotGridModule,
    DxFormModule
  ]
})
export class CustomDxModule { }
