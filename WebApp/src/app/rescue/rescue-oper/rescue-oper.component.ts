import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { RescueOper, RescueShip, RescueHelicopter } from '../../model/rescue';
import { UploadFile } from '../../model/upload';
import { MaterialGroup } from '../../model/response';
import { EditRescueComponent } from '../../dialog/edit-rescue/edit-rescue.component';
import { EditRescueShipComponent } from '../../dialog/edit-rescue-ship/edit-rescue-ship.component';
import * as moment from 'moment';
@Component({
  selector: 'app-rescue-oper',
  templateUrl: './rescue-oper.component.html',
  styleUrls: ['./rescue-oper.component.css']
})
export class RescueOperComponent implements OnInit {
  vm: RescueOper = new RescueOper();
  pID: number = undefined;
  type: number = undefined;
  applys: UploadFile[] = [];
  images: UploadFile[] = [];
  rewards: UploadFile[] = [];
  ships: RescueShip[] = [];
  helicopters: RescueHelicopter[] = [];
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.pID = params['id'] as number;
      this.type = params['type'] as number;
      if (this.pID) {
        this.serviceService.Get('rescue', '?id=eq.' + this.pID).subscribe(result => {
          this.vm = (result as RescueOper[])[0];
          this.applys = this.vm.apply ? JSON.parse(this.vm.apply) : [];
          this.images = this.vm.images ? JSON.parse(this.vm.images) : [];
          this.rewards = this.vm.reward ? JSON.parse(this.vm.reward) : [];
          this.ships = this.vm.ship ? JSON.parse(this.vm.ship) : [];
          this.helicopters = this.vm.helicopter ? JSON.parse(this.vm.helicopter) : [];
        }, error => {
          console.log(error);
        });
      }
    });
  }
  onBasicUpload(event) {
    if (event.xhr.status === 200) {
      const res = event.xhr.response;
      const fs = JSON.parse(res);
      this.applys = this.applys.concat(fs);
    }
  }
  deleteUpFile(f) {
    const ary = [];
    this.applys.forEach(element => {
      if (element.ExName !== f) { ary.push(element); }
    });
    this.applys = ary;
  }
  onBasicUpload1(event) {
    if (event.xhr.status === 200) {
      const res = event.xhr.response;
      const fs = JSON.parse(res);
      this.images = this.images.concat(fs);
    }
  }
  deleteUpFile1(f) {
    const ary = [];
    this.images.forEach(element => {
      if (element.ExName !== f) { ary.push(element); }
    });
    this.images = ary;
  }
  onBasicUpload2(event) {
    if (event.xhr.status === 200) {
      const res = event.xhr.response;
      const fs = JSON.parse(res);
      this.rewards = this.rewards.concat(fs);
    }
  }
  deleteUpFile2(f) {
    const ary = [];
    this.rewards.forEach(element => {
      if (element.ExName !== f) { ary.push(element); }
    });
    this.rewards = ary;
  }
  cancel() {
    this.router.navigate(['rescue']);
  }
  deleteHelicopters(row: RescueHelicopter) {
    const temp: RescueHelicopter[] = [];
    for (let i = 0; i < this.helicopters.length; ++i) {
      if (this.helicopters[i] !== row) {
        temp.push(this.helicopters[i]);
      }
    }
    this.helicopters = temp;
    this.helicopters = [...this.helicopters];
  }
  addHelicopters() {
    const dialogRef = this.dialog.open(EditRescueComponent, { data: null });
    dialogRef.afterClosed().subscribe(result => {
      const heili = result as RescueHelicopter;
      if (heili) {
        this.helicopters.push(heili);
        this.helicopters = [...this.helicopters];
      }
    });
  }
  editHelicopters(row: RescueHelicopter) {
    const dialogRef = this.dialog.open(EditRescueComponent, { data: row });
    dialogRef.afterClosed().subscribe(result => {
      const heili = result as RescueHelicopter;
      if (heili) {
        for (let i = 0; i < this.helicopters.length; ++i) {
          if (this.helicopters[i].id === heili.id) {
            this.helicopters[i] = heili;
          }
        }
        this.helicopters = [...this.helicopters];
      }
    });
  }
  addShip() {
    const dialogRef = this.dialog.open(EditRescueShipComponent, { data: null });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      const ship = result as RescueShip;
      if (ship) {
        this.ships.push(ship);
      }
    });
  }
  editShip(row: RescueShip) {
    const dialogRef = this.dialog.open(EditRescueShipComponent, { data: row });
    dialogRef.afterClosed().subscribe(result => {
      const ship = result as RescueShip;
      if (ship) {
        for (let i = 0; i < this.ships.length; ++i) {
          if (this.ships[i].id === ship.id) {
            this.ships[i] = ship;
          }
        }
        this.ships = [...this.ships];
      }
    });
  }
  deleteShip(row: RescueShip) {
    const temp: RescueShip[] = [];
    for (let i = 0; i < this.ships.length; ++i) {
      if (this.ships[i] !== row) {
        temp.push(this.ships[i]);
      }
    }
    this.ships = temp;
    this.ships = [...this.ships];
  }
  onSubmit() {
    this.vm.ship = JSON.stringify(this.ships);
    this.vm.helicopter = JSON.stringify(this.helicopters);
    this.vm.apply = JSON.stringify(this.applys);
    this.vm.images = JSON.stringify(this.images);
    this.vm.reward = JSON.stringify(this.rewards);
    if (this.pID) {// edit
      this.serviceService.Patch('rescue', '?id=eq.' + this.pID, this.vm).subscribe(result => {
        this.router.navigate(['rescue']);
      }, error => {
        console.log(error);
      });
    } else { // add
      this.serviceService.Post('rescue', this.vm).subscribe(result => {
        this.router.navigate(['rescue']);
      }, error => {
        console.log(error);
      });
    }
  }
}
