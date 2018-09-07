import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { equip } from '../../model/equipment';
@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {
  displayedColumns = ['name', 'feature', 'size', 'parameter', 'symbol'];

  ELEMENT_DATA: equip[] = [
    { id: 1, name: '**', feature: '安全防护', size: '', parameter: '', num: 2, producer: '', position: '', phone: '', desc: '' },
    { id: 2, name: '**', feature: '清障切割', size: '', parameter: '', num: 2, producer: '', position: '', phone: '', desc: '' }
  ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  constructor() { }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  ngOnInit() {
  }
}
