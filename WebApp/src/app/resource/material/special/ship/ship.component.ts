import { Component, OnInit, Input } from '@angular/core';
import { ShipOper } from "../../../../model/ship";
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})
export class ShipComponent implements OnInit {
  vm: ShipOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new ShipOper();
    this.vm = this.missionService.source as ShipOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('ship', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as ShipOper[])[0];
          this.vm = this.missionService.source as ShipOper;
        }, error => { 
          console.log(error); 
        }
      )
    }
  }

}
