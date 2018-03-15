import { Component, OnInit, Input } from '@angular/core';
import { OtherOper } from '../../../../model/others';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  vm: OtherOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new OtherOper();
    this.vm = this.missionService.source as OtherOper;
  }

  ngOnInit() {
    if (this.pId != -1) { //edit
      this.serviceService.Get('others', '?id=eq.' + this.pId).subscribe(result => {
        this.missionService.source = (result as OtherOper[])[0];
        this.vm = this.missionService.source as OtherOper;
      }, error => {
        console.log(error);
      });
    }
  }

}
