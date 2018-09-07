import { Component, OnInit, Input, OnChanges,DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputBase } from '../../model/input-base';
import { ItemControlService } from '../../service/item-control.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges,DoCheck {
  @Input() questions: InputBase[] = [];
  form: FormGroup;
  payLoad = '1';
  sign = ''

  constructor(private qcs: ItemControlService) { }

  ngOnInit() {

  }
  ngOnChanges(changes) {
    this.form = this.qcs.toFormGroup(this.questions);
  }
  ngDoCheck() {
        if (this.form.controls.datatype) {
          switch (this.form.controls.datatype.value) {
            case 'date': this.sign = 'date-format'; break;
            case 'datetime': this.sign = 'datetime-format'; break;
            case 'decimal': this.sign = 'decimal-radix'; break;
            default: this.sign = '';
              break;
          }
        }
  }
}
