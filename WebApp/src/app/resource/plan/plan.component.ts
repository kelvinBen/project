import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Plan } from '../../model/plan';
import { organization } from '../../model/organization';
import { Plantype, PlanLevel } from '../../model/plantype';
import { TdFileService, IUploadOptions } from '@covalent/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { User } from '../../model/user';
import { LocalStorageService } from 'ng2-webstorage';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService,
    private fileUploadService: TdFileService,
    private storage: LocalStorageService) { }
  planTypes: Plantype[] = [];
  selType: number = -1;
  planLevels: PlanLevel[] = [];
  selLevel: number = -1;
  selOrg: string = '';
  orgs: organization[] = [];
  ngOnInit() {
    this.serviceService.Get('plantype', '?order=id.asc').subscribe(result => {
      this.planTypes.push(new Plantype(-1, "全部"));
      let dts = result as Plantype[];
      this.planTypes = this.planTypes.concat(dts);
    }, error => {
      console.log(error);
    });
    this.serviceService.Get('planlevel', '?order=id.asc').subscribe(result => {
      this.planLevels.push(new PlanLevel(-1, "全部"));
      let dts = result as PlanLevel[];
      this.planLevels = this.planLevels.concat(dts);
    }, error => {
      console.log(error);
    });
    this.serviceService.Get("organization", '?select=id,name').subscribe(result => {
      this.orgs = result as organization[];
      this.queryPlan();
    });
  }

  plans: Plan[] = [];
  tempPlans: Plan[] = [];
  queryPlan() {
    let par = '?order=reportTime.desc';
    if (this.selType != -1) par += '&type=eq.' + this.selType;
    if (this.selLevel != -1) par += '&level=eq.' + this.selLevel;
    let ids: number[] = [];
    if (this.selOrg != '') {
      let org = this.selOrg;
      let orgs = this.orgs.filter(function (v, i) {
        return v.name.indexOf(org) != -1;
      });
      if (orgs.length > 0){
        par += '&department=in.';
        orgs.forEach(function(v,i){
          par += v.id;
          if (i != orgs.length - 1) par += ',';
        });
      }
    }
    console.log(par);
    this.serviceService.Get('plan', par).subscribe(result => {
      this.plans = result as Plan[];
      this.filter();
    }, error => {
      console.log(error);
    });
  }
  resetQuery() {
    this.selLevel = -1;
    this.selType = -1;
    this.selOrg = '';
  }
  getTypeName(id) {
    let name = id;
    for (let i = 0; i < this.planTypes.length; ++i) {
      if (this.planTypes[i].id == id) {
        name = this.planTypes[i].typename;
        break;
      }
    }
    return name;
  }
  getLevelName(id){
    let name = id;
    for (let i=0;i<this.planLevels.length;++i){
      if (this.planLevels[i].id == id){
        name = this.planLevels[i].name;
        break;
      }
    }
    return name;
  }
  getOrgName(id) {
    let name = id;
    let index = this.orgs.findIndex(function (v, i) { return v.id == id; })
    if (index == -1) return '';
    name = this.orgs[index].name;
    return name;
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('plan', par).subscribe(result => {
        this.queryPlan();
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
      url: '/upload/plan',
      method: 'post',
      formData: fmdata
    };
    this.fileUploadService.upload(options).subscribe((response) => {
      this.queryPlan();
    });
  };

  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '预案名称' },
    { name: 'level', label: '预案层级' },
    { name: 'type', label: '预案类型' },
    { name: 'department', label: '所属单位' },
    { name: 'reportTime', label: '发布时间' },
    { name: 'contact', label: '联系人' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.plans.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'reportTime';
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
    let newData: any[] = this.plans;
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
    this.tempPlans = newData;
  }
}
