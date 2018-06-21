import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServerService } from '../../../service/server.service';
import { logAdd } from '../../admin/stationlogadd/logAdd';
import { subCategory } from '../../../index/list/subcategory';
import * as moment from 'moment';
@Component({
  selector: 'app-adminlogview',
  templateUrl: './adminlogview.component.html',
  styleUrls: ['./adminlogview.component.css', '../../../../assets/css/backstage.css',]
})
export class AdminlogviewComponent implements OnInit {
  view: logAdd;
  errMsg: string;
  id: number;


  //审核日志
  submitStatus() {
    console.log(this.view);
    this.serverService.editLogStatus(this.view)
      .subscribe(
      result => {
        this.router.navigate(['/backstage/admin/adminlog']);
      },
      error => { this.errMsg = error; console.log(this.errMsg) }
      );
  }
  constructor(private serverService: ServerService, private route: ActivatedRoute, private router: Router) {
    let dt = moment();
    this.view = new logAdd(0, 7, 26, '', dt.format('YYYY-MM-DDTHH:mm'), '', '', 0, 0, '');
  }
  subCates: subCategory[];
  msg: string;
  getSubCateList() {
    this.serverService.subCategoryEx(7)
      .subscribe(
      result => {
        if (result.code == 0) {
          this.subCates = result.data as subCategory[];
        } else {
          console.log(result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }
  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.getSubCateList();
      let id = params['id'];
      this.serverService.detailByIdEx(id)
        .subscribe(
        result => {
          if (result.code == 0) {
           let dt = result.data as logAdd;
           dt.Time = moment(new Date(dt.Time)).format("YYYY-MM-DDTHH:mm");
           this.view = dt;
          } else {
            console.log(result.msg);
          }
        },
        error => { this.errMsg = error; console.log(this.errMsg) }
        );
    });
  }

  statusStr(status) {
    if (status == 0) return '未审核';
    else if (status == 1) return '审核通过';
    return '审核未通过';
  }

  getSubCateName(id) {
    if (!this.subCates) return;
    for (var i = 0; i < this.subCates.length; ++i) {
      if (this.subCates[i].Id == id) {
        return this.subCates[i].SmallClassName;
      }
    }
  }
  cancel() {
    this.router.navigate(['/backstage/admin/adminlog']);
  }
}

