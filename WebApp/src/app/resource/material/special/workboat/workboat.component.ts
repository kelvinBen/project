import { Component, OnInit, Input } from '@angular/core';
import { WorkboatOper } from '../../../../model/workboat';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-workboat',
  templateUrl: './workboat.component.html',
  styleUrls: ['./workboat.component.css']
})
export class WorkboatComponent implements OnInit {
  vm: WorkboatOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) { 
      this.missionService.source = new WorkboatOper();
      this.vm = this.missionService.source as WorkboatOper;
    }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('workboat', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as WorkboatOper[])[0];
          this.vm = this.missionService.source as WorkboatOper;
        }, error => { console.log(error); }
      )
    }
  }

}
