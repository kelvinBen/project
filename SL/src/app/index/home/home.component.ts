import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { StationModel, CountryModel, FileModel, VideoModel } from '../../model/station';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Carousel } from 'ngx-carousel';
import * as esriLoader from 'esri-loader';
import * as moment from 'moment';
esriLoader.bootstrap((err) => {
  if (err) {
    console.error(err);
  } else { }
}, {
    url: 'http://10.172.99.100:9999/init.js'// 'http://120.26.44.171:5555/init.js'
  });
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent implements OnInit {
  visibilityState: String = 'hidden';
  stations: StationModel[] = [];
  mayType: Number = 1;
  forcast: any;
  map: any;
  layer1: any;
  layer2: any;
  layer3: any;
  files: FileModel[] = [];
  videos:VideoModel[]=[];
  public carouselTileItems: Array<CountryModel>;
  public carouselTile: Carousel;
  @ViewChild('layerDiv') layerDiv: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const rValue = window.innerWidth / 2 - 500;
    this.renderer.setElementStyle(this.layerDiv.nativeElement, 'right', rValue.toString() + 'px');
  }
  constructor(private renderer: Renderer,
    private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private http: Http) { }

  ngOnInit() {
    const rValue = window.innerWidth / 2 - 500;
    this.renderer.setElementStyle(this.layerDiv.nativeElement, 'right', rValue.toString() + 'px');
    this._http.get('../../../assets/config/forcastGeo.json').subscribe(result => {
      this.stations = result as StationModel[];
      this.createMap();
    });

    this._http.get('http://117.34.117.196:9001/country?order=id.asc&limit=15&select=id,name').subscribe(result => {
      this.carouselTileItems = result as CountryModel[];
    });

    this.carouselTile = {
      grid: { xs: 2, sm: 3, md: 5, lg: 5, all: 0 },
      slide: 4,
      speed: 600,
      interval: 2000,
      animation: 'lazy',
      point: true,
      load: 2,
      custom: 'tile',
      dynamicLength: true
    };

    this._http.get('../../../assets/files/files.json').subscribe(result => {
      const fs = (result as FileModel[]).sort(function (a: FileModel, b: FileModel) {
        if (a.time > b.time) {
          return -1;
        } else if (a.time < b.time) {
          return 1;
        }

        return 0;
      });
      for (let i = 0; i < 5; i++) {
        this.files.push(fs[i]);
      }
    });
    this._http.get('../../../assets/video/video.json').subscribe(result => {
      const fs = (result as VideoModel[]).sort(function (a: VideoModel, b: VideoModel) {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }

        return 0;
      });
      for (let i = 0; i < 5; i++) {
        this.videos.push(fs[i]);
      }
    });
  }

  changeMap() {
    if (this.mayType === 1) {
      this.layer1.show();
      this.layer2.hide();
      this.layer3.hide();
    } else if (this.mayType === 2) {
      this.layer1.hide();
      this.layer2.show();
      this.layer3.hide();
    } else if (this.mayType === 3) {
      this.layer1.hide();
      this.layer2.hide();
      this.layer3.show();
    }
  }
  createMap() {
    esriLoader.dojoRequire(['esri/map',
      'esri/layers/ArcGISDynamicMapServiceLayer',
      'esri/layers/GraphicsLayer',
      'esri/graphic',
      'esri/geometry/Point',
      'esri/geometry/Extent',
      'esri/symbols/PictureMarkerSymbol',
      'esri/SpatialReference'],
      (Map, ArcGISDynamicMapServiceLayer, GraphicsLayer, Graphic, Point, Extent, PictureMarkerSymbol, SpatialReference) => {
        const extent = new Extent(22.239236186912123, 60.28863465605991, 122.02000717671656, 10.398249161157693, new SpatialReference({
          wkid: 4326
        }));
        this.map = new Map('mapContent', {
          extent: extent,
          logo: false
        });
        const url1 = 'http://10.172.10.120:6080/arcgis/rest/services/landsue/MapServer';
        const url2 = 'http://10.172.10.120:6080/arcgis/rest/services/ndvi/MapServer';
        const url3 = 'http://10.172.10.120:6080/arcgis/rest/services/ols/MapServer';
        this.layer1 = new ArcGISDynamicMapServiceLayer(url1);
        this.layer2 = new ArcGISDynamicMapServiceLayer(url2);
        this.layer3 = new ArcGISDynamicMapServiceLayer(url3);
        this.layer2.hide();
        this.layer3.hide();
        this.map.addLayer(this.layer1);
        this.map.addLayer(this.layer2);
        this.map.addLayer(this.layer3);
        this.map.addLayer(new GraphicsLayer({ id: 'Station' }));
        const ly = this.map.getLayer('Station');
        const defaultMark = new PictureMarkerSymbol('../../../assets/images/mark.png', 20, 20);
        for (let i = 0; i < this.stations.length; ++i) {
          const stn = this.stations[i];
          const pt = new Point(stn.point[0], stn.point[1]);
          const gr = new Graphic(pt, defaultMark, stn, null);
          ly.add(gr);
        }

        ly.parent = this;
        ly.on('click', function (evt) {
          if (evt.graphic && evt.graphic.attributes) {
            const item = evt.graphic.attributes as StationModel;
            this.parent.showForcast(item);
          }
        });
      });
  };

  showForcast(stn: StationModel) {
    this.forcast = '';
    const time = moment().add(-1, 'days').format('YYYYMMDD') + '20';
    let url = 'http://10.172.99.15/silkapi/Home/SevenDaysForecast?stationid=';
    url += stn.id += '&time=' + time + '&name=' + stn.name;
    const options = new RequestOptions({
      headers:
      new Headers({ 'Content-Type': 'text/html;charset=utf-8' })
    });
    this.http.get(url, options).toPromise().then(result => {
      this.forcast = this.sanitizer.bypassSecurityTrustHtml(result.text());
      this.visibilityState = 'shown';
    }).catch(error => {
      console.log(error);
    });
  }
}
