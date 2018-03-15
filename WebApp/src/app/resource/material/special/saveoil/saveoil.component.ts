import { Component, OnInit, Input } from '@angular/core';
import { SaveoilOper } from '../../../../model/saveoil';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-saveoil',
  templateUrl: './saveoil.component.html',
  styleUrls: ['./saveoil.component.css']
})
export class SaveoilComponent implements OnInit {
  vm: SaveoilOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new SaveoilOper();
    this.vm = this.missionService.source as SaveoilOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('saveoil', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as SaveoilOper[])[0];
          this.vm = this.missionService.source as SaveoilOper;
        }, error => {
           console.log(error); 
          }
      )
    }
  }

}
