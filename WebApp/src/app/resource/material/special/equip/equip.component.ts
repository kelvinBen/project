import { Component, OnInit, Input } from '@angular/core';
import { EquipOper } from '../../../../model/equip';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-equip',
  templateUrl: './equip.component.html',
  styleUrls: ['./equip.component.css']
})
export class EquipComponent implements OnInit {
  vm: EquipOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new EquipOper();
    this.vm = this.missionService.source as EquipOper;
  }

  ngOnInit() {
    if (this.pId != -1) {
      this.serviceService.Get('equip', '?id=eq.' + this.pId).subscribe(result => {
        this.missionService.source = (result as EquipOper[])[0];
        this.vm = this.missionService.source as EquipOper;
      }, error => {
        console.log(error);
      });
    }
  }

}
