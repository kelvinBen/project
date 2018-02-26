import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.css']
})
export class RiskComponent implements OnInit {
  selectValue: String;
  options = [
    { value: 'heavyrain', label: '暴雨' },
    { value: 'drought', label: '干旱' },
    { value: 'hightemp', label: '高温' },
    { value: 'wind', label: '大风' },
    { value: 'hail', label: '冰雹' }
  ];
  selectedOption = this.options[0];
  constructor() { }

  ngOnInit() {
  }
  changeSelect() {
    return this.selectValue = this.selectedOption.value;
  }
}
