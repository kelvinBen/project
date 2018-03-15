import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../service/service.service';
import { organizationOper, organization } from "../../model/organization";
import { MD_DIALOG_DATA } from '@angular/material';
import { OrgUsersOper, OrgUsers } from '../../model/orgusers';
@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListComponent implements OnInit {

  constructor( @Inject(MD_DIALOG_DATA) public data: OrgUsers,
    private _service: ServiceService,
    public dialogRef: MdDialogRef<AddListComponent>) { }
  vm: OrgUsers = null;
  ngOnInit() {
    this.vm = this.data;
  }
  submit() {
    if (this.vm.id == -1) {//add
      let dt: OrgUsersOper = new OrgUsersOper();
      dt.name = this.vm.name;
      dt.coding = this.vm.coding;
      dt.duty = this.vm.duty;
      dt.address = this.vm.address;
      dt.charge = this.vm.charge;
      dt.phone = this.vm.phone;
      dt.telephone = this.vm.telephone;
      dt.email = this.vm.email;
      dt.orgid = this.vm.orgid;
      dt.sort = 0;
      let par = '?orgid=eq.' + dt.orgid + '&order=sort.desc&limit=1';
      this._service.Get('orgusers', par).subscribe(result => {
        let us = result as OrgUsers[];
        dt.sort = us.length > 0 ? us[0].sort + 1 : 0;
        this._service.Post('orgusers', dt).subscribe(result => {
          this.dialogRef.close("1");
        }, error => {
          this.dialogRef.close("0");
        });
      }, error => {
        this.dialogRef.close("0");
      });
    } else {//edit
      this._service.Patch('orgusers', '?id=eq.' + this.vm.id, this.vm).subscribe(result => {
        this.dialogRef.close("1");
      }, error => {
        this.dialogRef.close("0");
      });
    }
  }
}
