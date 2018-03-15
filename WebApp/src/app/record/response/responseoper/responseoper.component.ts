import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { ResponseOper, ResponseGroup, MaterialGroup } from '../../../model/response';
import { MdDialog, MdDialogRef } from '@angular/material';
import { UploadFile } from "../../../model/upload";
import { WeiyouOper } from "../../../model/weiyou";
import { SaveoilOper } from "../../../model/saveoil";
import { EquipOper } from "../../../model/equip";
import { GunOper } from "../../../model/gun";
import { NetOper } from "../../../model/net";
import { XiaooilOper } from "../../../model/xiaooil";
import { Professor } from "../../../model/professor";
import { ResponseGroupComponent } from "../../../dialog/response-group/response-group.component";
import { MaterialGroupComponent } from "../../../dialog/material-group/material-group.component";
import { MaterialPersonComponent } from "../../../dialog/material-person/material-person.component";
@Component({
  selector: 'app-responseoper',
  templateUrl: './responseoper.component.html',
  styleUrls: ['./responseoper.component.css']
})
export class ResponseoperComponent implements OnInit {
  files: UploadFile[] = [];
  groups: ResponseGroup[] = [];
  materials: MaterialGroup[] = [];
  persons: Professor[] = [];
  responseId: number = undefined;
  type: number = undefined;
  vm: ResponseOper = new ResponseOper();
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.responseId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.responseId) {
        this.serviceService.Get('response', '?id=eq.' + this.responseId).subscribe(result => {
          this.vm = (result as ResponseOper[])[0];
          this.files = this.vm.otherFiles ? JSON.parse(this.vm.otherFiles) : [];
          this.groups = this.vm.goup ? JSON.parse(this.vm.goup) : [];
          this.materials = this.vm.material ? JSON.parse(this.vm.material) : [];
          this.persons = this.vm.persons ? JSON.parse(this.vm.persons) : [];
        }, error => {
          console.log(error);
        });
      }
    });
  }
  addGroup() {
    let dialogRef = this.dialog.open(ResponseGroupComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != "-1" && result) {
        let rg = result as ResponseGroup;
        this.groups.push(rg);
        this.groups = [...this.groups];
      }
    });
  }
  deleteGroup(id: number) {
    this.groups = this.groups.filter(function (v, i) {
      return v.groupid != id;
    });
  }
  addMaterial() {
    const dialogRef = this.dialog.open(MaterialGroupComponent, { width: '700px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const rg = result as MaterialGroup[];
        this.materials = this.materials.concat(rg);
      }
    });
  }
  addPerson() {
    let dialogRef = this.dialog.open(MaterialPersonComponent, { width: '700px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let rg = result as Professor[];
        this.persons = this.persons.concat(rg);
      }
    });
  }
  deleteMaterial(obj: MaterialGroup) {
    this.materials = this.materials.filter(function (v) {
      return (v.materialid != obj.materialid || v.materialtype != obj.materialtype);
    });
  }
  editing = {};
  editMaterial(obj: MaterialGroup) {
    this.editing[obj.materialtype + obj.materialid] = true;
  }
  updateValue(obj: MaterialGroup) {
    this.editing[obj.materialtype + obj.materialid] = false;
  }
  getMaterialUrl(obj: MaterialGroup) {
    let url = window.location.protocol + window.location.host;
    if (obj.materialtype == "shipex") {
      url += '/#/resource/1/ship/' + obj.materialid;
    }
    return url;
  }

  cancel() {
    this.router.navigate(['record/response']);
  }
  onSubmit() {
    this.vm.otherFiles = JSON.stringify(this.files);
    this.vm.goup = JSON.stringify(this.groups);
    this.vm.material = JSON.stringify(this.materials);
    this.vm.persons = JSON.stringify(this.persons);
    if (this.responseId) {//edit
      this.serviceService.Patch('response', '?id=eq.' + this.responseId, this.vm).subscribe(result => {
        this.materialNumChange();
        this.router.navigate(['record/response']);
      }, error => {
        console.log(error);
      });
    } else {//add
      this.serviceService.Post('response', this.vm).subscribe(result => {
        this.materialNumChange();
        this.router.navigate(['record/response']);
      }, error => {
        console.log(error);
      });
    }
  }
  materialNumChange() {
    if (this.vm.status) {//应急结束
      for (let i = 0; i < this.materials.length; ++i) {
        let m = this.materials[i];
        if (m.materialtype == '4') {//围油栏
          this.serviceService.Get('weiyou', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as WeiyouOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.alllength = d.alllength - m.numex;
              this.serviceService.Patch('weiyou', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          }, error => { console.log(error) });
        } else if (m.materialtype == '8') {//存储油器具
          this.serviceService.Get('saveoil', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as SaveoilOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.num = d.num - m.numex;
              this.serviceService.Patch('saveoil', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          });
        } else if (m.materialtype == '9') {//喷洒设备
          this.serviceService.Get('equip', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as EquipOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.num = d.num - m.numex;
              this.serviceService.Patch('equip', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          });
        } else if (m.materialtype == '10') {//gun
          this.serviceService.Get('gun', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as GunOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.gunnum = d.gunnum - m.numex;
              this.serviceService.Patch('gun', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          });
        } else if (m.materialtype == '11') {//油拖网
          this.serviceService.Get('net', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as NetOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.num = d.num - m.numex;
              this.serviceService.Patch('net', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          });
        } else if (m.materialtype == '12') {//消油剂
          this.serviceService.Get('xiaooil', '?id=eq.' + m.featureid).subscribe(result => {
            let wy = result as XiaooilOper[];
            if (wy && wy.length > 0) {
              let d = wy[0];
              d.num = d.num - m.numex;
              this.serviceService.Patch('xiaooil', '?id=eq.' + m.featureid, d).subscribe(result => {
              }, error => { console.log(error) });
            }
          });
        }
      }
    }
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
}
