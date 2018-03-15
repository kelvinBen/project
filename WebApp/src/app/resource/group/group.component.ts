import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Grouptype } from '../../model/grouptype';
import { Group } from "../../model/group";
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  types: Grouptype[] = [];
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  ngOnInit() {
    this.serviceService.Get('grouptype', '').subscribe(result => {
      this.types.push(new Grouptype(-1, "全部"));
      let dts = result as Grouptype[];
      this.types = this.types.concat(dts);
    }, error => {
      console.log(error);
    });
    this.queryGroup();
  }
  groups: Group[] = [];
  tempGroups: Group[] = [];
  selType: number = -1;
  queryGroup() {
    let par = '?order=id.desc';
    if (this.selType != -1) par += '&type=eq.' + this.selType;
    this.serviceService.Get('group', par).subscribe(result => {
      this.groups = result as Group[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  getTypeName(id) {
    let name = id;
    for (let i = 0; i < this.types.length; ++i) {
      if (this.types[i].id == id) {
        name = this.types[i].name;
        break;
      }
    }
    return name;
  }

  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('group', par).subscribe(result => {
        this.queryGroup();
      }, error => {
        console.log(error);
      });
    }
  }

  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'type', label: '队伍类型' },
    { name: 'desc', label: '描述' },
    { name: 'peopleNum', label: '人数' },
    { name: 'depart', label: '主管部门' },
    { name: 'charge', label: '负责人' },
    { name: 'phone', label: '联系方式' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.groups.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'name';
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
    let newData: any[] = this.groups;
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
    this.tempGroups = newData;
  }

}
