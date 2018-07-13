import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { NzModalService } from 'ng-zorro-antd';
import { orders,orderitem} from '../../../models/product';
import * as moment from 'moment';
// interface orderitem {
//   "id": number,
//   "ordernumber": string,
//   "userid": number,
//   "type": string,
//   "ordertime": string,
//   "price": number,
//   "status": string
// }
// interface order {
//   "code": number;
//   "msg": any;
//   "data": orderitem[]
// }
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  orders: orderitem[] = [];
  constructor(private productService: ProductService, private modalService: NzModalService) { }

  ngOnInit() {
    this.getOrders();
  }
  getOrders() {
    this.productService.getOrders().subscribe(result => {
      let info = result as orders;
      if (info.code === 0) {
        this.orders = info.data;
        this.orders.forEach(order => {
          order.ordertime = moment(order.ordertime).format("YYYY-MM-DD HH:mm:ss");
        })
        console.log(this.orders)
      } else {
        console.log(result)
      }
    }, error => {
      console.log(error);
    })
  }
  delet(id) {
    this.productService.deleteOrder(id).subscribe(result => {
      let info = result as orders;
      if (info.code === 0) {
        this.success();
        this.getOrders();
      } else {
        this.error();
      }
    })
  }
  payorder(id){
    window.location.href='https://end.extraweather.com/payorder?orderid='+id;
  }
  success(): void {
    this.modalService.success({
      nzTitle: '订单提示：',
      nzContent: '订单取消成功！'
    });
  }

  error(): void {
    this.modalService.error({
      nzTitle: '注册提示：',
      nzContent: '订单取消失败！'
    });
  }
}
