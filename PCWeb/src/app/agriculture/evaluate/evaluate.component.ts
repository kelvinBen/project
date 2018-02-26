import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css']
})
export class EvaluateComponent implements OnInit {
  listMenus: String[] = ['农气灾害监测', '农气灾害评估'];
  selMenu: String = '农气灾害监测';
  constructor() { }

  ngOnInit() {
  }

}
