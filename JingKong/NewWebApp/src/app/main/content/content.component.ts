import { Component, OnInit,DoCheck } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../service/api.service';
// import { QuestionService } from '../../service/question.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Msg } from '../../model/msg';
import { isFormattedError } from '@angular/compiler';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit,DoCheck {
  vmId: Number;
  questions: any[];
  headData = [];
  searchList = [];
  menuList = [];
  data = [];
  displayedColumns = [];

  // ELEMENT_DATA = [];
  dataSource = new MatTableDataSource(this.data);
  constructor(private _route: ActivatedRoute, private apiService: ApiService) {
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngDoCheck() {this.dataSource = new MatTableDataSource(this.data)}
  ngOnInit() {
    this._route.params.forEach((param) => {
      this.vmId = param['id'] as Number;
      if (this.vmId) {
        this.apiService.getListsAndConfig(this.vmId, 1).subscribe(result => {
          let info = result as Msg;
          if (info.errCode == 0) {
            this.headData = info.data.gridList;
            this.searchList = info.data.searchList;
            this.displayedColumns = info.data.gridList.map(i => {
              return i.attributeCode;
            });
            if(this.headData.length>0){
                this.displayedColumns.push('symbol');
            }
          }
        }, error => {
          alert("请求失败")
        }
        );
        this.apiService.getMenu(1).subscribe(result => {
          this.menuList = [];
          let info = result as Msg;
          if (info.errCode == 0) {
            info.data.forEach(element => {
              if (element.childrenList == 0) {
                this.menuList.push({ "title": element.title, "stitle": '', "entityTypeId": element.entityTypeId })
              } else {
                element.childrenList.forEach(ele => {
                  this.menuList.push({ "title": element.title, "stitle": ele.title, "entityTypeId": ele.entityTypeId });
                });
              }
            });
          }
        });
        this.apiService.getListData(this.vmId).subscribe(result => {
          this.data = [];
          let info = result as Msg;
          if (info.errCode == 0) {
            this.data = info.data;
            this.dataSource = new MatTableDataSource(this.data);
          }
        })
      }

    })
  }

}
