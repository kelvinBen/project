import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Filetype } from '../../model/filetype';
import { File } from '../../model/file';
@Component({
  selector: 'app-admin-file',
  templateUrl: './admin-file.component.html',
  styleUrls: ['./admin-file.component.css']
})
export class AdminFileComponent implements OnInit {
  types: Filetype[] = [];
  files: File[] = [];
  selType: number = -1;
  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    this.serviceService.Get('filetype', '').subscribe(result => {
      this.types.push(new Filetype(-1, "全部"));
      let dts = result as Filetype[];
      this.types = this.types.concat(dts);
    }, error => {
      console.log(error);
    });
    this.queryFile();
  }
  queryFile() {
    let par = '?order=time=desc';
    if (this.selType != -1) par += '&filetype=eq.' + this.selType;
    this.serviceService.Get('file', par).subscribe(result => {
      this.files = result as File[];
    }, error => {
      console.log(error);
    });
  }
  resetFile() {
    this.selType = -1;
  }
  delete(id) {
    if (confirm('删除操作不可恢复！确认删除？')) {
      let par = '?id=eq.' + id;
      this.serviceService.Delete('file', par).subscribe(result => {
        this.queryFile();
      }, error => {
        console.log(error);
      });
    }
  }
}
