import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { ServiceService } from '../../service/service.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { EmergencyOrg, EmergencyOrgOper } from '../../model/emergencyOrg';
import { AddEmergencyorgComponent } from '../../dialog/add-emergencyorg/add-emergencyorg.component';
@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css',
    '../addresslist/addresslist.component.css'
  ]
})
export class OrganizationComponent implements OnInit {
  emerNodes: TreeNode[] = [];
  selectEmer: TreeNode = null;
  emerOrgs: EmergencyOrg[] = [];
  editorContent: string;
  public editorOptions = {
    placeholder: '录入内容…'
  };
  constructor(private serviceService: ServiceService, private dialog: MdDialog) { }

  ngOnInit() {
    this.queryEmerOrgs();
    this.nodeSelect();
  }
  nodeSelect() {
    if (this.selectEmer) {
      const d = this.selectEmer.data as EmergencyOrg;
      this.editorContent = d.des;
    }
  }
  queryEmerOrgs() {
    this.emerNodes = [];
    this.serviceService.Get('emergencyOrg', '').subscribe(result => {
      this.emerOrgs = result as EmergencyOrg[];
      this.emerOrgs.filter(function (v, i) {
        return v.parentid == -1
      }).sort(function (a, b) {
        return a.sort - b.sort;
      }).forEach(element => {
        this.emerNodes.push({
          'label': element.name,
          'expandedIcon': 'fa-folder-open',
          'collapsedIcon': 'fa-folder',
          'expanded': true,
          'data': element,
          'children': this.analysis(this.emerOrgs, element.id)
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
        'label': element.name,
        'expandedIcon': 'fa-folder-open',
        'collapsedIcon': 'fa-folder',
        'expanded': true,
        'data': element,
        'children': this.analysis(this.emerOrgs, element.id)
      });
    });
    return child;
  }
  emerOperator(bAdd: boolean) {
    if (bAdd) {
      let dialogRef = this.dialog.open(AddEmergencyorgComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result == '1') this.queryEmerOrgs();
      });
    } else {
      if (!this.selectEmer) {
        alert('选择需要编辑的组织机构');
        return;
      }
      let dialogRef = this.dialog.open(AddEmergencyorgComponent, { data: this.selectEmer.data });
      dialogRef.afterClosed().subscribe(result => {
        if (result == '1') this.queryEmerOrgs();
      });
    }
  }
  deleteEmer() {
    if (this.selectEmer) {
      if (confirm('删除操作不可恢复！确认删除？')) {
        let d = this.selectEmer.data as EmergencyOrg;
        let par = '?id=eq.' + d.id;
        this.serviceService.Delete('emergencyOrg', par).subscribe(result => {
          this.queryEmerOrgs();
        }, error => {
          console.log(error);
        });
      }
    } else {
      alert('选择需要操作的组织机构');
    }
  }
  saveContent() {
    if (this.selectEmer) {
      let d = this.selectEmer.data as EmergencyOrg;
      let dt = new EmergencyOrgOper()
      dt.des = this.editorContent;
      this.serviceService.Patch('emergencyOrg', '?id=eq.' + d.id, dt).subscribe(result => {
        d.des = dt.des;
        alert('保存成功');
      }, error => {
        alert('保存失败');
        this.editorContent = d.des;
      });
    } else {
      alert('选择需要操作的组织机构');
    }
  }
  up() {

  }
  down() { }
  sortFun(up: boolean) {
    if (this.selectEmer) {
      let childrens: TreeNode[] = this.selectEmer.parent.children;
      for (let index = 0; index < childrens.length; ++index) {
        let node = childrens[index];
        let dt: EmergencyOrg = node.data as EmergencyOrg;
        if (up) {//up, not first node
          if (this.selectEmer === node) {
            if (index == 0) {
              alert('无效的上移操作');
            } else {
              let downNode: EmergencyOrg = (childrens[index - 1]).data as EmergencyOrg;
              let upErg: EmergencyOrgOper = new EmergencyOrgOper();
              let downErg: EmergencyOrgOper = new EmergencyOrgOper();
              upErg.sort = downNode.sort;
              downErg.sort = dt.sort;
              this.serviceService.Patch('emergencyOrg', '?id=eq.' + dt.id, upErg).subscribe(result => {
                this.serviceService.Patch('emergencyOrg', '?id=eq.' + downNode.id, downErg).subscribe(result => {
                  this.queryEmerOrgs();
                });
              })
            }
            break;
          }
        } else {//down, not last node
          if (this.selectEmer === node) {
            if (index == childrens.length - 1) {
              alert('无效的下移操作');
            }else{
              let upNode: EmergencyOrg = (childrens[index + 1]).data as EmergencyOrg;
              let upErg: EmergencyOrgOper = new EmergencyOrgOper();
              let downErg: EmergencyOrgOper = new EmergencyOrgOper();
              upErg.sort = dt.sort;
              downErg.sort = upNode.sort;
              this.serviceService.Patch('emergencyOrg', '?id=eq.' + dt.id, downErg).subscribe(result => {
                this.serviceService.Patch('emergencyOrg', '?id=eq.' + upNode.id, upErg).subscribe(result => {
                  this.queryEmerOrgs();
                });
              });
            }
            break;
          }
        }
      }
    } else {
      alert('选择需要操作的组织机构');
    }
  }
}
