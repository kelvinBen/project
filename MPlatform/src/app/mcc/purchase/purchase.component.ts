import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService,LocalStorage } from 'ngx-webstorage';
import { LoginUser } from '../../models/user';
import { Router } from '@angular/router';
import { Msg } from '../../models/data';
import { NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
interface itemData {
  title: string;
  product: {
    productid: number,
    productprice: number,
    productnum: number,
    price: number
  };
}
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser:LoginUser;
  url = 'https://end.extraweather.com';
  visitnumber = 100;
  //visitControl = [];
  data: any = [];
  postData: any = null;
  totalMoney: number = 0;
  orders: itemData[] = [];
  duration: number = 1;
  userId: Number;
  configs = [];
  times = [
    { label: '1', isactive: true },
    { label: ' 2', isactive: false },
    { label: '3', isactive: false },
    { label: '4', isactive: false },
    { label: '5', isactive: false },
    { label: '6', isactive: false },
    { label: '7', isactive: false },
    { label: '8', isactive: false },
    { label: '9', isactive: false },
    { label: '1年', isactive: false },
    { label: '2年', isactive: false },
  ]
  formatterDollar = value => `${value}万次/月`;
  parserDollar = value => value.replace('万次/月', '');
  constructor(private http: HttpClient, private router: Router, private modalService: NzModalService, private storage: LocalStorageService) {}
  ngOnInit() {
    if (this.curUser) {
      var jwt = this.curUser.token;
      var authHeader = new HttpHeaders();
      if (jwt) {
        authHeader.append('Authorization', 'Bearer ' + jwt);
      }
      this.userId =(this.curUser as LoginUser).id;
    }
    this.http.get(this.url + '/api/getuserproducts?userid=' + this.userId).subscribe(result => {
      var info = result as Msg;
      if (!info.code) {
        let list = info.data;
        this.configs = [];
        for (let key in list) {
          if (list.hasOwnProperty(key)) {
            let conf = new Object();
            conf["item"] = list[key][0].category;
            conf["display"] = false;
            conf["value"] = 0;
            this.configs.push(conf);
            if (list[key].length === 1) {
              if (list[key][0].detail) {
                list[key][0].label = list[key][0].detail;
              } else {
                list[key][0].label = '开启';
              }
              list[key][0].isactive = false;
              list[key].push({ category: list[key][0].category, label: '关闭', isactive: true, price: -list[key][0].price });
              this.data.push({ "title": key, "value": list[key] })
            } else {
              list[key].forEach(element => {
                element.isactive = false;
                element.label = element.detail;
              });
              list[key].push({ category: list[key][0].category, label: '关闭', isactive: true, price: -list[key][0].price });
              this.data.push({ "title": key, "value": list[key] })
            }
          }

        }
      } else { console.log(info.msg) }

    }, error => {
      console.log(error)
    })
  }
  crudProduct(e) {
    this.totalMoney = 0;
    if (this.orders.length > 0) {
      let symbol = this.orders.findIndex(order => {
        return e.category === (order.title);
      });
      if (e.id) {
        if (symbol < 0) {
          let title1 = e.category + '';
          this.orders.push({
            title: title1, product: {
              "productid": e.id,
              "productprice": e.price,
              "productnum": 1,
              "price": e.price,
            }
          });
        } else {
          this.orders[symbol].product = {
            "productid": e.id,
            "productprice": e.price,
            "productnum": 1,
            "price": e.price,
          }
        }
      } else {
        if (symbol < 0) {
          return true;
        } else {
          this.orders.splice(symbol, 1);
        }
      }
    } else {
      if (e.id) {
        let title2 = e.category + '';
        this.orders.push({
          title: title2, product: {
            "productid": e.id,
            "productprice": e.price,
            "productnum": 1,
            "price": e.price
          }
        });
      }
      else { return true; }
    }
    this.priceAdd();
  }
  priceAdd() {
    this.totalMoney = 0;
    let visitnum = this.visitnumber / 100;
    if (this.orders.length > 0) {
      this.orders.forEach(ele => {
        this.totalMoney += ele.product.price;
      })
      //if (this.visitControl[0].detail <= visitnum && this.visitControl[1].detail > visitnum) {
      //  this.totalMoney += (visitnum - this.visitControl[0].detail) * this.visitControl[0].price;
      //} else if (this.visitControl[1].detail <= visitnum && this.visitControl[2].detail > visitnum) {
      //  this.totalMoney += visitnum  * this.visitControl[1].price;
      //} else {
      //   this.totalMoney += visitnum  * this.visitControl[2].price;
      //}
      // this.totalMoney = this.totalMoney * this.duration;
    } else {
      this.totalMoney = 0;
    }
  }
  selectItem(e) {
    if (this.data.length > 0) {
      let symbol = this.data.findIndex(item => {
        return e.category === (item.title);
      });
      this.configs.forEach(ele => {
        if (ele.item === e.category) {
          this.data[symbol].value.forEach(i => {
            i.isactive = false;
          })
          e.isactive = true;
          this.crudProduct(e);
          if (e.label !== '关闭') {
            ele.display = true;
          } else {
            ele.display = false;
          }
          ele.value = e.label;
        }
      })
    }
  }
  changeFlow($event) {
    this.visitnumber = $event;
    this.priceAdd();
  }
  selectTime(time) {
    this.times.forEach(i => {
      i.isactive = false;
    })
    time.isactive = true;
    if (time.label === '1年') {
      this.duration = 12;
    } else if (time.label === '2年') {
      this.duration = 24;
    } else {
      this.duration = time.label;
    }
    this.priceAdd();
  }
  submit() {
    this.postData = null;
    // if (this.totalMoney === 0) {
    //   this.error();
    // } else {
    let orderdetails = [];
    this.orders.forEach(ele => {
      orderdetails.push(ele.product);
    })
    this.postData = {
      "order": {
        "userid": this.curUser.id,
        "type": "新购",
        "visitnumber": this.visitnumber,
        "duration": this.duration,
        "ordertime": moment(new Date()).add(-8, 'hours').format("YYYY-MM-DDTHH:mm:ss"),
        "price": this.totalMoney,
      }, "orderdetails": orderdetails
    }
    this.storage.store("order", this.postData);
    this.router.navigate(['/mcc/pay']);
  }
  error(): void {
    this.modalService.warning({
      nzTitle: '订单提示：',
      nzContent: "订单价格为0元，无法生成订单！"
    });
  }
}
