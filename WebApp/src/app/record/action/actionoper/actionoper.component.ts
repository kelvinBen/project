import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { ExerciseOper } from '../../../model/exercise';
import { UploadFile } from "../../../model/upload";
@Component({
  selector: 'app-actionoper',
  templateUrl: './actionoper.component.html',
  styleUrls: ['./actionoper.component.css']
})
export class ActionoperComponent implements OnInit {
  actionId: number = undefined;
  files: UploadFile[] = [];
  vm: ExerciseOper = new ExerciseOper();
  type: number = undefined;
  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.actionId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.actionId) {
        this.serviceService.Get('exercise', '?id=eq.' + this.actionId).subscribe(result => {
          this.vm = (result as ExerciseOper[])[0];
          this.files = this.vm.upload ? JSON.parse(this.vm.upload) : [];
          console.log(result);
        }, error => {
          console.log(error);
        });
      }
    });
  }
  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      let fs = JSON.parse(res);
      this.files = this.files.concat(fs);
    }
  }
  onSubmit() {
    this.vm.upload = JSON.stringify(this.files);
    if (this.actionId) {//edit
      this.serviceService.Patch('exercise', '?id=eq.' + this.actionId, this.vm).subscribe(result => {
        this.router.navigate(['record/action'])
      }, error => {
        console.log(error);
      })
    } else {//add
      this.serviceService.Post('exercise', this.vm).subscribe(result => {
        this.router.navigate(['record/action'])
      }, error => {
        console.log(error);
      });
    }
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName != f) ary.push(element);
    });
    this.files = ary;
  }
}
