import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { ShipExOper } from '../../../model/shipex';
@Component({
  selector: 'app-ship-ex-oper',
  templateUrl: './ship-ex-oper.component.html',
  styleUrls: ['./ship-ex-oper.component.css']
})
export class ShipExOperComponent implements OnInit {
  pId: number = undefined;
  type: number = undefined;
  vm: ShipExOper = new ShipExOper();
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.pId = params['id'] as number;
      if (this.pId) {
        this.serviceService.Get('shipex', '?id=eq.' + this.pId).subscribe(
          result => {
            this.vm = (result as ShipExOper[])[0];
          }, error => {
            console.log(error);
          });
      }
    });
  }
  onSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('shipex', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/ship'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('shipex', this.vm).subscribe(result => {
        this.router.navigate(['resource/ship'])
      }, error => {
        console.log(error);
      });
    }
  }
}
