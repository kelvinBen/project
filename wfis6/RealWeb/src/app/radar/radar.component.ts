import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomEsriService } from '../custom-esri/custom-esri.service';
import { Station } from '../models/stations';
import moment from 'moment-es6';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.css']
})
export class RadarComponent implements OnInit {
  mapType: Number = 1;
  boundaryLy: Boolean = true;
  stationLy: Boolean = false;
  stations: Station[] = [];
  selTime: String = moment().format('YYYY-MM-DD HH:mm');
  timeConfig = { format: 'YYYY-MM-DD HH', locale: moment.locale('zh-CN') };
  countylayer: Boolean = true;
  stnlayer: Boolean = false;
  toggleDiv: Boolean = true;
  check1: Boolean = true; // 组合反射率
  check2: Boolean = false; // 风暴路径
  check3: Boolean = false; // 1h降水估计
  check4: Boolean = false; // 3h降水估计
  check5: Boolean = false; // 垂直液态水含量
  check6: Boolean = false; // 径向速度
  selJX: String = '01.27'; // 径向速度仰角
  check7: Boolean = false; // 基本反射率
  selJB: String = '01.19'; // 基本反射率仰角

  xmin: Number = 107.500; // 格点经纬度范围
  xmax: Number = 110.000;
  ymin: Number = 33.500;
  ymax: Number = 35.000;

  @ViewChild('map') mapEl: ElementRef;
  constructor(private _http: HttpClient,
    public _esriLoad: CustomEsriService) { }

  ngOnInit() {
    const mapProperties: __esri.MapProperties = {};
    const mapViewProperties: __esri.MapViewProperties = {
      center: {
        x: (this.xmax.valueOf() + this.xmin.valueOf()) / 2,
        y: (this.ymax.valueOf() + this.ymin.valueOf()) / 2
      },
      zoom: 9
    };
    //this._esriLoad.loadMap(mapProperties, mapViewProperties, this.mapEl);
    this._esriLoad.loadMap(mapProperties, mapViewProperties, this.mapEl).then(mapResult => {
      //this._esriLoad.CreateGraphicsLayer('station', 1, this.stationLy).then(result => {
      //  this.initStation();
      //});
      this._esriLoad.CreateMapImageLayer('check1', 0.8, this.check1); // 组合反射率
      this._esriLoad.CreateMapImageLayer('check2', 0.8, this.check2); // 风暴路径
      this._esriLoad.CreateMapImageLayer('check3', 0.8, this.check3); // 1h降水估计
      this._esriLoad.CreateMapImageLayer('check4', 0.8, this.check4); // 3h降水估计
      this._esriLoad.CreateMapImageLayer('check5', 0.8, this.check5); // 垂直液态水含量
      this._esriLoad.CreateMapImageLayer('check61', 0.8, this.check6 && this.selJX === '01.27'); // 径向速度 -0.5度
      this._esriLoad.CreateMapImageLayer('check62', 0.8, this.check6 && this.selJX === '02.27'); // 径向速度 -1.5度
      this._esriLoad.CreateMapImageLayer('check63', 0.8, this.check6 && this.selJX === '03.27'); // 径向速度 -2.4度
      this._esriLoad.CreateMapImageLayer('check64', 0.8, this.check6 && this.selJX === '04.27'); // 径向速度 -3.4度
      this._esriLoad.CreateMapImageLayer('check71', 0.8, this.check7 && this.selJB === '01.19'); // 基本反射率-0.5度
      this._esriLoad.CreateMapImageLayer('check72', 0.8, this.check7 && this.selJB === '02.19'); // 基本反射率-1.5度
      this._esriLoad.CreateMapImageLayer('check73', 0.8, this.check7 && this.selJB === '03.19'); // 基本反射率-2.4度
      this._esriLoad.CreateMapImageLayer('check74', 0.8, this.check7 && this.selJB === '04.19'); // 基本反射率-3.4度
      this.loadData();
    });
  }

  initStation() {
    this._http.get('http://10.172.99.15:3000/stationinfo?cityid=eq.10').subscribe(result => {
      this.stations = result as Station[];
      this._esriLoad.InitStationLayer('station', this.stations);
      this._esriLoad.ShowOrHideLayer('station', this.stationLy);
    });
  }

  loadData() {
    const types = [['00.37', 'check1'], ['00.58', 'check2'], ['00.78', 'check3'], ['00.79', 'check4'],
    ['00.57', 'check5'], ['01.27', 'check61'], ['02.27', 'check62'], ['03.27', 'check63'], ['04.27', 'check64'],
    ['01.19', 'check71'], ['02.19', 'check72'], ['03.19', 'check73'], ['04.19', 'check74']];
    const time = moment(this.selTime.valueOf(), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss');
    types.forEach(tps => {
      const config = { Time: time, Type: tps[0] };
      this._http.post('apis/Stations/QueryRadarFile', config).subscribe(result => {
        const url = result as string;
        //this._esriLoad.AddNewImgIntoImageLayer(tps[1], url);
      }, error => { console.log(error); });
    });
  }
  forwardradar() {
    this.selTime = moment(this.selTime.valueOf(), 'YYYY-MM-DD HH:mm').add(-6, 'minutes').format('YYYY-MM-DD HH:mm');
    this.loadData();
  }
  backwardradar() {
    this.selTime = moment(this.selTime.valueOf(), 'YYYY-MM-DD HH:mm').add(6, 'minutes').format('YYYY-MM-DD HH:mm');
    this.loadData();
  }
  changeLayerBySelect(bType: boolean) {
    if (bType) { // 径向速度
      this._esriLoad.ShowOrHideLayer('check61', this.check6 && this.selJX === '01.27');
      this._esriLoad.ShowOrHideLayer('check62', this.check6 && this.selJX === '02.27');
      this._esriLoad.ShowOrHideLayer('check63', this.check6 && this.selJX === '03.27');
      this._esriLoad.ShowOrHideLayer('check64', this.check6 && this.selJX === '04.27');
    } else { // 基本反射率
      this._esriLoad.ShowOrHideLayer('check71', this.check7 && this.selJB === '01.19');
      this._esriLoad.ShowOrHideLayer('check72', this.check7 && this.selJB === '02.19');
      this._esriLoad.ShowOrHideLayer('check73', this.check7 && this.selJB === '03.19');
      this._esriLoad.ShowOrHideLayer('check74', this.check7 && this.selJB === '04.19');
    }
  }
  showLayer(lay: string, vis: Boolean) {
    this._esriLoad.ShowOrHideLayer(lay, vis);
  }
}
