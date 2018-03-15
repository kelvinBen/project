import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ServiceService } from '../../service/service.service';
import { Grouptype } from '../../model/grouptype';
import { Group } from "../../model/group";
@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.css']
})
export class SelectGroupComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<SelectGroupComponent>,
    public serviceService: ServiceService) { }
  types: Grouptype[] = [];
  selType: number = -1;
  selGroup: Group;
  groups: Group[] = [];
  ngOnInit() {
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
      this.groups.push(new Group(-1, '无', -1, 0, '', '', '', '', 0, 0));
      this.groups = this.groups.concat(result as Group[]);
      this.selGroup = this.groups[0];
    });
  }
}
