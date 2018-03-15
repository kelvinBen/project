import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { Professor } from "../../model/professor";
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-material-person',
  templateUrl: './material-person.component.html',
  styleUrls: ['./material-person.component.css']
})
export class MaterialPersonComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<MaterialPersonComponent>,
    private _dataTableService: TdDataTableService,
    public _service: ServiceService) { }

  ngOnInit() {
    this._service.Get('professor','').subscribe(result=>{
      this.rows = result as Professor[];
      this.filter();
    })
  }
  submit(){
    this.dialogRef.close(this.selectedRows);
  }
  rows: Professor[] = [];
  rowsTemp: Professor[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '专家姓名' },
    { name: 'gender', label: '专家性别' },
    { name: 'depart', label: '工作单位' },
    { name: 'position', label: '行政职位' },
    { name: 'desc', label: '专业特长' }];
  filteredTotal: number = this.rows.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = '';
  selectedRows: Professor[] = [];
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
    let newData: any[] = this.rows;
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
    this.rowsTemp = newData;
  }
}
