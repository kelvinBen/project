import { Component, OnInit, Input } from '@angular/core';
import { PieoilOper } from "../../../../model/pieoil";
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-pieoil',
  templateUrl: './pieoil.component.html',
  styleUrls: ['./pieoil.component.css']
})
export class PieoilComponent implements OnInit {
  vm: PieoilOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new PieoilOper();
    this.vm = this.missionService.source as PieoilOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('pieoil', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as PieoilOper[])[0];
          this.vm = this.missionService.source as PieoilOper;
        }, error => { 
          console.log(error); 
        }
      )
    }
  }

}
