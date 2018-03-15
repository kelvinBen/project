import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { MD_DIALOG_DATA } from '@angular/material';
import { RescueShip } from '../../model/rescue';


@Component({
  selector: 'app-edit-rescue-ship',
  templateUrl: './edit-rescue-ship.component.html',
  styleUrls: ['./edit-rescue-ship.component.css']
})
export class EditRescueShipComponent implements OnInit {
  constructor( @Inject(MD_DIALOG_DATA) public data: RescueShip,
    private _service: ServiceService,
    public dialogRef: MdDialogRef<EditRescueShipComponent>) { }

  ngOnInit() {
    if (this.data === null) { // add
      this.data = new RescueShip();
      this.data.id = (new Date()).getTime().toString();
    }
  }
  invalid() {
    if (this.data.cost && this.data.fuelPrice && this.data.area && this.data.area.trim() !== '' &&
      this.data.stime && this.data.etime && this.data.etime > this.data.stime &&
      this.data.person && this.data.num && this.data.oil) {
      return false;
    }

    return true;
  }
}
