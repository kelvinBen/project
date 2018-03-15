import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { organizationOper, organization } from "../../model/organization";
import { TreeNode } from 'primeng/primeng';
import { MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-add-org',
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.css']
})
export class AddOrgComponent implements OnInit {
  bNode: boolean = true;
  orgNodes: TreeNode[] = []
  selectOrg: TreeNode = null;
  parentNode: organization = new organization;
  orgs: organization[] = [];
  vm: organizationOper = new organizationOper();
  constructor( @Inject(MD_DIALOG_DATA) public data: organization,
    public dialogRef: MdDialogRef<AddOrgComponent>,
    public serviceService: ServiceService) { }

  ngOnInit() {
    this.queryOrgs();
    if (this.data) {//edit
      this.vm = this.data;
    }
  }

  queryOrgs() {
    this.serviceService.Get('organization', '').subscribe(result => {
      this.orgs = result as organization[];
      if (this.data) {
        for (let i = 0; i < this.orgs.length; ++i) {
          if (this.orgs[i].id == this.vm.parentid) {
            this.parentNode = this.orgs[i];
            break;
          }
        }
      }
      this.orgs.filter(function (v, i) {
        return v.parentid == -1;
      }).sort(function (a, b) {
        return a.sort - b.sort;
      }).forEach(element => {
        this.orgNodes.push({
          "label": element.name,
          "expandedIcon": "fa-folder-open",
          "collapsedIcon": "fa-folder",
          "expanded": true,
          "data": element,
          "children": this.analysis(this.orgs, element.id)
        });
      });
    }, error => { console.log(error); });
  }

  analysis(ary: organization[], parentid: number) {
    let child: TreeNode[] = [];
    this.orgs.filter(function (v, i) {
      return v.parentid == parentid;
    }).sort(function (a, b) {
      return a.sort - b.sort;
    }).forEach(element => {
      child.push({
        "label": element.name,
        "expandedIcon": "fa-folder-open",
        "collapsedIcon": "fa-folder",
        "expanded": true,
        "data": element,
        "children": this.analysis(this.orgs, element.id)
      });
    });
    return child;
  }

  nodeSelect(event) {
    this.parentNode = event.node.data as organization;
  }

  submit() {
    if (this.data) {
      this.vm.parentid = this.parentNode.id;
      this.serviceService.Patch('organization', '?id=eq.' + this.data.id, this.vm).subscribe(result => {
      }, error => { console.log(error); });
    } else {
      if (this.bNode) {
        this.vm.parentid = -1;
      } else {
        this.vm.parentid = this.parentNode.id;
      }
      let pid = this.vm.parentid;
      this.vm.sort = this.orgs.filter(function (v, i) {
        return v.parentid == pid;
      }).length;
      this.serviceService.Post('organization', this.vm).subscribe(result => {
      }, error => { console.log(error); });
    }
  }
}
