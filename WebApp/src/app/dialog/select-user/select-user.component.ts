import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { User } from '../../model/user';
import {
  TdDataTableService, TdDataTableSortingOrder,
  ITdDataTableSortChangeEvent, ITdDataTableColumn
} from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {
  datas: User[] = [];
  temps: User[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '姓名' },
    { name: 'position', label: '职务' },
    { name: 'phone', label: '手机' },
    { name: 'telphone', label: '座机' }
  ];
  filteredTotal: number = this.datas.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  constructor( @Inject(MD_DIALOG_DATA) public data: string,
    private _service: ServiceService,
    private _dataTableService: TdDataTableService,
    public dialogRef: MdDialogRef<SelectUserComponent>) { }

  ngOnInit() {
    this._service.Get('user', '').subscribe(result => {
      this.datas = result as User[];
      this.filter();
    });
  }

  submit() {
    this.dialogRef.close(this.selectedRows[0]);
  }
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
