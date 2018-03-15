import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { Grouptype } from '../../model/grouptype';
import { Group } from "../../model/group";
import { ResponseGroup } from "../../model/response";

@Component({
  selector: 'app-response-group',
  templateUrl: './response-group.component.html',
  styleUrls: ['./response-group.component.css']
})
export class ResponseGroupComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ResponseGroupComponent>,
    public serviceService: ServiceService) { }
  types: Grouptype[] = [];
  selType: number = -1;
  selGroup: Group;
  groups: Group[] = [];
  vm: ResponseGroup;
  ngOnInit() {
    this.vm = new ResponseGroup();
    this.serviceService.Get('grouptype', '').subscribe(result => {
      let ds = result as Grouptype[];
      this.types.push(new Grouptype(-1, '全部'));
      this.types = this.types.concat(ds);
      this.changeType();
    }, error => {
      console.log(error);
    });
  }
  changeType() {
    this.groups = [];
    let par = '';
    if (this.selType != -1) par = '?type=eq.' + this.selType;
    this.serviceService.Get('group', par).subscribe(result => {
      this.groups = result as Group[];
      this.selGroup = this.groups[0];
      this.vm.groupid = this.selGroup.id;
      this.vm.groupname = this.selGroup.name;
    });
  }
  changeGroup(){
    this.vm.groupid = this.selGroup.id;
    this.vm.groupname = this.selGroup.name;
  }
}
