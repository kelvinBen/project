import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { Hospital } from "../../model/hospital";
import { Communication } from "../../model/communication";
import { Transport } from "../../model/transport";
import { Shelter } from "../../model/shelter";
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-out',
  templateUrl: './out.component.html',
  styleUrls: ['./out.component.css']
})
export class OutComponent implements OnInit {

  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private _dataTableService: TdDataTableService) { }
  selIndex: number = 0;
  hospitals: Hospital[] = [];
  communications: Communication[] = [];
  transports: Transport[] = [];
  shelters: Shelter[] = [];
  tempHospitals: Hospital[] = [];
  tempCommunications: Communication[] = [];
  tempTransports: Transport[] = [];
  tempShelters: Shelter[] = []
  queryHospitals() {
    this.serviceService.Get('hospital', '').subscribe(result => {
      this.hospitals = result as Hospital[];
      this.filter1();
    }, error => {
      console.log(error);
    });
  }
  queryCommunication() {
    this.serviceService.Get('communication', '').subscribe(result => {
      this.communications = result as Communication[];
      this.tempCommunications = [...this.communications];
    }, error => {
      console.log(error);
    });
  }
  queryTransport() {
    this.serviceService.Get('transport', '').subscribe(result => {
      this.transports = result as Transport[];
      this.tempTransports = [...this.transports];
    }, error => {
      console.log(error);
    });
  }
  queryShelter() {
    this.serviceService.Get('shelter', '').subscribe(result => {
      this.shelters = result as Shelter[];
      this.tempShelters = [...this.shelters];
    }, error => {
      console.log(error);
    });
  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let t = params['id'] as number;
      if (t) {
        this.selIndex = t;
      }
    });
    this.queryHospitals();
    this.queryCommunication();
    this.queryTransport();
    this.queryShelter();
  }

  delete(id, table) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete(table, par).subscribe(result => {
        if (table == "hospital") {
          this.queryHospitals();
        } else if (table == "communication") {
          this.queryCommunication();
        } else if (table == "transport") {
          this.queryTransport();
        } else if (table == "shelter") {
          this.queryShelter();
        }
      }, error => {
        console.log(error);
      });
    }
  }

  //医疗
  columns1: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'bedNum', label: '病床数' },
    { name: 'doctorNum', label: '医生数' },
    { name: 'nurseNum', label: '护士数' },
    { name: 'charge', label: '负责人' },
    { name: 'phone', label: '联系方式' },
    { name: 'telephone', label: '值班电话' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal1: number = this.hospitals.length;
  searchTerm1: string = '';
  fromRow1: number = 1;
  currentPage1: number = 1;
  pageSize1: number = 10;
  sortBy1: string = 'name';
  selectedRows1: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  sort1(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy1 = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter1();
  }

  search1(searchTerm: string): void {
    this.searchTerm1 = searchTerm;
    this.filter1();
  }

  page1(pagingEvent: IPageChangeEvent): void {
    this.fromRow1 = pagingEvent.fromRow;
    this.currentPage1 = pagingEvent.page;
    this.pageSize1 = pagingEvent.pageSize;
    this.filter1();
  }

  filter1(): void {
    let newData: any[] = this.hospitals;
    let excludedColumns: string[] = this.columns1
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm1, true, excludedColumns);
    this.filteredTotal1 = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy1, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow1, this.currentPage1 * this.pageSize1);
    this.tempHospitals = newData;
  }

  //应急通信资源
  columns2: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'code', label: '行政区划代码' },
    { name: 'depart', label: '运营单位' },
    { name: 'range', label: '覆盖位置' },
    { name: 'charge', label: '负责人' },
    { name: 'phone', label: '联系方式' },
    { name: 'telephone', label: '值班电话' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal2: number = this.communications.length;
  searchTerm2: string = '';
  fromRow2: number = 1;
  currentPage2: number = 1;
  pageSize2: number = 10;
  sortBy2: string = 'name';
  selectedRows2: any[] = [];

  sort2(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy2 = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter2();
  }

  search2(searchTerm: string): void {
    this.searchTerm2 = searchTerm;
    this.filter2();
  }

  page2(pagingEvent: IPageChangeEvent): void {
    this.fromRow2 = pagingEvent.fromRow;
    this.currentPage2 = pagingEvent.page;
    this.pageSize2 = pagingEvent.pageSize;
    this.filter2();
  }

  filter2(): void {
    let newData: any[] = this.communications;
    let excludedColumns: string[] = this.columns2
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm2, true, excludedColumns);
    this.filteredTotal2 = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy2, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow2, this.currentPage2 * this.pageSize2);
    this.tempCommunications = newData;
  }

  //应急运输资源
  columns3: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'type', label: '站场类型' },
    { name: 'area', label: '站场面积/平方公里' },
    { name: 'ways', label: '运输方式' },
    { name: 'charge', label: '负责人' },
    { name: 'phone', label: '联系方式' },
    { name: 'telephone', label: '值班电话' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal3: number = this.transports.length;
  searchTerm3: string = '';
  fromRow3: number = 1;
  currentPage3: number = 1;
  pageSize3: number = 10;
  sortBy3: string = 'name';
  selectedRows3: any[] = [];

  sort3(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy3 = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter3();
  }

  search3(searchTerm: string): void {
    this.searchTerm3 = searchTerm;
    this.filter3();
  }

  page3(pagingEvent: IPageChangeEvent): void {
    this.fromRow3 = pagingEvent.fromRow;
    this.currentPage3 = pagingEvent.page;
    this.pageSize3 = pagingEvent.pageSize;
    this.filter3();
  }

  filter3(): void {
    let newData: any[] = this.transports;
    let excludedColumns: string[] = this.columns3
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm3, true, excludedColumns);
    this.filteredTotal3 = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy3, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow3, this.currentPage3 * this.pageSize3);
    this.tempTransports = newData;
  }

  //应急避难场所
  columns4: ITdDataTableColumn[] = [
    { name: 'name', label: '名称' },
    { name: 'type', label: '站场类型' },
    { name: 'area', label: '面积(m2)' },
    { name: 'peopleNum', label: '可容纳人数' },
    { name: 'address', label: '地址' },
    { name: 'phone', label: '联系方式' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal4: number = this.transports.length;
  searchTerm4: string = '';
  fromRow4: number = 1;
  currentPage4: number = 1;
  pageSize4: number = 10;
  sortBy4: string = 'name';
  selectedRows4: any[] = [];

  sort4(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy4 = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter4();
  }

  search4(searchTerm: string): void {
    this.searchTerm4 = searchTerm;
    this.filter4();
  }

  page4(pagingEvent: IPageChangeEvent): void {
    this.fromRow4 = pagingEvent.fromRow;
    this.currentPage4 = pagingEvent.page;
    this.pageSize4 = pagingEvent.pageSize;
    this.filter4();
  }

  filter4(): void {
    let newData: any[] = this.shelters;
    let excludedColumns: string[] = this.columns4
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm4, true, excludedColumns);
    this.filteredTotal4 = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy4, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow4, this.currentPage4 * this.pageSize4);
    this.tempShelters = newData;
  }
}
