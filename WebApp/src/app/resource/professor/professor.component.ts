import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Professor } from '../../model/professor';
import { professorType } from '../../model/professorType';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {

  types: professorType[] = [];
  selType: number = -1;
  professors: Professor[] = [];
  tempProfessors: Professor[] = [];
  selSex: string = '-1';
  constructor(private serviceService: ServiceService,
    private _dataTableService: TdDataTableService) { }

  ngOnInit() {
    this.serviceService.Get('professorType', '').subscribe(result => {
      this.types.push(new professorType(-1, "全部", ""));
      let dts = result as professorType[];
      this.types = this.types.concat(dts);
    }, error => { console.log(error); });
    this.queryProfessor();
  }

  queryProfessor() {
    let par = '?order=birthday.asc';
    if (this.selType != -1) par += '&professionType=eq.' + this.selType;
    if (this.selSex != '-1') par += '&gender=eq.' + this.selSex;
    this.serviceService.Get('professor', par).subscribe(result => {
      this.professors = result as Professor[];
      this.filter();
    }, error => { console.log(error); });
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

  getAge(birth: string) {
    var birDt = new Date(birth);
    return ((new Date()).getFullYear() - birDt.getFullYear());
  }

  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('professor', par).subscribe(result => {
        this.queryProfessor();
      }, error => {
        console.log(error);
      });
    }
  }
  columns: ITdDataTableColumn[] = [
    { name: 'name', label: '专家姓名' },
    { name: 'gender', label: '性别' },
    { name: 'birthday', label: '年龄' },
    { name: 'professionType', label: '专家类别' },
    { name: 'depart', label: '工作单位' },
    { name: 'position', label: '行政职务' },
    { name: 'desc', label: '专业特长描述' },
    { name: 'id', label: '操作' }
  ];

  filteredTotal: number = this.professors.length;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'birthday';
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
    let newData: any[] = this.professors;
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
    this.tempProfessors = newData;
  }
}
