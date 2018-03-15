import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { organizationOper, organization } from "../../model/organization";
import { TreeNode } from 'primeng/primeng';
@Component({
  selector: 'app-select-org',
  templateUrl: './select-org.component.html',
  styleUrls: ['./select-org.component.css']
})
export class SelectOrgComponent implements OnInit {
  orgNodes: TreeNode[] = []
  selectOrg: TreeNode = null;
  orgs: organization[] = [];
  constructor(public dialogRef: MdDialogRef<SelectOrgComponent>,
    public serviceService: ServiceService) { }

  ngOnInit() {
    this.queryOrgs();
  }

  queryOrgs() {
    this.serviceService.Get('organization', '').subscribe(result => {
      this.orgs = result as organization[];
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

}
