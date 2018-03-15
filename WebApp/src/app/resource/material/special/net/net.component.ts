import { Component, OnInit, Input } from '@angular/core';
import { Net, NetOper } from '../../../../model/net';
import { ServiceService, MissionService } from "../../../../service/service.service";
@Component({
  selector: 'app-net',
  templateUrl: './net.component.html',
  styleUrls: ['./net.component.css']
})
export class NetComponent implements OnInit {
  vm: NetOper;
  @Input() pId: number;
  constructor(private serviceService: ServiceService,
    public missionService: MissionService) {
    this.missionService.source = new NetOper();
    this.vm = this.missionService.source as NetOper;
  }

  ngOnInit() {
    if (this.pId != -1) {
      this.serviceService.Get('net', '?id=eq.' + this.pId).subscribe(result => {
        this.missionService.source = (result as NetOper[])[0];
        this.vm = this.missionService.source as NetOper;
      }, error => {
        console.log(error);
      });
    }
  }

}
