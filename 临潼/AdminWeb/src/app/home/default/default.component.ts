import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NewModel } from '../../models/news';
import { Warning, WarningEx } from '../../models/waring';
import { Forcast, ForcastValue } from '../../models/forcast';
import { Router } from '@angular/router';
import { GridParameter, GridResult } from '../../models/grid';
import * as echarts from 'echarts';
import * as moment from 'moment';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  iframeSrc: SafeUrl;
  cloudSrc: SafeResourceUrl;
  selLayer: Number = 1;
  @ViewChild('forcastChart') forcastChart: ElementRef;
  baseUrl: String = 'http://www.lintongqx.com/rest/';
  constructor(private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private _router: Router) { }
  picNews: NewModel[] = [];
  news: NewModel[] = [];
  products: NewModel[] = [];
  suggest: NewModel[] = [];
  laws: NewModel[] = [];
  warning: Warning = null;
  forcast: Forcast = null;
  ngOnInit() {
    const ct = moment().add(-1, 'hours').format('YYYYMMDDHH');
    const cloud = 'http://www.lintongqx.com/imgs/CLOUD_' + ct + '30.JPG';
    this.cloudSrc = this.sanitizer.bypassSecurityTrustResourceUrl(cloud);
    let url = this.baseUrl + 'News?SmallClassID=eq.1&order=Time.desc&limit=5&select=Id,Title,Time,Pic';
    this._http.get(url).subscribe(result => { // 图片新闻
      this.picNews = result as NewModel[];
    });
    url = this.baseUrl + 'News?SmallClassID=eq.2&order=Time.desc&limit=7&select=Id,Title,Time';
    this._http.get(url).subscribe(result => { // 区内新闻
      this.news = result as NewModel[];
    });
    url = this.baseUrl + 'News?BigClassID=eq.9&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {// 气象防灾减灾
      this.products = result as NewModel[];
    });
    url = this.baseUrl + 'News?SmallClassID=eq.29&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {// 农业气象科普
      this.suggest = result as NewModel[];
    });
    url = this.baseUrl + 'News?BigClassID=eq.8&order=Time.desc&limit=5&select=Id,Title,Time';
    this._http.get(url).subscribe(result => {// 法律法规
      this.laws = result as NewModel[];
    });

    // this._http.get('http://www.lintongqx.com/weather/Default/Waring').subscribe(result => {
    //   this.warning = result as Warning;
    // });
    this._http.get('http://www.lintongqx.com/wdata/warning?areaid=eq.610115&order=issuetime.desc&limit=1')
      .subscribe(result => {
        // this.warning = result as Warning;
        const d = (result as WarningEx[])[0];
        console.log(d);
        this.warning = {
          Author: '临潼气象台',
          Content: d.issuecontent.valueOf(),
          WaringLevel: d.warninglevel.valueOf(),
          WaringType: d.warningtype.valueOf(),
          Img: this.waringImg(d.warninglevel, d.warningtype),
          Info: '',
          Time: d.issuetime.valueOf(),
          Flag: d.issuecontent.indexOf('解除') === -1 ? 1 : 0
        };
      });
    this.changeLocation(109.214236, 34.367287);
  }

  waringImg(level: String, type: String): string {
    let img = '';
    if (type === '暴雪') {
      img = 'Blizzard';
      if (level === '黄色') {
        img += '(1).jpg';
      } else if (level === '橙色') {
        img += '(2).jpg';
      } else if (level === '红色') {
        img += '(3).jpg';
      } else if (level === '蓝色') {
        img += '(4).jpg';
      }
    } else if (type === '寒潮') {
      img = 'codewave';
      if (level === '黄色') {
        img += '(2).png';
      } else if (level === '橙色') {
        img += '(3).png';
      } else if (level === '红色') {
        img += '(4).png';
      } else if (level === '蓝色') {
        img += '(1).png';
      }
    } else if (type === '大雾') {
      img = 'Densefog';
      if (level === '黄色') {
        img += '(1).jpg';
      } else if (level === '橙色') {
        img += '(3).jpg';
      } else if (level === '红色') {
        img += '(2).jpg';
      }
    } else if (type === '干旱') {
      img = 'drought';
      if (level === '橙色') {
        img += '(2).png';
      } else if (level === '红色') {
        img += '(1).png';
      }
    } else if (type === '霜冻') {
      img = 'frost';
      if (level === '黄色') {
        img += '(3).png';
      } else if (level === '橙色') {
        img += '(1).jpg';
      } else if (level === '蓝色') {
        img += '(2).png';
      }
    } else if (type === '大风') {
      img = 'gale';
      if (level === '黄色') {
        img += '(3).png';
      } else if (level === '橙色') {
        img += '(4).png';
      } else if (level === '红色') {
        img += '(2).png';
      } else if (level === '蓝色') {
        img += '(1).png';
      }
    } else if (type === '冰雹') {
      img = 'hail';
      if (level === '橙色') {
        img += '(1).png';
      } else if (level === '红色') {
        img += '(2).png';
      }
    } else if (type === '暴雨') {
      img = 'hardrain';
      if (level === '黄色') {
        img += '(2).jpg';
      } else if (level === '橙色') {
        img += '(3).jpg';
      } else if (level === '红色') {
        img += '(1).jpg';
      } else if (level === '蓝色') {
        img += '(4).jpg';
      }
    } else if (type === '霾') {
      img = 'Haze';
      if (level === '黄色') {
        img += '(2).jpg';
      } else if (level === '橙色') {
        img += '(1).jpg';
      }
    } else if (type === '高温') {
      img = 'heatwave';
      if (level === '黄色') {
        img += '(3).png';
      } else if (level === '橙色') {
        img += '(2).png';
      } else if (level === '红色') {
        img += '(1).png';
      }
    } else if (type === '大雾') {
      img = 'heavyfog';
      if (level === '橙色') {
        img += '(2).jpg';
      } else if (level === '红色') {
        img += '(1).png';
      }
    } else if (type === '道路结冰') {
      img = 'Icyroads';
      if (level === '黄色') {
        img += '(3).jpg';
      } else if (level === '橙色') {
        img += '(1).jpg';
      } else if (level === '红色') {
        img += '(2).jpg';
      }
    } else if (type === '雷电') {
      img = 'lightning';
      if (level === '黄色') {
        img += '(2).jpg';
      } else if (level === '橙色') {
        img += '(3).png';
      } else if (level === '红色') {
        img += '(2).jpg';
      }
    } else if (type === '沙尘暴') {
      img = 'sandstrom';
      if (level === '黄色') {
        img += '(3).jpg';
      } else if (level === '橙色') {
        img += '(2).png';
      } else if (level === '红色') {
        img += '(1).png';
      }
    }
    return img;
  }

  waringInfo(obj: WarningEx): string {
    const flagStr = '防御指南';
    const index = obj.issuecontent.indexOf(flagStr);
    if (index !== -1) {
      const start = index + flagStr.length;
      const length = obj.issuecontent.length - start - 1;
      return obj.issuecontent.substr(start, length);
    }

    return '';
  }

  mavigationFun(url) {
    const navUrl = '/list/1/detail/' + url;
    this._router.navigateByUrl(navUrl);
  }

  changeLocation(lon: Number, lat: Number) {
    const par = new GridParameter();
    par.Xmax = par.Xmin = lon;
    par.Ymax = par.Ymin = lat;
    par.Num = 7;
    par.Fhour = 8;
    par.Ftime = moment().format('YYYYMMDD');
    par.Ftype = 't2m';
    par.Timeslot = 3;
    const x = (lon.valueOf() - 103) % 0.025;
    const y = (lat.valueOf() - 31) % 0.025;
    this._http.post('gridapi/Forcast', par).subscribe(result => {
      const dts = result as GridResult[];
      par.Ftype = 'rain';
      this._http.post('gridapi/Forcast', par).subscribe(result1 => {
        const dts1 = result1 as GridResult[];
        if (dts1 && dts1.length === 7) {
          this.createCharts(dts, dts1);
        }
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  createCharts(ts1: GridResult[], rs1: GridResult[]) {
    const ts: number[] = [];
    const rs: number[] = [];
    const tt: string[] = [];
    ts1.forEach(element => {
      tt.push(element.Time.valueOf());
      if (element.Values.length === 2) {
        ts.push(element.Values[0][0].valueOf());
      } else {
        ts.push(null);
      }
    });
    rs1.forEach(element => {
      if (element.Values.length === 2) {
        rs.push(element.Values[0][0].valueOf());
      } else {
        rs.push(null);
      }
    });
    const chart = echarts.init(this.forcastChart.nativeElement);
    const options = {
      tooltip: {
        trigger: 'axis'
      }, legend: {
        data: ['气温', '降水']
      }, yAxis: [{
        type: 'value',
        name: '气温',
        position: 'left',
        axisLabel: {
          formatter: '{value} °C'
        }
      }, {
        type: 'value',
        name: '降水',
        position: 'right',
        axisLabel: {
          formatter: '{value} mm'
        }
      }], xAxis: {
        type: 'category',
        name: '时间',
        data: tt
      }, series: [
        {
          name: '气温',
          type: 'line',
          data: ts,
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          }
        }, {
          name: '降水',
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            normal: { color: '#83bff6' }
          },
          data: rs
        }
      ]
    };
    chart.setOption(options);

  }
}
