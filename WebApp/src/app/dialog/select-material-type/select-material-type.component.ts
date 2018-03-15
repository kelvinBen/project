import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { Securitybig } from '../../model/securitybig';
import { Securitymiddle } from '../../model/securitymiddle';
import { Securitysmall, SecruityType } from '../../model/securitysmall';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-select-material-type',
  templateUrl: './select-material-type.component.html',
  styleUrls: ['./select-material-type.component.css']
})
export class SelectMaterialTypeComponent implements OnInit {

  constructor( @Inject(MD_DIALOG_DATA) public data: string,
    private _service: ServiceService,
    private _dataTableService: TdDataTableService,
    public dialogRef: MdDialogRef<SelectMaterialTypeComponent>) { }

  datas: SecruityType[] = [];
  temps: SecruityType[] = [];
  ngOnInit() {
    this._service.Get('securitysmall', '?material=like.*' + this.data + '*&order=id.asc').subscribe(result => {
      let dts = result as Securitysmall[];
      let ds = [];
      dts.forEach(function (v, i) {
        let d = new SecruityType();
        d.small = v.name;
        d.smallId = v.id;
        d.midId = v.middleId;
        ds.push(d);
      });
      this.datas = ds;
      this._service.Get('securitymiddle', '').subscribe(result1 => {
        let ms = result1 as Securitymiddle[];
        this.datas.forEach(function (v) {
          let index = ms.find(function (n) { return n.id == v.midId });
          if (index) {
            v.mid = index.name;
            v.bigId = index.bigId;
          }
        });
        this._service.Get('securitybig', '').subscribe(result2 => {
          let bs = result2 as Securitybig[];
          this.datas.forEach(function (v) {
            let index = bs.find(function (n) { return n.id == v.bigId });
            if (index) {
              v.big = index.name;
            }
          });
          this.filter();
        }, error2 => { console.log(error2) });
      }, error1 => { console.log(error1) });
    }, error => { console.log(error) });
  }

  submit(){
    this.dialogRef.close(this.selectedRows[0]);
  }
  columns: ITdDataTableColumn[] = [
    { name: 'big', label: '应急保障类别(大类)' },
    { name: 'mid', label: '现场任务类型(中类)' },
    { name: 'small', label: '主要作业方式或物资功能(小类)' }
  ];

  filteredTotal: number = this.datas.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'big';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.datas;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.temps = newData;
  }
}
