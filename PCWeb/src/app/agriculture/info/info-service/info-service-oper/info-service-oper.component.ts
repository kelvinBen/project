import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-service-oper',
  templateUrl: './info-service-oper.component.html',
  styleUrls: ['./info-service-oper.component.css']
})
export class InfoServiceOperComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  // oper(id: Number) {
  //   if (id) {

  //   } else {
  //     this._router.navigateByUrl('/prove/add');
  //   }
  // }
}
