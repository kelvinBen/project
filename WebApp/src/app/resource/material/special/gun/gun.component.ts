import { Component, OnInit, Input } from '@angular/core';
import { GunOper } from '../../../../model/gun';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-gun',
  templateUrl: './gun.component.html',
  styleUrls: ['./gun.component.css']
})
export class GunComponent implements OnInit {
  vm: GunOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new GunOper();
    this.vm = this.missionService.source as GunOper;
  }

  ngOnInit() {
    if (this.pId != -1) {
      this.serviceService.Get('gun', '?id=eq.' + this.pId).subscribe(result => {
        this.missionService.source = (result as GunOper[])[0];
        this.vm = this.missionService.source as GunOper;
      }, error => {
        console.log(error);
      });
    }
  }

}
