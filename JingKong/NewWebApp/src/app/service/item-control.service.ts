import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { InputBase } from '../model/input-base';

@Injectable()
export class ItemControlService {
  constructor() { }

  toFormGroup(questions: InputBase[] ) {
    let group: any = {};

    questions.forEach(question => {
      group[question.attributeCode] = question.isRequired ? new FormControl(question.defaultValue || '',Validators.required) :new FormControl(question.defaultValue || '');
    });
    return new FormGroup(group);
  }
}
