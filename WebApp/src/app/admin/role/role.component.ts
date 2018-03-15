import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { RoleView, Role } from '../../model/role';
import { User } from '../../model/user';
import { organization } from '../../model/organization';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: RoleView[] = [];
  tempRoles: RoleView[] = [];
  users: User[] = [];
  orgs: organization[] = [];
  columns: ITdDataTableColumn[] = [
    { name: 'user.name', label: '姓名' },
    { name: 'type', label: '角色' },
    { name: 'org.name', label: '所属单位' },
    { name: 'user.position', label: '职位' },
    { name: 'user.phone', label: '手机' },
    { name: 'user.telphone', label: '座机' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.roles.length;
  searchTerm: String = '';
  fromRow: Number = 1;
  currentPage: Number = 1;
  pageSize: Number = 10;
  sortBy: String = 'user.name';
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  ngOnInit() {
    this.serviceService.Get('user', '').subscribe(result => {
      this.users = result as User[];
      this.serviceService.Get('organization', '').subscribe(resultOrg => {
        this.orgs = resultOrg as organization[];
        this.query();
      });
    });
  }

  query() {
    this.serviceService.Get('role', '?order=id.asc').subscribe(result => {
      const rs = result as Role[];
      this.roles = [];
      rs.forEach(r => {
        const uId = r.userid;
        const oId = r.orgid;
        const u = this.users.find(x => x.id === uId);
        const o = this.orgs.find(x => x.id === oId);
        const role = new RoleView();
        role.id = r.id;
        if (u) {
          role.userid = r.userid;
          role.user = u;
        }
        if (o) {
          role.orgid = r.orgid;
          role.org = o;
        }
        role.type = r.type;
        this.roles.push(role);
      });
      this.filter();
    }, error => {
      console.log(error);
    });
  }

  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      const par = '?id=eq.' + id;
      this.serviceService.Delete('role', par).subscribe(result => {
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
    let newData: any[] = this.roles;
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
    this.tempRoles = newData;
  }

}
