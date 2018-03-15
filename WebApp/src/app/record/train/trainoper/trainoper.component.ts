import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { TrainOper } from '../../../model/train';
import { UploadFile } from "../../../model/upload";

@Component({
  selector: 'app-trainoper',
  templateUrl: './trainoper.component.html',
  styleUrls: ['./trainoper.component.css']
})
export class TrainoperComponent implements OnInit {

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }

  trainId: number = undefined;
  vm: TrainOper = new TrainOper();
  files: UploadFile[] = [];
  type: number = undefined;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.trainId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.trainId) {
        this.serviceService.Get('train', '?id=eq.' + this.trainId).subscribe(result => {
          this.vm = (result as TrainOper[])[0];
          this.files = this.vm.upload ? JSON.parse(this.vm.upload) : [];
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
    if (this.trainId) {
      //edit
      this.serviceService.Patch('train', '?id=eq.' + this.trainId, this.vm).subscribe(result => {
        this.router.navigate(['record/train']);
      }, error => {
        console.log(error);
      })
    } else {
      //add
      this.serviceService.Post('train', this.vm).subscribe(result => {
        this.router.navigate(['record/train']);
      }, error => {
        console.log(error);
      });
    }
  }
  cancel() {
    this.router.navigate(['record/train'])
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName != f) ary.push(element);
    });
    this.files = ary;
  }
}
