import { Component, OnInit } from '@angular/core';
import { Result } from '../service/result';
import { ServerService } from '../service/server.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  ontime: any;
  result: Result;
  msg: string;
  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService.queryDocByParame(1, 3)
      .subscribe(
      result => {
        this.result = result;
        if (this.result.code == 0) {
          this.ontime = this.result.data;
        } else {
          console.log(this.result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }

}
