import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Goods, GoodCate } from '../../model/goods';
import { Storage } from '../../model/storage';
import { Router } from '@angular/router';
import { Securitybig } from '../../model/securitybig';
import { Securitymiddle } from '../../model/securitymiddle';
import { Securitysmall } from '../../model/securitysmall';
import { Goodstype } from '../../model/goodstype';
import { Group } from '../../model/group';
import { organization } from '../../model/organization';
import { SelectOrgComponent } from '../../dialog/select-org/select-org.component';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService,
    private dialog: MdDialog,
    private router: Router) {
  }
  types: Goodstype[] = [];
  catesEx: GoodCate[] = [];
  selCateEx: number = -1;
  cates: Securitybig[] = [];
  cates1: Securitymiddle[] = [];
  cates2: Securitysmall[] = [];
  materials: Goods[] = [];
  tempMaterials: Goods[] = [];
  storages: Storage[] = [];
  tempStorages: Storage[] = [];
  type: number = -1; //大类
  type1: number = -1;  //中类
  type2: number = -1; //小类
  orgs: organization[] = [];
  groups: Group[] = [];
  operOrg: organization;//作业公司
  ngOnInit() {
    this.serviceService.Get('goodstype', '').subscribe(result => {
      this.types = result as Goodstype[];
    });
    this.serviceService.Get('goodcate', '').subscribe(result => {
      let all = new GoodCate();
      all.id = -1;
      all.name = "全部";
      this.catesEx.push(all);
      this.catesEx = this.catesEx.concat(result as GoodCate[]);
    });
    this.serviceService.Get('organization', '').subscribe(result => {
      this.orgs = result as organization[];
      this.serviceService.Get('group', '').subscribe(result => {
        this.groups = result as Group[];
        this.querygoods();
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
    //获取应急保障类别（大类）
    this.serviceService.Get('securitybig', '?order=id.asc').subscribe(result => {
      this.cates.push(new Securitybig(-1, "全部"));
      let dts = result as Securitybig[];
      this.cates = this.cates.concat(dts);
      this.type = this.cates[0].id;
      this.cate1Change();
    }, error => {
      console.log(error);
    });
    this.queryStorage();
  }
  queryType(id){
    const index = this.types.findIndex(function (v, i) {
      return v.id === id;
    });
    return index === -1 ? '' : this.types[index].typename;
  }
  queryOrg(id) {
    let index = this.orgs.findIndex(function (v, i) {
      return v.id == id;
    });
    return index == -1 ? '' : this.orgs[index].name;
  }
  queryGroup(id) {
    let index = this.groups.findIndex(function (v, i) {
      return v.id == id;
    });
    return index == -1 ? '' : this.groups[index].name;
  }
  cate1Change() {
    //获取中类
    let par = '?order=id.asc';
    if (this.type != -1) par += '&bigId=eq.' + this.type;
    // console.log(par);
    this.cates1 = [];
    this.serviceService.Get('securitymiddle', par).subscribe(result => {
      this.cates1.push(new Securitymiddle(-1, -1, "全部"));
      let dts = result as Securitymiddle[];
      this.cates1 = this.cates1.concat(dts);
      this.type1 = this.cates1[0].id;
      this.cate2Change();
    }, error => {
      console.log(error);
    });
  }
  cate2Change() {
    //获取小类
    let par = '?order=id.asc';
    if (this.type1 != -1) par += '&middleId=eq.' + this.type1;
    this.cates2 = [];
    this.serviceService.Get('securitysmall', par).subscribe(result => {
      this.cates2.push(new Securitysmall(-1, -1, "全部", ''));
      let dts = result as Securitysmall[];
      this.cates2 = this.cates2.concat(dts);
      this.type2 = this.cates2[0].id;
    }, error => {
      console.log(error);

    });
  }
  querygoods() {
    let par = '?order=id.desc';
    if (this.type2 != -1) par += '&smalltype=eq.' + this.type2;
    if (this.selCateEx != -1) par += '&category=eq.' + this.selCateEx;
    if (this.operOrg) par += '&depart=eq.' + this.operOrg.id;
    this.serviceService.Get('goods', par).subscribe(result => {
      this.materials = result as Goods[];
      this.filter();
    }, error => {
      console.log(error);
    });

  }

  queryStorage() {
    this.serviceService.Get('storage', '?order=id.asc').subscribe(result => {
      this.storages = result as Storage[];
      this.filter1();
    }, error => {
      console.log(error);
    });
  }

  deleteStorage(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('storage', par).subscribe(result => {
        this.queryStorage();
      }, error => {
        console.log(error);
      });
    }
  }

  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('goods', par).subscribe(result => {
        this.querygoods();
      }, error => {
        console.log(error);
      });
    }
  }
  searchOrg() {
    let dialogRef = this.dialog.open(SelectOrgComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != "-1" && result.data) {
        this.operOrg = result.data as organization;
      } else {
        this.operOrg = null;
      }
    });
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '物资名称' },
    { name: 'type', label: '物资类别' },
    { name: 'depart', label: '所属单位' },
    { name: 'emerGroup', label: '所属应急队伍' },
    { name: 'startTime', label: '出厂日期' },
    { name: 'updateTime', label: '更新时间' },
    { name: 'repairTime', label: '维护周期(天)' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.materials.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'startTime';
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
    let newData: any[] = this.materials;
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
    this.tempMaterials = newData;
  }


  columns1: ITdDataTableColumn[] = [
    { name: 'name', label: '存储库名称' },
    { name: 'type', label: '存储库类型' },
    { name: 'address', label: '地址' },
    { name: 'depart', label: '所属单位' },
    { name: 'charge', label: '负责人' },
    { name: 'phone', label: '联系电话' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal1: number = this.storages.length;

  searchTerm1: string = '';
  fromRow1: number = 1;
  currentPage1: number = 1;
  pageSize1: number = 10;
  sortBy1: string = 'name';
  selectedRows1: any[] = [];

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
    let newData: any[] = this.storages;
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
    this.tempStorages = newData;
  }
}
