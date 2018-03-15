import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { Grouptype } from '../../../model/grouptype';
import { GroupOper } from "../../../model/group";
@Component({
  selector: 'app-groupoper',
  templateUrl: './groupoper.component.html',
  styleUrls: ['./groupoper.component.css']
})
export class GroupoperComponent implements OnInit {
  pId: number = undefined;
  types: Grouptype[] = [];
  type: number = undefined;
  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }
  vm: GroupOper = new GroupOper('', 1, 0, '', '', '', '', 0, 0);
  ngOnInit() {
    this.serviceService.Get('grouptype', '').subscribe(result => {
      this.types = result as Grouptype[];
    }, error => {
      console.log(error);
    });
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.pId = params['id'] as number;
      if (this.pId) {
        this.serviceService.Get('group', '?id=eq.' + this.pId).subscribe(
          result => {
            this.vm = (result as GroupOper[])[0];
          }, error => {
            console.log(error);
          });
      }
    });
  }

  onSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('group', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/group'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('group', this.vm).subscribe(result => {
        this.router.navigate(['resource/group'])
      }, error => {
        alert(error)
      });
    }
  }
}
