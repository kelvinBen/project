import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import {LocalStorageService,LocalStorage} from 'ngx-webstorage';
import { HttpClient } from '@angular/common/http';
import { order,orderitem} from '../../models/product';
import { orderdata} from '../../models/order';

@Component({
  selector: 'app-paypage',
  templateUrl: './paypage.component.html',
  styleUrls: ['./paypage.component.css']
})
export class PaypageComponent implements OnInit {
  @LocalStorage('order') postData:orderdata;
  totalMoney = 0;
  radioValue = 'A';
  constructor(private productService: ProductService, private http: HttpClient,private storage:LocalStorageService) { }

  ngOnInit() {
    this.totalMoney = this.postData.order.price;
  }
  submit() {
    this.productService.addOrder(this.postData).subscribe(result => {
      let info = result as order;
      if (!info.code) {
        if(this.radioValue==='A'){
           window.location.href=this.productService.url+'/payorder?orderid='+info.data.id;
        }
      }
      else (console.log(result))
    }, error => {
      console.log(error);
    })
  }
}
