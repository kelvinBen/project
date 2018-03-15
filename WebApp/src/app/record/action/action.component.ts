import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Exercise } from '../../model/exercise';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {

  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService, ) { }

  actions: Exercise[] = [];
  tempActions: Exercise[] = [];
  selname: string = '';
  seldepart: string = '';
  seladdress: string = '';
  seldate: Date;
  ngOnInit() {
    this.queryaction();
  }
  queryaction() {
    let par = '?order=extime.asc';
    // if (this.selname != '') par += '&name=like.*' + this.selname + '*';
    // if (this.seldepart != '') par += '&depart=like.*' + this.seldepart + '*';
    // if (this.seladdress != '') par += '&address=like.*' + this.seladdress + '*';
    // if (this.seldate) par += '&extime=eq.' + this.seldate;
    this.serviceService.Get('exercise', par).subscribe(result => {
      this.actions = result as Exercise[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  resetaction() {
    this.selname = '';
    this.seldepart = '';
    this.seladdress = '';
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('exercise', par).subscribe(result => {
        this.queryaction();
      }, error => {
        console.log(error);
      });
    }
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '演习名称' },
    { name: 'depart', label: '演习单位' },
    { name: 'extime', label: '演习时间' },
    { name: 'num', label: '参加人数' },
    { name: 'address', label: '演习地点' },
    { name: 'require', label: '演习要求' },
    { name: 'content', label: '演习内容' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.actions.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'extime';
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
    let newData: any[] = this.actions;
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
    console.log(newData);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.tempActions = newData;
  }
}
