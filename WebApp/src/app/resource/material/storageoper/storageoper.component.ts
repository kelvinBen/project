import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { StorageOper } from '../../../model/storage';
import { organization } from "../../../model/organization";

import { SelectOrgComponent } from '../../../dialog/select-org/select-org.component';
@Component({
  selector: 'app-storageoper',
  templateUrl: './storageoper.component.html',
  styleUrls: ['./storageoper.component.css']
})
export class StorageoperComponent implements OnInit {
  pId: number = undefined;
  vm: StorageOper = new StorageOper();
  selOrg: organization = null;
  type: number = undefined;
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private router: Router) { }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.pId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.pId) {
        this.serviceService.Get('storage', '?id=eq.' + this.pId).subscribe(
          result => {
            this.vm = (result as StorageOper[])[0]
          }, error => {
            console.log(error);
          });
      }
    });
  }
  onSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('storage', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/material'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('storage', this.vm).subscribe(result => {
        this.router.navigate(['resource/material'])
      }, error => {
        console.log(error);
      });
    }
  }
  searchOrg() {
    let dialogRef = this.dialog.open(SelectOrgComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != "-1" && result.data) {
        this.selOrg = result.data as organization;
        this.vm.depart = this.selOrg.id;
        this.vm.address = this.selOrg.address;
        this.vm.longitude = this.selOrg.longtitude;
        this.vm.latitude = this.selOrg.latitude;
      }
    });
  }
}
