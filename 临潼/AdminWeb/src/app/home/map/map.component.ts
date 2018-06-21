import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Station } from '../../models/station';
import { Horn, HornStatus } from '../../models/horn';
import { RealWeather } from '../../models/realweather';
import { CimissModel, CimissValueModel } from '../../models/cimiss';
import * as esriLoader from 'esri-loader';
import * as moment from 'moment';
import * as echarts from 'echarts';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  selTime: Date = new Date();
  hornStatusMap: HornStatus[] = [];
  cimissValueModels: CimissValueModel[] = [];
  infoWindow: any;
  data_info = [
    [109.449280555556, 34.3923916666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05002临潼铁炉街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:邢轮轮15209231177<br>2014.07安装在办公楼(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:37:00</font></td></tr></table>'],
    [109.212094444444, 34.3644555555556, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05007临潼零口街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:付仙草13572435394<br>2014.07安装在办公楼(网线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/2/5 13:41:00</font></td></tr></table>'],
    [109.214072222222, 34.39785, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05011临潼行者街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:王小龙15829722228<br>2014.07安装在政府大门口(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/2 7:31:00</font></td></tr></table>'],
    [109.151147222222, 34.3601638888889, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05012临潼斜口街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:张学强13572927223<br>2014.07安装在政府大门口(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2015/9/18 7:30:00</font></td></tr></table>'],
    [109.2125, 34.4595805555556, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05013临潼北田街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:石科18702925966<br>2014.07安装在政府大门口(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:37:00</font></td></tr></table>'],
    [109.244455555556, 34.5149166666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05016临潼金雨街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:张萍13991389561<br>2014.07安装在政府大门口(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:31:00</font></td></tr></table>'],
    [109.177997222222, 34.5384, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05018临潼新市街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:郭宝军13991126080<br>2014.07安装在办公楼(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:37:00</font></td></tr></table>'],
    [109.383369444444, 34.5577833333333, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05020临潼油槐街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:刘小峰15829205785<br>2014.07安装在办公楼(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:30:00</font></td></tr></table>'],
    [109.218055555556, 34.3725, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05023临潼区防汛办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2014.07安装在办公楼大厅(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:30:00</font></td></tr></table>'],
    [109.22, 34.3691666666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05024临潼区华清社区</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2014.07安装在社区大门口(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2016/3/9 16:20:00</font></td></tr><tr><td ><font size=2>临时字幕<br>临时字幕<br>上线时间:2016/3/22 7:31:00</font></td></tr></table>'],
    [109.208611111111, 34.375, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05025临潼区建设和住房保障局</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2014.07安装在办公楼大厅(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 8:01:00</font></td></tr></table>'],
    [109.230875, 34.394752778, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05027临潼气象局</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.08安装在办公楼过道(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2016/3/22 9:43:00</font></td></tr><tr><td ><font size=2>临时字幕<br>临时字幕<br>上线时间:2016/3/22 7:31:00</font></td></tr></table>'],
    [109.209022222, 34.368366666, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05028临潼区政府</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.08安装在办公楼过道(网线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 8:01:00</font></td></tr></table>'],
    [109.2095556, 34.3711805556, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05029临潼区委</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.08安装在办公楼大厅(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 9:48:00</font></td></tr></table>'],
    [109.2098, 34.3692166667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05030临潼区检察院</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.08安装在办公楼大厅(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>上线时间:2015/11/9 7:11:00</font></td></tr></table>'],
    [109.225763889, 34.3817, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05031临潼区秦陵街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.08安装在办公楼大厅(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>上线时间:2016/3/22 7:31:00</font></td></tr></table>'],
  ];
  data_info2 = [
    [109.424122222222, 34.3368333333333, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05001临潼小金街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:张亮18729572528<br>2014.07安装在办公楼(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2016/2/5 18:32:00</font></td></tr></table>'],
    [109.391708333333, 34.4017666666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05003临潼马额街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:王志科13772086593<br>2014.07安装在办公楼(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/6/14 17:24:00</font></td></tr></table>'],
    [109.377544444444, 34.2141861111111, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05004临潼穆寨街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:王世锋13772527868<br>2014.07安装在办公楼(网线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/12/31 13:47:00</font></td></tr></table>'],
    [109.286658333333, 34.3416722222222, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05005临潼仁宗街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:苏亚锋15389455158<br>2014.07安装在办公楼(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2016/2/9 12:50:00</font></td></tr></table>'],
    [109.212047222222, 34.3644166666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05006临潼代王街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:张根良13772516393<br>2014.07安装在办公楼(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/12/12 20:01:00</font></td></tr></table>'],
    [109.212075, 34.364525, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05008临潼何寨街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:陈虹冰15029084666<br>2014.07安装在政务大厅(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/12/17 7:31:00</font></td></tr></table>'],
    [109.209505555556, 34.3685166666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05009临潼骊山街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:马悦18192014676<br>2014.07安装在政府大门口(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2014/11/25 14:34:00</font></td></tr></table>'],
    [109.208416666667, 34.5844027777778, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05014临潼栎阳街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵长征13772052875<br>2014.07安装在办公楼大厅(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2016/3/21 16:53:00</font></td></tr></table>'],
    [109.136427777778, 34.6182777777778, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05015临潼徐杨街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:尚双安13468880278<br>2014.07安装在政府大门口(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/4/23 7:35:00</font></td></tr></table>'],
    [109.26925, 34.4233027777778, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05019临潼新丰街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:徐武军13991378255<br>2014.07安装在办公楼(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2016/3/14 11:02:00</font></td></tr></table>'],
    [109.367522222222, 34.6159916666667, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05021临潼相桥街办</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:周锦锋13572912616<br>2014.07安装在办公楼(无线)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2015/11/9 18:31:00</font></td></tr></table>'],
    [109.23200556, 34.394763889, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>X05026临潼局气象台</font></td></tr><tr><td><font color=#006666>管理单位:临潼区气象局(赵静)<br>管理:赵静13609180183<br>2015.04安装在机房(自动获取)</font></td></tr><tr><td bgcolor=#006666><font color=#FFFFFF>发布内容2015/12/29 9:58:00</font></td></tr><tr><td ><font size=2>QQ图片20151229080657_meitu_1.jpg<br>实况信息<br>下线时间:2016/3/21 16:36:00</font></td></tr></table>'],
  ];
  data_info3 = [
    [109.210555555556, 34.3619444444444, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>骊山(在线)</font></td></tr><tr><td><font color=#006666>管理单位:(双色屏)<br>公共服务中心(童免澈)<br>时间:2016/2/15 6:54:00</font></td></tr></table>'],
    [109.230833333333, 34.3947222222222, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>临潼气象台(在线)</font></td></tr><tr><td><font color=#006666>管理单位:(双色屏)<br>临潼气象局(赵静)<br>时间:2016/3/21 0:21:00</font></td></tr></table>'],
    [109.258888888889, 34.4097222222222, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>临潼为农服务大(在线)</font></td></tr><tr><td><font color=#006666>管理单位:(双色屏)<br>临潼气象局(赵静)<br>时间:2016/3/18 9:28:00</font></td></tr></table>'],
    [109.383333333333, 34.5577777777778, '<table width=100% border=0 cellpadding=0 cellspacing=0><tr><td bgcolor=#003333><font color=#FFFFFF>临潼油槐街办(在线)</font></td></tr><tr><td><font color=#006666>管理单位:(双色屏)<br>临潼气象局(赵静)<br>时间:2015/10/20 9:39:00</font></td></tr></table>'],
  ];
  mapObjectWrapper: any;
  map: any;
  mapSelLayer: Number;
  @Input()
  showLayer: number;
  @Input()
  type: number;
  constructor(private _http: HttpClient) { }
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    const change = changes['showLayer'];
    this.mapSelLayer = change.currentValue;
    if (!this.map) { return; }
    const ly1 = this.map.getLayer('station');
    const ly2 = this.map.getLayer('display');
    const ly3 = this.map.getLayer('horn');
    const ly4 = this.map.getLayer('img');
    if (this.mapSelLayer === 1) {
      ly1.show();
      ly2.hide();
      ly3.hide();
      ly4.hide();
    } else if (this.mapSelLayer === 2) {
      ly1.hide();
      ly2.show();
      ly3.hide();
      ly4.hide();
    } else if (this.mapSelLayer === 3) {
      ly1.hide();
      ly2.hide();
      ly3.show();
      ly4.hide();
    } else if (this.mapSelLayer === 4) {
      ly1.hide();
      ly2.hide();
      ly3.hide();
      ly4.show();
    }
  }
  ngOnInit() {
    this.mapSelLayer = this.showLayer;
    this.createMap();
  }
  initURlParameters() {
    let parUrl = '';
    const currentDate = moment().add(-8, 'hours'); // 转化为世界时
    parUrl = 'http://www.lintongqx.com/cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleInRegionByTime';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR';
    parUrl += '&elements=Station_ID_C,Station_Name,Lat,Lon,Datetime,PRE_1h,TEM';
    parUrl += '&dataFormat=json&adminCodes=610115&times=';
    parUrl += currentDate.format('YYYYMMDDHH') + '0000';
    return parUrl;
  }
  initQueryURlParameters(pt, obj: CimissValueModel) {
    let parUrl = '';
    const endTime = moment().add(-8, 'hours'); // 转化为世界时
    const startTime = moment().add(-32, 'hours');
    parUrl = 'cimiss?userId=BEXA_XIAN_liuchang';
    parUrl += '&pwd=liu7758521' + '&interfaceId=getSurfEleByTimeRangeAndStaID';
    parUrl += '&dataCode=SURF_CHN_MUL_HOR&staIds=' + obj.Station_ID_C;
    parUrl += '&elements=Station_Name,Datetime,PRE_1h,TEM';
    parUrl += '&timeRange=[' + startTime.format('YYYYMMDDHH') + '0000' + ',';
    parUrl += endTime.format('YYYYMMDDHH') + '0000' + ']&dataFormat=json';
    this._http.get(parUrl).subscribe(result => {
      const dt = result as CimissModel;
      if (dt && dt.returnCode === '0') {
        const datas = dt.DS as CimissValueModel[];
        console.log(datas);
        const content = '<div id="container" style="width:400px;height:230px;"></div>';
        this.infoWindow.setContent(content);
        this.infoWindow.setTitle(obj.Station_Name + '过去24小时单站要素演变');
        this.infoWindow.resize(440, 290);
        this.createChart(datas);
        this.infoWindow.show(pt);
      }
    });
  }
  createChart(datas: CimissValueModel[]) {
    const ts: number[] = [];
    const rs: number[] = [];
    const tt: string[] = [];
    datas.forEach(ele => {
      tt.push(moment(ele.Datetime).add(8, 'hours').format('DD日HH时'));
      if (ele.PRE_1h > 9999) {
        rs.push(null);
      } else {
        rs.push(ele.PRE_1h * 0.1);
      }
      if (ele.TEM > 9999) {
        ts.push(null);
      } else {
        ts.push(ele.TEM);
      }
    });
    const chart = echarts.init(this.mapObjectWrapper.dom.byId('container'));
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
        name: '',
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
  createMap() {
    esriLoader.dojoRequire([
      'esri/map',
      'esri/SpatialReference',
      'esri/geometry/Extent',
      'esri/layers/MapImageLayer',
      'esri/layers/MapImage',
      'esri/layers/GraphicsLayer',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/Color',
      'esri/InfoTemplate',
      'esri/symbols/Font',
      'esri/geometry/Point',
      'esri/graphic',
      'esri/symbols/TextSymbol',
      'esri/dijit/InfoWindowLite',
      'dojo/dom-construct',
      'dojo/dom',
      'esri/symbols/PictureMarkerSymbol']
      , (Map, SpatialReference, Extent, MapImageLayer, MapImage, GraphicsLayer,
        SimpleMarkerSymbol, Color, InfoTemplate, Font, Point, Graphic, TextSymbol,
        InfoWindowLite, domConstruct, dom, PictureMarkerSymbol) => {
        this.mapObjectWrapper = {
          InfoWindowLite: InfoWindowLite,
          domConstruct: domConstruct,
          SpatialReference: SpatialReference,
          MapImage: MapImage,
          Extent: Extent,
          dom: dom
        };
        this.map = new Map('mapDiv', {
          zoom: 11,
          logo: false,
          extent: new Extent({
            xmin: 12136065.529927589,
            ymin: 4065528.307179362,
            xmax: 12193546.175198061,
            ymax: 4118116.9826395833,
            spatialReference: { wkid: 102100 }
          })
        }); // 添加临潼地图
        const gradsLayer = new MapImageLayer({ id: 'gd', opacity: 1 });
        this.map.addLayer(gradsLayer);
        const extent = new Extent(109.017, 34.268, 109.54, 34.664, new SpatialReference({ wkid: 4326 }));
        const imageURL = '../../assets/images/map.jpg';
        const mi = new MapImage({
          'extent': extent,
          'href': imageURL,
          'width': 800,
          'height': 600
        });
        gradsLayer.addImage(mi); // 添加点信息
        const sl = new GraphicsLayer({ id: 'station', visible: this.mapSelLayer === 1 });
        this.map.addLayer(sl);
        const styles = { style: { width: '400px', height: '400px' } };
        const node = domConstruct.create('div', styles, null, this.map.root);
        this.infoWindow = InfoWindowLite(null, node);
        this.infoWindow.startup();
        this.map.setInfoWindow(this.infoWindow);
        const font = new Font('12px', Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
        const marksymbol = new SimpleMarkerSymbol();
        marksymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        marksymbol.setSize(8);
        marksymbol.setOutline(null);
        marksymbol.setColor(new Color([255, 0, 0, 1]));
        this._http.get(this.initURlParameters()).subscribe(result => {
          const dt = result as CimissModel;
          if (dt && dt.returnCode === '0') {
            this.cimissValueModels = dt.DS as CimissValueModel[];
            const lay = this.map.getLayer('station');
            lay.parent = this;
            this.cimissValueModels.forEach(element => {
              const pt = new Point(parseFloat(element.Lon), parseFloat(element.Lat));
              const gr = new Graphic(pt, marksymbol, element, null);
              lay.add(gr);
              const textSymbol = new TextSymbol(element.TEM, font, new Color([0, 0, 0])); // 添加气温信息
              textSymbol.setOffset(0, -12);
              const labelPointGraphic = new Graphic(pt, textSymbol);
              lay.add(labelPointGraphic);
            });
            lay.on('click', function (evt) {
              if (evt && evt.graphic && evt.graphic.attributes) {
                const ele = evt.graphic.attributes as CimissValueModel;
                if (ele) {
                  this.parent.initQueryURlParameters(evt.graphic.geometry, ele);
                }
              }
            });
          }
        });
        // 添加显示屏信息
        const displayTemplate = new InfoTemplate();
        displayTemplate.setTitle('描述：');
        displayTemplate.setContent(getTextContent);
        const displaylay = new GraphicsLayer({ id: 'display', visible: this.mapSelLayer == 2 });
        this.map.addLayer(displaylay);
        const picsymbol1 = new PictureMarkerSymbol('../../../assets/images/xsp2.png', 50, 30);
        for (let i = 0; i < this.data_info.length; ++i) {
          const pt1 = new Point(this.data_info[i][0], this.data_info[i][1]);
          const gr1 = new Graphic(pt1, picsymbol1, this.data_info[i], displayTemplate);
          displaylay.add(gr1);
        }
        const picsymbol2 = new PictureMarkerSymbol('../../../assets/images/xsp1.png', 35, 35);
        for (let i = 0; i < this.data_info2.length; ++i) {
          const pt1 = new Point(this.data_info2[i][0], this.data_info2[i][1]);
          const gr1 = new Graphic(pt1, picsymbol2, this.data_info2[i], displayTemplate);
          displaylay.add(gr1);
        }
        const picsymbol3 = new PictureMarkerSymbol('../../../assets/images/xsp1.png', 38, 50);
        for (let i = 0; i < this.data_info3.length; ++i) {
          const pt1 = new Point(this.data_info3[i][0], this.data_info3[i][1]);
          const gr1 = new Graphic(pt1, picsymbol3, this.data_info3[i], displayTemplate);
          displaylay.add(gr1);
        }
        function getTextContent(graphic) {
          const attr = graphic.attributes;
          return attr[2];
        }
        // 添加大喇叭信息
        const hornTemplate = new InfoTemplate();
        hornTemplate.setTitle('大喇叭信息：');
        hornTemplate.setContent('<b>终端名称:</b>${Name}<br/>'
          + '<b>终端状态:</b>${Status}<br/>'
          + '<b>终端电话:</b>${Phone}<br/>'
          + '<b>联系地址:</b>${Address}<br/>'
          + '<b>联系人:</b>${Contacts}<br/>'
          + '<b>联系电话:</b>${ContactsPhone}<br/>'
          + '<b>设备安装时间:</b>${InstallationTime}<br/>'
          + '<b>已开通功能:</b>${Function}');
        const hornlay = new GraphicsLayer({ id: 'horn', visible: this.mapSelLayer === 3 });
        this.map.addLayer(hornlay);
        const picsymbol4 = new PictureMarkerSymbol('../../../assets/images/laba.png', 32, 32);
        this._http.get('http://www.lintongqx.com/rest/Horn').subscribe(result => {
          const horns = result as Horn[];
          horns.forEach(element => {
            const gr = new Graphic(new Point(element.Lon, element.Lat), picsymbol4, element, hornTemplate);
            hornlay.add(gr);
            const status = element.Status;
            const index = this.hornStatusMap.findIndex(v => {
              return v.Status === status;
            });
            if (index === -1) {
              const horn = new HornStatus();
              horn.Status = status;
              horn.Sum = 1;
              this.hornStatusMap.push(horn);
            } else {
              this.hornStatusMap[index].Sum += 1;
            }
          });
        });
        // 雷达图
        const imgLayer = new MapImageLayer({ id: 'img', opacity: 0.5, visible: this.mapSelLayer === 4 });
        this.map.addLayer(imgLayer);
        this.loadData();
      });
  }

  loadData() {
    const time = moment(this.selTime).format('YYYY-MM-DD HH:mm:ss');
    const config = { Time: time, Type: '00.37' };
    this._http.post('http://www.lintongqx.com/rd/Stations/QueryRadarFile', config, { responseType: 'text' }).subscribe(result => {
      const url = (result as string).replace('"', '').replace('"', '');
      const gdLayer = this.map.getLayer('img');
      if (gdLayer == null) { return; }
      const images = gdLayer.getImages();
      if (images != null) {
        for (let i = 0; i < images.length; ++i) {
          gdLayer.removeImage(images[i]);
        }
      }
      const extent = new this.mapObjectWrapper.Extent(106.7890, 32.6360, 111.1450, 36.2296, new this.mapObjectWrapper.SpatialReference({
        wkid: 4326
      }));
      const mi = new this.mapObjectWrapper.MapImage({
        'extent': extent,
        'href': url,
        'width': 800,
        'height': 600
      });
      gdLayer.addImage(mi);
    }, error => { console.log(error); });
  }
  forwardradar() {
    const dt = this.selTime;
    this.selTime = moment(dt).add(-6, 'minutes').toDate();
    this.loadData();
  }
  backwardradar() {
    const dt = this.selTime;
    this.selTime = moment(dt).add(6, 'minutes').toDate();
    this.loadData();
  }
}
