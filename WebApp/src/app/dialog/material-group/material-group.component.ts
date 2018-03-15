import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { MaterialGroup } from "../../model/response";
import { MD_DIALOG_DATA } from '@angular/material';
import { Goodstype } from "../../model/goodstype";
import { Goods } from "../../model/goods";
import { ShipEx } from "../../model/shipex";
import { Helicopter } from "../../model/helicopter";
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-material-group',
  templateUrl: './material-group.component.html',
  styleUrls: ['./material-group.component.css']
})
export class MaterialGroupComponent implements OnInit {
  selType: String = 'shipex';
  selSubType: Goodstype;
  goodsType: Goodstype[] = [];
  ships: ShipEx[] = [];
  helicopters: Helicopter[] = [];
  goods: Goods[] = [];
  shipOffset: Number = 0;
  constructor( @Inject(MD_DIALOG_DATA) public data: string,
    public dialogRef: MdDialogRef<MaterialGroupComponent>,
    private _dataTableService: TdDataTableService,
    public _service: ServiceService) { }

  ngOnInit() {
    if (this.data) { this.selType = this.data; }
    this._service.Get('goodstype', '').subscribe(result => {
      this.goodsType = result as Goodstype[];
      this.loadDatas();
    });
  }
  loadDatas() {
    console.log(this.selType);
    if (this.selType === 'shipex') {
      this._service.Get('shipex', '').subscribe(result => {
        this.ships = result as ShipEx[];
        this.columns = [
          { name: 'name', label: '船舶名称' },
          { name: 'type', label: '船舶类型' },
          { name: 'depart', label: '所属公司' },
          { name: 'shipowner', label: '船东' }
        ];
        this.filteredTotal = this.ships.length;
        this.sortBy = 'depart';
        this.rows = this.ships;
        this.filter();
      }, error => {
        console.log(error);
      });
    } else if (this.selType === 'helicopter') {
      this._service.Get('helicopter', '').subscribe(result => {
        this.helicopters = result as Helicopter[];
        this.columns = [
          { name: 'num', label: '型号' },
          { name: 'depart', label: '所属公司' },
          { name: 'base', label: '飞行基地' },
          { name: 'vender', label: '生产厂家' },
          { name: 'regnum', label: '注册号' }
        ];
        this.filteredTotal = this.helicopters.length;
        this.sortBy = 'depart';
        this.rows = this.helicopters;
        this.filter();
      });
    } else {
      if (!this.selSubType) {
        this.selSubType = this.goodsType[0];
      }
      this._service.Get('goods', '?type=eq.' + this.selSubType.id).subscribe(result => {
        this.goods = result as Goods[];
        this.columns = [
          { name: 'name', label: '物资名称' },
          { name: 'manufacturer', label: '生产厂家' },
          { name: 'depart', label: '所属公司' },
          { name: 'assetNum', label: '资产编号' }
        ];
        this.filteredTotal = this.goods.length;
        this.sortBy = 'depart';
        this.rows = this.goods;
        this.filter();
      });
    }
  }
  submit() {
    let temp: MaterialGroup[] = [];
    if (this.selType == 'shipex') {
      (this.selectedRows as ShipEx[]).forEach(function (v) {
        let vm = new MaterialGroup();
        vm.materialid = v.id;
        vm.materialname = v.name;
        vm.materialtype = "shipex";
        vm.typename = '船舶';
        vm.num = 1;
        vm.numex = 0;
        temp.push(vm);
      });
    } else if (this.selType == 'helicopter') {
      (this.selectedRows as Helicopter[]).forEach(function (v) {
        let vm = new MaterialGroup();
        vm.materialid = v.id;
        vm.materialname = v.regnum;
        vm.materialtype = "helicopter";
        vm.typename = '直升飞机';
        vm.num = 1;
        vm.numex = 0;
        temp.push(vm);
      });
    } else {
      let type = this.selSubType.id;
      let typename = this.selSubType.typename;
      (this.selectedRows as Goods[]).forEach(function (v) {
        let vm = new MaterialGroup();
        vm.materialid = v.id;
        vm.materialname = v.name;
        vm.featureid = v.featureid;
        vm.materialtype = type.toString();
        vm.typename = typename;
        vm.num = 1;
        vm.numex = 0;
        temp.push(vm);
      });
    }

    this.dialogRef.close(temp);
  }

  rows: any[] = [];
  rowsTemp: any[] = [];
  columns: ITdDataTableColumn[] = [];
  filteredTotal: number = 0;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = '';
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
    let newData: any[] = this.rows;
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
    this.rowsTemp = newData;
  }
}
