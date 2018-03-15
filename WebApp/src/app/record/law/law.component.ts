import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Law, LawType } from '../../model/law';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.css']
})
export class LawComponent implements OnInit {

  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }
  types: LawType[] = [];
  selType: number = -1;
  laws: Law[] = [];
  tempLaws: Law[] = [];
  ngOnInit() {
    this.serviceService.Get('lawtype', '').subscribe(result => {
      let all = new LawType();
      all.id = -1;
      all.name = '全部';
      this.types.push(all);
      this.types = this.types.concat(result as LawType[]);
    });
    this.querylaws();
  }

  getTypeName(id:number){
    for (let i=0;i<this.types.length;++i){
      if (this.types[i].id == id){
        return this.types[i].name;
      }
    }
  }
  selstart: Date;
  selfinal: Date;
  selName: string = "";
  querylaws() {
    let par = '?order=id.asc';
    if (this.selType != -1) par += '&type=eq.' + this.selType;
    if (this.selName.trim() != "") par += '&name=like.*' + this.selName + '*';
    // if (this.selstart || this.selfinal) par += '&reportTime=gte.' + this.selstart + '&reportTime=lte.' + this.selfinal;

    this.serviceService.Get('law', par).subscribe(result => {
      this.laws = result as Law[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  reset() {
    this.selstart = null;
    this.selfinal = null;
    this.selName = '';
    this.selType = -1;
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('law', par).subscribe(result => {
        this.querylaws();
      }, error => {
        console.log(error);
      });
    }
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'type', label: '效力等级' },
    { name: 'source', label: '来源' },
    { name: 'reportTime', label: '发布时间' },
    { name: 'validTime', label: '生效时间' },
    { name: 'content', label: '内容' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.laws.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'validTime';
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
    let newData: any[] = this.laws;
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
    this.tempLaws = newData;
  }
}
