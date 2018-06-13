import { Component, OnInit } from '@angular/core';
import { RainFile, RainFileOper } from '../../../models/file';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { CimissResult, CimissHour } from '../../../models/cimiss';
import { Station } from '../../../models/stations';

export class HourRainSum {
  public StationId: String;
  public StationName: String;
  public Rain: number;
}
@Component({
  selector: 'app-rain-operation',
  templateUrl: './rain-operation.component.html',
  styleUrls: ['./rain-operation.component.css']
})
export class RainOperationComponent implements OnInit {
  vmId: Number;
  vm: RainFileOper = null;
  stations: Station[] = [];
  timeConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  rainList: HourRainSum[] = [];
  constructor(private _http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute) {
  }
  ngOnInit() {
    this.vm = new RainFileOper();
    this.vm.CreateTime = moment().format('YYYY-MM-DD HH');
    this.vm.StartTime = moment().add(-12, 'hours').format('YYYY-MM-DD HH');
    this.vm.EndTime = this.vm.CreateTime;
    this._http.get('http://www.lintongqx.com/api/station?id=610125').subscribe(stationResult => {
      this.stations = stationResult as Station[];
      const ary = [];
      this.stations.forEach(station => {
        const obj = new HourRainSum();
        obj.Rain = 0;
        obj.StationId = station.Station_Id_C;
        obj.StationName = station.Station_Name;
        ary.push(obj);
      });
      this.rainList = ary;
      this._route.params.forEach((params: Params) => {
        this.vmId = params['id'] as Number;
        if (this.vmId) { // edit
          this._http.get('http://117.34.117.196:9008/Rain?Id=eq.' + this.vmId.toString()).subscribe(result => {
            this.vm = (result as RainFileOper[])[0];
            this.vm.CreateTime = moment(this.vm.CreateTime.valueOf()).format('YYYY-MM-DD HH');
            this.vm.StartTime = moment(this.vm.StartTime.valueOf()).format('YYYY-MM-DD HH');
            this.vm.EndTime = moment(this.vm.EndTime.valueOf()).format('YYYY-MM-DD HH');
            this.rainList = JSON.parse(this.vm.Precipitation.valueOf());
          }, error => {
            alert('数据不存在，返回列表');
            this._router.navigateByUrl('/product/rain');
          });
        } else {
          this.queryRain();
        }
      });
    });
  }

  onSubmit() {
    this.vm.CreateTime = moment(this.vm.CreateTime.valueOf(), 'YYYY-MM-DD HH').format('YYYY-MM-DD HH:mm:ss');
    this.vm.FileName = moment(this.vm.CreateTime.valueOf()).format('YYYYMMDDHHmmss') + '雨情通报';
    this.vm.Precipitation = JSON.stringify(this.rainList);
    this.vm.StartTime = moment(this.vm.StartTime.valueOf(), 'YYYY-MM-DD HH').format('YYYY-MM-DD HH:mm:ss');
    this.vm.EndTime = moment(this.vm.EndTime.valueOf(), 'YYYY-MM-DD HH').format('YYYY-MM-DD HH:mm:ss');
    if (this.vmId) {
      this._http.patch('http://117.34.117.196:9008/Rain?Id=eq.' + this.vmId.toString(), this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/rain');
      }, error => {
        console.log(error);
      });
    } else {
      this._http.post('http://117.34.117.196:9008/Rain', this.vm).subscribe(result => {
        this._router.navigateByUrl('/product/rain');
      }, error => {
        console.log(error);
      });
    }
  }

  queryRain() {
    let rainUrl: String = 'http://10.172.99.15/cimiss?userId=BEXA_XIAN_liuchang&pwd=liu7758521&';
    rainUrl += 'interfaceId=getSurfEleInRegionByTimeRange&dataCode=SURF_CHN_MUL_HOR&dataFormat=json&';
    rainUrl += 'elements=Station_Id_C,Datetime,PRE_1h&adminCodes=610125&timeRange=(';
    const sdt = moment(this.vm.StartTime.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
    const edt = moment(this.vm.EndTime.valueOf(), 'YYYY-MM-DD HH').add(-8, 'hours');
    rainUrl += sdt.format('YYYYMMDDHH') + '0000,';
    rainUrl += edt.format('YYYYMMDDHH') + '0000]';
    this._http.get(rainUrl.valueOf()).subscribe(result => {
      const cimissDt = result as CimissResult;
      if (cimissDt && cimissDt.returnCode === '0') {
        const dts = cimissDt.DS as CimissHour[];
        if (dts && dts.length > 0) {
          this.initRainArray(dts);
        } else {
          this.initRainArray([]);
        }
      }
    });
  }

  initRainArray(data: CimissHour[]) {
    this.rainList.forEach(rain => {
      rain.Rain = 0;
      const dts = data.filter(s => s.Station_Id_C === rain.StationId);
      if (dts && dts.length > 0) {
        dts.forEach(dt => {
          const r = this.calRain(dt.PRE_1h);
          rain.Rain += r;
        });
        rain.Rain = parseFloat(rain.Rain.toFixed(2));
      }
    });
  }

  calRain(r: String): number {
    if (r > '99990') { return 0; }
    return parseFloat(parseFloat(r.valueOf()).toFixed(2));
  }
}
