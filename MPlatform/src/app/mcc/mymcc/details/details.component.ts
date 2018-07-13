import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { Msg } from '../../../models/product';
import { orderdetail,detail}from '../../../models/order';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  orderid: Number;
  totalMoney: number;
  orderTime: string;
  visitNumber:number;
  duration:number;
  orderNumber: string;
  orderLength: number;
  type: string;
  status: string;
  products = [];
  lists = [];
  items = [];
  constructor(private _router: Router, private _route: ActivatedRoute, private productService: ProductService) { }
  ngOnInit() {
    this.getProducts();
    this._route.params.forEach((params: Params) => {
      this.orderid = params['id'] as Number;
      if (this.orderid) {
        this.productService.getOrderDetail(this.orderid).subscribe(result => {
          let info = result as detail;
          let symbol;
          if (info.code === 0) {
            this.totalMoney = info.data.order.price;
            this.status = info.data.order.status;
            this.visitNumber = info.data.order.visitnumber;
            this.duration = info.data.order.duration;
            this.type = info.data.order.type;
            this.orderTime = moment(info.data.order.ordertime).format("YYYY-MM-DD HH:mm:ss");
            this.orderNumber = info.data.order.ordernumber;
            info.data.orderdetails.forEach(ele => {
              symbol = this.products.findIndex(pro => {
                return pro.id === ele.productid;
              })
              if (symbol >= 0) {
                if (this.products[symbol].detail) {
                  this.items.push({ "itemname": this.products[symbol].category, "label": this.products[symbol].detail })
                } else {
                  this.items.push({ "itemname": this.products[symbol].category, "label": "开启" });
                }
              }
            })
            this.lists.forEach(list => {
              let mark = this.items.findIndex(item => {
                return item.itemname === list.title
              });
              if (mark < 0) {
                this.items.push({ "itemname": list.title, "label": "关闭" })
              }

            });

          } else {
            console.log(info.msg)
          }
        }, error => {
          console.log(error)
        })
      }
    })
  }
  getProducts() {
    this.productService.getProducts().subscribe(
      result => {
        var info = result as Msg;
        if (!info.code) {
          let list = info.data;
          for (let key in list) {
            if (key !== "访问量") {
              if (list.hasOwnProperty(key)) {
                this.lists.push({ "title": key })
                // this.items.push({ "itemname": key, "label": "" });
                list[key].forEach(element => {
                  this.products.push(element);
                });
              }
            }

          }
        }
      }
    );
  }

}
