import { Component, OnInit, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherInfo } from '../../models/weather';
import { HttpClient } from '@angular/common/http';
import { ForcastModel } from '../../models/forcast';
import { LoadingController, Loading } from 'ionic-angular';
import * as moment from 'moment';
import * as echarts from 'echarts';
import { CimissModel } from '../../models/cimiss';
class Forecast {
  public day: String;
  public micon: String;
  public htemp: String;
  public ltemp: String;
  public eicon: String;
  public windd: String;
  public windv: String;
}

@Component({
  selector: 'page-forcast',
  templateUrl: 'forcast.html',
})
export class ForcastPage implements OnInit {
  xdata: any;
  yhdata: any;
  yldata: any;
  hChart: any;
  lChart: any;
  @Input() station: WeatherInfo;
  datas: ForcastModel[] = [];
  dataExs: ForcastModel[] = [];
  listDatas: ForcastModel[] = [];
  items: Forecast[] = [];
  date: Date;
  loader: Loading;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public _http: HttpClient) {
    this.loader = this.loadingCtrl.create({
      content: '加载...'
    });
    this.loader.present();
  }

  ngOnInit() {
    this.hChart = echarts.init(document.getElementById('hc'));
    this.lChart = echarts.init(document.getElementById('lc'));
    this.queryForcast();
  }

  queryForcast() {
    this.datas = [];
    let url = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521';
    url += '&interfaceId=getSevpWefcRffcByTimeAndStaID &dataCode=SEVP_CHN_WEFC_RFFC';
    url += '&elements=Station_ID_C,Validtime,WEP,VIS,TEM,RHU,WIN_D,WIN_S&dataFormat=json&staIds=57132&time=';
    // url += this.station.StationNum + '&time=';
    const currentDate = moment();
    // if (currentDate.hours() < 6) { // 取前一天晚上20点起报的数据
    //   url += currentDate.add(-1, 'days').format('YYYYMMDD') + '120000';
    //   this.date = moment(currentDate.add(-1, 'days').format('YYYYMMDD') + '200000', 'YYYYMMDDHHmmss').toDate();
    // } else if (currentDate.hours() < 18) {// 取当天08点起报的数据
    url += currentDate.add(-2, 'days').format('YYYYMMDD') + '000000';
    this.date = moment(currentDate.format('YYYYMMDD') + '080000', 'YYYYMMDDHHmmss').toDate();
    // } else {// 取当天20点起报的数据
    //   url += currentDate.format('YYYYMMDD') + '120000';
    //   this.date = moment(currentDate.format('YYYYMMDD') + '200000', 'YYYYMMDDHHmmss').toDate();
    // }
    url += '&eleValueRanges=TEM:(,99999)'
    this._http.get(url).subscribe(result => {
      const cimiss = result as CimissModel;
      if (cimiss && cimiss.returnCode === '0') {
        this.datas = cimiss.DS as ForcastModel[];
        this.dataExs = [];
        this.listDatas = [];
        this.datas.forEach((dt, index) => {
          if (index < 5) {
            this.listDatas.push(dt);
          }
          const t = dt.Validtime;
          if (t === '12' || t === '24' || t === '36' || t === '48' || t === '60' ||
            t === '72' || t === '84' || t === '96' || t === '108' || t === '120') {
            this.dataExs.push(dt);
          }
        });
        this.xdata = [];
        this.yhdata = [];
        this.yldata = [];
        for (let i = 0; i < 5; ++i) {
          const f = new Forecast();
          f.day = moment(this.date).add(i, 'days').format('MM月DD日');
          let j = 0;
          if (i === 0) {
            j = 12;
          } else if (i === 1) {
            j = 36;
          } else if (i === 2) {
            j = 60;
          } else if (i === 3) {
            j = 84;
          } else if (i === 4) {
            j = 108;
          }
          const d1 = this.dataExs.find(s => {
            return s.Validtime === (j + 12).toString();
          });
          const d2 = this.dataExs.find(s => {
            return s.Validtime === j.toString();
          })
          f.htemp = d1.TEM.valueOf();
          f.ltemp = d2.TEM.valueOf();
          f.eicon = this.weatherImage(d1.WEP);
          f.micon = this.weatherImage(d2.WEP);
          f.windd = d2.WIN_D;
          f.windv = d2.WIN_S;
          this.xdata.push(f.day);
          this.yhdata.push(f.htemp);
          this.yldata.push(f.ltemp);
          this.items.push(f);
        }
        this.createhCharts();
        this.createlCharts();
      }

      this.loader.dismiss();
    });
  }

  formatForcastTime(validtime: String): String {
    const hours = parseInt(validtime.valueOf());
    return moment(this.date).add(hours, 'hours').format('DD日HH时');
  }

  weatherImage(wep: String): String {
    if (wep === '0') {
      return 'sunny.png';
    } else if (wep === '1') {
      return 'cloud.png';
    } else if (wep === '2') {
      return 'yin.png';
    } else if (wep === '3' || wep === '4') {
      return 'rain.png';
    } else if (wep === '5') {
      return 'rainsnow.png';
    } else if (wep === '6') {
      return 'rainsnow.png';
    } else if (wep === '7' || wep === '8' || wep === '9' || wep === '10' || wep === '11' || wep === '12') {
      return 'rain.png';
    } else if (wep === '13') {
      return 'snow.png';
    } else if (wep === '14') {
      return 'snow.png';
    } else if (wep === '15') {
      return 'snow.png';
    } else if (wep === '16') {
      return 'snowbig.png';
    } else if (wep === '17') {
      return 'snowbig.png';
    } else if (wep === '18') {
      return 'fog.png';
    } else if (wep === '19') {
      return 'rain.png';
    } else if (wep === '20') {
      return '沙尘暴';
    } else if (wep === '21') {
      return 'rain.png';
    } else if (wep === '22') {
      return 'rain.png';
    } else if (wep === '23') {
      return 'rain.png';
    } else if (wep === '24') {
      return 'rain.png';
    } else if (wep === '25') {
      return 'rain.png';
    } else if (wep === '26') {
      return 'snow.png';
    } else if (wep === '27') {
      return 'snowbig.png';
    } else if (wep === '28') {
      return 'snowbig.png';
    } else if (wep === '29') {
      return 'fog.png';
    } else if (wep === '30') {
      return 'fog.png';
    } else if (wep === '31') {
      return 'fog.png';
    }
  }

  weatherFlag(wep: String): String {
    if (wep === '0') {
      return '晴';
    } else if (wep === '1') {
      return '多云';
    } else if (wep === '2') {
      return '阴';
    } else if (wep === '3') {
      return '阵雨';
    } else if (wep === '4') {
      return '雷阵雨';
    } else if (wep === '5') {
      return '雷阵雨并伴有冰雹';
    } else if (wep === '6') {
      return '雨夹雪';
    } else if (wep === '7') {
      return '小雨';
    } else if (wep === '8') {
      return '中雨';
    } else if (wep === '9') {
      return '大雨';
    } else if (wep === '10') {
      return '暴雨';
    } else if (wep === '11') {
      return '大暴雨';
    } else if (wep === '12') {
      return '特大暴雨';
    } else if (wep === '13') {
      return '阵雪';
    } else if (wep === '14') {
      return '小雪';
    } else if (wep === '15') {
      return '中雪';
    } else if (wep === '16') {
      return '大雪';
    } else if (wep === '17') {
      return '暴雪';
    } else if (wep === '18') {
      return '雾';
    } else if (wep === '19') {
      return '冻雨';
    } else if (wep === '20') {
      return '沙尘暴';
    } else if (wep === '21') {
      return '小雨转中雨';
    } else if (wep === '22') {
      return '中雨转大雨';
    } else if (wep === '23') {
      return '大雨转暴雨';
    } else if (wep === '24') {
      return '暴雨转大暴雨';
    } else if (wep === '25') {
      return '大暴雨转特大暴雨';
    } else if (wep === '26') {
      return '小雪转中雪';
    } else if (wep === '27') {
      return '中雪转大雪';
    } else if (wep === '28') {
      return '大雪转暴雪';
    } else if (wep === '29') {
      return '浮沉';
    } else if (wep === '30') {
      return '扬沙';
    } else if (wep === '31') {
      return '强沙尘暴';
    }
  }

  createhCharts() {
    const options = {
      xAxis: {
        type: 'category',
        data: this.xdata,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      textStyle: {
        color: '#000'
      },
      grid: {
        left: '5px',
        right: '5px'
      },
      series: [{
        data: this.yhdata,
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        color: ['#3e8aff'],
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: '{c}℃'
          }
        },
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#3e8aff'
            }
          }
        }
      }]
    };
    this.hChart.setOption(options);
  }
  createlCharts() {
    const options = {
      xAxis: {
        type: 'category',
        data: this.xdata,
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false
      },
      textStyle: {
        color: '#000'
      },
      grid: {
        left: '5px',
        right: '5px'
      },
      series: [{
        data: this.yldata,
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        color: ['#fac102'],
        label: {
          normal: {
            show: true,
            position: 'bottom',
            formatter: '{c}℃'
          }
        },
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#fac102'
            }
          }
        }
      }]
    };
    this.lChart.setOption(options);
  }
}
