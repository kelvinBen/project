import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService } from '../../../service/service.service';
import { CountryOper } from '../../../model/country';
import { UploadFile } from '../../../model/upload';
@Component({
  selector: 'app-admin-countryoper',
  templateUrl: './admin-countryoper.component.html',
  styleUrls: ['./admin-countryoper.component.css']
})
export class AdminCountryoperComponent implements OnInit {
  public editorOptions = {
    placeholder: "insert content..."
  };
  constructor(private route: ActivatedRoute, private router: Router, private serviceService: ServiceService) { }
  type: number = undefined;
  countryId: number = undefined;
  vm: CountryOper = new CountryOper;
  files: UploadFile[] = [];
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'] as number;
      this.countryId = params['id'] as number;
      if (this.countryId) {
        this.serviceService.Get('country', '?id=eq.' + this.countryId).subscribe(result => {
          this.vm = (result as CountryOper[])[0];
          this.files = JSON.parse(this.vm.pic);
        }, error => {
          console.log(error);
        });
      }
    });
  }
  onSubmit() {
    if (this.countryId) { //edit
      this.serviceService.Patch('country', '?id=eq.' + this.countryId, this.vm).subscribe(result => {
        this.router.navigate(['/admin/admincountry']);
      }, error => {
        console.log(error);
      });
    } else {
      this.serviceService.Post('country', this.vm).subscribe(result => {
        this.router.navigate(['/admin/admincountry']);
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
