import { Component, OnInit } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ProveFile } from '../../models/file';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prove-oper',
  templateUrl: './prove-oper.component.html',
  styleUrls: ['./prove-oper.component.css']
})
export class ProveOperComponent implements OnInit {
  vm: ProveFile;
  title: String;
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this.vm = new ProveFile();
    this.vm.CreateTime = new Date();
    this.title = '新增气象证明';
  }

}
