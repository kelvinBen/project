import { Component, OnInit } from '@angular/core';
import { PlanOper } from '../../../model/plan';
import { Plantype } from '../../../model/plantype';

@Component({
  selector: 'app-case-oper',
  templateUrl: './case-oper.component.html',
  styleUrls: ['./case-oper.component.css']
})
export class CaseOperComponent implements OnInit {

  types: Plantype[] = [];
  vm: PlanOper = new PlanOper();
  constructor() { }

  ngOnInit() {
  }

}
