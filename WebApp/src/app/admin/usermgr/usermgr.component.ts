import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { User } from '../../model/user';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-usermgr',
  templateUrl: './usermgr.component.html',
  styleUrls: ['./usermgr.component.css']
})
export class UsermgrComponent implements OnInit {
  users: User[] = [];
  tempUsers: User[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '姓名' },
    { name: 'position', label: '职位' },
    { name: 'email', label: '邮件' },
    { name: 'phone', label: '手机' },
    { name: 'telphone', label: '座机' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.users.length;
  searchTerm: String = '';
  fromRow: Number = 1;
  currentPage: Number = 1;
  pageSize: Number = 10;
  sortBy: String = 'name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.serviceService.Get('user', '?order=id.asc').subscribe(result => {
      this.users = result as User[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }

  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      const par = '?id=eq.' + id;
      this.serviceService.Delete('user', par).subscribe(result => {
        this.query();
      }, error => {
        console.log(error);
      });
    }
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
    let newData: any[] = this.users;
    const excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm.valueOf(), true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy.valueOf(), this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow.valueOf(), this.currentPage.valueOf() * this.pageSize.valueOf());
    this.tempUsers = newData;
  }
}
