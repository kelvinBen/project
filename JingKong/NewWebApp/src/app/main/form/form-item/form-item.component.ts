import { Component,OnInit, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { InputBase }     from '../../../model/input-base';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.css']
})
export class FormItemComponent implements OnInit {
  @Input() question: InputBase;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.attributeCode].valid; }
  constructor() { }

  ngOnInit() {
  }

}
