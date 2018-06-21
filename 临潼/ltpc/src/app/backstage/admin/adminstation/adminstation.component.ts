import { Component, OnInit } from '@angular/core';
import { Result } from '../../../service/result';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DbServiceService } from '../../../service/db-service.service';
import { adminStation } from './adminstation'
import { User } from "../../../models/User";

@Component({
  selector: 'app-adminstation',
  templateUrl: './adminstation.component.html',
  styleUrls: ['./adminstation.component.css', '../../../../assets/css/backstage.css',
    '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class AdminstationComponent implements OnInit {
  userlist: User[];
  msg: string;
  getUser() {
    this._service.Get('Users', '')
      .subscribe(
      result => {
        this.userlist = result as User[];
        // if (result.code == 0) {
        //   this.userlist = result.data as adminStation[];//获取当前所选择分类下的所有子分类
        // } else {
        //   console.log(result.msg);
        // }
      },
      error => { this.msg = error; console.log(this.msg) }
      );

  }
  id: number;
  userdelete(id) {
    let conf = confirm('确定删除该用户？');
    if (conf) {
      this._service.Delete('Users', '?id=eq.' + id)
        .subscribe(
        result => {
          this.getUser();
        },
        error => { this.msg = error; console.log(this.msg) }
        );
    }
  }

  constructor(private route: ActivatedRoute, private _service: DbServiceService, private router: Router) { }

  ngOnInit() {
    this.getUser();
  }


}
