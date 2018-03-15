import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { PlanOper } from '../../../model/plan';
import { Plantype, PlanLevel } from '../../../model/plantype';
import { UploadFile } from "../../../model/upload";
import { organization } from "../../../model/organization";
import { SelectOrgComponent } from '../../../dialog/select-org/select-org.component';
@Component({
  selector: 'app-planoper',
  templateUrl: './planoper.component.html',
  styleUrls: ['./planoper.component.css']
})
export class PlanoperComponent implements OnInit {
  selOrg: organization = null;
  files: UploadFile[] = [];
  planId: number = undefined;
  type: number = undefined;
  planTypes: Plantype[] = [];
  planLevels: PlanLevel[] = [];
  vm: PlanOper = new PlanOper();
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.planId = params['id'] as number;
      if (this.planId) {
        this.serviceService.Get('plan', '?id=eq.' + this.planId).subscribe(
          result => {
            this.vm = (result as PlanOper[])[0];
            this.files = this.vm.upload ? JSON.parse(this.vm.upload) : [];
            if (this.vm.department) {
              this.serviceService.Get('organization', '?id=eq.' + this.vm.department).subscribe(result => {
                let os = result as organization[];
                if (os.length > 0) this.selOrg = os[0];
              });
            }
          }, error => {
            console.log(error);
          });
      }
    });
    this.serviceService.Get('plantype', '?order=id.asc').subscribe(result => {
      this.planTypes = result as Plantype[];
    }, error => {
      console.log(error);
    });
    this.serviceService.Get('planlevel', '?order=id.asc').subscribe(result => {
      this.planLevels = result as PlanLevel[];
    }, error => {
      console.log(error);
    });
  }
  cancel() {
    this.router.navigate(['resource/plan'])
  }
  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      let fs = JSON.parse(res);
      this.files = this.files.concat(fs);
    }
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName != f) ary.push(element);
    });
    this.files = ary;
  }
  onSubmit() {
    this.vm.upload = JSON.stringify(this.files);
    if (this.planId) {//edit
      this.serviceService.Patch('plan', '?id=eq.' + this.planId, this.vm).subscribe(result => {
        this.router.navigate(['resource/plan'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('plan', this.vm).subscribe(result => {
        this.router.navigate(['resource/plan'])
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
        this.vm.department = this.selOrg.id;
      }
    });
  }
}
