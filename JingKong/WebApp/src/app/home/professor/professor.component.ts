import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Professor } from '../../model/professor';
@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent implements OnInit {
  displayedColumns = ['id', 'name', 'professionType', 'depart', 'position', 'phone', 'email', 'desc', 'symbol'];
  ELEMENT_DATA: Professor[] = [
    { id: 1, name: '张三', professionType: 1, depart: '***', position: '', phone: '', email: '' },
    { id: 2, name: '李四', professionType: 1, depart: '***', position: '', phone: '', email: '' }
  ];
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
