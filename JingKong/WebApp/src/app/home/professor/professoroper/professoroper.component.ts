import { Component, OnInit } from '@angular/core';
import { ProfessorOper } from '../../../model/professor';
import { professorType } from '../../../model/professorType';
@Component({
  selector: 'app-professoroper',
  templateUrl: './professoroper.component.html',
  styleUrls: ['./professoroper.component.css']
})
export class ProfessoroperComponent implements OnInit {
  types: professorType[] = [];
  vm: ProfessorOper = new ProfessorOper('', 0, '', '', '', '');
  constructor() { }

  ngOnInit() {
  }

}
