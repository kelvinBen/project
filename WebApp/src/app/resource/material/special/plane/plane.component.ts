import { Component, OnInit, Input } from '@angular/core';
import { PlaneOper } from "../../../../model/plane";
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-plane',
  templateUrl: './plane.component.html',
  styleUrls: ['./plane.component.css']
})
export class PlaneComponent implements OnInit {
  vm: PlaneOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new PlaneOper();
    this.vm = this.missionService.source as PlaneOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('plane', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as PlaneOper[])[0];
          this.vm = this.missionService.source as PlaneOper;
        }, error => { console.log(error); }
      )
    }
  }

}
