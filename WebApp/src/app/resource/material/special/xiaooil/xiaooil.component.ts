import { Component, OnInit, Input } from '@angular/core';
import { XiaooilOper } from "../../../../model/xiaooil";
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-xiaooil',
  templateUrl: './xiaooil.component.html',
  styleUrls: ['./xiaooil.component.css']
})
export class XiaooilComponent implements OnInit {
  vm:XiaooilOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
      this.missionService.source = new XiaooilOper();
      this.vm = this.missionService.source as XiaooilOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('xiaooil', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as XiaooilOper[])[0];
          this.vm = this.missionService.source as XiaooilOper;
        }, error => { console.log(error); }
      )
    }
  }
}
