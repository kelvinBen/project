import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Rescue } from '../model/rescue';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-rescue',
  templateUrl: './rescue.component.html',
  styleUrls: ['./rescue.component.css']
})
export class RescueComponent implements OnInit {
  selYear: Date;
  rescues: Rescue[] = [];
  tempRescues: Rescue[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'rescueTime', label: '搜救时间' },
    { name: 'area', label: '搜救海区' },
    { name: 'note', label: '情况说明' },
    { name: 'id', label: '操作' }
  ];
  filteredTotal: number = this.rescues.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'rescueTime';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  ngOnInit() {
    this.serviceService.Get('rescue', '?order=id.desc&select=id,rescueTime,area,note').subscribe(result => {
      this.rescues = result as Rescue[];
      this.filter();
    }, error => {
      console.log(error);
    });
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
    let newData: any[] = this.rescues;
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
    this.tempRescues = newData;
  }
}
