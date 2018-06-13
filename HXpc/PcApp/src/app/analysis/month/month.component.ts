import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit {
  selMenu: String = '1';
  constructor() { }

  ngOnInit() {
  }

}
