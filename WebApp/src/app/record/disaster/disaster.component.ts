import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Disaster } from '../../model/disaster';
import { DisasterType } from '../../model/disasterType';
import { DisasterSmallType } from '../../model/disasterSmallType';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-disaster',
  templateUrl: './disaster.component.html',
  styleUrls: ['./disaster.component.css']
})
export class DisasterComponent implements OnInit {


  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  disasters: Disaster[] = [];
  dType: DisasterType[] = [];
  smallType: DisasterSmallType[] = [];//所有的小分类
  type: number = -1;  //大分类
  type1: number = -1;  //子分类.

  ngOnInit() {
    //获取大分类
    this.serviceService.Get('disasterType', '?order=id.asc').subscribe(result => {
      this.dType.push(new DisasterType(-1, "全部"));
      let dts = result as DisasterType[];
      this.dType = this.dType.concat(dts);
      this.type = this.dType[0].id;
      this.typeChange();
    }, error => {
      console.log(error);
    });
  }

  typeChange() {
    //获取子分类
    let par = '?order=id.asc';
    if (this.type != -1) par += '&typeId=eq.' + this.type;
    this.serviceService.Get('disasterSmallType', par).subscribe(result => {
      this.smallType.push(new DisasterSmallType(-1, -1, "全部"));
      let dts = result as DisasterSmallType[];
      this.smallType = this.smallType.concat(dts);
      this.type1 = this.smallType[0].id;
      this.querydisaster();
    }, error => {
      console.log(error);
    });
  }
  tempDisaster: Disaster[] = [];
  querydisaster() {
    let par = '?order=id.desc';
    if (this.type != -1) par += '&dType=eq.' + this.type;
    if (this.type1 != -1) par += '&smallType=eq.' + this.type1;
    console.log(par);
    this.serviceService.Get('disaster', par).subscribe(result => {
      this.disasters = result as Disaster[];
      this.tempDisaster = [...this.disasters];
    }, error => {
      console.log(error);
    });
  }
  getSmallType(id) {
    let name = id;
    for (let i = 0; i < this.smallType.length; ++i) {
      if (this.smallType[i].id == id) {
        name = this.smallType[i].name;
        break;
      }
    }
    return name;
  }
  resetdisaster() {
    this.type = -1;
    this.type1 = -1;
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('disaster', par).subscribe(result => {
        this.querydisaster();
      }, error => {
        console.log(error);
      });
    }
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '灾情灾害名称' },
    { name: 'smallType', label: '灾害类型' },
    { name: 'address', label: '发生地点' },
    { name: 'time', label: '发布时间' },
    { name: 'injury', label: '人员伤亡' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.disasters.length;

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
    let newData: any[] = this.disasters;
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
    this.tempDisaster = newData;
  }
}
