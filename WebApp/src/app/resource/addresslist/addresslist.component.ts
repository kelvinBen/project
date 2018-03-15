import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TreeNode } from 'primeng/primeng';
import { ServiceService } from '../../service/service.service';
import { organization } from "../../model/organization";
import { AddOrgComponent } from '../../dialog/add-org/add-org.component';
import { OrgUsers } from '../../model/orgusers';
import { AddListComponent } from '../../dialog/add-list/add-list.component';
@Component({
  selector: 'app-addresslist',
  templateUrl: './addresslist.component.html',
  styleUrls: ['./addresslist.component.css']
})
export class AddresslistComponent implements OnInit {
  orgNodes: TreeNode[] = [];
  selectOrg: TreeNode = null;
  orgs: organization[] = [];
  rows: OrgUsers[] = [];
  constructor(private serviceService: ServiceService,
    private dialog: MdDialog) { }

  ngOnInit() {
    this.queryOrgs();
    this.nodeSelect();
  }
  nodeSelect() {
    this.queryUsers();
  }

  queryUsers() {
    this.rows = [];
    if (this.selectOrg && this.selectOrg.data) {
      let d = this.selectOrg.data as organization;
      if (d) {
        this.serviceService.Get('orgusers', '?orgid=eq.' + d.id + '&order=sort.asc').subscribe(result => {
          this.rows = result as OrgUsers[];
        }, error => { });
      }
    }
  }

  queryOrgs() {
    this.orgNodes = [];
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

  orgOperator(bAdd: boolean) {
    if (bAdd) {
      const dialogRef = this.dialog.open(AddOrgComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result !== '-1') {
          this.queryOrgs();
        }
      });
    } else {
      if (!this.selectOrg) {
        alert('选择需要编辑的组织机构');
        return;
      }

      const dialogRef = this.dialog.open(AddOrgComponent, { data: this.selectOrg.data });
      dialogRef.afterClosed().subscribe(result => {
        this.queryOrgs();
      });
    }
  }

  listOperator() {
    if (!this.selectOrg) {
      alert("请先选择组织机构");
      return;
    }
    let dt = new OrgUsers();
    dt.id = -1;
    dt.orgid = (this.selectOrg.data as organization).id;
    let dialogRef = this.dialog.open(AddListComponent, { data: dt });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "1") {
        this.queryUsers();
      }
    });
  }

  listEdit(user: OrgUsers) {
    let dialogRef = this.dialog.open(AddListComponent, { data: user });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "1") {
        this.queryUsers();
      }
    });
  }

  deleteUser(id: number) {
    this.serviceService.Delete('orgusers', '?id=eq.' + id).subscribe(result => {
      this.queryUsers();
    });
  }

  saveUsersToDb() {
    let org = this.selectOrg.data as organization;
    let id = org.id;
    // org.users = JSON.stringify(this.rows);
    this.serviceService.Patch('organization', '?id=eq.' + id, org).subscribe(result => {

    }, error => {
      console.log(error);
    });
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

  deleteOrg() {
    if (this.selectOrg) {
      if (confirm('删除操作不可恢复！确认删除？')) {
        let d = this.selectOrg.data as organization;
        let par = '?id=eq.' + d.id
        this.serviceService.Delete('organization', par).subscribe(result => {
          this.queryOrgs();
        }, error => {
          console.log(error);
        });
      }
    }
  }
}
