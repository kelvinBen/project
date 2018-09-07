import { Component, OnInit } from '@angular/core';
import { PlanOper } from '../../../model/plan';
import { Plantype } from '../../../model/plantype';
@Component({
  selector: 'app-planoper',
  templateUrl: './planoper.component.html',
  styleUrls: ['./planoper.component.css']
})
export class PlanoperComponent implements OnInit {
  types: Plantype[] = [];
  vm: PlanOper = new PlanOper();
  constructor() { }

  ngOnInit() {
  }

}
