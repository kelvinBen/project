import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Msg } from '../../models/product';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-emailactive',
  templateUrl: './emailactive.component.html',
  styleUrls: ['./emailactive.component.css']
})
export class EmailactiveComponent implements OnInit {
  auth: string = '';
isEmail:boolean =false;
  constructor(private router: Router, private activedRoute: ActivatedRoute, private http: HttpClient, private modalService: NzModalService) { }

  ngOnInit() {
    this.activedRoute.params.forEach((params: Params) => {
      this.auth = params['auth'] as string;
      if(this.auth){
        this.isEmail=true;
     }
    })
  }
  enableEmail() {
    this.http.get('/checkemailactive?token=' + this.auth).subscribe(result => {
      let info = result as Msg;
      if (!info.code) {
        this.success();
      } else {
        this.error()
      }
    }, error => {
      this.error()
    })
  }
  success(): void {
    this.modalService.success({
      nzTitle: '账户提示：',
      nzContent: "邮箱激活成功",
    });
  }
  error(): void {
    this.modalService.error({
      nzTitle: '账户提示：',
      nzContent: "邮箱激活失败",
    });
  }
}
