import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Helicopter } from "../../model/helicopter";
import { TdFileService, IUploadOptions } from '@covalent/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-helicopter',
  templateUrl: './helicopter.component.html',
  styleUrls: ['./helicopter.component.css']
})
export class HelicopterComponent implements OnInit {

  helicopters: Helicopter[] = [];
  tempHelocopters: Helicopter[] = [];
  constructor(private service: ServiceService,
    private _dataTableService: TdDataTableService,
    private fileUploadService: TdFileService) { }

  ngOnInit() {
    this.query();
  }

  query() {
    this.service.Get('helicopter', '?order=id.asc').subscribe(result => {
      this.helicopters = result as Helicopter[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.service.Delete('helicopter', par).subscribe(result => {
        this.query();
      }, error => {
        console.log(error);
      });
    }
  }

  downloadFile(url) {
    window.open(url);
  }
  uploadEvent(file: File) {
    let fmdata: FormData = new FormData();
    fmdata.append("uploadfiles", file);
    let options: IUploadOptions = {
      url: '/upload/helicopter',
      method: 'post',
      formData: fmdata
    };
    this.fileUploadService.upload(options).subscribe((response) => {
      this.query();
    });
  };

  columns: ITdDataTableColumn[] = [
    { name: 'num', label: '型号' },
    { name: 'depart', label: '所属公司' },
    { name: 'year', label: '制造/购置年份' },
    { name: 'base', label: '飞行基地' },
    { name: 'vender', label: '生产厂家' },
    { name: 'regnum', label: '注册号' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.helicopters.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'num';
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
    let newData: any[] = this.helicopters;
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
    this.tempHelocopters = newData;
  }
}
