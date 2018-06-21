import { Component, OnInit } from '@angular/core';
import { Result } from '../../service/result';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // currentPic = 0;
  result: Result;
  msg: string;


  data: any;

  options: any;
  constructor(private serverService: ServerService) {
    //chart
    this.data = {
      labels: ['08时', '11时', '14时', '17时', '20时', '23时', '02时', '05时'],
      datasets: [
        {
          label: '气温',
          data: [-1, 2, 4, 4, 0, -1, -1, 3]
        }
      ]
    }
    this.options = {
      title: {
        display: true,
        text: 'My Title',
        fontSize: 16
      },
      legend: {
        position: 'bottom',
      }
    };
  }
  warn: any;//预警
  ngOnInit() {
    this.queryBysubcate(1, 3);//图片新闻
    this.queryBysubcate(3, 7);//县内新闻
    this.queryBysubcate(22, 5)//防灾减灾与气象服务
    this.queryBysubcate(23, 5)//农业气象科普
    this.queryBysubcate(31, 5)//法律法规
    this.serverService.warning().subscribe(result => {
      this.warn = result;
    }, error => { console.log(error) });
  }

  queryBysubcate(subId, num) {
    this.serverService.queryDocByParame(subId, num)
      .subscribe(
      result => {
        this.result = result;
        if (this.result.code == 0) {
          let data = this.result.data;
          this.extractData(subId, this.result.data);
        } else {
          console.log(this.result.msg);
        }
      },
      error => { this.msg = error; console.log(this.msg) }
      );
  }

  picNews: any;
  items: any;//县内新闻
  products: any;//气象服务产品
  nongqing: any;
  special: any;
  private extractData(subId, data) {
    if (subId == 1) { this.picNews = data; }
    else if (subId == 3) { this.items = data; }
    else if (subId == 22) { this.products = data; }
    else if (subId == 23) { this.nongqing = data; }
    else if (subId == 31) { this.special = data; }
  }
}
