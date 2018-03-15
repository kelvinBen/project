import { Component, OnInit, Input } from '@angular/core';
import { CarOper } from "../../../../model/car";
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  vm:CarOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) { 
      this.missionService.source = new CarOper();
      this.vm = this.missionService.source as CarOper;
    }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('car', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as CarOper[])[0];
          this.vm = this.missionService.source as CarOper;
        }, error => { 
          console.log(error); 
        }
      )
    }
  }

}
