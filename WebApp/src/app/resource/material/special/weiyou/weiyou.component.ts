import { Component, OnInit, Input } from '@angular/core';
import { WeiyouOper } from '../../../../model/weiyou';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-weiyou',
  templateUrl: './weiyou.component.html',
  styleUrls: ['./weiyou.component.css']
})
export class WeiyouComponent implements OnInit {
  vm: WeiyouOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new WeiyouOper();
    this.vm = this.missionService.source as WeiyouOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('weiyou', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as WeiyouOper[])[0];
          this.vm = this.missionService.source as WeiyouOper;
        }, error => { 
          console.log(error); 
        }
      )
    }
  }

}
