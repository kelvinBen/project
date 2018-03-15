import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { LawOper, LawType } from '../../../model/law';
import { UploadFile } from '../../../model/upload';
@Component({
  selector: 'app-lawoper',
  templateUrl: './lawoper.component.html',
  styleUrls: ['./lawoper.component.css']
})
export class LawoperComponent implements OnInit {

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }
  types: LawType[] = [];
  lawId: number = undefined;
  vm: LawOper = new LawOper();
  files: UploadFile[] = [];
  type: number = undefined;
  ngOnInit() {
    this.serviceService.Get('lawtype', '').subscribe(result => {
      this.types = result as LawType[];
    });
    this.route.params.forEach((params: Params) => {
      this.lawId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.lawId) {
        this.serviceService.Get('law', '?id=eq.' + this.lawId).subscribe(result => {
          this.vm = (result as LawOper[])[0];
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
    if (this.lawId) {
      //edit
      this.serviceService.Patch('law', '?id=eq.' + this.lawId, this.vm).subscribe(result => {
        this.router.navigate(['record/law']);
      }, error => {
        console.log(error);
      });
    } else {
      //add
      this.serviceService.Post('law', this.vm).subscribe(result => {
        this.router.navigate(['record/law']);
      }, error => {
        console.log(error);
      });
    }
  }
  cancel() {
    this.router.navigate(['record/law']);
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName !== f) { ary.push(element); }
    });
    this.files = ary;
  }
}
