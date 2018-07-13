import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { LocalStorageService,LocalStorage } from 'ngx-webstorage';
import { order, orderitem } from '../../../models/product';
import { LoginUser} from '../../../models/user';
import { Msg } from '../../../models/data';
import * as moment from 'moment';
@Component({
  selector: 'app-roleupdate',
  templateUrl: './roleupdate.component.html',
  styleUrls: ['./roleupdate.component.css']
})
export class RoleupdateComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser:LoginUser;
  checked = true;
  data: any = [];
  itemData: any = [];
  duration = '';
  money = '';
  postData: any = null;
  curItem: any;
  constructor(private productService: ProductService, private storage: LocalStorageService) { }

  ngOnInit() {
    this.productService.getRoleProduct().subscribe(result => {
      var info = result as Msg;
      if (!info.code) {
        let list = info.data;
        for (let key in list) {
          if (list.hasOwnProperty(key)) {
            this.data.push({ "title": key, "value": list[key], "isactive": false });
          }
        }
        this.data[0].isactive = true;
        this.itemData = this.data[0].value;
        this.itemData.forEach(element => {
          element.isactive = false;
        });
        this.itemData[0].isactive = true;
        this.curItem = this.data[0].value[0];
        this.duration = this.data[0].value[0].description;
        this.money = this.data[0].value[0].price;
      }
    }, error => { console.error() }
    )

  }
  itemchange(e) {
    let filterItem = this.data.filter(ele => {
      return ele.title === e.target.textContent;
    })
    this.data.forEach(element => {
      if (element.title === e.target.textContent) {
        element.isactive = true;
      } else {
        element.isactive = false;
      }
    });
    this.itemData = filterItem[0].value;
    console.log(this.itemData)
    this.itemData.forEach(element => {
      if (element.description === this.duration) { element.isactive = true; } else { element.isactive = false; }
    });

    this.curItem = this.itemData.filter(item => {
      return item.description === this.duration;
    })[0];
    // this.duration = this.data[0].itemdata[0].description;
    this.money = this.curItem.price;
    console.log(this.curItem)
  }
  timechange(e) {
    let filterItem = this.itemData.filter(ele => {
      return ele.detail === e.target.textContent;
    })
    this.curItem = filterItem[0];
    this.duration = this.curItem.description;
    this.itemData.forEach(element => {
      if (element.description === this.duration) { element.isactive = true; } else { element.isactive = false; }
    });
    this.money = this.curItem.price;
    console.log(this.curItem)

  }
  submit() {
    this.postData = {
      "order": {
        "userid": this.curUser.id,
        "type": "新购",
        "visitnumber": this.curItem.visitnumber,
        "duration": parseInt(this.duration),
        "ordertime": moment(new Date()).add(-8, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
        "price": this.money,
      }, "orderdetails": [{
        "productid": this.curItem.id,
        "productprice": this.curItem.price,
        "productnum": 1,
        "price": this.curItem.price
      }]
    }
    this.productService.addOrder(this.postData).subscribe(result => {
      let info = result as order;
      console.log(info);
      if (!info.code) {
        window.location.href = this.productService.url + '/payorder?orderid=' + info.data.id;
      }
      else {console.log(result)}
    }, error => {
      console.log(error);
    })
  }
}
