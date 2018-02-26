import { Component, OnInit } from '@angular/core';
import { Station } from '../../models/stations';
import { HttpClient } from '@angular/common/http';
import { CimissResult, CimissHour } from '../../models/cimiss';
import * as moment from 'moment';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  option: any;
  selectedMode: String = 'single';
  echartsIntance: any;
  stations: Station[] = [];
  selStation: String;
  arr_dewtemp = []; // 瞬时温度
  arr_precipitation = []; // 降水量
  arr_instantwindd = []; // 风向
  arr_instantwindv = []; // 风速
  arr_maxtemp = []; // 最高温度
  arr_mintemp = []; // 最小温度
  arr_stationpress = []; // 气压
  arr_relhumidity = []; // 湿度
  arr_time = [];
  sDate: Date = moment().add(-24, 'hours').toDate();
  eDate: Date = new Date();
  constructor(private _http: HttpClient) { }
  ngOnInit() {
    this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(result => {
      this.stations = result as Station[];
      this.option = this.createOption();
      this.selStation = '57132';
      this.queryFactor();
    });
  }
  onChartInit(ec) {
    this.echartsIntance = ec;
  }
  // changeSelect(){ 
  //   this.option = this.createOption();
  //   console.log(this.option);
  //   if(  this.option.legend.selectedMode === 'single'){
  //     // this.selectedMode = 'multiple' ;
  //     this.option.legend.selectedMode = 'multiple' ;
  //   }else {
  //     // this.selectedMode = 'single' ;
  //     this.option.legend.selectedMode = 'single';
  //   }
  //   // this.echartsIntance.setOption(this.option);
  //  this.queryFactor()
  //   console.log(this.selectedMode);
  // }
  queryFactor() {
    const endTime = moment(this.eDate).add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    const startTime = moment(this.sDate).add(-8, 'hours').format('YYYYMMDDHH') + '0000';
    let parUrl = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleByTimeRangeAndStaID';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    parUrl += '&elements=Station_ID_C,Station_Name,Lon,Lat,Datetime,PRE_1h,PRS,RHU,';
    parUrl += 'TEM,TEM_Min,TEM_Max,WIN_S_Inst_Max,WIN_D_INST_Max,VIS_Min';
    parUrl += '&staIds=' + this.selStation;
    parUrl += '&dataFormat=json&timeRange=[';
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
      const dt = result as CimissResult;
      if (dt && dt.returnCode === '0') {
        const infos = dt.DS as CimissHour[];
        infos.forEach(item => {
          const strTime = moment(item.Datetime.valueOf(), 'YYYY-MM-DD HH:mm:ss').add(8, 'hours').format('DD' + '日' + 'HH' + '时');
          this.arr_dewtemp.push(item.TEM);
          this.arr_precipitation.push(item.PRE_1h > '9999' ? 0 : item.PRE_1h);
          this.arr_instantwindd.push([strTime,
            (item.WIN_S_Inst_Max > '9999' ? 0 : item.WIN_S_Inst_Max),
            (item.WIN_D_INST_Max > '9999' ? 0 : item.WIN_D_INST_Max)]);
          this.arr_instantwindv.push(item.WIN_S_Inst_Max > '9999' ? 0 : item.WIN_S_Inst_Max);
          this.arr_maxtemp.push(item.TEM_Max > '9999' ? 0 : item.TEM_Max);
          this.arr_mintemp.push(item.TEM_Min > '9999' ? 0 : item.TEM_Min);
          this.arr_stationpress.push(item.PRS > '9999' ? 0 : item.PRS);
          this.arr_relhumidity.push(item.RHU > '9999' ? 0 : item.RHU);
          this.arr_time.push(strTime);
        });
        if (this.echartsIntance) {
          this.echartsIntance.setOption(this.createOption());
        }
      }
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
          let relVal = params[0].name + '<br/>';
          for (let i = 0; i < params.length; i++) {
            if (params[i].seriesName === '温度') {
              relVal += params[i].seriesName + ' : ' + params[i].value + '℃' + '<br/>';
            }
            if (params[i].seriesName === '最高温度') {
              relVal += params[i].seriesName + ' : ' + params[i].value + '℃' + '<br/>';
            }
            if (params[i].seriesName === '最低温度') {
              relVal += params[i].seriesName + ' : ' + params[i].value + '℃' + '<br/>';
            }
            if (params[i].seriesName === '相对湿度') {
              relVal += params[i].seriesName + ' : ' + params[i].value + '%' + '<br/>';
            }
            if (params[i].seriesName === '气压') {
              relVal += params[i].seriesName + ' : ' + params[i].value + 'hPa' + '<br/>';
            }
            if (params[i].seriesName === '降水量') {
              relVal += params[i].seriesName + ' : ' + params[i].value + 'mm' + '<br/>';
            }
            if (params[i].seriesName === '极大风' && params[i].seriesType === 'custom') {
              relVal += '极大风：' + '风速' + params[i].data[1] + 'm/s' + ' , ' + '风向' + params[i].data[2] + '°' + '<br/>';
            }
          } return relVal;
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {},
        }
      },
      calculable: true,
      legend: {
        data: ['温度', '最高温度', '最低温度', '极大风', '相对湿度', '气压', '降水量'],
        x: 'center',
        selected: {
          '极大风': false,
          '相对湿度': false,
          '气压': false,
          '极大风风速': false,
        }
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
        position: 'bottom',
        data: this.arr_time
      },
      yAxis: [
        {
          type: 'value',
          name: '相对湿度',
          position: 'left',
          show: true,
          offset: 0,
          // axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        {
          type: 'value',
          name: '气压',
          position: 'left',
          show: true,
          offset: 80,
          // axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          axisLabel: {
            formatter: '{value}hpa'
          }
        },
        {
          type: 'value',
          name: '风速',
          position: 'left',
          offset: 40,
          show: true,
          scale: true,
          // axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value}m/s'
          }
        },
        {
          type: 'value',
          name: '温度',
          position: 'right',
          show: true,
          scale: true,
          offset: 50,
          // axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            formatter: '{value}℃'
          }
        },
        {
          type: 'value',
          name: '降水量',
          position: 'right',
          offset: 0,
          // axisLine: { show: false },
          axisTick: { show: false },
          scale: true,
          show: true,
          axisLabel: {
            formatter: '{value}mm'
          }
        },

      ],
      series: [
        {
          name: '温度',
          yAxisIndex: 3,
          symbolSize: 6,
          // tooltip: {
          //   trigger: 'axis'
          // },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
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
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (params) {
                return params.data[1] + 'm/s'
              }
            }
          },
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
          name: '最高温度',
          yAxisIndex: 3,
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
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
          name: '最低温度',
          yAxisIndex: 3,
          symbolSize: 6,
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}℃'
            }
          },
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
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            }
          },
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
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}hPa'
            }
          },
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
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}mm'
            }
          },
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
    };
  }
}
