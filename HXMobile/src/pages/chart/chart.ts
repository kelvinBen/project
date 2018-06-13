import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/station';
import { LoadingController, Loading } from 'ionic-angular';
import { CimissModel } from '../../models/cimiss';
import { HourMainModel } from '../../models/hour';
import * as moment from 'moment';
import * as echarts from 'echarts';

@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html'
})
export class ChartPage implements OnInit {
  stations: Station[];
  selStation: String = '57132';
  loader: Loading;
  arr_dewtemp = []; // 瞬时温度
  arr_precipitation = []; // 降水量
  arr_instantwindd = []; // 风向
  arr_instantwindv = []; // 风速
  arr_maxtemp = []; // 最高温度
  arr_mintemp = []; // 最小温度
  arr_stationpress = []; // 气压
  arr_relhumidity = []; // 湿度
  arr_time = [];
  option: any;
  myChart: any;
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public _http: HttpClient) {
    this.loader = this.loadingCtrl.create({
      content: 'loading...'
    });
  }
  ngOnInit() {
    this.initLoading();
    this.loader.present();
    this.myChart = echarts.init(document.getElementById('mainChart'));
    this.queryStations();
  }

  initLoading() {
    if (!this.loader) {
      this.loader = this.loadingCtrl.create({
        content: 'loading...'
      });
    }
  }

  queryStations() {
    this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
      this.stations = result as Station[];
      this.queryFactor();
    });
  }



  queryFactor() {
    const curTime = new Date();
    const endTime = moment(curTime).add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    const startTime = moment(curTime).add(-32, 'hours').format('YYYYMMDDHH') + '0000';
    let parUrl = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleByTimeRangeAndStaID';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    parUrl += '&elements=Station_ID_C,Station_Name,Lon,Lat,Datetime,PRE_1h,PRS,RHU,';
    parUrl += 'TEM,TEM_Min,TEM_Max,WIN_S_Inst_Max,WIN_D_INST_Max,VIS_Min';
    parUrl += '&staIds=' + this.selStation;
    parUrl += '&dataFormat=json&timeRange=(';
    parUrl += startTime + ',' + endTime + ']';
    this.arr_dewtemp = [];
    this.arr_instantwindd = []; // 风向
    this.arr_precipitation = []; // 降水量
    this.arr_instantwindv = []; // 风速
    this.arr_maxtemp = []; // 最高温度
    this.arr_mintemp = []; // 最小温度
    this.arr_stationpress = []; // 大气压
    this.arr_relhumidity = []; // 相对湿度
    this.arr_time = [];
    this._http.get(parUrl).subscribe(result => {
      const dt = result as CimissModel;
      if (dt && dt.returnCode === '0') {
        const infos = dt.DS as HourMainModel[];
        infos.forEach(item => {
          const strTime = moment(item.Datetime, 'YYYY-MM-DD HH:mm:ss').add(-8, 'hours').format('DD' + '日' + 'HH' + '时');
          this.arr_dewtemp.push(item.TEM);
          this.arr_precipitation.push(item.PRE_1h > 9999 ? 0 : item.PRE_1h);
          this.arr_instantwindd.push(
            [strTime,
              (item.WIN_S_Inst_Max > 9999 ? 0 : item.WIN_S_Inst_Max),
              (item.WIN_D_INST_Max > 9999 ? 0 : item.WIN_D_INST_Max)]);
          this.arr_instantwindv.push(item.WIN_S_Inst_Max > 9999 ? 0 : item.WIN_S_Inst_Max);
          this.arr_maxtemp.push(item.TEM_Max > 9999 ? 0 : item.TEM_Max);
          this.arr_mintemp.push(item.TEM_Min > 9999 ? 0 : item.TEM_Min);
          this.arr_stationpress.push(item.PRS > 9999 ? 0 : item.PRS);
          this.arr_relhumidity.push(item.RHU > 9999 ? 0 : item.RHU);
          this.arr_time.push(strTime);
          this.option = this.createOption();
          this.myChart.setOption(this.option);
        });
      }
      this.loader.dismiss();
    }, error => {
      this.loader.dismiss();
    });
  }

  createOption(): any {
    return {
      title: {
        left: 'center',
        top: 0,
        textStyle: {
          color: '#555',
          fontWeight: 'normal',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          console.log(params);
          let relVal = params[0].name + '<br/>';

          if (params.length === 3) {
            relVal += params[0].seriesName + ' : ' + params[0].value + '℃' + '<br/>';
            relVal += '高温' + params[1].seriesName + ' : ' + params[1].value + '℃' + '<br/>';
            relVal += '低温' + params[2].seriesName + ' : ' + params[2].value + '℃' + '<br/>';
          }else if(params.length === 2){
            relVal += params[0].seriesName + ' : ' + params[0].data[1] + 'm/s ' + params[0].data[2] +'°';
          }
           else {
             if(params[0].seriesName === '相对湿度'){  relVal += params[0].seriesName + ' : ' + params[0].value + '%'+ '<br/>'; }
             if(params[0].seriesName === '气压'){  relVal += params[0].seriesName + ' : ' + params[0].value + 'hPa'+ '<br/>'; }
             if(params[0].seriesName === '降水量'){  relVal += params[0].seriesName + ' : ' + params[0].value + 'mm'+ '<br/>'; }
          }

          return relVal;
        }
      },
      grid: {
        left:60
      },
      toolbox: {
        feature: {
        }
      },
      legend: {
        data: ['温度', '极大风', '相对湿度', '气压', '降水量'],
        x: 'center',
        selectedMode: 'single',
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 1,
          rotate: 40,
        },
        data: this.arr_time
      },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          show: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value} %'
          }
        },
        {
          type: 'value',
          position: 'left',
          show: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value} hpa'
          }
        },
        {
          type: 'value',
          position: 'left',
          offset: 0,
          show: true,
          scale: true,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value} m/s'
          }
        },
        {
          type: 'value',
          position: 'left',
          show: true,
          scale: true,
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value} ℃'
          }
        },
        {
          type: 'value',
          position: 'true',
          offset: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          show: false,
          axisLabel: {
            formatter: '{value} mm'
          }
        },

      ],
      series: [
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#37b510',
              lineStyle: {
                color: '#37b510'
              }
            }
          },
          type: 'line',
          data: this.arr_dewtemp
        },
        {
          type: 'custom',
          name: '极大风',
          yAxisIndex: 2,
          renderItem: function (params, api) {
            const point = api.coord([
              api.value(0),
              api.value(1)
            ]);
            return {
              type: 'path',
              shape: {
                pathData: 'M508.928 1024L0.512 0l515.072 299.008L1024 2.048 508.928 1024z ',
                x: -8 / 2,
                y: -20 / 2,
                width: 8,
                height: 20
              },
              position: point,
              rotation: api.value(2),
              style: api.style({
                stroke: '#633296',
                lineWidth: 1,
                color: '#633296',
                background: '#633296',
              })
            };
          },
          data: this.arr_instantwindd
        },
        {
          type: 'line',
          name: '极大风',
          itemStyle: {
            normal: {
              color: '#633296',
              lineStyle: {
                color: '#633296'
              }
            }
          },

          yAxisIndex: 2,
          symbol: 'none',
          lineStyle: {
            normal: {
              color: '#f3ed0b',
              type: 'solid'
            }
          },
          data: this.arr_instantwindv,
          z: 1
        },
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#f15626',
              lineStyle: {
                color: '#f15626'
              }
            }
          },
          data: this.arr_maxtemp
        },
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#408e84',
              lineStyle: {
                color: '#408e84'
              }
            }
          },
          data: this.arr_mintemp
        },
        {
          name: '相对湿度',
          yAxisIndex: 0,
          symbolSize: 6,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#20a4cc',
              lineStyle: {
                color: '#20a4cc'
              }
            }
          },
          data: this.arr_relhumidity
        },
        {
          name: '气压',
          type: 'line',
          yAxisIndex: 1,
          symbolSize: 6,
          symbol: 'roundRect',

          itemStyle: {
            normal: {
              color: '#e88608',
              lineStyle: {
                color: '#e88608',
              }
            }
          },
          data: this.arr_stationpress
        },
        {
          name: '降水量',
          type: 'bar',
          symbolSize: 6,
          xAxisIndex: 0,
          itemStyle: {
            normal: {
              color: '#20a4cc',
              lineStyle: {
                color: '#20a4cc'
              }
            }
          },
          yAxisIndex: 4,
          data: this.arr_precipitation
        },
      ]
    }
  }
}
