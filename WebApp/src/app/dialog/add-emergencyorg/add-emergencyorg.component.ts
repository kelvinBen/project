import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { EmergencyOrg, EmergencyOrgOper } from '../../model/emergencyOrg';
import { TreeNode } from 'primeng/primeng';
import { MD_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-add-emergencyorg',
  templateUrl: './add-emergencyorg.component.html',
  styleUrls: ['./add-emergencyorg.component.css',
    '../add-org/add-org.component.css'
  ]
})
export class AddEmergencyorgComponent implements OnInit {
  bNode: boolean = true;
  emerNodes: TreeNode[] = [];
  emerOrgs: EmergencyOrg[] = [];
  parentNode: EmergencyOrg = new EmergencyOrg();
  vm: EmergencyOrgOper = new EmergencyOrgOper();

  constructor( @Inject(MD_DIALOG_DATA) public data: EmergencyOrg,
    public dialogRef: MdDialogRef<AddEmergencyorgComponent>,
    public serviceService: ServiceService) { }

  ngOnInit() {
    this.queryEmerOrgs();
    if (this.data) {
      this.vm = this.data;
      this.bNode = this.vm.parentid == -1;
    }
  }
  queryEmerOrgs() {
    this.emerNodes = [];
    this.serviceService.Get('emergencyOrg', '').subscribe(result => {
      this.emerOrgs = result as EmergencyOrg[];
      if (this.data) {
        for (let i = 0; i < this.emerOrgs.length; ++i) {
          if (this.emerOrgs[i].id == this.vm.parentid) {
            this.parentNode = this.emerOrgs[i];
            break;
          }
        }
      }else{
        this.parentNode.id = -1;
      }
      this.emerOrgs.filter(function (v, i) {
        return v.parentid == -1
      }).sort(function (a, b) {
        return a.sort - b.sort;
      }).forEach(element => {
        this.emerNodes.push({
          "label": element.name,
          "expandedIcon": "fa-folder-open",
          "collapsedIcon": "fa-folder",
          "expanded": true,
          "data": element,
          "children": this.analysis(this.emerOrgs, element.id)
        });
      });
    }, error => {
      console.log(error);
    });
  }
  analysis(ary: EmergencyOrg[], parentid: number) {
    let child: TreeNode[] = [];
    this.emerOrgs.filter(function (v, i) {
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
        "children": this.analysis(this.emerOrgs, element.id)
      });
    });
    return child;
  }
  nodeSelect(event) {
    this.parentNode = event.node.data as EmergencyOrg;
  }
  submit() {
    if (this.data) {//edit
      this.vm.parentid = this.parentNode.id;
      this.serviceService.Patch('emergencyOrg', '?id=eq.' + this.data.id, this.vm).subscribe(result => {
        this.dialogRef.close("1");
      }, error => {
        this.dialogRef.close("0");
        console.log(error);
      });
    } else {
      this.vm.parentid = this.parentNode.id;
      let pid = this.vm.parentid;
      let childs = this.emerOrgs.filter(function (v, i) {
        return v.parentid == pid;
      });
      let childrens = this.emerOrgs.filter(function (v, i) {
        return v.parentid == pid;
      }).sort(function (a, b) { return b.sort - a.sort });
      this.vm.sort = childrens.length > 0 ? childrens[0].sort + 1 : 0;
      this.serviceService.Post('emergencyOrg', this.vm).subscribe(result => {
        this.dialogRef.close("1");
      }, error => {
        this.dialogRef.close("0");
        console.log(error);
      });
    }
  }
}
