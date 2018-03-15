import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { ProfessorOper } from '../../../model/professor';
import { professorType } from '../../../model/professorType';
@Component({
  selector: 'app-professoroper',
  templateUrl: './professoroper.component.html',
  styleUrls: ['./professoroper.component.css']
})
export class ProfessoroperComponent implements OnInit {
  pId: number = undefined;
  types: professorType[] = [];
  type: number = undefined;
  vm: ProfessorOper = new ProfessorOper('', null, '', '', -1, '', '','','','');
  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.serviceService.Get('professorType', '').subscribe(result => {
      this.types = result as professorType[];
    }, error => {
      console.log(error);
    });
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.pId = params['id'] as number;
      if (this.pId) {
        this.serviceService.Get('professor', '?id=eq.' + this.pId).subscribe(
          result => {
            this.vm = (result as ProfessorOper[])[0];
          }, error => {
            console.log(error);
          });
      }
    });
  }

  onSubmit() {
    if (this.pId) {//edit
      this.serviceService.Patch('professor', '?id=eq.' + this.pId, this.vm).subscribe(result => {
        this.router.navigate(['resource/professor'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('professor', this.vm).subscribe(result => {
        this.router.navigate(['resource/professor'])
      }, error => {
        alert(error)
      });
    }
  }
}
