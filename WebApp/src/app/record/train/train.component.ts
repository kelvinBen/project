import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { TdFileService, IUploadOptions } from '@covalent/core';
import { Train } from '../../model/train';
import { IPageChangeEvent } from '@covalent/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import * as moment from 'moment';
@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})
export class TrainComponent implements OnInit {

  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService,
    private fileUploadService: TdFileService) { }
  selYear: string;
  selDepart: string;
  train: Train[] = [];
  ngOnInit() {
    this.selYear = moment(new Date(new Date().getFullYear(), 1, 1)).format('YYYY-MM-DD');
    this.querytrain();
  }
  tempTrain: Train[] = [];
  querytrain() {
    let par = '?order=time.asc';
    par += '&time=gte.' + moment(this.selYear).format('YYYY-MM-DD');
    if (this.selDepart) par += '&org=like.*' + this.selDepart + "*";
    this.serviceService.Get('train', par).subscribe(result => {
      this.train = result as Train[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('train', par).subscribe(result => {
        this.querytrain();
      }, error => {
        console.log(error);
      });
    }
  }
  updateFilter(event) {
    const val = event.target.value;
    const temp = this.train.filter(function (d) {
      return d.name.indexOf(val) !== -1 ||
        d.address.indexOf(val) !== -1 || !val;
    });
    this.tempTrain = temp;
  }
  downloadFile(url) {
    window.open(url);
  }
  uploadEvent(file: File) {
    let fmdata: FormData = new FormData();
    fmdata.append("uploadfiles", file);
    let options: IUploadOptions = {
      url: '/upload/train',
      method: 'post',
      formData: fmdata
    };
    this.fileUploadService.upload(options).subscribe((response) => {
      this.querytrain();
    });
  };


  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '培训名称' },
    { name: 'org', label: '所属单位' },
    { name: 'depart', label: '培训部门' },
    { name: 'time', label: '培训时间' },
    { name: 'address', label: '培训地点' },
    { name: 'num', label: '参与人数' },
    { name: 'status', label: '状态' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.train.length;

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
    let newData: any[] = this.train;
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
    this.tempTrain = newData;
  }
}
