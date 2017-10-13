import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../service/service.service';
import { Country } from '../../model/country';
@Component({
  selector: 'app-admin-country',
  templateUrl: './admin-country.component.html',
  styleUrls: ['./admin-country.component.css']
})
export class AdminCountryComponent implements OnInit {

  constructor(private serviceService: ServiceService) { }

  selName: string = '';
  countrys: Country[] = [];
  ngOnInit() {
    this.queryCountry();
  }
  queryCountry() {
    let par = '?order=id.desc&select=id,name,weather';
    if (this.selName != '') par += '&name=like.*' + this.selName + '*';
    this.serviceService.Get('country', par).subscribe(result => {
      this.countrys = result as Country[];
    }, error => {
      console.log(error);
    });
  }
  resetCountry() {
    this.selName = '';
  }
  delete(id){
    if(confirm('删除操作不可恢复！确认删除？')){
      let par ='?id=eq.' +id;
      this.serviceService.Delete('country',par).subscribe(result=>{
        this.queryCountry();
      },error=>{
        console.log(error);
      });
    }
  }
}
