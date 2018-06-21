import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { EsriLoaderService } from 'angular2-esri-loader';
import { Station, Horn } from './station';
import { ServerService } from '../../service/server.service';
import { RealWeather } from '../../service/result';
@Component({
  // moduleId: module.id,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  @Input()
  showLayer: number;
  @Input()
  type: number;

  @ViewChild('mapDiv') mapEl: ElementRef;

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

  mapSelLayer: Number;
  map: any;
  msg: string;
  constructor(private esriLoader: EsriLoaderService,
    private serverService: ServerService) {
  }


  stations: Station[];
  ngOnInit() {
    this.mapSelLayer = this.showLayer;
    return this.esriLoader.load({
      // use a specific version of the API instead of the latest
      url: 'http://120.26.44.171:5558/init.js'
    }).then(() => {
      return this.esriLoader.load({
        // use a specific version of the API instead of the latest
        url: '//js.arcgis.com/3.18/'
      }).then(() => {
        // load the map class needed to create a new map
        this.esriLoader.loadModules([
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
          'esri/symbols/PictureMarkerSymbol'])
          .then(([Map, SpatialReference, Extent, MapImageLayer, MapImage, GraphicsLayer,
            SimpleMarkerSymbol, Color, InfoTemplate, Font, Point, Graphic, TextSymbol, PictureMarkerSymbol]) => {
            // create the map at the DOM element in this component
            this.map = new Map(this.mapEl.nativeElement, {
              zoom: 11,
              logo: false,
              extent: new Extent({
                xmin: 12136065.529927589,
                ymin: 4065528.307179362,
                xmax: 12193546.175198061,
                ymax: 4118116.9826395833,
                spatialReference: { wkid: 102100 }
              })
            });
            //添加临潼地图
            let gradsLayer = new MapImageLayer({ id: "gd", opacity: 1 });
            this.map.addLayer(gradsLayer);
            let extent = new Extent(109.017, 34.268, 109.54, 34.664, new SpatialReference({ wkid: 4326 }));
            let imageURL = '../../assets/images/map.jpg';
            let mi = new MapImage({
              'extent': extent,
              'href': imageURL,
              'width': 800,
              'height': 600
            });
            gradsLayer.addImage(mi);
            //添加点信息
            let sl = new GraphicsLayer({ id: "station", visible: this.mapSelLayer == 1 });
            this.map.addLayer(sl);
            this.serverService.realWeather().subscribe(result => {
              let font = new Font("12px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
              let data = result as RealWeather[];
              let lay = this.map.getLayer("station");
              let infoTemplate = new InfoTemplate("站点信息：", "站名: ${StnName}");
              let marksymbol = new SimpleMarkerSymbol();
              marksymbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
              marksymbol.setSize(7);
              marksymbol.setOutline(null);
              marksymbol.setColor(new Color([255, 0, 0, 1]));
              for (let i = 0; i < data.length; ++i) {
                let item = data[i];
                let pt = new Point(parseFloat(item.Longitude), parseFloat(item.Latitude));
                let gr = new Graphic(pt, marksymbol, item, infoTemplate);
                lay.add(gr);
                //添加气温信息
                let textSymbol = new TextSymbol(item.Temp, font, new Color([0, 0, 0]));
                textSymbol.setOffset(0, -12);
                let labelPointGraphic = new Graphic(pt, textSymbol);
                lay.add(labelPointGraphic);
              }
            }, error => { });
            //添加显示屏信息
            let displayTemplate = new InfoTemplate();
            displayTemplate.setTitle('描述：');
            displayTemplate.setContent(getTextContent);
            let displaylay = new GraphicsLayer({ id: "display", visible: this.mapSelLayer == 2 });
            this.map.addLayer(displaylay);
            let picsymbol1 = new PictureMarkerSymbol('../../../assets/images/xsp2.png', 50, 30);
            for (let i = 0; i < this.data_info.length; ++i) {
              let pt1 = new Point(this.data_info[i][0], this.data_info[i][1]);
              let gr1 = new Graphic(pt1, picsymbol1, this.data_info[i], displayTemplate);
              displaylay.add(gr1);
            }
            let picsymbol2 = new PictureMarkerSymbol('../../../assets/images/xsp1.png', 35, 35);
            for (let i = 0; i < this.data_info2.length; ++i) {
              let pt1 = new Point(this.data_info2[i][0], this.data_info2[i][1]);
              let gr1 = new Graphic(pt1, picsymbol2, this.data_info2[i], displayTemplate);
              displaylay.add(gr1);
            }
            let picsymbol3 = new PictureMarkerSymbol('../../../assets/images/xsp1.png', 38, 50);
            for (let i = 0; i < this.data_info3.length; ++i) {
              let pt1 = new Point(this.data_info3[i][0], this.data_info3[i][1]);
              let gr1 = new Graphic(pt1, picsymbol3, this.data_info3[i], displayTemplate);
              displaylay.add(gr1);
            }
            function getTextContent(graphic) {
              var attr = graphic.attributes;
              return attr[2];
            }
            //添加大喇叭信息
            let hornlay = new GraphicsLayer({ id: "horn", visible: this.mapSelLayer == 3 });
            this.map.addLayer(hornlay);
            let picsymbol4 = new PictureMarkerSymbol('../../../assets/images/laba.png', 32, 32);
            this.serverService.horns().subscribe(result => {
              let horns = result as Horn[];
              horns.forEach(element => {
                let gr = new Graphic(new Point(element.lon, element.lat), picsymbol4, null, null);
                hornlay.add(gr);
              });
            });
          });
      });
    });
  }

  displayLayer() {
    var ly1 = this.map.getLayer("station");
    var ly2 = this.map.getLayer("display");
    var ly3 = this.map.getLayer("horn");
    if (this.mapSelLayer == 1) {
      ly1.show();
      ly2.hide();
      ly3.hide();
    } else if (this.mapSelLayer == 2) {
      ly1.hide();
      ly2.show();
      ly3.hide();
    } else if (this.mapSelLayer == 3) {
      ly1.hide();
      ly2.hide();
      ly3.show();
    }
  }
}
