import { Component, OnInit } from '@angular/core';
import { ShipExOper } from '../../../model/shipex';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-shipe-oper',
  templateUrl: './shipe-oper.component.html',
  styleUrls: ['./shipe-oper.component.css']
})
export class ShipeOperComponent implements OnInit {
  vmId: Number;
  vm: ShipExOper = new ShipExOper();
  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute) {
  }
  ngOnInit() {
    this._route.params.forEach((param)=>{
      this.vmId = param['id'] as Number;
      if (this.vmId) { // edit
        this._http.get('http://117.34.117.196:9008/Rain?Id=eq.' + this.vmId.toString()).subscribe(result => {
          this.vm = (result as ShipExOper[])[0];
        }, error => {
          alert('数据不存在，返回列表');
          this._router.navigateByUrl('/product/rain');
        });
      } 
    })
  }

}
