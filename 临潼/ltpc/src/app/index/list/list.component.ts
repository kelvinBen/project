import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Result } from '../../service/result';
import { ServerService } from '../../service/server.service';
import { Category } from './category';
import { subCategory } from './subcategory';
import { List } from './list';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  msg: string;
  subId: number;
  category: Category;
  categoryName: string;
  subCateName: string;
  subCates: subCategory[];
  selsubCate: subCategory;
  fileList: List[];
  constructor(private route: ActivatedRoute, private serverService: ServerService) { }

  ngOnInit() {  //init category data
    this.fileList = [];
    this.route.params.forEach((params: Params) => {
      let id = params['cate'];//category id
      this.serverService.categoryEx(id)
        .subscribe(
        result => {
          if (result.code == 0) {
            this.category = result.data as Category;
            this.serverService.subCategoryEx(this.category.Id)
              .subscribe(
              result => {
                if (result.code == 0) {
                  this.subCates = result.data as subCategory[];
                  this.selsubCate = this.subCates[0];
                  this.categoryName = this.selsubCate.SmallClassName;
                  this.getListCount(this.selsubCate.Id);
                } else {
                  console.log(result.msg);
                }
              },
              error => { this.msg = error; console.log(this.msg) }
              );
          } else {
            console.log(result.msg);
          }
        },
        error => { this.msg = error; console.log(this.msg) }
        );
    });
  }

  onItemClick(subCate) {
    this.fileList = [];
    this.selsubCate = subCate;
    this.categoryName = this.selsubCate.SmallClassName;
    this.getListCount(subCate.Id);
  }

  getSubName(){ return this.selsubCate.SmallClassName;}

  listCount: number;//总的条数
  pageNum: number = 10;//每一页多少条
  page: number[] = [];//代表总页数
  selPage: number = 1;//当前选中的页码
  getListCount(subId) {
    this.serverService.fileCount(subId)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.listCount = result.data as number;
          if (this.listCount == 0) return;
          this.page = [];
          let ps = Math.ceil(this.listCount / this.pageNum);
          for (let i = 0; i < ps; ++i) {
            this.page.push(i + 1);
          }
          this.selPage = this.page[0];
          this.getList();
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
  changePage(p) {
    this.selPage = p;
    this.getList();
  }

  getList() {
    this.serverService.filelist(this.selsubCate.Id, this.pageNum, this.selPage)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.fileList = result.data as List[];
          // console.log(this.fileList);
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }

}
