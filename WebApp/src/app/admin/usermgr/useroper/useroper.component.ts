import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { User, UserOper } from '../../../model/user';

@Component({
  selector: 'app-useroper',
  templateUrl: './useroper.component.html',
  styleUrls: ['./useroper.component.css']
})
export class UseroperComponent implements OnInit {
  userId: number = undefined;
  vm: UserOper = new UserOper();
  type: number = undefined;
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.userId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.userId) {
        this.serviceService.Get('user', '?id=eq.' + this.userId).subscribe(result => {
          this.vm = (result as UserOper[])[0];
        }, error => {
          console.log(error);
        });
      }
    });
  }
  cancel() {
    this.router.navigate(['admin/user']);
  }
  onSubmit() {
    if (this.userId) { // edit
      this.serviceService.Patch('user', '?id=eq.' + this.userId, this.vm).subscribe(result => {
        this.cancel();
      }, error => {
        console.log(error);
      });
    } else { // add
      this.serviceService.Post('user', this.vm).subscribe(result => {
        this.cancel();
      }, error => {
        console.log(error);
      });
    }
  }
}
