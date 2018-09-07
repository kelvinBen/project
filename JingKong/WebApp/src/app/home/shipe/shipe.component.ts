import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ShipEx } from '../../model/shipex';
@Component({
  selector: 'app-shipe',
  templateUrl: './shipe.component.html',
  styleUrls: ['./shipe.component.css']
})
export class ShipeComponent implements OnInit {
  displayedColumns = ['name', 'classification', 'depart', 'length', 'width', 'height', 'loaddraugh', 'parameter', 'symbol'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  ELEMENT_DATA: ShipEx[] = [
    { id: 1, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 2, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 3, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 4, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 5, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 6, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 7, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 8, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 9, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' },
    { id: 10, name: '*', classification: '*', length: 1, width: 1, height: 1, loaddraught: 1, parameter: '', depart: '', phone: '', desc: '' }
  ];

  constructor() { }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

