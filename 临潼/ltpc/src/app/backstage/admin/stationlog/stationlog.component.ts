import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ServerService } from '../../../service/server.service';
import { Category } from '../../../index/list/category';
import { subCategory } from '../../../index/list/subcategory';
import { List } from '../../../index/list/list';
import { LocalStorageService } from 'ng2-webstorage';
import { UserModel } from '../../../backstage/login/userModel';

@Component({
  selector: 'app-stationlog',
  templateUrl: './stationlog.component.html',
  styleUrls: ['./stationlog.component.css', '../../../../assets/css/backstage.css',
    '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class StationlogComponent implements OnInit {
  category: number = 7;
  subCate: number;//当前所选择的子分类
  subCates: subCategory[];//所有的子分类
  cates: Category[];
  msg: string;
  constructor(private route: ActivatedRoute,
    private localSto: LocalStorageService,
    private serverService: ServerService) { }

  //获取所有的子分类
  getSubCateList() {
    this.serverService.subCategoryEx(this.category)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.subCates = result.data as subCategory[];//获取当前所选择分类下的所有子分类
          this.subCate = this.subCates[0].Id;
          this.getListCount();
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
  listCount: number;//总的条数
  pageNum: number = 10;//每一页多少条
  page: number[] = [];//代表总页数
  selPage: number = 1;//当前选中的页码
  getListCount() {
    this.serverService.stationFileCountEx(this.user.userid, this.subCate)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.listCount = result.data as number;
          if (this.listCount == 0) {
            this.fileList = [];
            return;
          }
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

  fileList: List[];
  user: UserModel;
  getList() {
    this.serverService.stationFilelistEx(this.user.userid, this.subCate, this.pageNum, this.selPage)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.fileList = result.data as List[];
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
  ngOnInit() {
    this.user = this.localSto.retrieve('user') as UserModel;
    this.serverService.category().subscribe(result => {
      let temps = [];
      (result.data as Category[]).forEach(element => {
        if (element.Id == 7) temps.push(element);
      });
      this.cates = temps;
      this.getSubCateList();
    }, error => { alert(error) });
  }
  search() {
    this.getListCount();
  }
  deletecon(id) {
    var r = confirm("确定删除？")
    if (r == true) {
      this.serverService.deleteconEx(id)
        .subscribe(
        result => {
          // this.router.navigate(['/backstage/admin/adminnews']);
          this.search();
        },
        error => { this.msg = error; console.log(this.msg) }
        );
    }
  }

  statusStr(status) {
    if (status == 0) return '未审核';
    else if (status == 1) return '审核通过';
    return '审核未通过';
  }
}
