import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Http } from '@angular/http';
import { ServerService } from '../../../service/server.service';
import { Category } from '../../../index/list/category';
import { subCategory } from '../../../index/list/subcategory';
import { List } from '../../../index/list/list';
import { logAdd } from "./logAdd";
import { Result } from '../../../service/result';
import { LocalStorageService } from 'ng2-webstorage';
import { UserModel } from '../../../backstage/login/userModel';
import * as moment from 'moment';
@Component({
  selector: 'app-stationlogadd',
  templateUrl: './stationlogadd.component.html',
  styleUrls: ['./stationlogadd.component.css', '../../../../assets/css/backstage.css', '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class StationlogaddComponent implements OnInit {
  vm: logAdd;
  msg: string;
  list: List[];
  submitNews() {
    if (this.flag) {//add
      this.serverService.submitNewsEx(this.vm)
        .subscribe(
        result => {
          this.router.navigate(['/backstage/admin/stationlog/']);
        },
        error => { this.msg = error; console.log(this.msg) }
        );
    } else { //edit
      this.serverService.editNewsEx(this.vm)
        .subscribe(
        result => {
          this.router.navigate(['/backstage/admin/stationlog/']);
        },
        error => { this.msg = error; console.log(this.msg) }
        );
    }
  }
  cancel() {
    this.router.navigate(['/backstage/admin/stationlog/']);
  }
  getSubCateName(id) {
    for (var i = 0; i < this.subCates.length; ++i) {
      if (this.subCates[i].Id == id) {
        return this.subCates[i].SmallClassName;
      }
    }
  }
  subCates: subCategory[];
  cates: Category[];
  getSubCateList() {
    this.serverService.subCategoryEx(this.vm.BigClassID)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.subCates = result.data as subCategory[];
          this.vm.SmallClassID = this.subCates[0].Id;
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
  constructor(private route: ActivatedRoute,
    private serverService: ServerService,
    private router: Router, private localSto: LocalStorageService,
    private http: Http) {
    let dt = moment();
    this.vm = new logAdd(0, 7, 26, '', dt.format('YYYY-MM-DDTHH:mm'), '', '', 0, 0, '');
  }

  flag: boolean = false;//true -- add , false -- edit;
  user: UserModel;
  ngOnInit() {
    this.user = this.localSto.retrieve('user') as UserModel;
    this.serverService.category().subscribe(result => {
      let temps = [];
      (result.data as Category[]).forEach(element => {
        if (element.Id == 7) temps.push(element);
      });
      this.cates = temps;
      this.getSubCateList();
    });
    this.route.params.forEach((params: Params) => {
      let id = params['id'];//category id
      if (id == null) {//add 
        this.flag = true;
        this.vm.UserId = parseInt(this.user.userid);
      } else {//edit
        this.flag = false;
        this.serverService.detailByIdEx(id)
          .subscribe(
          result => {
            if (result.code == 0) {
              let dt = result.data as logAdd;
              dt.Time = moment(new Date(dt.Time)).format("YYYY-MM-DDTHH:mm");
              this.vm = dt;
            } else {
              console.log(result.msg);
            }
          },
          msg => { console.log(msg); }
          )
      }
    });
  }
}
