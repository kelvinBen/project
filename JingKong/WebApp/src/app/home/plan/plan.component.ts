import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Plan } from '../../model/plan';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  displayedColumns = ['platname', 'condition', 'date', 'position', 'wellname', 'plattype', 'symbol'];

  ELEMENT_DATA: Plan[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  constructor() {
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit() {
  }
}
