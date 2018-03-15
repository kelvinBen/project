import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { HelicopterOper } from '../../../model/helicopter';

@Component({
  selector: 'app-helicopter-oper',
  templateUrl: './helicopter-oper.component.html',
  styleUrls: ['./helicopter-oper.component.css']
})
export class HelicopterOperComponent implements OnInit {

  pId: number = undefined;
  type: number = undefined;
  vm: HelicopterOper = new HelicopterOper();
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.pId = params['id'] as number;
      if (this.pId) {
        this.serviceService.Get('helicopter', '?id=eq.' + this.pId).subscribe(
          result => {
            this.vm = (result as HelicopterOper[])[0];
          }, error => {
            console.log(error);
          });
      }
    });
  }
  onSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('helicopter', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/helicopter'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('helicopter', this.vm).subscribe(result => {
        this.router.navigate(['resource/helicopter'])
      }, error => {
        console.log(error);
      });
    }
  }
}
