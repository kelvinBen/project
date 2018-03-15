import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceService } from '../../service/service.service';
import { MdIconRegistry } from '@angular/material';
import { Securitybig } from '../../model/securitybig';
import { Securitymiddle } from '../../model/securitymiddle';
import { Securitysmall } from '../../model/securitysmall';
import { organization } from '../../model/organization';
import { Group } from '../../model/group';
import { Storage, StorageLayer } from '../../model/storage';
import { Goods, GoodCate } from '../../model/goods';
import * as esriLoader from 'esri-loader';
import * as moment from 'moment';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  animations: [
    trigger('visibilityChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('shown', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('hidden', style({ opacity: 0, transform: 'scale(0.0)' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ])
  ]
})

export class IndexComponent implements OnInit {
  esriObject: any;
  rows: Goods[] = [];
  orgs: organization[] = [];
  tblName: string = '';
  catesEx: GoodCate[] = [];
  selCateEx: number = -1;
  selName: String = '';
  cates: Securitybig[] = [];
  cates1: Securitymiddle[] = [];
  cates2: Securitysmall[] = [];
  orgCheck: boolean = false;//应急机构
  materialCheck: boolean = true;//material
  rescueCheck: boolean = false;//救援队伍
  policeCheck: boolean = false;//公安队伍
  expertCheck: boolean = false;//应急专家
  warehouseCheck: boolean = true;//存储库
  maplayerCheck: number = 1;//地图控制显示
  visibilityState: string = 'hidden';
  map: any;
  baselayer: any;
  baselayer1: any;
  baselayer2: any;
  type: number = -1; //大类
  type1: number = -1;  //中类
  type2: number = -1; //小类
  constructor(private iconRegistry: MdIconRegistry,
    private sanitizer: DomSanitizer,
    private serviceService: ServiceService) {
    iconRegistry.addSvgIcon(
      'org-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/organization.svg'));
    iconRegistry.addSvgIcon(
      'rescue-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/rescue.svg'));
    iconRegistry.addSvgIcon(
      'expert-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/expert.svg'));
    iconRegistry.addSvgIcon(
      'materials-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/materials.svg'));
    iconRegistry.addSvgIcon(
      'external-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/external.svg'));
    iconRegistry.addSvgIcon(
      'disaster-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/disaster.svg'));
    iconRegistry.addSvgIcon(
      'layer-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/Images/map/layer.svg'));
  }

  ngOnInit() {
    // this.serviceService.Get('securitybig', '?order=id.asc').subscribe(result => {
    //   this.cates.push(new Securitybig(-1, "全部"));
    //   let dts = result as Securitybig[];
    //   this.cates = this.cates.concat(dts);
    //   this.type = this.cates[0].id;
    //   this.cate1Change();
    // }, error => {
    //   console.log(error);
    // });
    this.serviceService.Get('goodcate', '').subscribe(result => {
      const all = new GoodCate();
      all.id = -1;
      all.name = '全部';
      this.catesEx.push(all);
      this.catesEx = this.catesEx.concat(result as GoodCate[]);
    });
    this.createMap();
  }
  query() {
    let par = '?order=id.desc';
    if (this.selCateEx !== -1) {
      par += '&category=eq.' + this.selCateEx;
    }
    if (this.selName !== '') {
      par += '&name=like.*' + this.selName + '*';
    }
    this.serviceService.Get('goods', par).subscribe(result => {
      this.rows = result as Goods[];
      this.tblName = '查询物资列表';
      this.visibilityState = 'shown';
    }, error => {
      console.log(error);
    });
  }
  queryStorageMaterials(sto: Storage) {
    const par = '?order=id.desc&storage=eq.' + sto.id;
    this.serviceService.Get('goods', par).subscribe(result => {
      this.rows = result as Goods[];
      this.tblName = sto.name + '存储库物资列表';
      this.visibilityState = 'shown';
    }, error => {
      console.log(error);
    });
  }
  queryOrg(id) {
    const index = this.orgs.findIndex(function (v, i) {
      return v.id === id;
    });
    return index === -1 ? '' : this.orgs[index].name;
  }
  cate1Change() {
    //获取中类
    let par = '?order=id.asc';
    if (this.type != -1) par += '&bigId=eq.' + this.type;
    // console.log(par);
    this.cates1 = [];
    this.serviceService.Get('securitymiddle', par).subscribe(result => {
      this.cates1.push(new Securitymiddle(-1, -1, "全部"));
      let dts = result as Securitymiddle[];
      this.cates1 = this.cates1.concat(dts);
      this.type1 = this.cates1[0].id;
      this.cate2Change();
    }, error => {
      console.log(error);
    });
  }
  cate2Change() {
    //获取小类
    let par = '?order=id.asc';
    if (this.type1 != -1) par += '&middleId=eq.' + this.type1;
    this.cates2 = [];
    this.serviceService.Get('securitysmall', par).subscribe(result => {
      this.cates2.push(new Securitysmall(-1, -1, "全部", ''));
      let dts = result as Securitysmall[];
      this.cates2 = this.cates2.concat(dts);
      this.type2 = this.cates2[0].id;
    }, error => {
      console.log(error);
    });
  }
  createMap() {
    esriLoader.dojoRequire(['esri/map', 'esri/layers/GraphicsLayer', 'esri/symbols/PictureMarkerSymbol', "extLayers/gaodeLayer",
      'esri/graphic', 'esri/geometry/Point', 'esri/SpatialReference', 'esri/dijit/InfoWindowLite', 'dojo/dom-construct'],
      (Map, GraphicsLayer, PictureMarkerSymbol, gaodeLayer, Graphic, Point, SpatialReference, InfoWindowLite, domConstruct) => {
        this.map = new Map('mapContainer', {
          zoom: 10,
          logo: false,
          // basemap: 'topo',
          sliderPosition: 'top-right',
          center: [117.65, 39.02]
        });
        this.esriObject = {
          Point: Point
        };
        this.baselayer = new gaodeLayer({ layertype: "road" });
        this.map.addLayer(this.baselayer);
        this.baselayer1 = new gaodeLayer({ layertype: "st" });//加载卫星图
        this.baselayer1.hide();
        this.map.addLayer(this.baselayer1);
        this.baselayer2 = new gaodeLayer({ layertype: "label" });//加载标注图
        this.baselayer2.hide();
        this.map.addLayer(this.baselayer2);
        let infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, this.map.root));
        infoWindow.startup();
        infoWindow.setMap(this.map);
        //应急机构
        let orglayer = new GraphicsLayer({ id: 'org', opacity: 0.8, visible: this.orgCheck });
        this.map.addLayer(orglayer);
        let picSymbol = new PictureMarkerSymbol('../../../assets/Images/map/organization.png', 30, 30);
        this.serviceService.Get('organization', '').subscribe(result => {
          let dts = result as organization[];
          this.orgs = dts;
          dts.forEach(function (v) {
            let lat = parseFloat(v.latitude);
            let lon = parseFloat(v.longtitude);
            if (lat && lon) {
              let wzpt = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
              let grp = new Graphic(wzpt, picSymbol, v, null);
              orglayer.add(grp);
            }
          });
          orglayer.on("click", function (mouseEvent) {
            if (mouseEvent.graphic && mouseEvent.graphic.attributes) {
              let org = mouseEvent.graphic.attributes as organization;
              infoWindow.setTitle(org.name);
              infoWindow.setContent(org.introduce);
              infoWindow.resize(300, 180);
              infoWindow.show(mouseEvent.graphic.geometry);
            }
          });
        });

        //救援应急队伍
        let reslayer = new GraphicsLayer({ id: 'rescue', opacity: 0.8, visible: this.rescueCheck });
        this.map.addLayer(reslayer);
        let resSymbol = new PictureMarkerSymbol('../../../assets/Images/map/firecontrol.png', 30, 30);
        this.serviceService.Get('group', '').subscribe(result => {
          let dts = result as Group[];
          dts.forEach(function (v) {
            if (v.latitude && v.longtitude) {
              let respt = new Point(v.longtitude, v.latitude, new SpatialReference({ wkid: 4326 }));
              reslayer.add(new Graphic(respt, resSymbol, v, null));
            }
          });
          reslayer.on("click", function (mouseEvent) {
            if (mouseEvent.graphic && mouseEvent.graphic.attributes) {
              let org = mouseEvent.graphic.attributes as Group;
              infoWindow.setTitle(org.name);
              infoWindow.setContent(org.desc);
              infoWindow.resize(300, 180);
              infoWindow.show(mouseEvent.graphic.geometry);
            }
          });
        });
        //公安队伍
        let policelayer = new GraphicsLayer({ id: 'police', opacity: 0.8, visible: this.policeCheck });
        this.map.addLayer(policelayer);
        let policept = new Point(117.72988, 39.06674, new SpatialReference({ wkid: 4326 }));
        let policeSymbol = new PictureMarkerSymbol('../../../assets/Images/map/police.png', 30, 30);
        policelayer.add(new Graphic(policept, policeSymbol));
        policelayer.on('click', function (mouseEvent) {
          if (mouseEvent.graphic != null) {
            infoWindow.setTitle('天津滨海新区公安局');
            infoWindow.setContent('地址：天津市滨海新区永丰街23号');
            infoWindow.resize(300, 180);
            infoWindow.show(mouseEvent.graphic.geometry);
          }
        });
        //应急专家
        // let expertlayer = new GraphicsLayer({ id: 'expert', opacity: 0.8, visible: true });
        // this.map.addLayer(expertlayer);
        // let expertpt = new Point(117.27175, 39.07018, new SpatialReference({ wkid: 4326 }));
        // let expertSymbol = new PictureMarkerSymbol('../../../assets/Images/map/expert.png', 30, 30);
        // expertlayer.add(new Graphic(expertpt, expertSymbol));
        // expertlayer.on('click', function (mouseEvent) {
        //   if (mouseEvent.graphic != null) {
        //     infoWindow.setTitle('张文胜');
        //     infoWindow.setContent('专家类别：事故灾难类专家<br />单位：天津科技大学食品安全战略与管理研究中心<br />职务：教授');
        //     infoWindow.resize(300, 180);
        //     infoWindow.show(mouseEvent.graphic.geometry);
        //   }
        // });
        //存储库
        let warehouselayer = new GraphicsLayer({ id: 'warehouse', opacity: 0.8, visible: this.warehouseCheck });
        this.map.addLayer(warehouselayer);
        let warehouseSymbol = new PictureMarkerSymbol('../../../assets/Images/map/warehouse2.png', 20, 20);
        this.serviceService.Get('storage', '').subscribe(result => {
          let dts = result as Storage[];
          let par = this;
          dts.forEach(function (v) {
            let lat = parseFloat(v.latitude);
            let lon = parseFloat(v.longitude);
            if (lat && lon) {
              let warehousept = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
              let dt = new StorageLayer();
              dt.data = v;
              dt.parent = par;
              warehouselayer.add(new Graphic(warehousept, warehouseSymbol, dt, null));
            }
          });
          warehouselayer.on('click', function (mouseEvent) {
            if (mouseEvent.graphic != null && mouseEvent.graphic.attributes) {
              let dt = mouseEvent.graphic.attributes.data as Storage;
              infoWindow.setTitle(dt.name);
              infoWindow.setContent('位置' + dt.address + '<br />负责人:' + dt.charge);
              infoWindow.resize(300, 180);
              infoWindow.show(mouseEvent.graphic.geometry);
              mouseEvent.graphic.attributes.parent.queryStorageMaterials(dt);
              // mouseEvent.graphic.attributes.parent.visibilityState = 'shown'; // 显示表格
            }
          });
        });
        //material
        let materiallayer = new GraphicsLayer({ id: 'material', opacity: 0.8, visible: this.materialCheck });
        this.map.addLayer(materiallayer);
        let materialSymbol = new PictureMarkerSymbol('../../../assets/Images/map/material.png', 20, 20);
        this.serviceService.Get('goods', '').subscribe(result => {
          let dts = result as Goods[];
          let date = new Date();
          for (var i = 0; i < dts.length; ++i) {
            let lat = parseFloat(dts[i].latitude);
            let lon = parseFloat(dts[i].longitude);
            if (lat && lon) {
              let materialpt = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
              materiallayer.add(new Graphic(materialpt, warehouseSymbol, dts[i], null));
            }
            let d = parseInt(dts[i].repairTime); // 维护周期
            let stime = moment(dts[i].startTime); // 出厂日期;
            let cur = moment(date);
            if (d && d > 0 && stime && cur.isAfter(stime)) {
              let update = moment(dts[i].updateTime);
              let days = cur.diff(stime, 'days');
              let ds = Math.ceil(days / d); // 向上取整
              let ds1 = Math.floor(days / d); // 向下取整
              ds = days - ds * d; // 距离上一个检修日天数
              ds1 = ds1 * d - days; // 下一个检修日天数
              if (ds <= 5) { // 判断更新时间
                let stand = cur.add(-ds, 'days');
                if (update.isBefore(stand)) {
                  this.first.push(dts[i]);
                }
              }
              if (ds1 <= 5) {
                let stand = cur.add(ds1, 'days');
                if (stand.diff(update, 'days') > 5) {
                  this.sec.push(dts[i]);
                }
              }
            }
          }
          materiallayer.on('click', function (mouseEvent) {
            if (mouseEvent.graphic != null && mouseEvent.graphic.attributes) {
              let dt = mouseEvent.graphic.attributes as Goods;
              infoWindow.setTitle(dt.name);
              infoWindow.setContent('应急物资');
              infoWindow.resize(300, 180);
              infoWindow.show(mouseEvent.graphic.geometry);
            }
          });
        });
      });
  }

  first: Goods[] = [];
  sec: Goods[] = [];
  layerFun(layername, flag) {
    const lay = this.map.getLayer(layername);
    if (!lay) { return; };
    if (flag === true) { lay.show(); } else { lay.hide(); };
  }

  rowClick(row: Goods) {
    if (row.longitude && row.latitude) {
      const pt = new this.esriObject.Point(parseFloat(row.longitude), parseFloat(row.latitude));
      this.map.centerAndZoom(pt, 12);
    } else {
      this.serviceService.Get('storage', '?id=eq.' + row.storage).subscribe(result => {
        const stor = result as Storage[];
        if (stor && stor.length > 0) {
          const s = stor[0];
          if (s && s.longitude && s.latitude) {
            const pt = new this.esriObject.Point(parseFloat(s.longitude), parseFloat(s.latitude));
            this.map.centerAndZoom(pt, 12);
          }
        }
      });
    }
  }

  changeMap(type) {
    if (type == 1) {
      this.baselayer.show();
      this.baselayer1.hide();
      this.baselayer2.hide();
    } else {
      this.baselayer.hide();
      this.baselayer1.show();
      this.baselayer2.show();
    }
  }

  showInfos(objs: Goods[], title: string) {
    this.rows = objs;
    this.tblName = title + '存储库物资列表';
    this.visibilityState = 'shown';
  }
}
