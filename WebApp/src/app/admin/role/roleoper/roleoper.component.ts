import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { User } from '../../../model/user';
import { organization } from '../../../model/organization';
import { Role, RoleOper } from '../../../model/role';
import { SelectOrgComponent } from '../../../dialog/select-org/select-org.component';
import { SelectUserComponent } from '../../../dialog/select-user/select-user.component';

@Component({
  selector: 'app-roleoper',
  templateUrl: './roleoper.component.html',
  styleUrls: ['./roleoper.component.css']
})
export class RoleoperComponent implements OnInit {
  roleId: number = undefined;
  vm: RoleOper = new RoleOper();
  type: number = undefined;
  selOrg: organization = null;
  selUser: User = null;
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MdDialog) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.roleId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.roleId) {
        this.serviceService.Get('role', '?id=eq.' + this.roleId).subscribe(result => {
          this.vm = (result as RoleOper[])[0];
          if (this.vm.orgid) {
            this.serviceService.Get('organization', '?id=eq.' + this.vm.orgid.toString()).subscribe(o => {
              this.selOrg = (o as organization[])[0];
            });
          }
          if (this.vm.userid) {
            this.serviceService.Get('user', '?id=eq.' + this.vm.userid.toString()).subscribe(u => {
              this.selUser = (u as User[])[0];
            });
          }
        }, error => {
          console.log(error);
        });
      }
    });
  }
  cancel() {
    this.router.navigate(['admin/role']);
  }
  onSubmit() {
    if (this.roleId) { // edit
      this.serviceService.Patch('role', '?id=eq.' + this.roleId, this.vm).subscribe(result => {
        this.cancel();
      }, error => {
        console.log(error);
      });
    } else { // add
      this.serviceService.Post('role', this.vm).subscribe(result => {
        this.cancel();
      }, error => {
        console.log(error);
      });
    }
  }
  searchOrg() {
    const dialogRef = this.dialog.open(SelectOrgComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== '-1' && result.data) {
        this.selOrg = result.data as organization;
        this.vm.orgid = this.selOrg.id;
      }
    });
  }
  searchUser() {
    const dialogRef = this.dialog.open(SelectUserComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selUser = result as User;
      if (this.selUser) {
        this.vm.userid = this.selUser.id;
      }
    });
  }
}
