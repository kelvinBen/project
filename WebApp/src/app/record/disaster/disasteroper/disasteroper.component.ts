import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { DisasterOper } from '../../../model/disaster';
import { DisasterType } from '../../../model/disasterType';
import { DisasterSmallType } from '../../../model/disasterSmallType';
import { UploadFile } from "../../../model/upload";

@Component({
  selector: 'app-disasteroper',
  templateUrl: './disasteroper.component.html',
  styleUrls: ['./disasteroper.component.css']
})
export class DisasteroperComponent implements OnInit {

  constructor(private serviceService: ServiceService, private route: ActivatedRoute, private router: Router) { }

  disasterId: number = undefined;
  dType: DisasterType[] = [];
  smallType: DisasterSmallType[] = [];
  vm: DisasterOper = new DisasterOper();
  type: number = undefined;
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.disasterId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.disasterId) {
        this.serviceService.Get('disaster', '?id=eq.' + this.disasterId).subscribe(result => {
          this.vm = (result as DisasterOper[])[0];
          this.files = this.vm.upload ? JSON.parse(this.vm.upload) : [];
          console.log(result);
        }, error => {
          console.log(error);
        });
      }
    });
    this.serviceService.Get('disasterType', '?order=id.asc').subscribe(result => {
      this.dType = result as DisasterType[];
    }, error => {
      console.log(error);
    });
    this.serviceService.Get('disasterSmallType', '?order=id.asc').subscribe(result => {
      this.smallType = result as DisasterSmallType[];
    }, error => {
      console.log(error);
    });
  }
  files: UploadFile[] = [];
  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      let fs = JSON.parse(res);
      this.files = this.files.concat(fs);
    }
  }
  onSubmit() {
    this.vm.upload = JSON.stringify(this.files);
    if (this.disasterId) {
      //edit
      this.serviceService.Patch('disaster', '?id=eq.' + this.disasterId, this.vm).subscribe(result => {
        this.router.navigate(['record/disaster']);
      }, error => {
        console.log(error);
      });
    } else {
      //add
      this.serviceService.Post('disaster', this.vm).subscribe(result => {
        this.router.navigate(['record/disaster']);
      }, error => {
        console.log(error);
      });
    }
  }

  cancel() {
    this.router.navigate(['record/disaster'])
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName != f) ary.push(element);
    });
    this.files = ary;
  }
}
