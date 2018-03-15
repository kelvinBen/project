import { Component, OnInit, Input } from '@angular/core';
import { DongliOper } from '../../../../model/dongli';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-dongli',
  templateUrl: './dongli.component.html',
  styleUrls: ['./dongli.component.css']
})
export class DongliComponent implements OnInit {
  vm: DongliOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new DongliOper();
    this.vm = this.missionService.source as DongliOper;
  }

  ngOnInit() {
    if (this.pId != -1) {//edit
      this.serviceService.Get('dongli', '?id=eq.' + this.pId).subscribe(
        result => {
          this.missionService.source = (result as DongliOper[])[0];
          this.vm = this.missionService.source as DongliOper;
        }, error => {
          console.log(error);
        }
      )
    }
  }

}
