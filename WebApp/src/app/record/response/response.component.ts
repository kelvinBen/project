import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Response } from '../../model/response';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css']
})
export class ResponseComponent implements OnInit {

  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }
  responses: Response[] = [];
  ngOnInit() {
    this.serviceService.Get('response', '?order=id.desc').subscribe(result => {
      this.responses = result as Response[];
    }, error => {
      console.log(error);
    });
    this.queryresponse();
  }
  results = [
    { id: -1, name: '全部' },
    { id: 1, name: '一级' },
    { id: 2, name: '二级' },
    { id: 3, name: '三级' }
  ];
  selname: string = '';
  sellevel: number = -1;
  selstart: Date;
  selfinal: Date;
  tempResponse: Response[] = [];
  queryresponse() {
    let par = '?order=id.asc';
    if (this.selname != '') par += '&eventName=like.*' + this.selname + '*';
    if (this.sellevel != -1) par += '&level=eq.' + this.sellevel;
    if (this.selstart || this.selfinal) par += '&time=gte.' + this.selstart + '&time=lte.' + this.selfinal;
    this.serviceService.Get('response', par).subscribe(result => {
      this.responses = result as Response[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  resetQuery() {
    this.selname = '';
    this.sellevel = -1;
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('response', par).subscribe(result => {
        this.queryresponse();
      }, error => {
        console.log(error);
      });
    }
  }
  columns: ITdDataTableColumn[] = [
    { name: 'eventName', label: '名称' },
    { name: 'level', label: '响应级别' },
    { name: 'address', label: '事发地点' },
    { name: 'time', label: '事发时间' },
    { name: 'reason', label: '事发原因' },
    { name: 'range', label: '影响范围' },
    { name: 'injury', label: '伤亡情况' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.responses.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'time';
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
    let newData: any[] = this.responses;
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
    this.tempResponse = newData;
  }
}
