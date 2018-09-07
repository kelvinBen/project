import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Plan } from '../../model/plan';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {

  displayedColumns = ['platname', 'condition', 'date', 'position', 'wellname', 'plattype', 'contractor', 'operator', 'symbol']

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
