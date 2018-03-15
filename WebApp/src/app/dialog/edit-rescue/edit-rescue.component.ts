import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { RescueHelicopter } from '../../model/rescue';

@Component({
  selector: 'app-edit-rescue',
  templateUrl: './edit-rescue.component.html',
  styleUrls: ['./edit-rescue.component.css']
})
export class EditRescueComponent implements OnInit {
  constructor( @Inject(MD_DIALOG_DATA) public data: RescueHelicopter,
    private _service: ServiceService,
    public dialogRef: MdDialogRef<EditRescueComponent>) { }

  ngOnInit() {
    if (!this.data) {
      this.data = new RescueHelicopter();
      this.data.id = (new Date()).getTime().toString();
    }
  }
  invalid() {
    if (this.data.cost && this.data.area && this.data.area.trim() !== '' &&
      this.data.stime && this.data.etime && this.data.etime > this.data.stime &&
      this.data.person && this.data.num) {
      return false;
    }

    return true;
  }
}
