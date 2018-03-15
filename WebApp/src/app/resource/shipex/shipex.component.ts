import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { ShipEx } from "../../model/shipex";
import { TdFileService, IUploadOptions } from '@covalent/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-shipex',
  templateUrl: './shipex.component.html',
  styleUrls: ['./shipex.component.css']
})
export class ShipexComponent implements OnInit {
  ships: ShipEx[] = [];
  tempShips: ShipEx[] = [];
  constructor(private service: ServiceService,
    private _dataTableService: TdDataTableService,
    private fileUploadService: TdFileService) { }

  ngOnInit() {
    this.queryShips();
  }
  queryShips() {
    this.service.Get('shipex', '?order=id.asc').subscribe(result => {
      this.ships = result as ShipEx[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  downloadFile(url) {
    window.open(url);
  }
  uploadEvent(file: File) {
    let fmdata: FormData = new FormData();
    fmdata.append("uploadfiles", file);
    let options: IUploadOptions = {
      url: '/upload/ship',
      method: 'post',
      formData: fmdata
    };
    this.fileUploadService.upload(options).subscribe((response) => {
      this.queryShips();
    });
  };
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.service.Delete('shipex', par).subscribe(result => {
        this.queryShips();
      }, error => {
        console.log(error);
      });
    }
  }

  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '船舶名称' },
    { name: 'shipowner', label: '船东' },
    { name: 'depart', label: '所属公司' },
    { name: 'type', label: '船舶类型' },
    { name: 'country', label: '船旗国' },
    { name: 'registry', label: '船籍港' },
    { name: 'classification', label: '船级社' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.ships.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'depart';
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
    let newData: any[] = this.ships;
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
    this.tempShips = newData;
  }
}
