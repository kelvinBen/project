import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { UploadFile } from '../../../model/upload';
import { FileOper } from '../../../model/file';
import { Filetype } from '../../../model/filetype';
@Component({
  selector: 'app-admin-fileoper',
  templateUrl: './admin-fileoper.component.html',
  styleUrls: ['./admin-fileoper.component.css']
})
export class AdminFileoperComponent implements OnInit {
  types: Filetype[] = [];
  type: number = undefined;
  fileId: number = undefined;
  vm: FileOper = new FileOper;
  files: UploadFile[] = [];
  constructor(private route: ActivatedRoute, private router: Router, private serviceService: ServiceService) { }

  ngOnInit() {
    this.serviceService.Get('filetype', '').subscribe(result => {
      this.types = result as Filetype[];
    }, error => {
      console.log(error);
    });
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.fileId = params['id'] as number;
      if (this.fileId) {
        this.serviceService.Get('file', '?id=eq.' + this.fileId).subscribe(result => {
          this.vm = (result as FileOper[])[0];
          this.files = JSON.parse(this.vm.upload);
        }, error => {
          console.log(error);
        });
      }
    });
  }
  onSubmit() {
    this.vm.upload = JSON.stringify(this.files);
    if (this.fileId) {
      this.serviceService.Patch('file', '?id=eq.' + this.fileId, this.vm).subscribe(result => {
        this.router.navigate(['/admin/adminfile']);
      }, error => {
        console.log(error);
      });
    } else {
      this.serviceService.Post('file', this.vm).subscribe(result => {
        this.router.navigate(['/admin/adminfile']);
      }, error => {
        console.log(error);
      });
    }
  }
  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      this.files = JSON.parse(res);
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
